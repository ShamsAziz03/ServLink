const express = require("express");
const router = express.Router();
const suggestedServicesAI = require("../controllers/suggestedServicesForUserController");
const userAI = require("../controllers/userAI");

router.get("/getUserIntrests/:userId", suggestedServicesAI.getUserIntrests);
router.get("/getCategories", suggestedServicesAI.getCategories);
router.get("/getServices", suggestedServicesAI.getServices);
router.get("/getProviderServices", suggestedServicesAI.getProviderServices);
router.get("/getUserBookings/:userId", suggestedServicesAI.getUserBookings);

router.post("/getRecommendedServices", userAI.getRecommendedServices);

module.exports = router;
