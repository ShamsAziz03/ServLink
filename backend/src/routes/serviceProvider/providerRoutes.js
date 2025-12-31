const express = require("express");
const router = express.Router();

const {
  getProviderBookings,
  updateBookingStatus,
  getBookingsByDate,
  completeBooking
} = require("../../controllers/serviceProvider/providerBookings");

// جلب كل حجوزات البروفايدر
router.get("/:provider_id", getProviderBookings);

// تحديث حالة الحجز
router.put("/booking/:booking_id/complete", completeBooking);  // هنا booking_id

// تحديث حالة الحجز بشكل عام
router.put("/booking/:id/status", updateBookingStatus);

// حجوزات يوم معين
router.get("/:provider_id/date/:date", getBookingsByDate);

module.exports = router;
