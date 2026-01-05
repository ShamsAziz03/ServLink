const BookingModel = require("../../models/bookingsModel");

exports.getProviderBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await BookingModel.getProviderBookingsByUserId(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider bookings",
      error: err.message,
    });
  }
};

exports.getBookAnswers = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const result = await BookingModel.getBookAnswers(bookId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching book answers",
      error: err.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId, is_accept, status } = req.body;
    const result = await BookingModel.updateBook(bookId, is_accept, status);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error update book status",
      error: err.message,
    });
  }
};
