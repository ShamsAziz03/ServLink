// import * as dotenv from "dotenv";
// dotenv.config();

// import Groq from "groq-sdk";
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const data = {
//   provider: {
//     provider_id: 1,
//     service_locations: "Ramallah, Nablus, Bethlehem",
//     years_of_experience: 5,
//     services: [
//       { service_name: "Helping disabled at home", base_price: 28.0 },
//       { service_name: "Baby Sitting", base_price: 25.0 },
//     ],
//   },
//   bookings: {
//     stats: {
//       total: 5,
//       completed: 3,
//       cancelled: 1,
//       pending: 1,
//       completionRate: 60.0,
//       cancellationRate: 20.0,
//       totalEarnings: 119.0,
//     },
//   },
//   competitors: {
//     market_avg: {
//       hourly_rate: 30.5,
//       bookings_per_provider: 6.5,
//     },
//   },
//   market: {
//     popular_services: ["Home Cleaning", "Plumbing", "Electrical Services"],
//     popular_cities: ["Ramallah", "Nablus", "Bethlehem"],
//     peak_days: ["tuesday", "wednesday", "thursday"],
//     market_avg_rate: 32.0,
//   },
// };

// async function analyzeProvider() {
//   try {
//     const response = await groq.chat.completions.create({
//       model: "openai/gpt-oss-20b",
//       messages: [
//         {
//           role: "system",
//           content: `
// You are an expert performance analyst specialized in the Palestinian service marketplace. Analyze the following data accurately:

// ## Provider Information:
// - Cities Served: ${data.provider.service_locations}
// - Hourly Rate: ${data.provider.hourly_rate} ₪
// - Years of Experience: ${data.provider.years_of_experience}
// - Services Offered: ${data.provider.services}

// ## Provider Booking Statistics:
// - Total Bookings: ${data.bookings.stats.total}
// - Completion Rate: ${data.bookings.stats.completionRate}%
// - Cancellation Rate: ${data.bookings.stats.cancellationRate}%
// - Pending Bookings: ${data.bookings.stats.pending}
// - Total Earnings: ${data.bookings.stats.totalEarnings} ₪

// ## Market Benchmarks:
// - Average Price in Field: ${data.competitors.market_avg.hourly_rate} ₪
// - Average Bookings per Competitor: ${data.competitors.market_avg.bookings_per_provider}
// - Most Demanded Services: ${data.market.popular_services.join(", ")}
// - Most Demanded Cities: ${data.market.popular_cities.join(", ")}
// - Peak Days: ${data.market.peak_days.join(", ")}

// ## Required:
// Perform a comprehensive analysis and provide actionable recommendations. Focus on:
// 1. Competitive pricing
// 2. Services to add based on demand
// 3. Geographic expansion
// 4. Schedule optimization
// 5. Improving completion rates

// Return ONLY JSON without any additional text in this format:
// {
//   "overall_status": "excellent | good | average | needs_improvement",
//   "performance_score": 0-100,
//   "key_metrics": {
//     "completion_rate": ${data.bookings.stats.completionRate},
//     "cancellation_rate": ${data.bookings.stats.cancellationRate},
//     "booking_frequency": "high | medium | low"
//   },
//   "strengths": ["strength 1", "strength 2"],
//   "weaknesses": ["weakness 1", "weakness 2"],
//   "recommendations": {
//     "pricing": {
//       "current_position": "low | competitive | high",
//       "suggestion": "specific recommendation",
//       "potential_impact": "expected impact"
//     },
//     "services": {
//       "add_services": ["service 1", "service 2"],
//       "reason": "the reason"
//     },
//     "coverage": {
//       "add_cities": ["city 1", "city 2"],
//       "reason": "the reason"
//     },
//     "schedule": {
//       "suggestion": "schedule recommendation",
//       "peak_hours": "suggested peak hours"
//     }
//   },
//   "priority_actions": [
//     {
//       "action": "specific action",
//       "impact": "high | medium | low",
//       "effort": "easy | moderate | hard"
//     }
//   ]
// }

// `,
//         },
//       ],
//     });

//     console.log(response.choices[0].message.content);
//   } catch (error) {
//     console.error("Error analyzing provider:", error);
//   }
// }

// analyzeProvider();

import * as dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const data = {
  bookings: [
    {
      booking_id: "1",
      user_id: "6",
      provider_services_id: "3",
      status: "Completed",
      booking_date: "2025-10-15",
      service_date: "2025-10-17",
      service_time: "10:00:00",
      total_price: "30.00",
      payment_method: "Credit Card",
      address: "123 Painting St, Nablus",
      notes: "Furniture assembly for new apartment",
      created_at: "2025-10-15 14:20:00",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: "30.00",
    },
    {
      booking_id: "2",
      user_id: "1",
      provider_services_id: "7",
      status: "Completed",
      booking_date: "2025-10-10",
      service_date: "2025-10-12",
      service_time: "12:30:00",
      total_price: "35.00",
      payment_method: "Cash",
      address: "123 Painting St, Nablus",
      notes: "Fixed leaking sink in kitchen",
      created_at: "2025-10-10 09:30:00",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: "37.00",
    },
    {
      booking_id: "3",
      user_id: "6",
      provider_services_id: "8",
      status: "Pending",
      booking_date: "2025-11-03",
      service_date: "2025-11-05",
      service_time: "15:00:00",
      total_price: "40.00",
      payment_method: "Credit Card",
      address: "123 Painting St, Nablus",
      notes: "Installing two electrical sockets",
      created_at: "2025-11-03 11:00:00",
      is_accept: "accepted",
      estimated_time: "2.50",
      duration_time: null,
      actual_total_price: null,
    },
    {
      booking_id: "4",
      user_id: "2",
      provider_services_id: "5",
      status: "Completed",
      booking_date: "2025-10-25",
      service_date: "2025-10-26",
      service_time: "09:30:00",
      total_price: "28.50",
      payment_method: "Credit Card",
      address: "123 Main Street, New York",
      notes: "Tree trimming for backyard",
      created_at: "2025-10-25 16:15:00",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: "30.50",
    },
    {
      booking_id: "5",
      user_id: "3",
      provider_services_id: "3",
      status: "Pending",
      booking_date: "2025-11-02",
      service_date: "2026-01-28",
      service_time: "11:00:00",
      total_price: "40.00",
      payment_method: "Cash",
      address: "456 Elm Street, Brooklyn",
      notes: "Tutoring in math for 2 hours",
      created_at: "2025-11-02 10:40:00",
      is_accept: "accepted",
      estimated_time: "3.00",
      duration_time: null,
      actual_total_price: null,
    },
    {
      booking_id: "6",
      user_id: "4",
      provider_services_id: "1",
      status: "Completed",
      booking_date: "2025-10-20",
      service_date: "2025-10-21",
      service_time: "13:00:00",
      total_price: "25.00",
      payment_method: "Credit Card",
      address: "789 Oak Avenue, Queens",
      notes: "Helped assemble furniture",
      created_at: "2025-10-20 08:45:00",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: "25.00",
    },
    {
      booking_id: "7",
      user_id: "5",
      provider_services_id: "2",
      status: "Cancelled",
      booking_date: "2025-10-18",
      service_date: "2025-10-19",
      service_time: "09:00:00",
      total_price: "25.00",
      payment_method: "Cash",
      address: "321 Pine Road, Manhattan",
      notes: "Babysitting booking cancelled",
      created_at: "2025-10-18 17:10:00",
      is_accept: "rejected",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: null,
    },
    {
      booking_id: "8",
      user_id: "6",
      provider_services_id: "4",
      status: "Completed",
      booking_date: "2025-10-05",
      service_date: "2025-10-07",
      service_time: "16:00:00",
      total_price: "30.00",
      payment_method: "Credit Card",
      address: "654 Maple Lane, Bronx",
      notes: "Full furniture relocation",
      created_at: "2025-10-05 15:30:00",
      is_accept: "accepted",
      estimated_time: "4.00",
      duration_time: "2.00",
      actual_total_price: "32.00",
    },
    {
      booking_id: "9",
      user_id: "2",
      provider_services_id: "6",
      status: "Pending",
      booking_date: "2025-11-03",
      service_date: "2025-11-08",
      service_time: "14:30:00",
      total_price: "28.50",
      payment_method: "Cash",
      address: "123 Painting St, Nablus",
      notes: "Gardening and cleanup for front yard",
      created_at: "2025-11-03 13:20:00",
      is_accept: "accepted",
      estimated_time: "5.00",
      duration_time: null,
      actual_total_price: null,
    },
    {
      booking_id: "10",
      user_id: "6",
      provider_services_id: "5",
      status: "Completed",
      booking_date: "2025-10-22",
      service_date: "2025-10-23",
      service_time: "10:30:00",
      total_price: "28.50",
      payment_method: "Credit Card",
      address: "123 Main Street, New York",
      notes: "Lawn maintenance follow-up",
      created_at: "2025-10-22 09:00:00",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: "28.50",
    },
    {
      booking_id: "11",
      user_id: "1",
      provider_services_id: "10",
      status: "Completed",
      booking_date: "2025-11-08",
      service_date: "2025-11-10",
      service_time: "10:00:00",
      total_price: "35.00",
      payment_method: "Cash",
      address: "123 Main Street, NY",
      notes: "Pet Grooming booking",
      created_at: "2025-11-08 00:00:00",
      is_accept: "accepted",
      estimated_time: "6.00",
      duration_time: "2.00",
      actual_total_price: "34.00",
    },
    {
      booking_id: "13",
      user_id: "3",
      provider_services_id: "1",
      status: "Pending",
      booking_date: "2025-11-08",
      service_date: "2026-01-21",
      service_time: "11:30:00",
      total_price: "30.00",
      payment_method: "Cash",
      address: "789 Oak Avenue, Queens",
      notes: "Crop Maintenance booking",
      created_at: "2025-11-08 00:00:00",
      is_accept: "accepted",
      estimated_time: "1.00",
      duration_time: null,
      actual_total_price: null,
    },
    {
      booking_id: "14",
      user_id: "7",
      provider_services_id: "2",
      status: "Completed",
      booking_date: "2025-10-30",
      service_date: "2025-11-02",
      service_time: "15:30:00",
      total_price: "120.00",
      payment_method: "Credit Card",
      address: "Nablus - Rafidia",
      notes: "Client requested eco-friendly materials",
      created_at: "2025-11-30 12:20:30",
      is_accept: "accepted",
      estimated_time: "2.50",
      duration_time: "2.00",
      actual_total_price: "120.00",
    },
    {
      booking_id: "15",
      user_id: "7",
      provider_services_id: "3",
      status: "Cancelled",
      booking_date: "2025-11-05",
      service_date: "2025-11-07",
      service_time: "09:00:00",
      total_price: "60.00",
      payment_method: "Cash",
      address: "Hebron - Ein Sarah St.",
      notes: "Cancelled due to provider unavailability",
      created_at: "2025-11-30 12:20:30",
      is_accept: "rejected",
      estimated_time: "2.00",
      duration_time: "2.00",
      actual_total_price: null,
    },
    {
      booking_id: "16",
      user_id: "7",
      provider_services_id: "1",
      status: "Completed",
      booking_date: "2025-10-25",
      service_date: "2025-11-28",
      service_time: "17:45:00",
      total_price: "95.00",
      payment_method: "Cash",
      address: "Jenin - City Center",
      notes: "Customer satisfied with the service",
      created_at: "2025-11-30 12:20:30",
      is_accept: "accepted",
      estimated_time: "2.00",
      duration_time: "2.50",
      actual_total_price: "100.00",
    },
    {
      booking_id: "17",
      user_id: "7",
      provider_services_id: "2",
      status: "Pending",
      booking_date: "2025-11-09",
      service_date: "2026-01-13",
      service_time: "11:00:00",
      total_price: "150.00",
      payment_method: "Online Payment",
      address: "Bethlehem - Old City",
      notes: "Includes kitchen and bathroom cleaning",
      created_at: "2025-11-30 12:20:30",
      is_accept: "pending",
      estimated_time: "2.00",
      duration_time: null,
      actual_total_price: null,
    },
    {
      booking_id: "18",
      user_id: "7",
      provider_services_id: "3",
      status: "Pending",
      booking_date: "2026-01-04",
      service_date: "2026-01-15",
      service_time: "11:30:00",
      total_price: "30.00",
      payment_method: "cache",
      address: "Jenin, Area A, West Bank, Palestinian Territories",
      notes: null,
      created_at: "2026-01-04 15:06:59",
      is_accept: "pending",
      estimated_time: "1.00",
      duration_time: null,
      actual_total_price: null,
    },
  ],
  schedules: [
    {
      id: "6",
      provider_id: "2",
      day_of_week: "monday",
      start_time: "10:00:00",
      end_time: "16:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "7",
      provider_id: "2",
      day_of_week: "tuesday",
      start_time: "10:00:00",
      end_time: "16:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "8",
      provider_id: "2",
      day_of_week: "wednesday",
      start_time: "10:00:00",
      end_time: "16:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "9",
      provider_id: "2",
      day_of_week: "thursday",
      start_time: "10:00:00",
      end_time: "16:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "10",
      provider_id: "2",
      day_of_week: "friday",
      start_time: "10:00:00",
      end_time: "16:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "11",
      provider_id: "3",
      day_of_week: "monday",
      start_time: "08:00:00",
      end_time: "15:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "12",
      provider_id: "3",
      day_of_week: "tuesday",
      start_time: "08:00:00",
      end_time: "15:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "13",
      provider_id: "3",
      day_of_week: "wednesday",
      start_time: "08:00:00",
      end_time: "15:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "14",
      provider_id: "3",
      day_of_week: "thursday",
      start_time: "08:00:00",
      end_time: "15:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "15",
      provider_id: "3",
      day_of_week: "friday",
      start_time: "08:00:00",
      end_time: "15:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "16",
      provider_id: "4",
      day_of_week: "monday",
      start_time: "09:00:00",
      end_time: "18:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "17",
      provider_id: "4",
      day_of_week: "tuesday",
      start_time: "09:00:00",
      end_time: "18:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "18",
      provider_id: "4",
      day_of_week: "wednesday",
      start_time: "09:00:00",
      end_time: "18:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "19",
      provider_id: "4",
      day_of_week: "thursday",
      start_time: "09:00:00",
      end_time: "18:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "20",
      provider_id: "4",
      day_of_week: "friday",
      start_time: "09:00:00",
      end_time: "18:00:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "21",
      provider_id: "5",
      day_of_week: "monday",
      start_time: "09:30:00",
      end_time: "17:30:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "22",
      provider_id: "5",
      day_of_week: "tuesday",
      start_time: "09:30:00",
      end_time: "17:30:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "23",
      provider_id: "5",
      day_of_week: "wednesday",
      start_time: "09:30:00",
      end_time: "17:30:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "24",
      provider_id: "5",
      day_of_week: "thursday",
      start_time: "09:30:00",
      end_time: "17:30:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "25",
      provider_id: "5",
      day_of_week: "friday",
      start_time: "09:30:00",
      end_time: "17:30:00",
      created_at: "2025-12-06 10:15:47",
    },
    {
      id: "31",
      provider_id: "6",
      day_of_week: "sunday",
      start_time: "09:00:00",
      end_time: "17:00:00",
      created_at: "2026-01-07 15:27:08",
    },
    {
      id: "32",
      provider_id: "1",
      day_of_week: "tuesday",
      start_time: "09:00:00",
      end_time: "17:00:00",
      created_at: "2026-01-08 07:37:42",
    },
    {
      id: "33",
      provider_id: "1",
      day_of_week: "wednesday",
      start_time: "10:00:00",
      end_time: "13:00:00",
      created_at: "2026-01-08 07:37:42",
    },
    {
      id: "34",
      provider_id: "1",
      day_of_week: "thursday",
      start_time: "09:00:00",
      end_time: "17:00:00",
      created_at: "2026-01-08 07:37:42",
    },
    {
      id: "35",
      provider_id: "1",
      day_of_week: "friday",
      start_time: "09:00:00",
      end_time: "17:00:00",
      created_at: "2026-01-08 07:37:42",
    },
    {
      id: "36",
      provider_id: "1",
      day_of_week: "monday",
      start_time: "09:00:00",
      end_time: "17:00:00",
      created_at: "2026-01-08 07:37:42",
    },
  ],
  providers: [
    {
      provider_id: "1",
      user_id: "1",
      field_of_work: "Home Cleaning",
      description:
        "I’m a cleaner who actually knows what thorough means. I handle homes and offices with deep-clean precision, from scrubbing the tough corners to keeping your space fresh and maintained. I’m fast, organized, and consistent. I treat every place with the same care I’d want in my own home.",
      hourly_rate: "25.00",
      service_locations: ["Ramallah", "Nablus", "Bethlehem"],
      years_of_experience: 5,
      languages: ["English", "Arabic"],
      approved_by_admin: 1,
      created_at: "2025-11-02 15:29:34",
      aboutProvider:
        "Expert in home and office cleaning services, including deep cleaning and maintenance.",
      id_card_number: null,
    },
    {
      provider_id: "2",
      user_id: "2",
      field_of_work: "Furniture Assembly",
      description:
        "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
      hourly_rate: "30.00",
      service_locations: ["Nablus", "Jenin"],
      years_of_experience: 3,
      languages: ["English"],
      approved_by_admin: 1,
      created_at: "2025-11-02 15:29:34",
      aboutProvider:
        "Skilled in assembling all types of furniture efficiently and safely.",
      id_card_number: null,
    },
    {
      provider_id: "3",
      user_id: "3",
      field_of_work: "Gardening & Lawn Care",
      description:
        "I bring steady, experienced hands to lawn care, trimming, and landscaping. I keep yards looking sharp—healthy grass, clean edges, and a well-kept finish. I work efficiently, stay respectful of your space, and deliver results that look good week after week. If you want a gardener who actually understands the details and does the job with pride, I’m here to handle it.",
      hourly_rate: "28.50",
      service_locations: ["Hebron", "Jericho"],
      years_of_experience: 4,
      languages: ["English", "Spanish"],
      approved_by_admin: 1,
      created_at: "2025-11-02 15:29:34",
      aboutProvider:
        "Experienced gardener providing lawn care, trimming, and landscaping services.",
      id_card_number: null,
    },
    {
      provider_id: "4",
      user_id: "4",
      field_of_work: "Plumbing",
      description:
        "I’m a certified plumber who doesn’t cut corners. Whether it’s a leak, an installation, or a full repair, I tackle it with precision and the right tools. I work clean, stay punctual, and make sure the job holds up long after I’m gone. If you want plumbing done safely and professionally, I’m ready to sort it out.",
      hourly_rate: "35.00",
      service_locations: ["Bethlehem", "Ramallah"],
      years_of_experience: 6,
      languages: ["English"],
      approved_by_admin: 0,
      created_at: "2025-11-02 15:29:34",
      aboutProvider:
        "Certified plumber handling residential and commercial plumbing tasks.",
      id_card_number: null,
    },
    {
      provider_id: "5",
      user_id: "5",
      field_of_work: "Electrical Services",
      description:
        "I’m a trained electrician handling installations, repairs, and troubleshooting with strict attention to safety and detail. Clean wiring, reliable setups, and work done by the book no risks, no sloppy fixes. I show up on time, work efficiently, and leave everything solid and secure. If you need electrical work handled by someone who actually knows what they’re doing, I’ve got you covered.",
      hourly_rate: "40.00",
      service_locations: ["Tulkarm", "Jericho", "Nablus"],
      years_of_experience: 7,
      languages: ["English", "French"],
      approved_by_admin: 1,
      created_at: "2025-11-02 15:29:34",
      aboutProvider:
        "Professional electrician for home and office installations and repairs.",
      id_card_number: null,
    },
    {
      provider_id: "6",
      user_id: "8",
      field_of_work: "Furniture Assembly",
      description:
        "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
      hourly_rate: "70.00",
      service_locations: ["Jenin"],
      years_of_experience: 10,
      languages: ["English", "Arabic"],
      approved_by_admin: 1,
      created_at: "2025-12-04 23:01:23",
      aboutProvider:
        "Skilled in assembling all types of furniture efficiently and safely.",
      id_card_number: null,
    },
  ],
  services: [
    {
      service_id: "1",
      category_id: "1",
      name: "Assemble furniture",
      description:
        "Professional help assembling and installing furniture at your home.",
      image: "http://10.0.2.2:5000/assets/Assemble_and_install_furniture2.jpg",
    },
    {
      service_id: "2",
      category_id: "5",
      name: "Baby Sitting",
      description: "Reliable babysitting services for your children.",
      image: "http://10.0.2.2:5000/assets/Babysitting.jpg",
    },
    {
      service_id: "3",
      category_id: "3",
      name: "Helping disabled at home",
      description: "Assistance and care for the elderly or disabled at home.",
      image: "http://10.0.2.2:5000/assets/Helping_elderly_disabled_at_home.jpg",
    },
    {
      service_id: "4",
      category_id: "4",
      name: "Full Furniture Relocation",
      description: "Complete moving service for furniture and household items.",
      image: "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
    },
    {
      service_id: "5",
      category_id: "1",
      name: "Installing Electrical Sockets",
      description:
        "Installation of electrical sockets by a professional handyman.",
      image: "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
    },
    {
      service_id: "6",
      category_id: "1",
      name: "Pipe Work (Plumbing)",
      description: "Plumbing and pipe work services for homes and offices.",
      image: "http://10.0.2.2:5000/assets/pipe_work (plumbing).jpg",
    },
    {
      service_id: "7",
      category_id: "8",
      name: "Academic tutoring (math/science)",
      description: "Private academic lessons in math and science subjects.",
      image: "http://10.0.2.2:5000/assets/private_language_lessons.jpg",
    },
    {
      service_id: "8",
      category_id: "2",
      name: "Tree Trimming",
      description:
        "Gardening service specializing in tree trimming and maintenance.",
      image: "http://10.0.2.2:5000/assets/Tree_trimming.jpg",
    },
    {
      service_id: "9",
      category_id: "2",
      name: "Crop Maintenance",
      description:
        "Regular crop monitoring, watering, and pest control for farms.",
      image: "http://10.0.2.2:5000/assets/weed_removal.jpg",
    },
    {
      service_id: "10",
      category_id: "6",
      name: "Pet Grooming",
      description:
        "Full grooming service for dogs and cats, including bathing and trimming.",
      image: "http://10.0.2.2:5000/assets/Pet_sitting_at_home.jpg",
    },
    {
      service_id: "11",
      category_id: "7",
      name: "Computer Repair",
      description:
        "Troubleshooting and repairing desktops, laptops, and peripherals.",
      image: "http://10.0.2.2:5000/assets/Troubleshoot_computer_hardware.jpg",
    },
    {
      service_id: "12",
      category_id: "3",
      name: "Cleaning Service",
      description:
        "Comprehensive cleaning service: house, appliances, clothes, or car cleaning, with customizable duration and materials.",
      image: "http://10.0.2.2:5000/assets/Regular_house_cleaning.jpg",
    },
  ],
  provider_services: [
    {
      provider_services_id: "1",
      provider_id: "1",
      service_id: "3",
      base_price: "28.00",
      images: [
        "http://10.0.2.2:5000/assets/Helping_elderly_disabled_at_home.jpg",
        "http://10.0.2.2:5000/assets/helpingdisabledathome.jpg",
        "http://10.0.2.2:5000/assets/helpingdisableathome2.jpg",
      ],
      service_location: ["Ramallah", "Nablus", "Bethlehem", "Gaza"],
    },
    {
      provider_services_id: "2",
      provider_id: "1",
      service_id: "2",
      base_price: "25.00",
      images: [
        "http://10.0.2.2:5000/assets/Babysitting.jpg",
        "http://10.0.2.2:5000/assets/babysitting1.jpg",
        "http://10.0.2.2:5000/assets/babysitting2.jpg",
      ],
      service_location: ["Ramallah", "Nablus", "Bethlehem"],
    },
    {
      provider_services_id: "3",
      provider_id: "2",
      service_id: "1",
      base_price: "30.00",
      images: [
        "http://10.0.2.2:5000/assets/Assemble_and_install_furniture2.jpg",
        "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
      ],
      service_location: ["Nablus", "Jenin"],
    },
    {
      provider_services_id: "4",
      provider_id: "2",
      service_id: "4",
      base_price: "30.00",
      images: [
        "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
        "http://10.0.2.2:5000/uploads/experience_photos/samer_ahmad1.jpg",
      ],
      service_location: ["Nablus", "Jenin"],
    },
    {
      provider_services_id: "5",
      provider_id: "3",
      service_id: "8",
      base_price: "28.50",
      images: [
        "http://10.0.2.2:5000/assets/Tree_trimming.jpg",
        "http://10.0.2.2/uploads/experience_photos/sara_zahi1.jpg",
      ],
      service_location: ["Hebron", "Jericho"],
    },
    {
      provider_services_id: "6",
      provider_id: "3",
      service_id: "3",
      base_price: "28.50",
      images: [
        "http://10.0.2.2:5000/assets/Helping_elderly_disabled_at_home.jpg",
        "http://10.0.2.2/uploads/experience_photos/sara_zahi2.jpg",
      ],
      service_location: ["Hebron", "Jericho"],
    },
    {
      provider_services_id: "7",
      provider_id: "4",
      service_id: "6",
      base_price: "35.00",
      images: [
        "http://10.0.2.2:5000/assets/pipe_work (plumbing).jpg",
        "http://10.0.2.2/uploads/experience_photos/john_doe1.jpg",
      ],
      service_location: ["Bethlehem", "Ramallah"],
    },
    {
      provider_services_id: "8",
      provider_id: "5",
      service_id: "5",
      base_price: "40.00",
      images: [
        "http://10.0.2.2:5000/assets/Installing_electrical_sockets.jpg",
        "http://10.0.2.2/uploads/experience_photos/jane_smith1.jpg",
      ],
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      provider_services_id: "9",
      provider_id: "5",
      service_id: "7",
      base_price: "40.00",
      images: [
        "http://10.0.2.2:5000/assets/private_language_lessons.jpg",
        "http://10.0.2.2/uploads/experience_photos/jane_smith2.jpg",
      ],
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      provider_services_id: "10",
      provider_id: "3",
      service_id: "9",
      base_price: "30.00",
      images: ["https://10.0.2.2:5000/assets/Tree_trimming.jpg"],
      service_location: ["Hebron", "Jericho"],
    },
    {
      provider_services_id: "11",
      provider_id: "1",
      service_id: "10",
      base_price: "35.00",
      images: ["http://10.0.2.2:5000/assets/Pet_sitting_at_home.jpg"],
      service_location: ["Ramallah", "Nablus", "Bethlehem"],
    },
    {
      provider_services_id: "12",
      provider_id: "5",
      service_id: "11",
      base_price: "40.00",
      images: [
        "https://10.0.2.2:5000/assets/Troubleshoot_computer_hardware.jpg",
      ],
      service_location: ["Tulkarm", "Jericho", "Nablus"],
    },
    {
      provider_services_id: "13",
      provider_id: "6",
      service_id: "1",
      base_price: "70.00",
      images: [
        "http://10.0.2.2:5000/assets/Assemble_and_install_furniture2.jpg",
        "http://10.0.2.2:5000/assets/Full_furniture_relocation.jpg",
      ],
      service_location: ["Jenin"],
    },
  ],
};

async function analyzeProvider(providerId) {
  try {
    const provider = data.providers.find(
      (p) => p.provider_id === String(providerId)
    );
    if (!provider) throw new Error("Provider not found");

    // provider services - from PS and services tables
    const providerServices = data.provider_services
      .filter((ps) => ps.provider_id === String(providerId))
      .map((ps) => ({
        ...ps,
        service_details:
          data.services.find((s) => s.service_id === ps.service_id) || {},
      }));

    // similar competitors services - from provSer array and  PS table with services table
    const competitorServices = data.provider_services
      .filter(
        (ps) =>
          ps.provider_id !== String(providerId) &&
          providerServices.some((p) => {
            const serviceA = data.services.find(
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
          data.services.find((s) => s.service_id === ps.service_id) || {},
      }));

    const providerBookings = data.bookings.filter((b) =>
      providerServices.some(
        (ps) => ps.provider_services_id === b.provider_services_id
      )
    );

    const competitorBookings = data.bookings.filter((b) =>
      competitorServices.some(
        (ps) => ps.provider_services_id === b.provider_services_id
      )
    );

    const providerSchedule = data.schedules.filter(
      (s) => s.provider_id === String(providerId)
    );

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: `
You are an expert performance analyst specialized in the Palestinian service marketplace.

Analyze this provider in detail and compare with competitors offering similar services based on:
- Provider's own bookings and schedule
- Competitors' bookings for similar services (include time and day to find peak demand)
- Full service details for provider and competitors
- Market trends and statistics from Google and other sources

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
1. Evaluate the provider's strengths and weaknesses based on:
   - Services offered
   - Booking history
   - Completion and cancellation rates
   - Market demand and trends from Google or other credible sources

2. Suggest actionable recommendations:
   - **Pricing adjustments:** Specify for which service(s) the price is low, competitive, or high, and provide a recommended adjustment with expected impact.
   - **New services:** List specific services the provider should add, and explain why (market demand, competitor gap, or trend).
   - **City expansion:** For each service (existing or new), specify which cities the provider should expand into and justify based on demand or competitor activity.
   - **Schedule optimization:** Suggest ideal working hours/days for each service to maximize bookings and efficiency.
   - **Completion improvement:** Recommend strategies to improve completion rate for each service.

3. Identify peak hours and days per service based on provider and competitor bookings, highlighting times of highest demand.

4. Return ONLY JSON in this enhanced format:

{
  "overall_status": "excellent | good | average | needs_improvement",
  "performance_score": 0-100,
  "key_metrics": {
    "completion_rate": 0-100,
    "cancellation_rate": 0-100,
    "booking_frequency": "high | medium | low"
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": {
    "pricing": [
      { "service": "Service A", "current_position": "low | competitive | high", "suggestion": "recommendation", "potential_impact": "expected impact" }
    ],
    "services": [
      { "add_service": "Service B", "reason": "reason" }
    ],
    "coverage": [
      { "service": "Service A", "add_cities": ["city1","city2"], "reason": "reason" }
    ],
    "schedule": [
      { "service": "Service A", "suggestion": "recommendation", "peak_hours": "hours with highest demand" }
    ],
    "completion_improvement": [
      { "service": "Service A", "recommendation": "strategy to improve completion rate" }
    ]
  },
  "priority_actions": [
    { "action": "action", "impact": "high | medium | low", "effort": "easy | moderate | hard" }
  ],
  "explains": [
    "Each recommendation should reference the data source: provider bookings, competitor bookings, Google trends, or market reports."
  ]
}
          `,
        },
      ],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing provider:", error);
  }
}

analyzeProvider(1);
