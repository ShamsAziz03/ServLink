const express = require("express");
const router = express.Router();
const providerBooks = require("../../controllers/serviceProvider/serviceProviderRequestsController");
const providerAI = require("../../controllers/serviceProvider/providerAIController");

router.get("/getProviderBookings/:userId", providerBooks.getProviderBookings);
router.get("/getBookAnswers/:bookId", providerBooks.getBookAnswers);
router.put("/updateBook", providerBooks.updateBook);
router.post("/getAbstractOfBookDetails", providerAI.getAbstractOfBookDetails);
router.post("/getServiceInfoFromAI", providerAI.getServiceInfoFromAI);

module.exports = router;
