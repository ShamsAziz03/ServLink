const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/categories", async (req, res) => {
  const results = await db.promise().query("SELECT * FROM categories");
  res.send(results);
});

router.get("/offers", async (req, res) => {
  const results = await db.promise().query("SELECT * FROM offers");
  res.send(results);
});

router.get("/notifications/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const results = await db
    .promise()
    .query("SELECT * FROM notifications WHERE user_id = ?", [userId]);
  res.send(results);
});

router.delete("/deleteNotification/:notification_id", async (req, res) => {
  const notification_id = req.params.notification_id;
  const results = await db
    .promise()
    .query("DELETE FROM notifications WHERE notification_id = ?", [
      notification_id,
    ]);
  const [rows] = await db
    .promise()
    .query("SELECT MAX(notification_id) AS max_id FROM notifications");
  const nextId = rows[0].max_id ? rows[0].max_id + 1 : 1;
  await db
    .promise()
    .query(`ALTER TABLE notifications AUTO_INCREMENT = ?`, [nextId]);
  res.json({ message: "Notification deleted successfully" });
});

router.delete("/deleteNotifications/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  await db
    .promise()
    .query("DELETE FROM notifications WHERE user_id = ?", [userId]);
  const [rows] = await db
    .promise()
    .query("SELECT MAX(notification_id) AS max_id FROM notifications");
  const nextId = rows[0].max_id ? rows[0].max_id + 1 : 1;
  await db
    .promise()
    .query(`ALTER TABLE notifications AUTO_INCREMENT = ?`, [nextId]);

  res.json({ message: "Notifications deleted successfully" });
});

router.get("/topProviders", async (req, res) => {
  try {
    const query = `
 SELECT  r.score , ps.base_price, u.first_name, u.last_name, s.name, sp.id_card_photo, sp.provider_id
FROM ratings r
JOIN bookings b ON r.booking_id = b.booking_id
JOIN provider_services ps ON b.Provider_Services_id = ps.Provider_Services_id
JOIN service_providers sp ON ps.provider_id = sp.provider_id
JOIN users u ON sp.user_id = u.user_id
JOIN services s ON ps.service_id = s.service_id
ORDER BY r.score DESC, r.rated_at DESC
LIMIT 4;
    `;

    const [rows] = await db.promise().execute(query);
    res.send(rows);
  } catch (err) {
    console.error("SQL Error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", detail: err.message });
  }
});

router.get("/mostBooked", async (req, res) => {
  try {
    const query = `
SELECT 
    s.service_id,
    s.name AS service_name,
    s.image AS service_image,
    c.name AS category_name,
    MIN(ps.base_price) AS base_price,
    COUNT(b.booking_id) AS total_bookings
FROM bookings b
JOIN provider_services ps ON b.Provider_Services_id = ps.Provider_Services_id
JOIN services s ON ps.service_id = s.service_id
JOIN categories c ON s.category_id = c.category_id
GROUP BY s.service_id, s.name, s.image, c.name
ORDER BY total_bookings DESC, base_price asc
LIMIT 5;

    `;

    const [rows] = await db.promise().execute(query);
    res.send(rows);
  } catch (err) {
    console.error("SQL Error:", err);
    res
      .status(500)
      .json({ error: "Database query failed", detail: err.message });
  }
});
module.exports = router;
