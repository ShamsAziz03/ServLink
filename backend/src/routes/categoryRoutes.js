const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  const results = await db.promise().query("SELECT * FROM categories");
  res.send(results);
});

module.exports = router;
