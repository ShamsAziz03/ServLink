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

// to get best service and provider match using AI

const getSystemPrompt = () => {
  return `You are an advanced AI system specialized in matching customers with service providers.

  PRIMARY MISSION:
Deeply analyze customer requests and find the best service providers based on precise, multi-dimensional criteria.

 ANALYSIS CRITERIA:
1. Accurately understand the type of service requested from description
2. Determine the appropriate main category
3. Analyze urgency level and priority
4. Assess request complexity
5. Estimate required time duration
6. Verify budget compatibility

 PROVIDER MATCHING CRITERIA:
1. Specialization (25%): How well provider's field matches requested service
2. Experience (10%): Years of experience and certifications
3. Availability (15%): Available on requested date
4. Price (25%): Price suitability for budget
5. Location (15%): Proximity to customer location (exact or near, using resources from google and internet to know)
6. Service Quality (10%): Variety and quality of offered services

 CRITICAL RULES:
- NEVER recommend a provider unavailable on requested date
- Check unavailableDates carefully
- Check weeklySchedule to verify day availability
- Sort results from highest to lowest matchScore
- This App in palestine.

 OUTPUT QUALITY:
- Answer ONLY in 100% valid JSON format
- Don't add any text before or after JSON
- Use English key names and values
- Be precise with numbers and percentages
- Write clear and specific reasons for each recommendation

 EXPERTISE:
You are an expert in data analysis and smart matching with 10+ years experience in recommendation systems.`;
};

const buildUserPrompt = (userRequest, systemData) => {
  const isExact =
    userRequest.preferredStartRangeDate === userRequest.preferredEndRangeDate;
  return `
  
 CUSTOMER REQUEST which has these info:

 Request Description, Request Details(Requested City,)
"${userRequest.description}"

 Request Details:
• Requested City: ${userRequest.city}
• Budget: ${userRequest.minBudget} - ${userRequest.maxBudget} ILS/hour
•  Preferred Date: ${
    isExact
      ? `${userRequest.preferredStartRangeDate} (EXACT DATE — end date not provided, search ONLY this day)`
      : `${userRequest.preferredStartRangeDate} to ${userRequest.preferredEndRangeDate} (DATE RANGE)`
  }

IMPORTANT DATE RULE:
- If the end date is missing, you MUST treat it as an exact single date equal to the start date.
- Only return providers available on that exact date (and within their working hours and not in unavailable dates).

AVAILABLE CATEGORIES 
${JSON.stringify(systemData.categories, null, 2)}

AVAILABLE SERVICES 
${JSON.stringify(systemData.services, null, 2)}

AVAILABLE PROVIDERS 
${JSON.stringify(systemData.providers, null, 2)}

PROVIDERS AND SERVICES CONNECTION
${JSON.stringify(systemData.providerServices, null, 2)}

PROVIDERS SCHEDULE
${JSON.stringify(systemData.providerWorkingHours, null, 2)}

PROVIDERS UNAVAILABLE DATES
${JSON.stringify(systemData.providerNotes, null, 2)}

USERS INFO
${JSON.stringify(systemData.users, null, 2)}

Return JSON ONLY in this exact format:

{
  "requestAnalysis": {
    "serviceType": "",
    "detectedCategory": "",
    "detectedServiceNames": [],
    "urgencyLevel": "",
    "complexityLevel": "",
    "estimatedDuration": "",
    "keyRequirements": []
  },
  
  "matchedProviders": [
    {
      "providerUserName": "",
      "UserPhone":"",
      "providerServiceId": 0,
      "providerId": 0,
      "serviceId": 0,
      "matchScore"": 0,
      "availabilityStatus": {
        "isAvailableOnRequestedDate": true,
        "availableTimeSlots": [{"date": "","startTime": ""},{},...],
      },
      "strengths": [],
      "servicesMatch": {
        "relevantServices": [
          {
            "serviceName": "",
            "price": 0,
          }
        ],
      }
    }
  ],
}

REMEMBER:
- Sort matchedProviders from highest to lowest matchScore
- Don't recommend unavailable providers
- Be precise with numbers
`;
};

const getServiceMatchAI = async (req, res) => {
  try {
    const { userRequest, systemData } = req.body;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(userRequest, systemData),
        },
      ],
      temperature: 0.2, // high accuracy
      max_tokens: 5000, // for detailed results
      top_p: 0.9,
      response_format: { type: "json_object" },
    });

    const aiResponse = completion.choices[0].message.content;
    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    const obj = {
      success: true,
      data: parsed,
      metadata: {
        tokensUsed: completion.usage.total_tokens,
        tokensPrompt: completion.usage.prompt_tokens,
        tokensCompletion: completion.usage.completion_tokens,
      },
    };
    res.json(obj);
  } catch (err) {
    console.error("❌ Groq AI Error:", error);
    res.status(500).json({ error: "error" });
  }
};

module.exports = {
  getEstimatedTimeBook,
  getServiceMatchAI,
};
