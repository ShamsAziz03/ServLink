const ServiceProviderModel = require("../models/serviceProviderModel");

exports.getServiceProviders = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const result = await ServiceProviderModel.getServiceProviders(serviceId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching service providers",
      error: err.message,
    });
  }
};

exports.getProviderRating = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const result = await ServiceProviderModel.getRating(providerId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider rating",
      error: err.message,
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const result = await ServiceProviderModel.getFeedbacks(providerId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
