const db = require("../config/db");

// 🧩 إنشاء مستخدم جديد
exports.createUser = ({
  first_name,
  last_name,
  email,
  phone,
  password_hash,
  city,
  location_coordinates,
  interests,
  birth_date,
  role,
}) => {
  return db.promise().query(
    `INSERT INTO users 
     (first_name, last_name, email, phone, password_hash, city, location_coordinates, interests, birth_date, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email,
      phone,
      password_hash,
      city,
      location_coordinates,
      interests,
      birth_date,
      role,
    ]
  );
};

// 🔍 البحث عن مستخدم عبر البريد الإلكتروني
exports.getUserByEmail = (email) => {
  return db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
};

// 🔍 البحث عن مستخدم عبر الـ user_id
exports.getUserById = (userId) => {
  return db.promise().query("SELECT * FROM users WHERE user_id = ?", [userId]);
};

// ✏️ تحديث بيانات المستخدم (تعديل الملف الشخصي)
exports.updateUser = (userId, data) => {
  const { first_name, last_name, email, phone, city } = data;
  return db
    .promise()
    .query(
      "UPDATE users SET first_name=?, last_name=?, email=?, phone=?, city=? WHERE user_id=?",
      [first_name, last_name, email, phone, city, userId]
    );
};

// 🔐 تحديث كلمة المرور
exports.updatePassword = (userId, newHash) => {
  return db
    .promise()
    .query("UPDATE users SET password_hash = ? WHERE user_id = ?", [newHash, userId]);
};
