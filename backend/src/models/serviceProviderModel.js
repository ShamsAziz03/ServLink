const db = require("../config/db");

class ServiceProvider {
  static async getServiceProviders(serviceId) {
    const query = `select sp.*
,ps.service_id,ps.base_price,ps.images,u.first_name,u.last_name, u.phone,u.email
from provider_services ps
join service_providers sp on ps.provider_id=sp.provider_id
join users u on sp.user_id= u.user_id
where ps.service_id=
? ;
;
`;
    const [result] = await db.promise().execute(query, [serviceId]);
    return result;
  }

  static async getRating(providerId) {
    const query = `select sp.provider_id, max(r.score) as max_rating
from service_providers sp
join provider_services ps on sp.provider_id=ps.provider_id
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
join ratings r on b.booking_id=r.booking_id
where sp.provider_id= ? 
group by sp.provider_id;
`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }


  static async getFeedbacks(providerId) {
    const query = `select sp.provider_id, r.score,r.feedback_text,u.first_name,u.last_name,r.rated_at
from service_providers sp
join provider_services ps on sp.provider_id=ps.provider_id
join bookings b on ps.Provider_Services_id=b.Provider_Services_id
join ratings r on b.booking_id=r.booking_id
join users u on b.user_id=u.user_id
where sp.provider_id= ? ;
`;
    const [result] = await db.promise().execute(query, [providerId]);
    return result;
  }
}
module.exports = ServiceProvider;
