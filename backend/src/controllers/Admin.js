const db = require("../config/db");
exports.getAdminInfo = async (req, res) => {
  try {
    let query = `
      SELECT
        (SELECT COUNT(*) FROM users) AS user_count,
        (SELECT COUNT(*) FROM bookings) AS booking_count,
        (SELECT COUNT(*) FROM services) AS service_count,
        (SELECT COUNT(*) FROM service_providers) AS provider_count,
        (SELECT COUNT(*) FROM categories) AS category_count
    `;
    const [rows] = await db.promise().query(query);
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserswithBookings = async (req, res) => {
  try {
    const query = `
      SELECT 
  u.*,
  COUNT(b.booking_id) AS bookings_count
FROM users u
LEFT JOIN bookings b 
  ON b.user_id = u.user_id
WHERE u.role = 'user'
GROUP BY u.user_id;

    `;

    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.blockingUser = async (req, res) => {
  try {
    const { user_id, is_blacklisted } = req.body;

    if (user_id === undefined || is_blacklisted === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const query = `
      UPDATE users 
      SET is_blacklisted = ?
      WHERE user_id = ?
    `;

    const [result] = await db
      .promise()
      .query(query, [is_blacklisted, user_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: is_blacklisted ? "User blocked" : "User unblocked",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = `
   SELECT 
  u.*,
  COUNT(b.booking_id) AS bookings_count
FROM users u
LEFT JOIN bookings b 
  ON b.user_id = u.user_id
WHERE (
  u.first_name LIKE ?
  OR u.last_name LIKE ?
  OR u.email LIKE ?
)
AND u.role = 'user'
GROUP BY u.user_id;

    `;

    const searchValue = `%${search}%`;

    const [rows] = await db.promise().query(query, [
      searchValue,
      searchValue,
      searchValue,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//////////Provider
exports.getProvidersWithBookings = async (req, res) => {
  try {
    const query = `
      SELECT 
  u.*,
  p.*,
  COUNT(b.booking_id) AS bookings_count
FROM users u
JOIN service_providers p
        ON p.user_id = u.user_id
      LEFT JOIN provider_services ps
        ON ps.provider_id = p.provider_id
      LEFT JOIN bookings b
        ON b.Provider_Services_id = ps.Provider_Services_id
      GROUP BY 
        u.user_id,
        p.provider_id,
        p.field_of_work,
        p.description,
        p.certifications,
        p.years_of_experience,
        p.hourly_rate,
        p.service_locations,
        p.approved_by_admin

    `;

    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= SEARCH PROVIDERS =================
exports.searchProviders = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search)
      return res.status(400).json({ error: "Search query missing" });

    const query = `
      SELECT 
        u.*,
        p.*,
        COUNT(b.booking_id) AS bookings_count
      FROM service_providers p
      INNER JOIN users u
        ON u.user_id = p.user_id
      LEFT JOIN provider_services ps
        ON ps.provider_id = p.provider_id
      LEFT JOIN bookings b
        ON b.Provider_Services_id = ps.Provider_Services_id
      WHERE 
        p.provider_id IS NOT NULL
        AND (
          u.first_name LIKE ?
          OR u.last_name LIKE ?
          OR u.email LIKE ?
          OR p.field_of_work LIKE ?
          OR p.service_locations LIKE ?
        )
      GROUP BY 
        u.user_id,
        p.provider_id;
    `;

    const likeSearch = `%${search}%`;

    const [rows] = await db.promise().query(query, [
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
      likeSearch,
    ]);

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleApproveProvider = async (req, res) => {
  try {
    const { provider_id, approved_by_admin } = req.body;

    if (!provider_id || approved_by_admin === undefined) {
      return res.status(400).json({ error: "provider_id or approved_by_admin missing" });
    }

    const query = `
      UPDATE service_providers
      SET approved_by_admin = ?
      WHERE provider_id = ?
    `;

    await db.promise().query(query, [approved_by_admin, provider_id]);
    res.status(200).json({ message: "Provider status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getCategories = async (req, res) => {
  try {
    const query = `
      SELECT 
      c.*
      FROM categories c;
    `;

    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.file;

    if (!name || !description || !file) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const cover_image_url = `http://ip:5000/assets/${file.filename}`;

    const query = `
      INSERT INTO categories (name, description, cover_image)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [name, description, cover_image_url]);

    res.status(201).json({ message: "Category added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { category_id, name, description } = req.body;  
    const file = req.file; 

    if (!category_id || !name || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let cover_image_url;
    if (file) {
      cover_image_url = `http://ip:5000/assets/${file.filename}`;
    }

    let query, params;
    if (cover_image_url) {
      query = `UPDATE categories SET name=?, description=?, cover_image=? WHERE category_id=?`;
      params = [name, description, cover_image_url, category_id];
    } else {
      query = `UPDATE categories SET name=?, description=? WHERE category_id=?`;
      params = [name, description, category_id];
    }

    const [result] = await db.promise().query(query, params);

    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
