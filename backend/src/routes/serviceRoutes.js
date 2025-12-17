const express = require("express");
const { searchServices } = require("../controllers/ServiceController");

const router = express.Router();

router.get("/search", searchServices);

module.exports = router;
