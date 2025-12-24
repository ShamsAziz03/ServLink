const express = require("express");
const router = express.Router();
const serviceProviderServiceListController = require("../../controllers/serviceProvider/serviceProviderServiceList");

router.get(
  "/getProviderListServicesInfo/:userId",
  serviceProviderServiceListController.getProviderListServicesInfo
);

router.get(
  "/getProviderServiceFeedbacks/:Provider_Services_id",
  serviceProviderServiceListController.getProviderServiceFeedbacks
);

router.get(
  "/getProviderServiceAvgRating/:Provider_Services_id",
  serviceProviderServiceListController.getProviderServiceAvgRating
);




module.exports = router;
