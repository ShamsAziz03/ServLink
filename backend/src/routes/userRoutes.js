const express = require("express");
const router = express.Router();
const { register } = require("../controllers/userController");

// POST /api/users/register
router.post("/register", register);

module.exports = router;
