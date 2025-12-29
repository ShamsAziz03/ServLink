const ServiceProviderScheduleModel = require("../../models/serviceProviderScheduleModel");
const ServiceProviderUnavailableDatesModel = require("../../models/serviceProviderUnavailableDatesModel");

exports.getProviderScheduleByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result =
      await ServiceProviderScheduleModel.getProviderScheduleByUserId(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider schedule",
      error: err.message,
    });
  }
};

exports.getProviderUnavailableDatesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result =
      await ServiceProviderUnavailableDatesModel.getProviderUnavailableDatesByUserId(
        userId
      );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider unavailable dates",
      error: err.message,
    });
  }
};

exports.updateProviderUnavailableDates = async (req, res) => {
  try {
    const { userId, incomingDates } = req.body;
    const result =
      await ServiceProviderUnavailableDatesModel.updateProviderUnavailableDates(
        userId,
        incomingDates
      );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error updating provider unavailable dates",
      error: err.message,
    });
  }
};

exports.updateProviderSchedule = async (req, res) => {
  try {
    const { userId, incomingSchedule } = req.body;
    const result = await ServiceProviderScheduleModel.updateProviderSchedule(
      userId,
      incomingSchedule
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error updating provider schedule",
      error: err.message,
    });
  }
};
