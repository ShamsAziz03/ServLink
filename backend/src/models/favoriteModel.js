const db = require("../config/db");

const Favorite = {
  getByUserId: async (user_id) => {
    const [rows] = await db.promise().query(
  `SELECT 
      f.favorite_id,
      p.provider_id,
      CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
      p.field_of_work,
      p.description,
      p.hourly_rate
   FROM favorites f
   JOIN service_providers p ON f.provider_id = p.provider_id
   JOIN users u ON p.user_id = u.user_id
   WHERE f.user_id = ?`,
  [user_id]
);

    return rows;
  },

  deleteById: async (favorite_id) => {
    await db.promise().query("DELETE FROM favorites WHERE favorite_id = ?", [favorite_id]);
  },
};

module.exports = Favorite;
