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

router.get("/getFeedbacks/:providerId", bookingServiceController.getFeedbacks);

router.get(
  "/getServiceProviderSchedule/:providerId",
  bookingServiceController.getProviderSchedule
);

router.get(
  "/getServiceProviderUnavailableDates/:providerId",
  bookingServiceController.getProviderUnAvailableDates
);

router.get(
  "/getServiceProviderBookings/:providerId",
  bookingServiceController.getProviderBookings
);

router.post(
  "/getProvidersUnAvailableDates",
  bookingServiceController.getProvidersUnAvailableDates
);

router.post(
  "/getProvidersSchedule",
  bookingServiceController.getProvidersSchedule
);

router.post("/addBooking", bookingServiceController.addBooking);

router.post("/addTransaction", bookingServiceController.addTransaction);

module.exports = router;
