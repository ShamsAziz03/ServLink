const express = require("express");
const router = express.Router();
const serviceProviderStatsController = require("../../controllers/serviceProvider/serviceProviderStatsController");

router.get(
  "/getProviderRatingOrdersEarning/:userId",
  serviceProviderStatsController.getProviderRatingOrdersEarning
);


router.get(
  "/getProviderCancelledPendingOrders/:userId",
  serviceProviderStatsController.getProviderCancelledPendingOrders
);

module.exports = router;
