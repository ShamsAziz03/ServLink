const db = require("../config/db");

class ServiceMatchAI {
  static async getproviderWorkingHours() {
    const query = `SELECT 
    ps.provider_id, ps.start_time, ps.end_time, ps.day_of_week
FROM
    provider_schedule ps;`;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getProviderServices() {
    const query = `SELECT 
    ps.Provider_Services_id,
    ps.provider_id,
    ps.service_id,
    ps.base_price,
    ps.service_location
FROM
    provider_services ps;`;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getServices() {
    const query = `SELECT 
    s.service_id, s.category_id, s.name, s.description
FROM
    services s;
   `;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getProviderNotes() {
    const query = `SELECT 
    un.provider_id, un.date
FROM
    provider_unavailable_dates un;
   `;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getCategories() {
    const query = `SELECT 
    c.category_id, c.name, c.description
FROM
    categories c;`;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getProviders() {
    const query = `SELECT 
    sp.provider_id,
    sp.user_id,
    sp.field_of_work,
    sp.description,
    sp.certifications,
    sp.hourly_rate,
    sp.service_locations,
    sp.years_of_experience,
    sp.languages,
    sp.aboutProvider
FROM
    service_providers sp;`;
    const [result] = await db.promise().execute(query);
    return result;
  }
  static async getUsers() {
    const query = `SELECT 
    u.user_id, u.first_name, u.last_name, u.phone
FROM
    users u;
   `;
    const [result] = await db.promise().execute(query);
    return result;
  }
}
module.exports = ServiceMatchAI;
