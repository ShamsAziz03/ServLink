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

function parseJsonSafe(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "");
  return JSON.parse(cleaned);
}

const insightsCache = new Map();
const CACHE_DURATION = 2 * 60 * 60 * 1000;
// const CACHE_DURATION = 24 * 60 * 60 * 1000;

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 10000;

const getAIPerformenceInsights = async (req, res) => {
  try {
    const {
      bookings,
      schedules,
      providers,
      services,
      provider_services,
      providerId,
    } = req.body;

    const cacheKey = `insights_${providerId}`;
    const cachedData = insightsCache.get(cacheKey);

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      console.log("Returning cached insights for provider:", providerId);
      return res.json(cachedData.data);
    }

    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = Math.ceil(
        (MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000
      );
      return res.status(429).json({
        error: "Too many requests",
        message: `Please wait ${waitTime} seconds before trying again`,
        waitTime: waitTime,
        cached: cachedData ? cachedData.data : null,
      });
    }

    lastRequestTime = now;

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const provider = providers.find(
      (p) => Number(p.provider_id) === Number(providerId)
    );
    if (!provider) throw new Error("Provider not found");

    // provider services
    const providerServices = provider_services
      .filter((ps) => Number(ps.provider_id) === Number(providerId))
      .map((ps) => ({
        ...ps,
        service_details:
          services.find((s) => s.service_id === ps.service_id) || {},
      }));

    // competitor services
    const competitorServices = provider_services
      .filter(
        (ps) =>
          Number(ps.provider_id) !== Number(providerId) &&
          providerServices.some((p) => {
            const serviceA = services.find(
              (s) => s.service_id === ps.service_id
            );
            const serviceB = p.service_details;
            return (
              serviceA &&
              serviceB &&
              (serviceA.name
                .toLowerCase()
                .includes(serviceB.name.toLowerCase()) ||
                serviceA.description
                  .toLowerCase()
                  .includes(serviceB.description.toLowerCase()))
            );
          })
      )
      .map((ps) => ({
        ...ps,
        service_details:
          services.find((s) => s.service_id === ps.service_id) || {},
      }));

    const providerBookings = bookings.filter((b) =>
      providerServices.some(
        (ps) => ps.provider_services_id === b.provider_services_id
      )
    );

    const competitorBookings = bookings.filter((b) =>
      competitorServices.some(
        (ps) => ps.provider_services_id === b.provider_services_id
      )
    );

    const providerSchedule = schedules.filter(
      (s) => Number(s.provider_id) === Number(providerId)
    );

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 4000,
      messages: [
        {
          role: "system",
          content: `You are an expert performance analyst specialized in the Palestinian service marketplace.

Analyze this provider in detail and compare with competitors offering similar services based on:
- Provider's own bookings and schedule
- Competitors' bookings for similar services (include time and day to find peak demand)
- Full service details for provider and competitors
- Market trends and statistics from Google and other credible sources

## Provider Data:
${JSON.stringify(provider, null, 2)}

## Provider Services (with details):
${JSON.stringify(providerServices, null, 2)}

## Competitor Services (with details):
${JSON.stringify(competitorServices, null, 2)}

## Provider Bookings:
${JSON.stringify(providerBookings, null, 2)}

## Competitor Bookings (similar services):
${JSON.stringify(competitorBookings, null, 2)}

## Provider Schedule:
${JSON.stringify(providerSchedule, null, 2)}

## Instructions:

1. **Evaluate the provider's strengths and weaknesses** based on:
   - Services offered
   - Booking history (mention actual numbers: X completed out of Y booked)
   - Completion and cancellation rates (calculate from data: completed/total * 100)
   - Market demand and trends from Google or other credible sources

2. **Suggest actionable recommendations:**

   **Pricing adjustments:**
   - Specify for which service(s) the price is low, competitive, or high
   - State CURRENT price (e.g., "$28.00") and COMPETITOR price (e.g., "$28.50")
   - Provide recommended adjustment with EXACT numbers (e.g., "Raise from $28.00 to $29.00 (≈+4%)")
   - Explain expected impact with numbers and reasoning

   **New services:**
   - List specific services the provider should add
   - Explain why with market data (e.g., "Google Trends shows 18% rise in searches")
   - Reference competitor gaps or market trends with percentages

   **City expansion:**
   - For each service (existing or new), specify which cities to expand into
   - List ACTUAL city names from the data
   - Justify based on demand or competitor activity (mention which competitors serve these cities)

   **Schedule optimization:**
   - Suggest ideal working hours/days for each service
   - Use ACTUAL booking times from data (e.g., "13:00, 15:30, 17:45")
   - Identify days with zero cancellations
   - Note weekend gaps if Saturday/Sunday bookings exist
   - Maximize bookings and efficiency based on patterns

   **Completion improvement:**
   - Recommend specific strategies to improve completion rate for each service
   - Include expected percentage improvement (e.g., "8-10% improvement")
   - Reference successful practices from similar markets

3. **Identify peak hours and days** per service based on provider and competitor bookings:
   - List actual booking times (HH:MM format)
   - Highlight times of highest demand
   - Note patterns by day of week

4. **Return ONLY JSON** in this enhanced format (NO markdown, NO code blocks):

{
  "overall_status": "excellent | good | average | needs_improvement",
  "performance_score": 0-100,
  "key_metrics": {
    "completion_rate": <exact calculated number 0-100>,
    "cancellation_rate": <exact calculated number 0-100>,
    "booking_frequency": "high | medium | low"
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": {
    "pricing": [
      {
        "service": "<exact service name from data>",
        "current_position": "low | competitive | high",
        "suggestion": "Raise/Lower base price from $X.XX to $Y.YY (≈±Z%)",
        "potential_impact": "Specific impact: 'Increase revenue per job by ~$X while staying below competitor ($Y.YY); expected Z% higher conversion...'"
      }
    ],
    "services": [
      {
        "add_service": "<specific new service name>",
        "reason": "Market data with numbers (e.g., 'Google Trends shows 18% annual rise in searches; competitor gaps in X')"
      }
    ],
    "coverage": [
      {
        "service": "<exact service name>",
        "add_cities": ["<city1>", "<city2>"],
        "reason": "Justification with data (e.g., 'Competitor serves these cities at similar price; captures untapped market')"
      }
    ],
    "schedule": [
      {
        "service": "<exact service name or 'All'>",
        "suggestion": "Add specific days and time ranges (e.g., 'Add Saturday shifts (09:00-17:00) and extend weekday to 18:00')",
        "peak_hours": "HH:MM-HH:MM (e.g., '13:00-17:45') with context (e.g., 'midday-afternoon with 2 bookings; 14:30-17:45 peak for competitors')"
      }
    ],
    "completion_improvement": [
      {
        "service": "<exact service name or general>",
        "recommendation": "Specific strategy with expected impact (e.g., 'Implement pre-booking checklist to reduce cancellations; add 10% discount for confirmed 24h advance')"
      }
    ]
  },
  "priority_actions": [
    {
      "action": "Detailed action with specifics (e.g., 'Add Saturday schedule' or 'Adjust X price to $Y')",
      "impact": "high | medium | low",
      "effort": "easy | moderate | hard"
    }
  ],
}

## CRITICAL REQUIREMENTS:
- Include market context with percentages and trends
`,
        },
      ],
    });

    const result = parseJsonSafe(response.choices[0].message.content);

    insightsCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    cleanOldCache();

    console.log("AI insights generated successfully for provider:", providerId);
    res.json(result);
  } catch (error) {
    console.error("Error enhance provider work:", error);

    const cacheKey = `insights_${req.body.providerId}`;
    const cachedData = insightsCache.get(cacheKey);

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests to AI service. Please wait a moment.",
        cached: cachedData ? cachedData.data : null,
        retryAfter: error.headers?.["retry-after"] || 10,
      });
    }

    res.status(500).json({
      error: "AI analysis failed",
      message: error.message,
      cached: cachedData ? cachedData.data : null,
    });
  }
};

