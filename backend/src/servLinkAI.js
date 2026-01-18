// import * as dotenv from "dotenv";
// dotenv.config();
// import Groq from "groq-sdk";

// const data = {
//   cancelledBook: {
//     booking_id: 13,
//     status: "Pending",
//     service_date: "2026-01-20T22:00:00.000Z",
//     service_time: "11:30:00",
//     payment_method: "Cash",
//     address: "Rukab St., Ramallah",
//     created_at: "2025-11-07T22:00:00.000Z",
//     is_accept: "accepted",
//     estimated_time: "1.00",
//     duration_time: null,
//     actual_total_price: null,
//     total_price: "30.00",
//     customerId: 7,
//     first_name: "ali",
//     last_name: "omar",
//     phone: "+1987444321",
//     email: "ali.omar@example.com",
//     serviceName: "Helping disabled at home",
//     categoryName: "Cleaning",
//     Provider_Services_id: 1,
//     service_id: 3,
//     provider_id: 1,
//     providerPricePerHour: 28.0,
//   },
//   serviceProviderTable: [
//     {
//       Provider_Services_id: 3,
//       provider_id: 2,
//       service_id: 1,
//       base_price: "30.00",
//       service_location: "Nablus, Jenin",
//     },
//     {
//       Provider_Services_id: 4,
//       provider_id: 2,
//       service_id: 4,
//       base_price: "30.00",
//       service_location: "Nablus, Jenin",
//     },
//     {
//       Provider_Services_id: 5,
//       provider_id: 3,
//       service_id: 8,
//       base_price: "28.50",
//       service_location: "Hebron, Jericho",
//     },
//     {
//       Provider_Services_id: 6,
//       provider_id: 3,
//       service_id: 3,
//       base_price: "28.50",
//       service_location: "Hebron, Jericho",
//     },
//     {
//       Provider_Services_id: 7,
//       provider_id: 4,
//       service_id: 6,
//       base_price: "35.00",
//       service_location: "Bethlehem, Ramallah",
//     },
//     {
//       Provider_Services_id: 8,
//       provider_id: 5,
//       service_id: 5,
//       base_price: "40.00",
//       service_location: "Tulkarm, Jericho, Nablus",
//     },
//     {
//       Provider_Services_id: 9,
//       provider_id: 5,
//       service_id: 7,
//       base_price: "40.00",
//       service_location: "Tulkarm, Jericho, Nablus",
//     },
//     {
//       Provider_Services_id: 10,
//       provider_id: 3,
//       service_id: 9,
//       base_price: "30.00",
//       service_location: "Hebron, Jericho",
//     },
//     {
//       Provider_Services_id: 12,
//       provider_id: 5,
//       service_id: 11,
//       base_price: "40.00",
//       service_location: "Tulkarm, Jericho, Nablus",
//     },
//     {
//       Provider_Services_id: 13,
//       provider_id: 6,
//       service_id: 1,
//       base_price: "70.00",
//       service_location: "Jenin",
//     },
//   ],
//   services: [
//     {
//       service_id: 1,
//       serviceName: "Assemble furniture",
//       description:
//         "Professional help assembling and installing furniture at your home.",
//       categoryName: "Handyman",
//     },
//     {
//       service_id: 5,
//       serviceName: "Installing Electrical Sockets",
//       description:
//         "Installation of electrical sockets by a professional handyman.",
//       categoryName: "Handyman",
//     },
//     {
//       service_id: 6,
//       serviceName: "Pipe Work (Plumbing)",
//       description: "Plumbing and pipe work services for homes and offices.",
//       categoryName: "Handyman",
//     },
//     {
//       service_id: 8,
//       serviceName: "Tree Trimming",
//       description:
//         "Gardening service specializing in tree trimming and maintenance.",
//       categoryName: "Agriculture",
//     },
//     {
//       service_id: 9,
//       serviceName: "Crop Maintenance",
//       description:
//         "Regular crop monitoring, watering, and pest control for farms.",
//       categoryName: "Agriculture",
//     },
//     {
//       service_id: 3,
//       serviceName: "Helping disabled at home",
//       description: "Assistance and care for the elderly or disabled at home.",
//       categoryName: "Cleaning",
//     },
//     {
//       service_id: 12,
//       serviceName: "Cleaning Service",
//       description:
//         "Comprehensive cleaning service: house, appliances, clothes, or car cleaning, with customizable duration and materials.",
//       categoryName: "Cleaning",
//     },
//     {
//       service_id: 4,
//       serviceName: "Full Furniture Relocation",
//       description: "Complete moving service for furniture and household items.",
//       categoryName: "Furniture Moving",
//     },
//     {
//       service_id: 2,
//       serviceName: "Baby Sitting",
//       description: "Reliable babysitting services for your children.",
//       categoryName: "Child Care",
//     },
//     {
//       service_id: 10,
//       serviceName: "Pet Grooming",
//       description:
//         "Full grooming service for dogs and cats, including bathing and trimming.",
//       categoryName: "Pet Care",
//     },
//     {
//       service_id: 11,
//       serviceName: "Computer Repair",
//       description:
//         "Troubleshooting and repairing desktops, laptops, and peripherals.",
//       categoryName: "IT / Computer Services",
//     },
//     {
//       service_id: 7,
//       serviceName: "Academic tutoring (math/science)",
//       description: "Private academic lessons in math and science subjects.",
//       categoryName: "Private Lessons",
//     },
//   ],
//   providers: [
//     {
//       provider_id: 2,
//       first_name: "Omar",
//       last_name: "Khaled",
//       field_of_work: "Furniture Assembly",
//       description:
//         "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
//       aboutProvider:
//         "Skilled in assembling all types of furniture efficiently and safely.",
//       service_locations: "Nablus, Jenin",
//       languages: "English",
//       approved_by_admin: 1,
//       years_of_experience: 3,
//     },
//     {
//       provider_id: 3,
//       first_name: "Sara",
//       last_name: "Zahi",
//       field_of_work: "Gardening & Lawn Care",
//       description:
//         "I bring steady, experienced hands to lawn care, trimming, and landscaping. I keep yards looking sharp—healthy grass, clean edges, and a well-kept finish. I work efficiently, stay respectful of your space, and deliver results that look good week after week. If you want a gardener who actually understands the details and does the job with pride, I’m here to handle it.",
//       aboutProvider:
//         "Experienced gardener providing lawn care, trimming, and landscaping services.",
//       service_locations: "Hebron, Jericho",
//       languages: "English, Spanish",
//       approved_by_admin: 1,
//       years_of_experience: 4,
//     },
//     {
//       provider_id: 4,
//       first_name: "Samer",
//       last_name: "Ahmad",
//       field_of_work: "Plumbing",
//       description:
//         "I’m a certified plumber who doesn’t cut corners. Whether it’s a leak, an installation, or a full repair, I tackle it with precision and the right tools. I work clean, stay punctual, and make sure the job holds up long after I’m gone. If you want plumbing done safely and professionally, I’m ready to sort it out.",
//       aboutProvider:
//         "Certified plumber handling residential and commercial plumbing tasks.",
//       service_locations: "Bethlehem, Ramallah",
//       languages: "English",
//       approved_by_admin: 0,
//       years_of_experience: 6,
//     },
//     {
//       provider_id: 5,
//       first_name: "Jane",
//       last_name: "Smith",
//       field_of_work: "Electrical Services",
//       description:
//         "I’m a trained electrician handling installations, repairs, and troubleshooting with strict attention to safety and detail. Clean wiring, reliable setups, and work done by the book no risks, no sloppy fixes. I show up on time, work efficiently, and leave everything solid and secure. If you need electrical work handled by someone who actually knows what they’re doing, I’ve got you covered.",
//       aboutProvider:
//         "Professional electrician for home and office installations and repairs.",
//       service_locations: "Tulkarm, Jericho, Nablus",
//       languages: "English, French",
//       approved_by_admin: 1,
//       years_of_experience: 7,
//     },
//     {
//       provider_id: 6,
//       first_name: "Ahmad",
//       last_name: "Ali",
//       field_of_work: "Furniture Assembly",
//       description:
//         "I assemble furniture with a technician’s mindset efficient, secure, and clean results every time. Years of hands-on experience mean no guesswork, no mess, just solid, professional assembly. I work quickly, stay organized, and handle every piece like it’s going in my own place. If you want someone dependable who gets the job done right the first time, I’m your guy.",
//       aboutProvider:
//         "Skilled in assembling all types of furniture efficiently and safely.",
//       service_locations: "Jenin",
//       languages: "English, Arabic",
//       approved_by_admin: 1,
//       years_of_experience: 10,
//     },
//   ],
//   providersSchedules: [
//     {
//       provider_id: 2,
//       day_of_week: "monday",
//       start_time: "10:00:00",
//       end_time: "16:00:00",
//     },
//     {
//       provider_id: 2,
//       day_of_week: "tuesday",
//       start_time: "10:00:00",
//       end_time: "16:00:00",
//     },
//     {
//       provider_id: 2,
//       day_of_week: "wednesday",
//       start_time: "10:00:00",
//       end_time: "16:00:00",
//     },
//     {
//       provider_id: 2,
//       day_of_week: "thursday",
//       start_time: "10:00:00",
//       end_time: "16:00:00",
//     },
//     {
//       provider_id: 2,
//       day_of_week: "friday",
//       start_time: "10:00:00",
//       end_time: "16:00:00",
//     },
//     {
//       provider_id: 3,
//       day_of_week: "monday",
//       start_time: "08:00:00",
//       end_time: "15:00:00",
//     },
//     {
//       provider_id: 3,
//       day_of_week: "tuesday",
//       start_time: "08:00:00",
//       end_time: "15:00:00",
//     },
//     {
//       provider_id: 3,
//       day_of_week: "wednesday",
//       start_time: "08:00:00",
//       end_time: "15:00:00",
//     },
//     {
//       provider_id: 3,
//       day_of_week: "thursday",
//       start_time: "08:00:00",
//       end_time: "15:00:00",
//     },
//     {
//       provider_id: 3,
//       day_of_week: "friday",
//       start_time: "08:00:00",
//       end_time: "15:00:00",
//     },
//     {
//       provider_id: 4,
//       day_of_week: "monday",
//       start_time: "09:00:00",
//       end_time: "18:00:00",
//     },
//     {
//       provider_id: 4,
//       day_of_week: "tuesday",
//       start_time: "09:00:00",
//       end_time: "18:00:00",
//     },
//     {
//       provider_id: 4,
//       day_of_week: "wednesday",
//       start_time: "09:00:00",
//       end_time: "18:00:00",
//     },
//     {
//       provider_id: 4,
//       day_of_week: "thursday",
//       start_time: "09:00:00",
//       end_time: "18:00:00",
//     },
//     {
//       provider_id: 4,
//       day_of_week: "friday",
//       start_time: "09:00:00",
//       end_time: "18:00:00",
//     },
//     {
//       provider_id: 5,
//       day_of_week: "monday",
//       start_time: "09:30:00",
//       end_time: "17:30:00",
//     },
//     {
//       provider_id: 5,
//       day_of_week: "tuesday",
//       start_time: "09:30:00",
//       end_time: "17:30:00",
//     },
//     {
//       provider_id: 5,
//       day_of_week: "wednesday",
//       start_time: "09:30:00",
//       end_time: "17:30:00",
//     },
//     {
//       provider_id: 5,
//       day_of_week: "thursday",
//       start_time: "09:30:00",
//       end_time: "17:30:00",
//     },
//     {
//       provider_id: 5,
//       day_of_week: "friday",
//       start_time: "09:30:00",
//       end_time: "17:30:00",
//     },
//     {
//       provider_id: 6,
//       day_of_week: "sunday",
//       start_time: "09:00:00",
//       end_time: "17:00:00",
//     },
//   ],
//   providersHolidays: [
//     { provider_id: 2, date: "2025-12-18T22:00:00.000Z", note: "Vacation" },
//     { provider_id: 2, date: "2025-12-28T22:00:00.000Z", note: "Sick leave" },
//     { provider_id: 3, date: "2025-12-29T22:00:00.000Z", note: "Vacation" },
//     {
//       provider_id: 3,
//       date: "2026-01-04T22:00:00.000Z",
//       note: "Unavailable: Tutoring",
//     },
//     {
//       provider_id: 4,
//       date: "2026-01-09T22:00:00.000Z",
//       note: "Completed: Furniture relocation",
//     },
//     {
//       provider_id: 4,
//       date: "2025-12-22T22:00:00.000Z",
//       note: "Pending cleaning service",
//     },
//     {
//       provider_id: 5,
//       date: "2025-12-22T22:00:00.000Z",
//       note: "Completed: Lawn maintenance",
//     },
//     {
//       provider_id: 5,
//       date: "2025-12-28T22:00:00.000Z",
//       note: "Pending tutoring",
//     },
//     { provider_id: 2, date: "2026-01-19T22:00:00.000Z", note: "Unavailable" },
//     { provider_id: 6, date: "2026-01-26T22:00:00.000Z", note: "sick" },
//   ],
//   providersBookings: [
//     {
//       booking_id: 3,
//       Provider_Services_id: 8,
//       status: "Pending",
//       service_date: "2025-11-04T22:00:00.000Z",
//       service_time: "15:00:00",
//       payment_method: "Credit Card",
//       address: "123 Painting St, Nablus",
//       estimated_time: "2.50",
//     },
//     {
//       booking_id: 5,
//       Provider_Services_id: 3,
//       status: "Pending",
//       service_date: "2026-01-27T22:00:00.000Z",
//       service_time: "11:00:00",
//       payment_method: "Cash",
//       address: "456 Elm Street, Brooklyn",
//       estimated_time: "3.00",
//     },
//     {
//       booking_id: 9,
//       Provider_Services_id: 6,
//       status: "Pending",
//       service_date: "2025-11-07T22:00:00.000Z",
//       service_time: "14:30:00",
//       payment_method: "Cash",
//       address: "123 Painting St, Nablus",
//       estimated_time: "5.00",
//     },
//     {
//       booking_id: 18,
//       Provider_Services_id: 3,
//       status: "Pending",
//       service_date: "2026-01-14T22:00:00.000Z",
//       service_time: "11:30:00",
//       payment_method: "cache",
//       address: "Jenin, Area A, West Bank, Palestinian Territories",
//       estimated_time: "1.00",
//     },
//   ],
// };

