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

module.exports = router;
