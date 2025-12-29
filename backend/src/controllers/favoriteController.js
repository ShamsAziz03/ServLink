const Favorite = require("../models/favoriteModel");

const favoriteController = {
  getUserFavorites: async (req, res) => {
    const { user_id } = req.params;
    try {
      const favorites = await Favorite.getByUserId(user_id);
      res.json(favorites);
    } catch (err) {
      res.status(500).json({ message: "Error fetching favorites", error: err });
    }
  },

  removeFavorite: async (req, res) => {
    const { favorite_id } = req.params;
    try {
      await Favorite.deleteById(favorite_id);
      res.json({ message: "Removed from favorites" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting favorite", error: err });
    }
  },

  addFavProvider: async (req, res) => {
    const { userId, providerId } = req.body;
    try {
      const result = await Favorite.addFavProvider(userId, providerId);
      res.json(result);
    } catch (err) {
      res.json({ message: "Error fetching favorites", error: err });
    }
  },
};

module.exports = favoriteController;