// const findBestProvider = async (data) => {
//   try {
//     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

//     // Calculate Day of Week
//     const targetDate = new Date(data.cancelledBook.service_date);
//     const days = [
//       "sunday",
//       "monday",
//       "tuesday",
//       "wednesday",
//       "thursday",
//       "friday",
//       "saturday",
//     ];
//     const targetDayOfWeek = days[targetDate.getDay()];

//     const systemPrompt = `
// You are a strict Database Query Engine for a Palestinian Service Booking App. Your task is to find a replacement provider for a cancelled booking.

// ### CRITICAL EXECUTION ORDER (MUST FOLLOW STRICTLY):

// **PHASE 1: SERVICE SEMANTIC MATCHING (PRIMARY FILTER)**
// - Examine the cancelled service: serviceName AND description.
// - Scan 'serviceProviderTable' and cross-reference with 'services' table.
// - For each provider in serviceProviderTable:
//   1. Get their service_id
//   2. Look up that service_id in the 'services' table
//   3. Compare the serviceName and description by MEANING, not exact text match
// - **MATCHING LOGIC:**
//   - Look for services that accomplish the same goal or serve the same purpose
// - **KEEP:** Providers whose service has semantic similarity to the requested service
// - **REJECT:** Providers whose service is completely unrelated in purpose/meaning

