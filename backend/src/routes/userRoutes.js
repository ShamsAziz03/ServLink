const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
 
router.post("/register", userController.register);
router.post("/login", userController.login);

 
router.patch("/:id", userController.updateUser);
 
router.patch("/:id/changePassword", userController.changePassword);

module.exports = router;
