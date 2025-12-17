const db = require("../config/db");
const getAllServices = async () => {
  const [rows] = await db.promise().query(`
    SELECT s.service_id, s.name AS service_name, s.description AS service_description,
           c.name AS category_name, c.description AS category_description,
           u.first_name, u.last_name,
           p.provider_id,           
           p.hourly_rate,
           p.service_locations
    FROM services s
    JOIN categories c ON s.category_id = c.category_id
    JOIN provider_services ps ON s.service_id = ps.service_id
    JOIN service_providers p ON ps.provider_id = p.provider_id
    JOIN users u ON p.user_id = u.user_id
  `);
  return rows;
};
module.exports = { getAllServices };
