const ProviderOffersModel = require("../models/serviceMatchAIModel");

exports.getproviderWorkingHours = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getproviderWorkingHours();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProviderServices = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getProviderServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getServices();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProviderNotes = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getProviderNotes();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getCategories();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getProviders();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await ProviderOffersModel.getUsers();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
