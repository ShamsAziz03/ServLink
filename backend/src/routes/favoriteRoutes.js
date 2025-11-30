const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.get("/user/:user_id", favoriteController.getUserFavorites);
router.delete("/:favorite_id", favoriteController.removeFavorite);

module.exports = router;
