const db = require("../config/db");
exports.getBookingsByUser = async (req, res) => {
  const { user_id } = req.params;
  const { status } = req.query; // ?status=complete

  try {
    let query = `
      SELECT 
  b.*,
  p.field_of_work AS service_name,
  p.description,
  p.hourly_rate,
  s.name,
  CONCAT(u.first_name, ' ', u.last_name) AS provider_name
FROM bookings b
LEFT JOIN Provider_Services ps
  ON b.Provider_Services_id = ps.Provider_Services_id
LEFT JOIN services s
  ON ps.service_id = s.service_id
  LEFT JOIN service_providers p
  ON ps.provider_id = p.provider_id
LEFT JOIN users u
  ON p.user_id = u.user_id
WHERE b.user_id = ?;`;

    const params = [user_id];

    if (status) {
      query += " AND b.status = ?";
      params.push(status);
    }

    const [rows] = await db.promise().query(query, params);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateBooking = async (req, res) => {
  const { booking_id } = req.params;
  const { service_date, service_time, address, notes } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT service_date FROM bookings WHERE booking_id = ?", [booking_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingDate = new Date(rows[0].service_date);
    const now = new Date();

    const diffDays = (bookingDate - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      return res.status(400).json({ message: "Cannot edit booking less than 1 day before service" });
    }

    await db
      .promise()
      .query(
        `UPDATE bookings 
         SET service_date=?, service_time=?, address=?, notes=? 
         WHERE booking_id=?`,
        [service_date, service_time, address, notes, booking_id]
      );

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBooking = async (req, res) => {
  const { booking_id } = req.params;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT service_date FROM bookings WHERE booking_id = ?", [booking_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const bookingDate = new Date(rows[0].service_date);
    const now = new Date();

    const diffDays = (bookingDate - now) / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      return res.status(400).json({ message: "Cannot delete booking less than 1 day before service" });
    }

    await db.promise().query("DELETE FROM bookings WHERE booking_id = ?", [booking_id]);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
