const express = require("express");
const router = express.Router();
const providerBooks = require("../../controllers/serviceProvider/serviceProviderRequestsController");
const providerAI = require("../../controllers/serviceProvider/providerAIController");
const dataForPerformanceAIController = require("../../controllers/serviceProvider/dataForPerformanceInsights");

router.get("/getProviderBookings/:userId", providerBooks.getProviderBookings);
router.get("/getBookAnswers/:bookId", providerBooks.getBookAnswers);
router.put("/updateBook", providerBooks.updateBook);
router.post("/getAbstractOfBookDetails", providerAI.getAbstractOfBookDetails);
router.post("/getServiceInfoFromAI", providerAI.getServiceInfoFromAI);
router.post("/getAIPerformenceInsights", providerAI.getAIPerformenceInsights);

router.get("/getAllBooks", dataForPerformanceAIController.getAllBooks);

router.get("/getAllProviders", dataForPerformanceAIController.getAllProviders);

router.get("/getAllSchedules", dataForPerformanceAIController.getAllSchedules);

router.get(
  "/getAllProviderServices",
  dataForPerformanceAIController.getAllProviderServices
);

router.get("/getAllServices", dataForPerformanceAIController.getAllServices);

router.get("/getProviderID/:userId", dataForPerformanceAIController.getProviderID);

router.get("/getProviderPendingAcceptedBookings/:userId", providerBooks.getProviderPendingAcceptedBookings);


module.exports = router;
