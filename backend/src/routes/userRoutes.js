const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/save-push-token", userController.savePushToken);
router.post("/send-notification", userController.sendPushNotification);

router.patch("/:id", userController.updateUser);
router.patch("/:id/changePassword", userController.changePassword);
router.get("/user_inbox/:userId", userController.getUserInbox);
router.put("/mark-read/:reply_id",userController.read_reply); 
module.exports = router;
