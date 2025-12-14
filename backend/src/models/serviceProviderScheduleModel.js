const db = require("../config/db");

class ServiceProviderSchedule {
  static async getProviderSchedule(providerId) {
    const query = `select provider_id,day_of_week,start_time,end_time from provider_schedule
        where provider_id = ?`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }
}
module.exports = ServiceProviderSchedule;
