const SuggestedServicesModel = require("../models/suggestedServicesModel");

exports.getUserIntrests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await SuggestedServicesModel.getUserIntrests(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await SuggestedServicesModel.getCategories();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const result = await SuggestedServicesModel.getServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProviderServices = async (req, res) => {
  try {
    const result = await SuggestedServicesModel.getProviderServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await SuggestedServicesModel.getUserBookings(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
