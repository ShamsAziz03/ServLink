const db = require("../config/db");

class Bookings {
  static async getProviderBookings(providerId) {
    const query = `select ps.provider_id,b.service_date,b.service_time,b.estimated_time
from provider_services ps
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
where ps.provider_id = ? AND b.is_accept='accepted' AND b.status='Pending'
     `;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProviderBookingsByUserId(userId) {
    const query = `SELECT 
    sp.provider_id
FROM
    service_providers sp
WHERE
    sp.user_id = ?
     `;
    const [result] = await db.promise().execute(query, [userId]);
    const providerId = result[0].provider_id;

    const getBooks = `SELECT 
    b.booking_id,
    b.status,
    b.service_date,
    b.service_time,
    b.payment_method,
    b.address,
    b.notes,
    b.created_at,
    b.is_accept,
    b.estimated_time,
    b.duration_time,
    b.actual_total_price,
    b.total_price,
    u.user_id as customerId,
    u.first_name,
    u.last_name,
    u.phone,
    s.name AS serviceName,
    c.name AS categoryName
FROM
    bookings b
        LEFT JOIN
    users u ON b.user_id = u.user_id
        LEFT JOIN
    provider_services ps ON b.Provider_Services_id = ps.Provider_Services_id
        JOIN
    services s ON ps.service_id = s.service_id
        JOIN
    categories c ON s.category_id = c.category_id
WHERE
    ps.provider_id = ?
     `;
    const [response] = await db.promise().execute(getBooks, [providerId]);
    return response;
  }

  static async getBookAnswers(bookId) {
    const getBookAnswers = `SELECT 
    ba.answer_value,ba.question_id
FROM
    bookings b
        LEFT JOIN
    booking_answers ba ON b.booking_id = ba.booking_id
WHERE
    b.booking_id = ?
     `;
    const [response] = await db.promise().execute(getBookAnswers, [bookId]);
    return response;
  }

  static async updateBook(bookId, is_accept, status, userId, providerId) {
    const updateQuery = `UPDATE bookings
    SET is_accept = ?, status = ?
    WHERE booking_id = ?;`;
    const [response] = await db
      .promise()
      .execute(updateQuery, [is_accept, status, bookId]);

    if (response.affectedRows > 0) {
      const [providerRows] = await db.promise().execute(
        `SELECT u.first_name, u.last_name 
         FROM service_providers p 
         JOIN users u ON p.user_id = u.user_id 
         WHERE p.provider_id = ?`,
        [providerId]
      );

      const provider = providerRows[0];
      const providerName = provider
        ? `${provider.first_name} ${provider.last_name}`
        : "Provider";

      let title, message;
      if (is_accept === "accepted") {
        title = "Booking Accepted";
        message = `Your booking has been accepted by ${providerName}`;
      } else if (is_accept === "rejected") {
        title = "Booking Rejected";
        message = `Your booking has been rejected by ${providerName}`;
      }
      const sentAt = new Date();
      await db
        .promise()
        .execute(
          `INSERT INTO notifications (user_id, title, message, sent_at) VALUES (?, ?, ?, ?)`,
          [userId, title, message, sentAt]
        );

      return { success: "Update Done and Notification Sent" };
    }

    return { error: "Can't Update" };
  }
}
module.exports = Bookings;
