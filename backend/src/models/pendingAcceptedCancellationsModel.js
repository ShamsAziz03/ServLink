const db = require("../config/db");

class PendingAcceptedCancellationsModel {
  static async addNewCancelledBooking(booking_id, reason, provider) {
    try {
      const query = `
INSERT INTO pending_accepted_cancellations (
 booking_id, cancelled_at, reason

)
VALUES (?, ?, ?);
  `;
      const [result] = await db
        .promise()
        .execute(query, [booking_id, new Date(), reason]);

      if (result.affectedRows > 0) {
        const [cancelledBooks] = await db.promise().execute(
          `SELECT *
 FROM pending_accepted_cancellations pac
join bookings b on pac.booking_id=b.booking_id
join provider_services ps on b.Provider_Services_id=ps.Provider_Services_id
join service_providers sp on ps.provider_id=sp.provider_id
where sp.user_id= ?;`,
          [provider.user_id],
        );
        if (cancelledBooks.length < 10) {
          return { success: true, blocked: false };
        } else {
          await db.promise().execute(
            `INSERT INTO user_blacklist (
       blacklist_id,
       user_id,
       reason,
       start_date,
       end_date
     )
     VALUES (
       UUID(),
       ?,
       'Too many cancellations',
       NOW(),
       DATE_ADD(NOW(), INTERVAL 1 MONTH)
     )`,
            [provider.user_id],
          );
          return { success: true, blocked: true };
        }
      } else return { error: "Can't Cancel Book" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async updateBookStatus(booking_id) {
    try {
      const query = `
UPDATE bookings
SET 
    status = 'Cancelled',
    is_accept = 'rejected'
WHERE booking_id = ?;
  `;
      const [result] = await db.promise().execute(query, [booking_id]);

      if (result.affectedRows > 0) return { success: true };
      else return { error: "Can't Cancel Book" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addNotification(book, provider) {
    try {
      const title = `Cancel Booking`;
      const message = `The Provider ${provider.first_name} ${provider.last_name}, has Cancel Your booking that already confirm it,
      it was in ${book.service_date} at ${book.service_time}, for ${book.serviceName} - ${book.categoryName}, in ${book.address}.
      Please Check The new Provider that system choose for you, if you have any problem, tell use Using Contact Us page as sson as possible!`;
      const query = `
INSERT INTO notifications (
user_id, title, message, sent_at
)
VALUES (?, ?, ?, ?);
  `;
      const [result] = await db
        .promise()
        .execute(query, [book.customerId, title, message, new Date()]);

      if (result.affectedRows > 0) return { success: "Cancel Book Success" };
      else return { error: "Can't add notification" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async sendFailureNotificationToUser(book, provider) {
    try {
      const title = `System Fails to Auto booking For You!`;
      const message = `The System can't add new booking automatically with another provider, since youe booking with ${provider.first_name} ${provider.last_name} Cancelled,
      it was in ${book.service_date} at ${book.service_time}, for ${book.serviceName} - ${book.categoryName}, in ${book.address}.
      Please book with another one and if you have any problem, tell use Using Contact Us page`;
      const query = `
INSERT INTO notifications (
user_id, title, message, sent_at
)
VALUES (?, ?, ?, ?);
  `;
      const [result] = await db
        .promise()
        .execute(query, [book.customerId, title, message, new Date()]);

      if (result.affectedRows > 0) return { success: true };
      else
        return { error: "Can't notify user that system can't do auto booking" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async getServiceProviderTable(providerId) {
    const query = `SELECT 
    ps.Provider_Services_id,
    ps.provider_id,
    ps.service_id,
    ps.base_price,
    ps.service_location
FROM
    provider_services ps
WHERE
    ps.provider_id != ?; `;
    const [response] = await db.promise().execute(query, [providerId]);
    return response;
  }

  static async getAllServices() {
    const query = `SELECT 
    s.service_id,
    s.name AS serviceName,
    s.description,
    c.name AS categoryName
FROM
    services s
        JOIN
    categories c ON s.category_id = c.category_id;`;
    const [response] = await db.promise().execute(query);
    return response;
  }

  static async getProviders(providerId) {
    const query = `SELECT 
    sp.provider_id,
    u.first_name,
    u.last_name,
    sp.field_of_work,
    sp.description,
    sp.aboutProvider,
    sp.service_locations,
    sp.languages,
    sp.approved_by_admin,
    sp.years_of_experience
FROM
    service_providers sp
        JOIN
    users u ON sp.user_id = u.user_id
    where sp.provider_id != ? ; `;
    const [response] = await db.promise().execute(query, [providerId]);
    return response;
  }

  static async getProvidersSchedules(providerId) {
    const query = `SELECT 
    ps.provider_id, ps.day_of_week, ps.start_time, ps.end_time
FROM
    provider_schedule ps
WHERE
    ps.provider_id != ?;`;
    const [response] = await db.promise().execute(query, [providerId]);
    return response;
  }

  static async getProvidersHolidays(providerId) {
    const query = `SELECT 
    pu.provider_id, pu.date, pu.note
FROM
    provider_unavailable_dates pu
WHERE
    pu.provider_id != ?;`;
    const [response] = await db.promise().execute(query, [providerId]);
    return response;
  }

  static async getProvidersBookings(providerId) {
    const query = `SELECT 
    b.booking_id,
    ps.Provider_Services_id,
    b.status,
    b.service_date,
    b.service_time,
    b.payment_method,
    b.address,
    b.estimated_time
FROM
    bookings b
        JOIN
    users u ON b.user_id = u.user_id
        JOIN
    provider_services ps ON b.Provider_Services_id = ps.Provider_Services_id
WHERE
    ps.provider_id != ?
        AND b.status = 'Pending'`;
    const [response] = await db.promise().execute(query, [providerId]);
    return response;
  }

  static async addNewBook(book, resultFromAI) {
    try {
      const query = `
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
      notes,
      created_at,
      is_accept,
      estimated_time,
      duration_time,
      actual_total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, NULL, NULL)
  `;
      const [result] = await db
        .promise()
        .execute(query, [
          book.customerId,
          resultFromAI.best_provider.providerServiceId,
          "Pending",
          new Date(),
          resultFromAI.best_provider.scheduled_date,
          resultFromAI.best_provider.scheduled_time,
          Number(book.estimated_time) * resultFromAI.best_provider.base_price,
          book.payment_method,
          book.address,
          book.notes,
          "pending",
          book.estimated_time,
        ]);

      if (result.affectedRows > 0)
        return {
          booking_id: result.insertId,
        };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addNewNotificationToUser(newBookInfo, userId) {
    try {
      const title = `Add new Booking instead of one that cancelled`;
      const message = `The system is automatically booking for you with new provider, instead of one that cancelled, in the same range of price and near to your location,
      the book is done with ${newBookInfo.best_provider.provider_name}, the task name is: ${newBookInfo.best_provider.service_name_offered_by_provider}, base price/hr: ${newBookInfo.best_provider.base_price}
      on ${newBookInfo.best_provider.scheduled_date}, at ${newBookInfo.best_provider.scheduled_time}.`;
      const query = `
INSERT INTO notifications (
user_id, title, message, sent_at
)
VALUES (?, ?, ?, ?);
  `;
      await db.promise().execute(query, [userId, title, message, new Date()]);
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addBookAnswers(oldBookId, newBookId) {
    try {
      const query = `
      INSERT INTO booking_answers (booking_id, question_id, answer_value)
      SELECT ?, question_id, answer_value
      FROM booking_answers
      WHERE booking_id = ?
    `;

      await db.promise().execute(query, [newBookId, oldBookId]);
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }
}
module.exports = PendingAcceptedCancellationsModel;
