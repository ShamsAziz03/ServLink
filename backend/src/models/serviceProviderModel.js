const db = require("../config/db");

class ServiceProvider {
  static async getServiceProviders(serviceId) {
    const query = `select sp.*,
    ps.service_id,ps.base_price,ps.images,u.first_name,u.last_name, u.phone,u.email
from provider_services ps
join service_providers sp on ps.provider_id=sp.provider_id
join users u on sp.user_id= u.user_id
where ps.service_id= ?;
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
  VALUES (?, ?, 'Pending', CURDATE(), ?, ?, ?, ?, ?, NOW(), 'pending', ?)
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
    ps.service_location,
    SUM(CASE
        WHEN b.status = 'Pending' THEN 1
        ELSE 0
    END) AS numOfPendingsOrders,
    SUM(CASE
        WHEN b.status = 'Cancelled' THEN 1
        ELSE 0
    END) AS numOfCancelledOrders,
    SUM(CASE
        WHEN b.status = 'Completed' THEN 1
        ELSE 0
    END) AS numOfCompletedOrders
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
       left JOIN
    bookings b ON ps.Provider_Services_id = b.Provider_Services_id
WHERE
    u.user_id = ?
GROUP BY u.user_id , s.name , ps.Provider_Services_id , s.description , s.image , c.name , ps.base_price , ps.images , ps.service_location

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

  static async getProviderServiceAvgRating(Provider_Services_id) {
    const query = `SELECT 
    AVG(score) as avgScore
FROM
    provider_services ps
        JOIN
    bookings b ON ps.Provider_Services_id = b.Provider_Services_id
        JOIN
    ratings r ON b.booking_id = r.booking_id
        JOIN
    users u ON b.user_id = u.user_id
WHERE
    ps.Provider_Services_id = ? && b.status='Completed'
`;
    const [result] = await db.promise().execute(query, [Provider_Services_id]);
    return result;
  }

  static async deleteProviderService(Provider_Services_id) {
    try {
      const query = `
    DELETE FROM provider_services
    WHERE Provider_Services_id = ?;
  `;
      const [result] = await db
        .promise()
        .execute(query, [Provider_Services_id]);

      const secQry =
        "SELECT IFNULL(MAX(Provider_Services_id), 0) + 1 AS maxId FROM provider_services";
      const [data] = await db.promise().execute(secQry);
      const nextId = data[0].maxId;
      const thirdQry = `
  ALTER TABLE provider_services
  AUTO_INCREMENT = ${nextId};
`;
      await db.promise().query(thirdQry);

      return result;
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async getAllCategories() {
    const query = `SELECT name from categories;`;
    const [result] = await db.promise().execute(query);
    return result;
  }

  static async updateServiceInfo(
    base_price,
    service_location,
    Provider_Services_id,
    serviceName,
    categoryName,
    description,
    images
  ) {
    try {
      const query = `
  UPDATE provider_services
SET 
    base_price = ?,
    service_location = ?,
    images = ?
WHERE Provider_Services_id = ?;
  `;
      const [result] = await db
        .promise()
        .execute(query, [
          base_price,
          service_location,
          images,
          Provider_Services_id,
        ]);

      const secQry = `UPDATE services s
JOIN provider_services ps ON ps.service_id = s.service_id
JOIN categories c ON c.name = ?
SET
    s.name = ?,
    s.description = ?,
    s.category_id = c.category_id
WHERE ps.Provider_Services_id = ?;`;
      const [data] = await db
        .promise()
        .execute(secQry, [
          categoryName,
          serviceName,
          description,
          Provider_Services_id,
        ]);
      if (result.affectedRows > 0 && data.affectedRows > 0)
        return { success: "Update Success" };
      else return { error: "Can't Update" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addService(
    base_price,
    service_location,
    serviceName,
    categoryName,
    description,
    images,
    user_id,
    service_cover_image
  ) {
    try {
      const query = ` SELECT category_id from categories where name = ?;
  `;
      const [result] = await db.promise().execute(query, [categoryName]);

      const query2 = `
INSERT INTO services (
  category_id, name, description, image
)
VALUES (?, ?, ?, ?);
  `;
      const [result2] = await db
        .promise()
        .execute(query2, [
          result[0].category_id,
          serviceName,
          description,
          service_cover_image,
        ]);
      const serviceId = result2.insertId;

      const query3 = `
           select provider_id from service_providers where service_providers.user_id= ?;
  `;
      const [result3] = await db.promise().execute(query3, [user_id]);
      const providerId = result3[0].provider_id;

      const query4 = `
INSERT INTO provider_services (
 provider_id, service_id, base_price, images, service_location
)
VALUES (?, ?, ?, ?, ?);
  `;
      const [result4] = await db
        .promise()
        .execute(query4, [
          providerId,
          serviceId,
          base_price,
          images,
          service_location,
        ]);

      if (result2.affectedRows > 0 && result4.affectedRows > 0)
        return { success: "Add Success" };
      else return { error: "Can't Add" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addCategory(name, description, cover_image) {
    try {
      const query = ` INSERT INTO categories (
  name, description, cover_image
)
VALUES (?, ?, ?);
  `;
      const [result] = await db
        .promise()
        .execute(query, [name, description, cover_image]);

      if (result.affectedRows > 0) return { success: "Add category Success" };
      else return { error: "Can't Add new category" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }
}
module.exports = ServiceProvider;
