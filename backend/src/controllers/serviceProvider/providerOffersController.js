const ProviderOffersModel = require("../../models/providerOffersModel");

exports.getProviderOffers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ProviderOffersModel.getProviderOffers(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching provider offers",
      error: err.message,
    });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const { id, title, description, basePrice, percent, startDate, endDate } =
      req.body;
    const result = await ProviderOffersModel.updateOffer(
      id,
      title,
      description,
      basePrice,
      percent,
      startDate,
      endDate
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error update offer",
      error: err.message,
    });
  }
};

exports.addOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      basePrice,
      percent,
      startDate,
      endDate,
      providerServiceId,
      providerName,
    } = req.body;
    const result = await ProviderOffersModel.addOffer(
      title,
      description,
      basePrice,
      percent,
      startDate,
      endDate,
      providerServiceId,
      providerName
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error add new offer",
      error: err.message,
    });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    const result = await ProviderOffersModel.deleteOffer(offerId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error delete offer",
      error: err.message,
    });
  }
};

exports.getServices = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await ProviderOffersModel.getServices(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching services in offer page",
      error: err.message,
    });
  }
};
