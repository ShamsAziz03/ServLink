const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");
const AdminController = require("../controllers/Admin");

router.get("/adminInfo", AdminController.getAdminInfo);
router.get("/UserswithBookings", AdminController.getUserswithBookings);
router.put("/block-user", AdminController.blockingUser);
router.get("/search-users", AdminController.searchUser);

router.get("/ProviderswithBookings", AdminController.getProvidersWithBookings);
router.put("/approve-provider", AdminController.toggleApproveProvider);
router.get("/search-providers", AdminController.searchProviders);

router.get("/categories", AdminController.getCategories);
router.post(
  "/addCategory",
  upload.single("cover_image"), 
  AdminController.addCategory
);
router.put(
  "/updateCategory",
  upload.single("cover_image"),
  AdminController.updateCategory
);

router.get("/services", AdminController.getServices);

router.get("/get_contact_messages", AdminController.get_contact_messages);
router.post("/contact_reply", AdminController.replyMessage);

module.exports = router;
