const express = require("express");
const router = express.Router();
const serviceMatchAI = require("../controllers/serviceMatchAIController");
const userAI = require("../controllers/userAI");

router.get("/getproviderWorkingHours", serviceMatchAI.getproviderWorkingHours);
router.get("/getProviderServices", serviceMatchAI.getProviderServices);
router.get("/getServices", serviceMatchAI.getServices);
router.get("/getProviderNotes", serviceMatchAI.getProviderNotes);
router.get("/getCategories", serviceMatchAI.getCategories);
router.get("/getProviders", serviceMatchAI.getProviders);
router.get("/getUsers", serviceMatchAI.getUsers);

router.post("/getServiceMatchAI", userAI.getServiceMatchAI);

module.exports = router;
