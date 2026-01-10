const BookingModel = require("../../models/bookingsModel");
const ScheduleModel = require("../../models/serviceProviderScheduleModel");
const ProviderModel = require("../../models/serviceProviderModel");

exports.getAllBooks = async (req, res) => {
  try {
    const result = await BookingModel.getAllBooks();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all books",
      error: err.message,
    });
  }
};

exports.getAllSchedules = async (req, res) => {
  try {
    const result = await ScheduleModel.getAllSchedules();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all Schedules",
      error: err.message,
    });
  }
};

exports.getAllProviders = async (req, res) => {
  try {
    const result = await ProviderModel.getAllProviders();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all providers",
      error: err.message,
    });
  }
};

exports.getAllProviderServices = async (req, res) => {
  try {
    const result = await ProviderModel.getAllProviderServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all Provider Services",
      error: err.message,
    });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const result = await ProviderModel.getAllServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching all Services",
      error: err.message,
    });
  }
};

exports.getProviderID = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ProviderModel.getProviderID(userId);
    res.send(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching prov id",
      error: err.message,
    });
  }
};
