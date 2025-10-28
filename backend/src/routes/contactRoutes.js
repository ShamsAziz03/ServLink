const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/contact-us", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.json({ success: false, msg: "Missing fields" });
    }

    try {
        await db.promise().query(
            "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
            [name, email, message]
        );

        return res.json({ success: true });
    } catch (error) {
        console.log(error);
        return res.json({ success: false });
    }
});

module.exports = router;
