const db = require("../config/db");

class Bookings {
  static async getProviderBookings(providerId) {
    const query = `select ps.provider_id,b.service_date,b.service_time,b.estimated_time
from provider_services ps
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
where ps.provider_id = ? AND b.is_accept='accepted' AND b.status='Pending'
     `;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }
}
module.exports = Bookings;
