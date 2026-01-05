const express = require("express");
const router = express.Router();
const providerBooks = require("../../controllers/serviceProvider/serviceProviderRequestsController");

router.get("/getProviderBookings/:userId", providerBooks.getProviderBookings);
router.get("/getBookAnswers/:bookId", providerBooks.getBookAnswers);
router.put("/updateBook", providerBooks.updateBook);


module.exports = router;
