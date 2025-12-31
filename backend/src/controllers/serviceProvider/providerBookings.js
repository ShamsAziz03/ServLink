const db = require("../../config/db");

// GET: جلب جميع حجوزات البروفايدر
exports.getProviderBookings = async (req, res) => {
  const { provider_id } = req.params;

  try {
    const query = `
      SELECT 
        b.booking_id,
        b.user_id,
        CONCAT(u.first_name,' ', u.last_name) AS client_name,
        b.service_date,
        b.service_time,
        b.duration_time,
        b.address,
        b.notes,
        b.total_price,
        b.status,
        b.payment_method,
        b.estimated_time,
        sp.field_of_work AS service_name
      FROM bookings b
      JOIN provider_services ps
        ON b.Provider_Services_id = ps.Provider_Services_id
        LEFT JOIN service_providers sp 
        ON b.Provider_Services_id = sp.provider_id
      JOIN users u
        ON b.user_id = u.user_id
      WHERE ps.provider_id = ?
      ORDER BY b.service_date, b.service_time
    `;
    const [rows] = await db.promise().query(query, [provider_id]);
    
    // تنسيق التاريخ ليكون متوافقاً مع الجافاسكريبت
    const formattedRows = rows.map(row => ({
      ...row,
      service_date: formatDate(row.service_date) // تأكد من أن التاريخ بصيغة YYYY-MM-DD
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
        CONCAT(u.first_name,' ', u.last_name) AS client_name,
        b.service_date,
        b.service_time,
        b.duration_time,
        b.address,
        b.notes,
        b.total_price,
        b.payment_method,
        b.status,
        b.estimated_time,
      FROM bookings b
      JOIN provider_services ps
        ON b.Provider_Services_id = ps.Provider_Services_id
      JOIN users u
        ON b.user_id = u.user_id
      WHERE ps.provider_id = ? 
        AND b.service_date = ?
      ORDER BY b.service_time
    `;
    
    const [rows] = await db.promise().query(query, [provider_id, date]);
    res.status(200).json(rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
// PUT /api/bookings/:id/complete
exports.completeBooking = async (req, res) => {
  const { booking_id } = req.params;
  const { actual_time } = req.body;

  try {
    const [result] = await db.promise().query(
      `UPDATE bookings SET duration_time = ?, status = 'Completed' WHERE booking_id = ?`,
      [actual_time, booking_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });

    res.status(200).json({ success: true, actual_time });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// دالة مساعدة لتنسيق التاريخ
function formatDate(date) {
  if (!date) return null;
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return date; // إذا كان التاريخ غير صالح، أرجع القيمة الأصلية
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}