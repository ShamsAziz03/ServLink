const express = require("express");
const router = express.Router();
const providerOffers = require("../../controllers/serviceProvider/providerOffersController");

router.get("/getProviderOffers/:userId", providerOffers.getProviderOffers);
router.put("/updateOffer", providerOffers.updateOffer);
router.post("/addOffer", providerOffers.addOffer);
router.delete("/deleteOffer/:id", providerOffers.deleteOffer);
router.get("/getServices/:userId", providerOffers.getServices);


module.exports = router;
