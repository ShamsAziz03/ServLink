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

module.exports = {
  getAbstractOfBookDetails,
};
