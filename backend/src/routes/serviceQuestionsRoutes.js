const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/getServiceQuestions/:service_id", async (req, res) => {
  const service_id = req.params.service_id;

  const query = `
SELECT *
FROM service_questions
WHERE service_id= ?

  `;

  try {
    const [results] = await db.promise().execute(query, [service_id]);
    res.send(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

router.post("/storeAnswers", async (req, res) => {
  const { answers, bookId } = req.body;

  const values = [];
  for (const question_text in answers) {
    values.push([bookId, question_text, answers[question_text]]);
  }

  if (!values.length) {
    return res.status(400).json({ message: "No answers to insert" });
  }

  const query =
    "INSERT INTO booking_answers (booking_id, question_id, answer_value) VALUES ?";

  try {
    const [results] = await db.promise().query(query, [values]); // <-- use query() not execute()
    res.json({
      message: "Questions added successfully",
      inserted: results.affectedRows,
    });
  } catch (err) {
    console.error("MySQL error:", err);
    res.status(500).json({ message: "Database error", details: err.message });
  }
});

module.exports = router;
