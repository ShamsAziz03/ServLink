import * as dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const userRequest = {
  description: "I need someone to assemble a large IKEA wardrobe at my home.",
  city: "Jenin",
  minBudget: "25",
  maxBudget: "75",
  preferredStartRangeDate: "2026-01-15",
  preferredEndRangeDate: "",
};

const systemData = {
  providerWorkingHours: [
    {
      provider_id: 2,
      day_of_week: "monday",
      start_time: "10:00:00",
      end_time: "16:00:00",
    },
    {
      provider_id: 2,
      day_of_week: "tuesday",
      start_time: "10:00:00",
      end_time: "16:00:00",
    },
    {
      provider_id: 2,
      day_of_week: "wednesday",
      start_time: "10:00:00",
      end_time: "16:00:00",
    },
    {
      provider_id: 2,
      day_of_week: "thursday",
      start_time: "10:00:00",
      end_time: "16:00:00",
    },
    {
      provider_id: 2,
      day_of_week: "friday",
      start_time: "10:00:00",
      end_time: "16:00:00",
    },
    {
      provider_id: 3,
      day_of_week: "monday",
      start_time: "08:00:00",
      end_time: "15:00:00",
    },
    {
      provider_id: 3,
      day_of_week: "tuesday",
      start_time: "08:00:00",
      end_time: "15:00:00",
    },
    {
      provider_id: 3,
      day_of_week: "wednesday",
      start_time: "08:00:00",
      end_time: "15:00:00",
    },
    {
      provider_id: 3,
      day_of_week: "thursday",
      start_time: "08:00:00",
      end_time: "15:00:00",
    },
    {
      provider_id: 3,
      day_of_week: "friday",
      start_time: "08:00:00",
      end_time: "15:00:00",
    },
    {
      provider_id: 4,
      day_of_week: "monday",
      start_time: "09:00:00",
      end_time: "18:00:00",
    },
    {
      provider_id: 4,
      day_of_week: "tuesday",
      start_time: "09:00:00",
      end_time: "18:00:00",
    },
    {
      provider_id: 4,
      day_of_week: "wednesday",
      start_time: "09:00:00",
      end_time: "18:00:00",
    },
    {
      provider_id: 4,
      day_of_week: "thursday",
      start_time: "09:00:00",
      end_time: "18:00:00",
    },
    {
      provider_id: 4,
      day_of_week: "friday",
      start_time: "09:00:00",
      end_time: "18:00:00",
    },
    {
      provider_id: 5,
      day_of_week: "monday",
      start_time: "09:30:00",
      end_time: "17:30:00",
    },
    {
      provider_id: 5,
      day_of_week: "tuesday",
      start_time: "09:30:00",
      end_time: "17:30:00",
    },
    {
      provider_id: 5,
      day_of_week: "wednesday",
      start_time: "09:30:00",
      end_time: "17:30:00",
    },
    {
      provider_id: 5,
      day_of_week: "thursday",
      start_time: "09:30:00",
      end_time: "17:30:00",
    },
    {
      provider_id: 5,
      day_of_week: "friday",
      start_time: "09:30:00",
      end_time: "17:30:00",
    },
    {
      provider_id: 6,
      day_of_week: "sunday",
      start_time: "09:00:00",
      end_time: "17:00:00",
    },
    {
      provider_id: 1,
      day_of_week: "tuesday",
      start_time: "09:00:00",
      end_time: "17:00:00",
    },
    {
      provider_id: 1,
      day_of_week: "wednesday",
      start_time: "10:00:00",
      end_time: "13:00:00",
    },
    {
      provider_id: 1,
      day_of_week: "thursday",
      start_time: "09:00:00",
      end_time: "17:00:00",
    },
    {
      provider_id: 1,
      day_of_week: "friday",
      start_time: "09:00:00",
      end_time: "17:00:00",
    },
    {
      provider_id: 1,
      day_of_week: "monday",
      start_time: "09:00:00",
      end_time: "17:00:00",
    },
  ],

  providerServices: [
    {
      id: 1,
      provider_id: 1,
      service_id: 3,
      base_price: 28.0,
      service_location: ["Ramallah", "Nablus", "Bethlehem", "Gaza"],
    },
    {
      id: 2,
      provider_id: 1,
      service_id: 2,
      base_price: 25.0,
      service_location: ["Ramallah", "Nablus", "Bethlehem"],
    },
    {
      id: 3,
      provider_id: 2,
      service_id: 1,
      base_price: 30.0,
      service_location: ["Nablus", "Jenin"],
    },
    {
      id: 4,
      provider_id: 2,
      service_id: 4,
      base_price: 30.0,
      service_location: ["Nablus", "Jenin"],
    },
    {
      id: 5,
      provider_id: 3,
      service_id: 8,
      base_price: 28.5,
      service_location: ["Hebron", "Jericho"],
    },
    {
      id: 6,
      provider_id: 3,
      service_id: 3,
      base_price: 28.5,
      service_location: ["Hebron", "Jericho"],
    },
    {
      id: 7,
      provider_id: 4,
      service_id: 6,
      base_price: 35.0,
      service_location: ["Bethlehem", "Ramallah"],
    },
    {
      id: 8,
      provider_id: 5,
      service_id: 5,
      base_price: 40.0,
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      id: 9,
      provider_id: 5,
      service_id: 7,
      base_price: 40.0,
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      id: 10,
      provider_id: 3,
      service_id: 9,
      base_price: 30.0,
      service_location: ["Hebron", "Jericho"],
    },
    {
      id: 11,
      provider_id: 1,
      service_id: 10,
      base_price: 35.0,
      service_location: ["Ramallah", "Nablus", "Bethlehem"],
    },
    {
      id: 12,
      provider_id: 5,
      service_id: 11,
      base_price: 40.0,
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      id: 13,
      provider_id: 6,
      service_id: 1,
      base_price: 70.0,
      service_location: ["Jenin"],
    },
  ],

  services: [
    {
      service_id: 1,
      category_id: 1,
      name: "Assemble furniture",
      description:
        "Professional help assembling and installing furniture at your home.",
    },
    {
      service_id: 2,
      category_id: 5,
      name: "Baby Sitting",
      description: "Reliable babysitting services for your children.",
    },
    {
      service_id: 3,
      category_id: 3,
      name: "Helping disabled at home",
      description: "Assistance and care for the elderly or disabled at home.",
    },
    {
      service_id: 4,
      category_id: 4,
      name: "Full Furniture Relocation",
      description: "Complete moving service for furniture and household items.",
    },
    {
      service_id: 5,
      category_id: 1,
      name: "Installing Electrical Sockets",
      description:
        "Installation of electrical sockets by a professional handyman.",
    },
    {
      service_id: 6,
      category_id: 1,
      name: "Pipe Work (Plumbing)",
      description: "Plumbing and pipe work services for homes and offices.",
    },
    {
      service_id: 7,
      category_id: 8,
      name: "Academic tutoring (math/science)",
      description: "Private academic lessons in math and science subjects.",
    },
    {
      service_id: 8,
      category_id: 2,
      name: "Tree Trimming",
      description:
        "Gardening service specializing in tree trimming and maintenance.",
    },
    {
      service_id: 9,
      category_id: 2,
      name: "Crop Maintenance",
      description:
        "Regular crop monitoring, watering, and pest control for farms.",
    },
    {
      service_id: 10,
      category_id: 6,
      name: "Pet Grooming",
      description:
        "Full grooming service for dogs and cats, including bathing and trimming.",
    },
    {
      service_id: 11,
      category_id: 7,
      name: "Computer Repair",
      description:
        "Troubleshooting and repairing desktops, laptops, and peripherals.",
    },
    {
      service_id: 12,
      category_id: 3,
      name: "Cleaning Service",
      description:
        "Comprehensive cleaning service: house, appliances, clothes, or car cleaning, with customizable duration and materials.",
    },
  ],

  providerNotes: [
    { provider_id: 2, date: "2025-12-19" },
    { provider_id: 2, date: "2025-12-29" },
    { provider_id: 3, date: "2025-12-30" },
    { provider_id: 3, date: "2026-01-05" },
    { provider_id: 4, date: "2026-01-10" },
    { provider_id: 4, date: "2025-12-23" },
    { provider_id: 5, date: "2025-12-23" },
    { provider_id: 5, date: "2025-12-29" },
    { provider_id: 2, date: "2026-01-20" },
    { provider_id: 6, date: "2026-01-27" },
    { provider_id: 1, date: "2026-01-01" },
    { provider_id: 1, date: "2026-01-10" },
    { provider_id: 1, date: "2026-01-08" },
    { provider_id: 1, date: "2026-01-28" },
  ],
  categories: [
    {
      category_id: 1,
      name: "Handyman",
      description: "Services related to handyman work",
    },
    {
      category_id: 2,
      name: "Agriculture",
      description: "Services related to agriculture and farming",
    },
    {
      category_id: 3,
      name: "Cleaning",
      description: "Cleaning services for homes and offices",
    },
    {
      category_id: 4,
      name: "Furniture Moving",
      description: "Help with moving furniture safely",
    },
    {
      category_id: 5,
      name: "Child Care",
      description: "Childcare and babysitting services",
    },
    {
      category_id: 6,
      name: "Pet Care",
      description: "Pet sitting, walking, and care services",
    },
    {
      category_id: 7,
      name: "IT / Computer Services",
      description: "IT support and computer services",
    },
    {
      category_id: 8,
      name: "Private Lessons",
      description: "Tutoring and private lessons in various subjects",
    },
  ],

  providers: [
    {
      provider_id: 1,
      user_id: 1,
      field_of_work: "Home Cleaning",
      description:
        "I’m a cleaner who actually knows what thorough means. I handle homes and offices with deep-clean precision, from scrubbing the tough corners to keeping your space fresh and maintained. I’m fast, organized, and consistent. I treat every place with the same care I’d want in my own home.",
      certifications:
        "Cleaning Certification Level 2, Safety Training Certificate",
      hourly_rate: 25.0,
      service_locations: ["Ramallah", "Nablus", "Bethlehem"],
      years_of_experience: 5,
      languages: ["English", "Arabic"],
      aboutProvider:
        "Expert in home and office cleaning services, including deep cleaning and maintenance.",
    },
    {
      provider_id: 2,
      user_id: 2,
      field_of_work: "Furniture Assembly",
      description:
        "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
      certifications: "Furniture Assembly Certificate Level 1",
      hourly_rate: 30.0,
      service_locations: ["Nablus", "Jenin"],
      years_of_experience: 3,
      languages: ["English"],
      aboutProvider:
        "Skilled in assembling all types of furniture efficiently and safely.",
    },
    {
      provider_id: 3,
      user_id: 3,
      field_of_work: "Gardening & Lawn Care",
      description:
        "I bring steady, experienced hands to lawn care, trimming, and landscaping. I keep yards looking sharp—healthy grass, clean edges, and a well-kept finish. I work efficiently, stay respectful of your space, and deliver results that look good week after week. If you want a gardener who actually understands the details and does the job with pride, I’m here to handle it.",
      certifications: "Gardening Certification, Landscaping Training",
      hourly_rate: 28.5,
      service_locations: ["Hebron", "Jericho"],
      years_of_experience: 4,
      languages: ["English", "Spanish"],
      aboutProvider:
        "Experienced gardener providing lawn care, trimming, and landscaping services.",
    },
    {
      provider_id: 4,
      user_id: 4,
      field_of_work: "Plumbing",
      description:
        "I’m a certified plumber who doesn’t cut corners. Whether it’s a leak, an installation, or a full repair, I tackle it with precision and the right tools. I work clean, stay punctual, and make sure the job holds up long after I’m gone. If you want plumbing done safely and professionally, I’m ready to sort it out.",

      certifications: "Plumbing License Level 2",
      hourly_rate: 35.0,
      service_locations: ["Bethlehem", "Ramallah"],
      years_of_experience: 6,
      languages: ["English"],
      aboutProvider:
        "Certified plumber handling residential and commercial plumbing tasks.",
    },
    {
      provider_id: 5,
      user_id: 5,
      field_of_work: "Electrical Services",
      description:
        "I’m a trained electrician handling installations, repairs, and troubleshooting with strict attention to safety and detail. Clean wiring, reliable setups, and work done by the book no risks, no sloppy fixes. I show up on time, work efficiently, and leave everything solid and secure. If you need electrical work handled by someone who actually knows what they’re doing, I’ve got you covered.",

      certifications: "Electrical Certification, Safety Training",
      hourly_rate: 40.0,
      service_locations: ["Tulkarm", "Jericho", "Nablus"],
      years_of_experience: 7,
      languages: ["English", "French"],
      aboutProvider:
        "Professional electrician for home and office installations and repairs.",
    },
    {
      provider_id: 6,
      user_id: 8,
      field_of_work: "Furniture Assembly",
      description:
        "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
      certifications: "Furniture Assembly Certificate Level 2",
      hourly_rate: 70.0,
      service_locations: ["Jenin"],
      years_of_experience: 10,
      languages: ["English", "Arabic"],
      aboutProvider:
        "Skilled in assembling all types of furniture efficiently and safely.",
    },
  ],
  users: [
    { user_id: 1, first_name: "Sami", last_name: "Ali", phone: "1234569" },
    {
      user_id: 2,
      first_name: "Omar",
      last_name: "Khaled",
      phone: "+1234567890",
    },
    { user_id: 3, first_name: "Sara", last_name: "Zahi", phone: "+1987654321" },
    {
      user_id: 4,
      first_name: "Samer",
      last_name: "Ahmad",
      phone: "+1123456789",
    },
    {
      user_id: 5,
      first_name: "Jane",
      last_name: "Smith",
      phone: "+1098765432",
    },
    { user_id: 6, first_name: "John", last_name: "Doe", phone: "+1012345678" },
    { user_id: 7, first_name: "Shams", last_name: "Aziz", phone: "1234567890" },
    { user_id: 8, first_name: "Ahmad", last_name: "Ali", phone: "+123456" },
  ],
};

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
    "categoryId":0,
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
      "providerId": 0,
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
            "providerServiceId": 0,
            "serviceId": 0,
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

const analyze = async (userRequest, systemData) => {
  try {
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
    console.log(JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error("❌ Groq AI Error:", error);
    throw new Error("AI analysis failed: " + error.message);
  }
};

analyze(userRequest, systemData);
