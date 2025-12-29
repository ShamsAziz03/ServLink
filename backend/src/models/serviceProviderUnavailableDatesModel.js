const db = require("../config/db");

class ServiceProviderUnavailableDates {
  static async getProviderUnavailableDates(providerId) {
    const query = `select provider_id,date from provider_unavailable_dates
        where provider_id = ?`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProviderBookings(providerId) {
    const query = `select ps.provider_id,b.service_date
from provider_services ps
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
where ps.provider_id = ? AND b.is_accept='accepted';`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProviderUnavailableDatesByUserId(userId) {
    const query = `SELECT 
    provider_id FROM
    servlink.service_providers
    WHERE
    service_providers.user_id = ? ;`;
    const [result] = await db.promise().execute(query, [userId]);
    const providerId = result[0].provider_id;
    const queryUnavailableDates = `select id,provider_id,DATE_FORMAT(date, '%Y-%m-%d') AS date,created_at,note from provider_unavailable_dates
        where provider_id = ? `;
    const [dates] = await db
      .promise()
      .execute(queryUnavailableDates, [providerId]);
    return dates;
  }

  static async updateProviderUnavailableDates(userId, incomingDates) {
    const [result] = await db
      .promise()
      .execute(
        `SELECT provider_id FROM servlink.service_providers where user_id= ? ; `,
        [userId]
      );
    const values = incomingDates.map((d) => [
      result[0].provider_id,
      d.date,
      d.note || "",
    ]);

    await db
      .promise()
      .execute(`DELETE FROM provider_unavailable_dates WHERE provider_id = ?`, [
        result[0].provider_id,
      ]);

    await db
      .promise()
      .query(
        `INSERT INTO provider_unavailable_dates (provider_id, date, note) VALUES ?`,
        [values]
      );

    return { success: "Update Dates Success!" };
  }
}
module.exports = ServiceProviderUnavailableDates;
