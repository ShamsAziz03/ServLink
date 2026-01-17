const db = require("../config/db");

class PendingAcceptedCancellationsModel {
  static async addNewCancelledBooking(booking_id, reason) {
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

      if (result.affectedRows > 0) return { success: true };
      else return { error: "Can't Cancel Book" };
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
}
module.exports = PendingAcceptedCancellationsModel;
