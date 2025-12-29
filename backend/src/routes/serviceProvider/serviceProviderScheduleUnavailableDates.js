const express = require("express");
const router = express.Router();
const serviceProviderScheduleUnavailableDatesController = require("../../controllers/serviceProvider/serviceProviderScheduleUnavailableDatesController");

router.get(
  "/getProviderSchedule/:userId",
  serviceProviderScheduleUnavailableDatesController.getProviderScheduleByUserId
);

router.get(
  "/getProviderUnavailableDates/:userId",
  serviceProviderScheduleUnavailableDatesController.getProviderUnavailableDatesByUserId
);

router.put(
  "/updateProviderUnavailableDates",
  serviceProviderScheduleUnavailableDatesController.updateProviderUnavailableDates
);

router.put(
  "/updateProviderSchedule",
  serviceProviderScheduleUnavailableDatesController.updateProviderSchedule
);

module.exports = router;
