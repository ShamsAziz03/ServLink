const db = require("../config/db");

exports.createUser = ({
  first_name, last_name, email, phone, password_hash,
  address, city, location_coordinates, interests, birth_date
}) => {
  return db.promise().query(
    `INSERT INTO users 
    (first_name, last_name, email, phone, password_hash, address, city, location_coordinates, interests, birth_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [first_name, last_name, email, phone, password_hash, address, city, location_coordinates, interests, birth_date]
  );
};

exports.getUserByEmail = (email) => {
  return db.promise().query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
};