// **PHASE 2: CATEGORY VERIFICATION (SECONDARY FILTER)**
// - From providers who passed Phase 1, check their categoryName
// - **PREFERENCE LOGIC:**
//   - **Perfect Match:** Same category as requested (highest priority)
//   - **Related Match:** Similar/complementary category (acceptable)
//   - **Unrelated:** Completely different category (lowest priority, but don't eliminate if service meaning matched in Phase 1)

// **PHASE 3: GEOGRAPHIC PROXIMITY FILTER**
// - Extract the user's city from the cancelled booking address
// - For providers who passed Phases 1 & 2, check their service_location
// - Use West Bank geographic clustering:
//   - **North Cluster:** Jenin, Nablus, Tulkarm, Qalqilya
//   - **Center Cluster:** Ramallah, Al-Bireh, Jerusalem, Jericho (Ariha), Bethlehem, Beit Jala, Beit Sahour
//   - **South Cluster:** Hebron (Al-Khalil), Dura, Yatta
// - **Selection Logic:**
//   1. First Priority: Exact city match
//   2. Second Priority: Same cluster
//   3. Third Priority: Adjacent cluster (North↔Center, Center↔South)
//   4. Fourth Priority: Opposite cluster (North↔South)

// **PHASE 4: AVAILABILITY VERIFICATION (MANDATORY)**
// - For all remaining providers, verify:
//   1. **Schedule Check:** In 'providersSchedules', confirm the provider works on ${targetDayOfWeek} and the requested time falls within their start_time and end_time
//   2. **Holiday Check:** In 'providersHolidays', confirm the provider does NOT have an entry for the requested date
//   3. **Booking Conflict Check:** In 'providersBookings', verify no existing booking conflicts with the requested date and time
// - **ELIMINATE:** Any provider who fails availability check

