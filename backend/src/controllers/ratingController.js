const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  const { booking_id, score, feedback_text } = req.body;

  if (!booking_id || !score) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Insert only required fields
    const ratingId = await Rating.create({ booking_id, score, feedback_text });
    res.json({ message: "Rating submitted successfully", ratingId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getUserBookingsWithRatings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const bookings = await Rating.getByUser(userId);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
