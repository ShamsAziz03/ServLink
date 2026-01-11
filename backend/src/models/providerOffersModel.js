const db = require("../config/db");

class ProviderOffersModel {
  static async getProviderOffers(userId) {
    const query = `select offers.*, ps.base_price, s.name from offers
join provider_services ps on offers.Provider_Services_id=ps.Provider_Services_id
join service_providers sp on ps.provider_id=sp.provider_id
join services s on ps.service_id=s.service_id
        where sp.user_id= ?`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }

  static async updateOffer(
    id,
    title,
    description,
    basePrice,
    percent,
    startDate,
    endDate
  ) {
    try {
      const query = `UPDATE offers SET title = ?, description = ?, old_price = ?, new_price = ?, percent = ?, start_date = ?, end_date = ? WHERE id = ?;`;
      const [result] = await db
        .promise()
        .execute(query, [
          title,
          description,
          basePrice,
          Number(basePrice) - Number(basePrice) * (Number(percent) / 100),
          percent,
          startDate,
          endDate,
          id,
        ]);

      if (result.affectedRows > 0) return { success: "Update Offer Success" };
      else return { error: "Can't Update Offer" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async addOffer(
    title,
    description,
    basePrice,
    percent,
    startDate,
    endDate,
    providerServiceId,
    providerName
  ) {
    try {
      const query = `
INSERT INTO offers (
 title,
    description,
    old_price,
    new_price,
    percent,
    start_date,
    end_date,
    Provider_Services_id,
    provider_name
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
      const [result] = await db
        .promise()
        .execute(query, [
          title,
          description,
          basePrice,
          Number(basePrice) - Number(basePrice) * (Number(percent) / 100),
          percent,
          startDate,
          endDate,
          providerServiceId,
          providerName,
        ]);

      if (result.affectedRows > 0) return { success: "Add Offer Success" };
      else return { error: "Can't Add Offer" };
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async deleteOffer(offerId) {
    try {
      const query = `
    DELETE FROM offers
    WHERE id = ?;
  `;
      const [result] = await db.promise().execute(query, [offerId]);

      const secQry = "SELECT IFNULL(MAX(id), 0) + 1 AS maxId FROM offers";
      const [data] = await db.promise().execute(secQry);
      const nextId = data[0].maxId;
      const thirdQry = `
  ALTER TABLE offers
  AUTO_INCREMENT = ${nextId};
`;
      await db.promise().query(thirdQry);

      return result;
    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  static async getServices(userId) {
    const query = `select ps.base_price,s.name as serviceName,ps.Provider_Services_id,u.first_name,u.last_name from provider_services ps
join service_providers sp on ps.provider_id=sp.provider_id
join services s on ps.service_id=s.service_id
join users u on sp.user_id=u.user_id
        where sp.user_id= ?`;
    const [result] = await db.promise().execute(query, [userId]);
    return result;
  }
}
module.exports = ProviderOffersModel;
