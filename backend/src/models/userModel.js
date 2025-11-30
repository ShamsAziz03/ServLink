const db = require("../config/db");


exports.createUser = ({
  first_name,
  last_name,
  email,
  phone,
  password_hash,
  city,
  interests,
  birth_date,
  role,
}) => {
  return db.promise().query(
    `INSERT INTO users 
     (first_name, last_name, email, phone, password_hash, city,interests, birth_date, role)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email,
      phone,
      password_hash,
      city,
      interests,
      birth_date,
      role,
    ]
  );
};


exports.getUserByEmail = (email) => {
  return db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
};


exports.getUserById = (userId) => {
  return db.promise().query("SELECT * FROM users WHERE user_id = ?", [userId]);
};

exports.updateUser = (userId, data) => {
  const { first_name, last_name, email, phone, city } = data;
  return db
    .promise()
    .query(
      "UPDATE users SET first_name=?, last_name=?, email=?, phone=?, city=? WHERE user_id=?",
      [first_name, last_name, email, phone, city, userId]
    );
};
exports.updatePassword = (userId, newHash) => {
  return db
    .promise()
    .query("UPDATE users SET password_hash = ? WHERE user_id = ?", [newHash, userId]);
};
