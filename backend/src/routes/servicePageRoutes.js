const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/metaData/:service_id", async (req, res) => {
  const service_id = req.params.service_id;

  const query = `
    SELECT 
    ps.base_price,
    COALESCE(r.score, 4) AS score
FROM provider_services ps
LEFT JOIN bookings b 
       ON b.Provider_Services_id = ps.Provider_Services_id
LEFT JOIN ratings r 
       ON r.booking_id = b.booking_id
WHERE ps.service_id = ?
ORDER BY ps.base_price ASC
LIMIT 1;
  `;

  try {
    const [results] = await db.promise().execute(query, [service_id]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get("/feedback/:service_id", async (req, res) => {
  const service_id = req.params.service_id;

  const query = `
    SELECT 
      r.rating_id,
      r.feedback_text,
      r.rated_at,
      r.score,
      u.first_name,
      u.last_name
    FROM ratings r
    JOIN bookings b ON b.booking_id = r.booking_id
    JOIN users u ON u.user_id = b.user_id
     JOIN provider_services ps ON ps.Provider_Services_id = b.Provider_Services_id
     JOIN services s ON s.service_id = ps.service_id
    WHERE s.service_id = ?;
  `;

  try {
    const [results] = await db.promise().execute(query, [service_id]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get("/providers/:service_id", async (req, res) => {
  const service_id = req.params.service_id;

  const query = `
        SELECT 
      u.first_name,
      u.last_name,
      sp.id_card_photo,
      sp.languages,
      sp.years_of_experience,
      sp.provider_id,
      sp.service_locations
    FROM services s
    JOIN provider_services ps ON ps.service_id = s.service_id
    JOIN service_providers sp ON sp.provider_id = ps.provider_id
    JOIN users u ON u.user_id = sp.user_id
    WHERE s.service_id = ?;
  `;

  try {
    const [results] = await db.promise().execute(query, [service_id]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
