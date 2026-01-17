const express = require("express");
const router = express.Router();
const WalletController = require("../controllers/serviceProvider/wallet");

router.get("/:provider_id", WalletController.getProviderWallet);
router.post("/pay-debt", WalletController.payProviderDebt);
module.exports = router;
