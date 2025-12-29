const db = require("../config/db");

const User = {
  createUser: ({ first_name, last_name, email, phone, password_hash, city, interests, birth_date, role }) => {
    return db.promise().query(
      `INSERT INTO users 
       (first_name, last_name, email, phone, password_hash, city, interests, birth_date, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, password_hash, city, interests, birth_date, role]
    );
  },

  getUserByEmail: (email) => db.promise().query("SELECT * FROM users WHERE email = ?", [email]),

  getUserById: (userId) => db.promise().query("SELECT * FROM users WHERE user_id = ?", [userId]),

  updateUser: (userId, data) => {
    const { first_name, last_name, email, phone, city } = data;
    return db.promise().query(
      "UPDATE users SET first_name=?, last_name=?, email=?, phone=?, city=? WHERE user_id=?",
      [first_name, last_name, email, phone, city, userId]
    );
  },

  updatePassword: (userId, newHash) => db.promise().query(
    "UPDATE users SET password_hash=? WHERE user_id=?",
    [newHash, userId]
  ),

  updatePushToken: (userId, token) => db.promise().query(
    "UPDATE users SET expo_push_token=? WHERE user_id=?",
    [token, userId]
  ),

  getPushTokenById: (userId) => db.promise().query(
    "SELECT expo_push_token FROM users WHERE user_id=?",
    [userId]
  )
};

module.exports = User;
