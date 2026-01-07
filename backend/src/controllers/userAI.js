const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const db = require("../config/db");

function parseJsonSafe(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "");
  return JSON.parse(cleaned);
}

const getEstimatedTimeBook = async (req, res) => {
  try {
    const { questionsAnswers, service_id } = req.body;

    if (!service_id || !questionsAnswers) {
      return res.status(400).json({ error: "Missing data" });
    }

    const [serviceRows] = await db.promise().execute(
      `
      SELECT s.name, s.description
      FROM services s
      WHERE s.service_id = ?
      `,
      [service_id]
    );

    const service = serviceRows[0] || null;

    const [bookingRows] = await db.promise().execute(
      `
      SELECT 
        b.*,
        ps.service_id,
        ps.base_price
      FROM bookings b
      JOIN provider_services ps 
        ON b.Provider_Services_id = ps.Provider_Services_id
      WHERE ps.service_id = ?
      `,
      [service_id]
    );

    const bookings = bookingRows || [];

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are an expert service manager.
You receive booking details and answers from users.
Your job: analyze the booking answers and previous bookings of the same service to estimate a reasonable 'estimated_time' in hours.

Rules:
- Return a JSON object with two fields:
  {
    "estimated_time": number,
    "explanation": "short text explaining your reasoning"
  }
- Base the estimation on the answers about task size, vehicle, and any additional notes.
- Consider previous bookings of the same service for reference.
- Include a very short explanation (1-2 sentences) about why you chose this estimated time.
- Consider the service task will be in Palestine, use realistic assumptions.
`,
        },
        {
          role: "user",
          content: `
Booking Answers:
${JSON.stringify(questionsAnswers, null, 2)}

Previous Bookings:
${JSON.stringify(bookings, null, 2)}

Service Details:
${JSON.stringify(service, null, 2)}
`,
        },
      ],
    });

    const result = parseJsonSafe(response.choices[0].message.content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "error" });
  }
};

module.exports = {
  getEstimatedTimeBook,
};
