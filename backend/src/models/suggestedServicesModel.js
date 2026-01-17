const db = require("../config/db");

class SuggestedServicesModel {
  static async getUserIntrests(userId) {
    const query = `SELECT 
    u.interests
FROM
    users u
WHERE
    u.user_id = ?;`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }
  static async getCategories() {
    const query = `SELECT 
    c.category_id, c.name AS categoryName
FROM
    categories c;`;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getServices() {
    const query = `SELECT 
    s.service_id, s.category_id, s.name as serviceName, s.description as serviceDescription,  s.image AS service_image
FROM
    services s;
   `;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getProviderServices() {
    const query = `SELECT 
    ps.Provider_Services_id, ps.service_id, ps.base_price
FROM
    provider_services ps;
   `;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getUserBookings(userId) {
    const query = `SELECT 
    *
FROM
    bookings b
WHERE
    b.user_id = ?;`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }
}
module.exports = SuggestedServicesModel;
