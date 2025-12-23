const db = require("../config/db");

class ServiceProvider {
  static async getServiceProviders(serviceId) {
    const query = `select sp.*
,ps.service_id,ps.base_price,ps.images,u.first_name,u.last_name, u.phone,u.email
from provider_services ps
join service_providers sp on ps.provider_id=sp.provider_id
join users u on sp.user_id= u.user_id
where ps.service_id=
? ;
;
`;
    const [result] = await db.promise().execute(query, [serviceId]);
    return result;
  }

  static async getRating(providerId) {
    const query = `select sp.provider_id, max(r.score) as max_rating
from service_providers sp
join provider_services ps on sp.provider_id=ps.provider_id
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
join ratings r on b.booking_id=r.booking_id
where sp.provider_id= ? 
group by sp.provider_id;
`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getFeedbacks(providerId) {
    const query = `select sp.provider_id, r.score,r.feedback_text,u.first_name,u.last_name,r.rated_at
from service_providers sp
join provider_services ps on sp.provider_id=ps.provider_id
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
join ratings r on b.booking_id=r.booking_id
join users u on b.user_id=u.user_id
where sp.provider_id= ? ;
`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProvidersUnAvailableDates(ids) {
    const providersArray = ids.map(() => "?").join(",");
    const query = `SELECT sp.provider_id,pud.date
 FROM service_providers sp
 join provider_unavailable_dates pud on sp.provider_id=pud.provider_id
 WHERE sp.provider_id IN (${providersArray});`;
    const [result] = await db.promise().execute(query, ids);
    return result;
  }

  static async getProvidersSchedule(ids) {
    const providersArray = ids.map(() => "?").join(",");
    const query = `SELECT sp.provider_id,ps.day_of_week,ps.start_time,ps.end_time
 FROM service_providers sp
 join provider_schedule ps on sp.provider_id=ps.provider_id
 WHERE sp.provider_id IN (${providersArray});`;
    const [result] = await db.promise().execute(query, ids);
    return result;
  }

  static async addBooking(
    providerId,
    hourlyRate,
    expectedTime,
    serviceDate,
    serviceTime,
    typeOfPayment,
    userId,
    serviceId,
    location,
    estimated_time
  ) {
    const psSql = `
  SELECT Provider_Services_id, base_price
  FROM provider_services
  WHERE provider_id = ? AND service_id = ?
  LIMIT 1
`;

    const [rows] = await db.promise().execute(psSql, [providerId, serviceId]);

    if (!rows.length) {
      throw new Error("Provider does not offer this service");
    }

    const providerServiceId = rows[0].Provider_Services_id;
    const totalPrice = hourlyRate * expectedTime;

    const insertSql = `
  INSERT INTO bookings (
    user_id,
    Provider_Services_id,
    status,
    booking_date,
    service_date,
    service_time,
    total_price,
    payment_method,
    address,
    created_at,
    is_accept,
    estimated_time
  )
  VALUES (?, ?, 'pending', CURDATE(), ?, ?, ?, ?, ?, NOW(), 'pending', ?)
`;

    const [result] = await db
      .promise()
      .execute(insertSql, [
        userId,
        providerServiceId,
        serviceDate,
        serviceTime,
        totalPrice,
        typeOfPayment,
        location,
        estimated_time,
      ]);

    return result;
  }
  static async addTransaction(walletId = 0, bookingId, type, amount) {
    const sql = `
    INSERT INTO transactions (
      wallet_id,
      booking_id,
      type,
      amount,
      created_at
    )
    VALUES (?, ?, ?, ?, NOW());
  `;

    const values = [walletId, bookingId, type, amount];

    const [result] = await db.promise().execute(sql, values);

    return { insertId: result.insertId }; // return insertId
  }

  static async getProviderRatingOrdersEarning(userId) {
    const query = `SELECT u.email,
SUM(total_price) as totalProfits,
AVG(score) as rating,
COUNT(b.booking_id) as numOfOrders
 FROM servlink.service_providers sp
 join users u on sp.user_id= u.user_id
 join provider_services ps on sp.provider_id=ps.provider_id
 join bookings b on ps.Provider_Services_id=b.Provider_Services_id
 join ratings r on b.booking_id=r.booking_id
 where sp.user_id= ? &&status='Completed'
  group by u.email

`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async providerFromSearch(providerId) {
    const query = `
    SELECT 
      sp.provider_id,
      sp.aboutProvider,
      sp.description,
      sp.certifications,
      sp.years_of_experience,
      sp.service_locations,
      sp.field_of_work,
      ps.base_price,
      ps.images,
      u.first_name,
      u.last_name,
      u.phone,
      u.email,
      sp.id_card_photo
    FROM service_providers sp
    JOIN provider_services ps 
      ON sp.provider_id = ps.provider_id
    JOIN users u 
      ON sp.user_id = u.user_id
    WHERE sp.provider_id = ?;
  `;

    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProviderCancelledPendingOrders(userId) {
    const query = `SELECT 
    u.email,
    SUM(CASE
        WHEN b.status = 'Pending' THEN 1
        ELSE 0
    END) AS numOfPendingsOrders,
      SUM(CASE
        WHEN b.status = 'Cancelled' THEN 1
        ELSE 0
    END) AS numOfCancelledOrders
FROM
    users u
        JOIN
   service_providers sp on u.user_id=sp.user_id
        JOIN
    provider_services ps ON sp.provider_id = ps.provider_id
        JOIN
    bookings b ON ps.Provider_Services_id = b.Provider_Services_id
WHERE
    u.user_id = ?
       group by u.email

`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async getProviderServicePerformance(userId) {
    const query = `SELECT u.user_id,s.name,
 COUNT(b.booking_id) AS totalBookings 
 FROM servlink.users u 
 join service_providers sp on u.user_id=sp.user_id 
 join provider_services ps on sp.provider_id=ps.provider_id 
 join services s on ps.service_id=s.service_id 
 join bookings b on ps.Provider_Services_id=b.Provider_Services_id 
 where u.user_id= ?
 GROUP BY u.user_id, s.name;
`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async getProviderMonthlyEarnings(userId) {
    const query = `SELECT u.user_id,s.name,b.service_date,b.total_price
 FROM servlink.users u 
 join service_providers sp on u.user_id=sp.user_id 
 join provider_services ps on sp.provider_id=ps.provider_id 
 join services s on ps.service_id=s.service_id 
 join bookings b on ps.Provider_Services_id=b.Provider_Services_id 
 where u.user_id= ? && b.status='Completed'
 GROUP BY u.user_id, s.name,b.service_date,b.total_price;
`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async getProviderListServicesInfo(userId) {
    const query = `SELECT 
    u.user_id,
    s.name AS serviceName,
    ps.Provider_Services_id,
    s.description,
    s.image,
    c.name AS categoryName,
    ps.base_price,
    ps.images,
    ps.service_location
FROM
    servlink.users u
        JOIN
    service_providers sp ON u.user_id = sp.user_id
        JOIN
    provider_services ps ON sp.provider_id = ps.provider_id
        JOIN
    services s ON ps.service_id = s.service_id
        JOIN
    categories c ON s.category_id = c.category_id
WHERE
    u.user_id = ?

`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async getProviderServiceFeedbacks(Provider_Services_id) {
    const query = `SELECT 
    u.first_name, u.last_name, r.*
FROM
    provider_services ps
        JOIN
    bookings b ON ps.Provider_Services_id = b.Provider_Services_id
        JOIN
    ratings r ON b.booking_id = r.booking_id
        JOIN
    users u ON b.user_id = u.user_id
WHERE
    ps.Provider_Services_id = ?

`;
    const [result] = await db.promise().execute(query, [Provider_Services_id]);
    return result;
  }
}
module.exports = ServiceProvider;