// **PHASE 5: PRICE OPTIMIZATION (FINAL TIEBREAKER)**
// - Among all providers who passed Phases 1-4, select the one whose base_price is closest to the user's original providerPricePerHour

// ### OUTPUT FORMAT (JSON ONLY):
// {
//   "found": boolean,
//   "best_provider": {
//     "provider_name": "First Last",
//     "service_name_offered_by_provider": "Exact service name from services table",
//     "service_id": number,
//     "service_category": "Category name",
//     "base_price": number,
//     "providerServiceId": number,
//     "scheduled_date": "YYYY-MM-DD",
//     "scheduled_time": "HH:MM:SS",
//   }
// }

// If no provider passes all phases, return:
// {
//   "found": false,
//   "reason": "Detailed explanation of which phase eliminated all candidates"
// }
// `;

//     const userPrompt = `
// Database Content: ${JSON.stringify(data)}

// ### CANCELLED BOOKING DETAILS:
// - **Service Requested:** "${data.cancelledBook.serviceName}"
// - **Service Description Context:** Look up service_id ${data.cancelledBook.service_id} in the services table to understand what the user actually needs
// - **Service Category:** "${data.cancelledBook.categoryName}"
// - **User Location:** "${data.cancelledBook.address}"
// - **Service Date:** ${data.cancelledBook.service_date}
// - **Day of Week:** ${targetDayOfWeek}
// - **Service Time:** ${data.cancelledBook.service_time}
// - **Estimated Duration:** ${data.cancelledBook.estimated_time} hour(s)
// - **Target Price Per Hour:** $${data.cancelledBook.providerPricePerHour}

// ### YOUR TASK:
// Find the best replacement provider using the strict 5-phase filtering process.

// **EXECUTION PRIORITY:**
// 1. SERVICE MEANING (most important - what does the service actually do?)
// 2. CATEGORY (secondary - does it fall under similar work type?)
// 3. LOCATION (third - how close is the provider?)
// 4. AVAILABILITY (mandatory - must be free on the date/time)
// 5. PRICE (final tiebreaker - closest to target price)

// **CRITICAL RULES:**
// - Phase 1 filters by what the service actually DOES, not category labels
// - A provider offering a semantically similar service in a different category is BETTER than a provider in the same category offering an unrelated service
// - Never sacrifice service meaning for location proximity
// - Availability is mandatory - no exceptions

// Begin your analysis now. Work through each phase systematically.
// `;

//     const response = await groq.chat.completions.create({
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt },
//       ],
//       model: "llama-3.1-8b-instant",
//       temperature: 0.0,
//       response_format: { type: "json_object" },
//     });

//     const aiResponse = response.choices[0].message.content;
//     const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
//     const parsed = JSON.parse(cleanJson);
//     console.log(parsed);
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// findBestProvider(data);
