const db = require("../config/db");

class ServiceProviderSchedule {
  static async getProviderSchedule(providerId) {
    const query = `select provider_id,day_of_week,start_time,end_time from provider_schedule
        where provider_id = ?`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }

  static async getProviderScheduleByUserId(userId) {
    const query = `SELECT 
    provider_id FROM
    servlink.service_providers
    WHERE
    service_providers.user_id = ? ;`;
    const [result] = await db.promise().execute(query, [userId]);
    const providerId = result[0].provider_id;
    const querySchedule = `select id,provider_id,day_of_week,start_time,end_time from provider_schedule
        where provider_id = ? `;
    const [schedule] = await db.promise().execute(querySchedule, [providerId]);
    return schedule;
  }

  static async updateProviderSchedule(userId, incomingSchedule) {
    const [result] = await db
      .promise()
      .execute(
        `SELECT provider_id FROM servlink.service_providers where user_id= ? ; `,
        [userId]
      );

    const values = Object.entries(incomingSchedule).map(([day, times]) => [
      result[0].provider_id,
      day,
      times.start,
      times.end,
    ]);
    await db
      .promise()
      .execute(`DELETE FROM provider_schedule WHERE provider_id = ?`, [
        result[0].provider_id,
      ]);

    await db
      .promise()
      .query(
        `INSERT INTO provider_schedule (provider_id, day_of_week, start_time, end_time) VALUES ?`,
        [values]
      );

    return { success: "Update schedule Success!" };
  }
}
module.exports = ServiceProviderSchedule;
