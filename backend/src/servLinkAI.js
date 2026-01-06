import * as dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const answers = [
  {
    answer_id: "40",
    booking_id: "17",
    question: "Moving from (address)?",
    answer_value: "Bethlehem - Old City",
  },
  {
    answer_id: "41",
    booking_id: "17",
    question: "Moving to (address)?",
    answer_value: "Bethlehem - New Area",
  },
  {
    answer_id: "42",
    booking_id: "17",
    question: "How big is your task?",
    answer_value: "Large - Est. 4+ hrs",
  },
  {
    answer_id: "43",
    booking_id: "17",
    question: "Do you need Vehicle?",
    answer_value: "Truck",
  },
  {
    answer_id: "44",
    booking_id: "17",
    question: "Add any additional details",
    answer_value: "Includes appliances",
  },
];

const bookings = [
  {
    booking_id: "8",
    user_id: "5",
    Provider_Services_id: "4",
    status: "Completed",
    booking_date: "2025-10-01",
    service_date: "2025-10-05",
    service_time: "10:00:00",
    total_price: "140.00",
    payment_method: "Online Payment",
    address: "Nablus - Main Street",
    notes: "Small apartment",
    created_at: "2025-09-30 08:00:00",
    is_accept: "accepted",
    estimated_time: "2.00",
    duration_time: "3.00",
    actual_total_price: "140.00",
  },
  {
    booking_id: "17",
    user_id: "7",
    Provider_Services_id: "4",
    status: "Pending",
    booking_date: "2025-11-09",
    service_date: "2025-11-23",
    service_time: "13:00:00",
    total_price: "150.00",
    payment_method: "Online Payment",
    address: "Bethlehem - Old City11",
    notes: "Includes kitchen and bathroom cleaning",
    created_at: "2025-11-30 12:20:30",
    is_accept: "accepted",
    estimated_time: "2.00",
    duration_time: "3.50",
    actual_total_price: null,
  },
];

const services = [
  {
    service_id: "4",
    category_id: "4",
    name: "Full Furniture Relocation",
    description: "Complete moving service for furniture and household items.",
    image: "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
  },
];

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
- Include a short explanation (1-2 sentences) about why you chose this estimated time.
- Consider the service task will be in Palestine, use realistic assumptions.
`,
    },
    {
      role: "user",
      content: `
Booking Answers:
${JSON.stringify(answers, null, 2)}

Previous Bookings:
${JSON.stringify(bookings, null, 2)}

Service Details:
${JSON.stringify(services, null, 2)}
`,
    },
  ],
});

function parseJsonSafe(text) {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "");
  return JSON.parse(cleaned);
}

const result = parseJsonSafe(response.choices[0].message.content);
console.log("Estimated Time (hours):", result.estimated_time);
console.log("Explanation:", result.explanation);
