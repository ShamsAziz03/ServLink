const db = require("../config/db");

exports.createUser = ({
  first_name, last_name, email, phone, password_hash,
 city, location_coordinates, interests, birth_date,role
}) => {
  return db.promise().query(
    `INSERT INTO users 
    (first_name, last_name, email, phone, password_hash, city, location_coordinates, interests, birth_date, role)
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [first_name, last_name, email, phone, password_hash, city, location_coordinates, interests, birth_date, role]
  );
};

exports.getUserByEmail = (email) => {
  return db.promise().query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
};
