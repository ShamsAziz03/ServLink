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
  }
};

module.exports = ServiceProvider;
