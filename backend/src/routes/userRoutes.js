const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// تسجيل وتسجيل الدخول
router.post("/register", userController.register);
router.post("/login", userController.login);

// تعديل الملف الشخصي
router.patch("/:id", userController.updateUser);

// تغيير كلمة المرور
router.patch("/:id/changePassword", userController.changePassword);

module.exports = router;