function cleanOldCache() {
  const now = Date.now();
  for (const [key, value] of insightsCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      insightsCache.delete(key);
    }
  }
}

//to do automatic booking for user if his book cancelled
const findBestProvider = async (data) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    // Calculate Day of Week
    const targetDate = new Date(data.cancelledBook.service_date);
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const targetDayOfWeek = days[targetDate.getDay()];

    const systemPrompt = `
You are a strict Database Query Engine for a Palestinian Service Booking App. Your task is to find a replacement provider for a cancelled booking.

### CRITICAL EXECUTION ORDER (MUST FOLLOW STRICTLY):

**PHASE 1: SERVICE SEMANTIC MATCHING (PRIMARY FILTER)**
- Examine the cancelled service: serviceName AND description.
- Scan 'serviceProviderTable' and cross-reference with 'services' table.
- For each provider in serviceProviderTable:
  1. Get their service_id
  2. Look up that service_id in the 'services' table
  3. Compare the serviceName and description by MEANING, not exact text match
- **MATCHING LOGIC:**
  - Look for services that accomplish the same goal or serve the same purpose
- **KEEP:** Providers whose service has semantic similarity to the requested service
- **REJECT:** Providers whose service is completely unrelated in purpose/meaning

**PHASE 2: CATEGORY VERIFICATION (SECONDARY FILTER)**
- From providers who passed Phase 1, check their categoryName
- **PREFERENCE LOGIC:**
  - **Perfect Match:** Same category as requested (highest priority)
  - **Related Match:** Similar/complementary category (acceptable)
  - **Unrelated:** Completely different category (lowest priority, but don't eliminate if service meaning matched in Phase 1)

**PHASE 3: GEOGRAPHIC PROXIMITY FILTER**
- Extract the user's city from the cancelled booking address
- For providers who passed Phases 1 & 2, check their service_location
- Use West Bank geographic clustering:
  - **North Cluster:** Jenin, Nablus, Tulkarm, Qalqilya
  - **Center Cluster:** Ramallah, Al-Bireh, Jerusalem, Jericho (Ariha), Bethlehem, Beit Jala, Beit Sahour
  - **South Cluster:** Hebron (Al-Khalil), Dura, Yatta
- **Selection Logic:**
  1. First Priority: Exact city match
  2. Second Priority: Same cluster
  3. Third Priority: Adjacent cluster (North↔Center, Center↔South)
  4. Fourth Priority: Opposite cluster (North↔South)

**PHASE 4: AVAILABILITY VERIFICATION (MANDATORY)**
- For all remaining providers, verify:
  1. **Schedule Check:** In 'providersSchedules', confirm the provider works on ${targetDayOfWeek} and the requested time falls within their start_time and end_time
  2. **Holiday Check:** In 'providersHolidays', confirm the provider does NOT have an entry for the requested date
  3. **Booking Conflict Check:** In 'providersBookings', verify no existing booking conflicts with the requested date and time
- **ELIMINATE:** Any provider who fails availability check

**PHASE 5: PRICE OPTIMIZATION (FINAL TIEBREAKER)**
- Among all providers who passed Phases 1-4, select the one whose base_price is closest to the user's original providerPricePerHour

### OUTPUT FORMAT (JSON ONLY):
{
  "found": boolean,
  "best_provider": {
    "provider_name": "First Last",
    "service_name_offered_by_provider": "Exact service name from services table",
    "service_id": number,
    "service_category": "Category name",
    "base_price": number,
    "providerServiceId": number,
    "scheduled_date": "YYYY-MM-DD",
    "scheduled_time": "HH:MM:SS",
  }
}

If no provider passes all phases, return:
{
  "found": false,
  "reason": "Detailed explanation of which phase eliminated all candidates"
}
`;

    const userPrompt = `
Database Content: ${JSON.stringify(data)}

### CANCELLED BOOKING DETAILS:
- **Service Requested:** "${data.cancelledBook.serviceName}"
- **Service Description Context:** Look up service_id ${data.cancelledBook.service_id} in the services table to understand what the user actually needs
- **Service Category:** "${data.cancelledBook.categoryName}"
- **User Location:** "${data.cancelledBook.address}"
- **Service Date:** ${data.cancelledBook.service_date}
- **Day of Week:** ${targetDayOfWeek}
- **Service Time:** ${data.cancelledBook.service_time}
- **Estimated Duration:** ${data.cancelledBook.estimated_time} hour(s)
- **Target Price Per Hour:** $${data.cancelledBook.providerPricePerHour}

### YOUR TASK:
Find the best replacement provider using the strict 5-phase filtering process.

**EXECUTION PRIORITY:**
1. SERVICE MEANING (most important - what does the service actually do?)
2. CATEGORY (secondary - does it fall under similar work type?)
3. LOCATION (third - how close is the provider?)
4. AVAILABILITY (mandatory - must be free on the date/time)
5. PRICE (final tiebreaker - closest to target price)

**CRITICAL RULES:**
- Phase 1 filters by what the service actually DOES, not category labels
- A provider offering a semantically similar service in a different category is BETTER than a provider in the same category offering an unrelated service
- Never sacrifice service meaning for location proximity
- Availability is mandatory - no exceptions

Begin your analysis now. Work through each phase systematically.
`;

    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.0,
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0].message.content;
    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    return parsed;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  getAbstractOfBookDetails,
  getServiceInfoFromAI,
  getAIPerformenceInsights,
  findBestProvider,
};
