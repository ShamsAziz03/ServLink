const db = require("../config/db");

class Rating {
  static async create({ booking_id, score, feedback_text }) {
    const [existing] = await db.promise().query(
      "SELECT * FROM ratings WHERE booking_id = ?",
      [booking_id]
    );

    if (existing.length > 0) throw new Error("You already rated this booking");

    const [result] = await db.promise().query(
      "INSERT INTO ratings (booking_id, score, feedback_text) VALUES (?, ?, ?)",
      [booking_id, score, feedback_text]
    );

    return result.insertId;
  }

  static async getByUser(user_id) {
    const [rows] = await db.promise().query(
      `SELECT b.*, sp.name AS provider_name,
              r.rating_id, r.score, r.feedback_text, r.rated_at
       FROM bookings b
       LEFT JOIN service_providers sp ON b.provider_id = sp.provider_id
       LEFT JOIN ratings r ON b.booking_id = r.booking_id AND r.user_id = ?
       WHERE b.user_id = ?`,
      [user_id, user_id]
    );

    return rows.map(b => ({
      booking_id: b.booking_id,
      service_date: b.service_date,
      service_time: b.service_time,
      status: b.status,
      provider_name: b.provider_name,
      provider_id: b.provider_id,
      total_price: b.total_price,
      payment_method: b.payment_method,
      address: b.address,
      notes: b.notes,
      rating: b.rating_id ? { score: b.score, feedback_text: b.feedback_text, rated_at: b.rated_at } : null
    }));
  }
}

module.exports = Rating;
