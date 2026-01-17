const express = require("express");
const router = express.Router();
const PendingAcceptedCancellations = require("../../controllers/serviceProvider/providerCancelApprovedBookingsController");


router.post("/addNewCancelledBooking", PendingAcceptedCancellations.addNewCancelledBooking);
router.put("/updateBookStatus", PendingAcceptedCancellations.updateBookStatus);
router.post("/addNotification", PendingAcceptedCancellations.addNotification);



module.exports = router;
