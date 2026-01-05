const db = require("../config/db");

const Favorite = {
  getByUserId: async (user_id) => {
    const [rows] = await db.promise().query(
      `SELECT 
      f.favorite_id,
      p.provider_id,
      CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
      p.field_of_work,
      p.aboutProvider,
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
    await db
      .promise()
      .query("DELETE FROM favorites WHERE favorite_id = ?", [favorite_id]);
  },

  addFavProvider: async (userId, providerId) => {
    const query = `
      INSERT INTO favorites (user_id, provider_id, added_at)
      VALUES (?, ?, NOW())
    `;
    const [result] = await db.promise().execute(query, [userId, providerId]);
    if (result.affectedRows > 0) {
      return { success: true };
    } else {
      return { success: false };
    }
  },
};

module.exports = Favorite;
