const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();
const client = new Groq({ apiKey: process.env.AI_KEY });

router.post("/category-suggest", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const prompt = `
For a service website:
- Suggest a better, short, and attractive category name
- Write a clean, attractive category description in exactly 10 words
- No emojis. No punctuation simple words
- Return strictly as JSON with keys:
  "name": "new category name",
  "description": "10 word description"
- Do not write anything else
Original category: "${name}"
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 80,
      temperature: 0.7,
    });

    let aiResult;
    try {
      aiResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      console.error("AI response was:", response.choices[0].message.content);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    res.json(aiResult);

  } catch (error) {
    console.error("Groq SDK error:", error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});

// POST /api/generate_reply_suggestions
router.post("/generate_reply_suggestions", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const prompt = `
You are a smart assistant for a service website admin.
- Suggest 3 short, polite, and friendly replies for this user message
- Each reply should be max 25 words
- No emojis, no unnecessary punctuation
- Return strictly as JSON with key:
  "suggestions": ["reply1", "reply2", "reply3"]
- Do not write anything else
Original message: "${message}"
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    let aiResult;
    try {
      aiResult = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.error("JSON parse error:", err.message);
      console.error("AI response was:", response.choices[0].message.content);
      return res.status(500).json({ message: "AI returned invalid JSON" });
    }

    res.json(aiResult);

  } catch (error) {
    console.error("Groq SDK error:", error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});
  // POST /api/simplify_reply
router.post("/simplify_reply", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Reply text is required" });

    const prompt = `
You are an assistant that improves admin replies for a service website.
- Simplify, clarify, and make it friendly.
- Start with a warm greeting.
- End with a polite line that we are always ready to answer questions.
- Keep meaning the same, max 50 words.
Original reply: "${text}"
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    // هنا نأخذ النص كما هو من AI بدون JSON.parse
    const aiText = response.choices[0].message.content.trim();

    // نرسل JSON صالح للـ frontend
    res.json({ simplified: aiText });

  } catch (error) {
    console.error("Groq SDK error:", error.message);
    res.status(500).json({ message: "AI generation failed" });
  }
});
 router.post("/provider-summary", async (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({ message: "Provider data is required" });
    }

    const prompt = `
You are an admin assistant for a service platform.

Analyze this provider data and write a short professional summary.
Rules:
- Max 3 sentences as paraghraph
- Clear and helpful for admin decision
- No emojis
- No extra punctuation
- Return ONLY valid JSON exactly like this:
{
  "summary": "text here"
}

Provider data:
Name: ${provider.first_name} ${provider.last_name}
Field: ${provider.field_of_work}
Experience: ${provider.years_of_experience} years
Bookings: ${provider.bookings_count}
Hourly rate: ${provider.hourly_rate}
Provider from: ${provider.city}
Service locations :${provider.service_locations}
Approved: ${provider.approved_by_admin === 1 ? "Yes" : "No"}
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 80,
    });

    const content = response.choices[0].message.content.trim();

    let aiResult;
    try {
      aiResult = JSON.parse(content);
    } catch (err) {
      console.error("Invalid JSON from AI:", content);
      return res.status(500).json({
        summary: "Unable to generate summary at the moment"
      });
    }

    res.json(aiResult);

  } catch (error) {
    console.error("AI summary error:", error.message);
    res.status(500).json({
      summary: "AI service failed"
    });
  }
});



/////////////////////////////
router.post("/admin-report", async (req, res) => {
  try {
    const stats = req.body;

    const prompt = `
You are an AI analyst for a service platform admin.

Based on the following statistics:
Users: ${stats.user_count}
Providers: ${stats.provider_count}
Services: ${stats.service_count}
Categories: ${stats.category_count}
Bookings: ${stats.booking_count}

Create a short admin report with this exact structure:

Overview:
(one sentence summary)

Key Insights:
- insight one
- insight two

Suggestion:
(one clear suggestion)

Rules:
- Professional tone
- No emojis
- Plain text only
- Do not add extra sections
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 120,
    });

    const report = response.choices[0].message.content.trim();

    res.json({ report });

  } catch (error) {
    res.status(500).json({
      report: "AI report is currently unavailable",
    });
  }
});


module.exports = router;


