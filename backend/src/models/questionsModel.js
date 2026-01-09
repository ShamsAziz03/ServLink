const db = require("../config/db");

class QuestionsModel {
  static async getServicesQuestions() {
    const query = `SELECT 
    sq.question_text,
    sq.answer_type,
    sq.options,
    sq.is_required,
    s.name as serviceName
FROM
    servlink.service_questions sq
        JOIN
    services s ON sq.service_id = s.service_id;`;
    const [result] = await db.promise().execute(query);
    return result;
  }

  static async addServiceQuestions(serviceId, questions) {
    const query = `  INSERT INTO service_questions
    (service_id, question_text, answer_type, options, is_required)
    VALUES ?`;
    const values = questions.map((q) => [
      serviceId,
      q.question_text,
      q.answer_type,
      q.options ? JSON.stringify(q.options) : null,
      q.is_required ? 1 : 0,
    ]);

    const [result] = await db.promise().query(query, [values]);
    if (result.affectedRows > 0) return { success: "Add Service Success" };
    else return { error: "Can't Add" };
  }
}
module.exports = QuestionsModel;
