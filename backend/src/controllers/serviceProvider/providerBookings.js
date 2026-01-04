const db = require("../../config/db");
exports.getProviderBookings = async (req, res) => {
  const { provider_id } = req.params;

  try {
    const query = `
      SELECT 
  b.booking_id,
  b.user_id,
  CONCAT(c.first_name, ' ', c.last_name) AS client_name,
  b.service_date,
  b.service_time,
  b.duration_time,
  b.address,
  b.notes,
  b.total_price,
  b.status,
  b.payment_method,
  b.estimated_time,
  sp.field_of_work AS service_name,
  s.name,
  CONCAT(pu.first_name, ' ', pu.last_name) AS provider_name
FROM bookings b
JOIN provider_services ps
  ON b.Provider_Services_id = ps.Provider_Services_id
JOIN service_providers sp
  ON ps.provider_id = sp.provider_id
JOIN services s
  ON ps.service_id = s.service_id
JOIN users pu
  ON sp.user_id = pu.user_id
JOIN users c
  ON b.user_id = c.user_id
WHERE ps.provider_id = ?
ORDER BY b.service_date, b.service_time;

    `;
    const [rows] = await db.promise().query(query, [provider_id]);
    
    const formattedRows = rows.map(row => ({
      ...row,
      service_date: formatDate(row.service_date) 
    }));
    
    res.status(200).json(formattedRows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// PUT: تحديث حالة الحجز
exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // التحقق من القيم المسموح بها
    const allowedStatuses = ['Confirmed', 'Pending', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status value. Allowed values: Confirmed, Pending, Cancelled' 
      });
    }

    const query = `
      UPDATE bookings 
      SET status = ?, updated_at = NOW() 
      WHERE booking_id = ?
    `;
    
    const [result] = await db.promise().query(query, [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Booking status updated successfully',
      booking_id: id,
      new_status: status
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};

// GET: جلب حجوزات يوم معين (اختياري - مفيد للبحث)
exports.getBookingsByDate = async (req, res) => {
  const { provider_id, date } = req.params; // date format: YYYY-MM-DD

  try {
    const query = `
       SELECT 
  b.booking_id,
  b.user_id,
  CONCAT(c.first_name, ' ', c.last_name) AS client_name,
  b.service_date,
  b.service_time,
  b.duration_time,
  b.address,
  b.notes,
  b.total_price,
  b.status,
  b.payment_method,
  b.estimated_time,
  sp.field_of_work AS service_name,
  s.name,
  CONCAT(pu.first_name, ' ', pu.last_name) AS provider_name
FROM bookings b
JOIN provider_services ps
  ON b.Provider_Services_id = ps.Provider_Services_id
JOIN service_providers sp
  ON ps.provider_id = sp.provider_id
JOIN services s
  ON ps.service_id = s.service_id
JOIN users pu
  ON sp.user_id = pu.user_id
JOIN users c
  ON b.user_id = c.user_id
WHERE ps.provider_id = ?
ORDER BY b.service_date, b.service_time;


    `;
    
    const [rows] = await db.promise().query(query, [provider_id, date]);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
// PUT /api/bookings/:id/complete
// PUT /api/bookings/:booking_id/complete
exports.completeBooking = async (req, res) => {
  const { booking_id } = req.params;
  const { actual_time } = req.body;

  try {
    const [rateRows] = await db.promise().query(
      `
      SELECT sp.hourly_rate
      FROM bookings b
      JOIN provider_services ps 
        ON b.Provider_Services_id = ps.Provider_Services_id
      JOIN service_providers sp 
        ON ps.provider_id = sp.provider_id
      WHERE b.booking_id = ?
      `,
      [booking_id]
    );

    if (rateRows.length === 0) {
      return res.status(404).json({ message: "Booking or provider not found" });
    }

    const hourlyRate = rateRows[0].hourly_rate;

    const actualTotalPrice = actual_time * hourlyRate;

    const [result] = await db.promise().query(
      `
      UPDATE bookings 
      SET 
        duration_time = ?,
        actual_total_price = ?,
        status = 'Completed'
      WHERE booking_id = ?
      `,
      [actual_time, actualTotalPrice, booking_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      booking_id,
      actual_time,
      hourly_rate: hourlyRate,
      actual_total_price: actualTotalPrice
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};


function formatDate(date) {
  if (!date) return null;
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date; 
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}