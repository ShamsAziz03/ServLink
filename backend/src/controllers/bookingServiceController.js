const ServiceProviderModel = require("../models/serviceProviderModel");
const ServiceProviderSchedule = require("../models/serviceProviderScheduleModel");
const ServiceProviderUnavailableDates = require("../models/serviceProviderUnavailableDatesModel");
const ServiceProviderBookings = require("../models/bookingsModel");

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
    res.json({ error: err.message });
  }
};

exports.getProviderSchedule = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const result = await ServiceProviderSchedule.getProviderSchedule(
      providerId
    );
    if (result.length === 0)
      res.json({ error: "No Such Schedule for theis SP" });
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.getProviderUnAvailableDates = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const result =
      await ServiceProviderUnavailableDates.getProviderUnavailableDates(
        providerId
      );
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.getProviderBookings = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    const result = await ServiceProviderBookings.getProviderBookings(
      providerId
    );
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.getProvidersUnAvailableDates = async (req, res) => {
  try {
    const { ids } = req.body;
    const result =
      await ServiceProviderModel.getProvidersUnAvailableDates(
        ids
      );
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};


exports.getProvidersSchedule = async (req, res) => {
  try {
    const { ids } = req.body;
    const result =
      await ServiceProviderModel.getProvidersSchedule(
        ids
      );
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};
