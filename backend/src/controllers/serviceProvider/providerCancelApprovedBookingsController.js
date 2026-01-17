const PendingAcceptedCancellationsModel = require("../../models/pendingAcceptedCancellationsModel");

exports.addNewCancelledBooking = async (req, res) => {
  try {
    const { booking_id, reason } = req.body;
    const result =
      await PendingAcceptedCancellationsModel.addNewCancelledBooking(
        booking_id,
        reason
      );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new cell in cancellation bookings",
      error: err.message,
    });
  }
};

exports.updateBookStatus = async (req, res) => {
  try {
    const { booking_id } = req.body;
    const result =
      await PendingAcceptedCancellationsModel.updateBookStatus(booking_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error update book status",
      error: err.message,
    });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { book, provider } = req.body;
    const result = await PendingAcceptedCancellationsModel.addNotification(
      book,
      provider
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new cell in Notifications",
      error: err.message,
    });
  }
};
