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
}
module.exports = ServiceProviderUnavailableDates;
