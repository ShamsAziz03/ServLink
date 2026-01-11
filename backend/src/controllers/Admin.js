const db = require("../config/db");
const ip = process.env.EXPO_PUBLIC_IP;
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
  const ip = process.env.EXPO_PUBLIC_IP;
    const cover_image_url = `http://${ip}:5000/assets/${file.filename}`;

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
      cover_image_url = `http://${ip}:5000/assets/${file.filename}`;
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
 

exports.getServices = async (req, res) => {
    try {
    const query = `
    SELECT
  s.service_id,
  s.name AS service_name,
  s.description,
  s.image,
  c.name AS category_name,
  MIN(sp.base_price) AS base_price
FROM services s
JOIN categories c ON s.category_id = c.category_id
JOIN provider_services sp ON sp.service_id = s.service_id
GROUP BY s.service_id;

  `;


    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};   
exports.get_contact_messages= async (req, res) => {
  try {
    const query = `
     select c.*
     from contact_messages c
    `;

    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.replyMessage = async (req, res) => {
  const { contact_id, reply } = req.body;

  if (!contact_id || !reply) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    await db.promise().query(
      "INSERT INTO contact_replies (contact_id, reply) VALUES (?, ?)",
      [contact_id, reply]
    );

    await db.promise().query(
      "UPDATE contact_messages SET replied = 1 WHERE id = ?",
      [contact_id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const query = `
      SELECT 
      u.user_id,
  u.first_name,
  u.last_name,
  u.email,
  u.phone,
  u.city,
  u.role
FROM users u
WHERE u.role = 'admin' OR u.role = 'super_admin'
GROUP BY u.user_id;

    `;

    const [rows] = await db.promise().query(query);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const bcrypt = require("bcrypt");
exports.addAdmin = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      city,
    } = req.body;

    // ✅ Validate
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email and password are required",
      });
    }

    // Check if email already exists
    const [existing] = await db
      .promise()
      .query("SELECT user_id FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert admin
    const query = `
      INSERT INTO users
      (first_name, last_name, email, password_hash, phone, city, role)
      VALUES (?, ?, ?, ?, ?, ?, 'admin')
    `;

    const params = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone || null,
      city || null,
    ];

    await db.promise().query(query, params);

    res.status(201).json({
      message: "Admin added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const [admin] = await db
      .promise()
      .query("SELECT role FROM users WHERE user_id = ?", [id]);

    if (admin.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin[0].role === "super_admin") {
      return res
        .status(403)
        .json({ message: "You cannot delete a super admin" });
    }

    await db
      .promise()
      .query("DELETE FROM users WHERE user_id = ?", [id]);

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
