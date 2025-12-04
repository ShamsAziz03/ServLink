const express = require("express");
const router = express.Router();
const bookingServiceController = require("../controllers/bookingServiceController");

router.get(
  "/getServiceProviders/:serviceId",
  bookingServiceController.getServiceProviders
);

router.get(
  "/getProviderRating/:providerId",
  bookingServiceController.getProviderRating
);

router.get(
  "/getFeedbacks/:providerId",
  bookingServiceController.getFeedbacks
);

module.exports = router;
