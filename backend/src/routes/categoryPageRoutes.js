const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/categories", async (req, res) => {
  const results = await db
    .promise()
    .query("SELECT name,category_id FROM categories");
  res.send(results);
});

router.get("/services/:category_id", async (req, res) => {
  const categoryId = req.params.category_id;

  const query = `
    SELECT 
      s.service_id,
      s.name AS service_name,
      s.image,
      s.description AS service_description,
      s.category_id,
      c.name AS category_name,
      c.description AS category_description
    FROM services s
    JOIN categories c ON s.category_id = c.category_id
    WHERE s.category_id = ?;
  `;

  try {
    const [results] = await db.promise().execute(query, [categoryId]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get("/feedback/:category_id", async (req, res) => {
  const categoryId = req.params.category_id;

  const query = `
    SELECT 
      r.rating_id,
      r.feedback_text,
      r.rated_at,
      r.score,
      u.first_name,
      u.last_name,
      s.category_id
    FROM ratings r
    JOIN bookings b ON b.booking_id = r.booking_id
    JOIN users u ON u.user_id = b.user_id
     JOIN provider_services ps ON ps.Provider_Services_id = b.Provider_Services_id
     JOIN services s ON s.service_id = ps.service_id
    WHERE s.category_id = ?;
  `;

  try {
    const [results] = await db.promise().execute(query, [categoryId]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.get("/serviceFromSearch/:service_id", async (req, res) => {
  const serviceId = req.params.service_id;

  const query = `
    SELECT 
      s.service_id,
      s.name AS service_name,
      s.image,
      s.description AS service_description,
      s.category_id
    FROM services s
    JOIN categories c ON s.category_id = c.category_id
    WHERE s.service_id = ?;
  `;

  try {
    const [results] = await db.promise().execute(query, [serviceId]);
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.json("Database error");
  }
});

module.exports = router;
