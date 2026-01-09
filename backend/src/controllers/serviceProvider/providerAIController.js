const dotenv = require("dotenv");
dotenv.config();

const Groq = require("groq-sdk");

const getAbstractOfBookDetails = async (req, res) => {
  try {
    const { book, answers } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are a professional service assistant. 
Your task: generate a short, clear abstract for a provider about a new booking. 
The abstract should be concise (4-5 sentences) and include:
- What the task is
- Task size or estimated time
- Any special requirements (from answers)
- Booking location
- User info (name, city, contact)
Return only plain text suitable to show to the provider.
        `,
        },
        {
          role: "user",
          content: `
Booking Info With User Info:
${JSON.stringify(book, null, 2)}

Booking Answers:
${JSON.stringify(answers, null, 2)}
        `,
        },
      ],
    });
    const abstract = response.choices[0].message.content;
    res.send(abstract);
  } catch (err) {
    res.status(500).send("error");
  }
};

const getServiceInfoFromAI = async (req, res) => {
  try {
    const { serviceData, questions } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.5,
      messages: [
        {
          role: "system",
          content: `
You are a senior service marketplace expert.

The user will provide a weak or generic service name, a rough description, service cities, and a base price.
Treat the provided service name as a rough placeholder. Do NOT reuse it.

Your goals:
- Generate a clearer, more marketable service name that would attract users
- Write a concise, benefit-driven service description from 1-2 sentences
- Generate the MOST useful booking questions to help providers deliver the service efficiently
- Cover scope, effort, requirements, and risks
- Keep questions short, clear, and practical
- Generate EXACTLY 6 questions

Pricing rules:
- All prices must be realistic for Palestine.
- Consider the average hourly rates for the cities specified by the user.
- Use the user-provided base price only as a reference, not a fixed value.
- If the base price is illogical (too high or too low), replace it with a reasonable price based on your statistics for Palestine.
- Adjust the final price up or down based on the service type, estimated effort, and local norms.
- Prices must be in ILS.

Dataset usage rules:
- A dataset of existing questions is provided for inspiration only
- Do NOT copy questions verbatim
- Do NOT reuse identical wording or option lists
- You may ignore the dataset entirely if better questions can be generated

STRICT RULES:
- Return ONLY valid JSON
- No explanations, no markdown, no extra text
- Options must be null for text questions
- At least 4 questions must be required

JSON FORMAT (STRICT):
{
  "questions": [
    {
      "question_text": string,
      "answer_type": "select" | "text",
      "options": string[] | null,
      "is_required": boolean
    }
  ],
  "serviceName":string,
  "description":string,
  "price":number
}
      `,
        },
        {
          role: "user",
          content: `
SERVICE INPUT:
${JSON.stringify(serviceData, null, 2)}

EXISTING QUESTION DATASET (FOR INSPIRATION ONLY):
${JSON.stringify(questions, null, 2)}
`,
        },
      ],
    });
    const abstract = response.choices[0].message.content;
    res.json(abstract);
  } catch (error) {
    res.status(500).send("error");
  }
};

module.exports = {
  getAbstractOfBookDetails,
  getServiceInfoFromAI,
};
