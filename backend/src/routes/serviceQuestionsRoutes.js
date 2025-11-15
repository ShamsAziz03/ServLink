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
  const answers = req.body.answers;

  const values = [];
  for (const question_id in answers) {
    values.push([2, question_id, answers[question_id]]);
  }

  const query =
    "INSERT INTO booking_answers (booking_id, question_id, answer_value) VALUES ?";

  try {
    const [results] = await db.promise().query(query, [values]);
    res.status(200).send({ message: "Questions added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error");
  }
});

module.exports = router;
