const db = require("../config/db");

const ServiceProvider = {
  create: ({
    user_id,
    field_of_work,
    aboutProvider,
     id_card_number,
    certifications,
    experience_photos,
    hourly_rate,
    service_locations,
    years_of_experience,
    languages,
    description
  }) => {
    return db.promise().query(
      `INSERT INTO service_providers
      (user_id, field_of_work, aboutProvider, id_card_number, certifications, experience_photos,
       hourly_rate, service_locations, years_of_experience, languages,description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        field_of_work,
        aboutProvider,
         id_card_number,
        certifications,
        experience_photos,
        hourly_rate,
        service_locations,
        years_of_experience,
        languages,
        description
      ]
    );
  },
getByUserId: async (user_id) => {
    const [rows] = await db.promise().query(
      `SELECT * FROM service_providers WHERE user_id = ?`,
      [user_id]
    );
    return rows[0]; 
  }
};

 
module.exports = ServiceProvider;
