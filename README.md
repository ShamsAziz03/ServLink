# 🚀 ServLink — Your Smart Service Connection App

ServLink is a comprehensive **mobile-first ecosystem** designed to bridge the gap between customers and trusted local professionals. Whether it's home maintenance, cleaning, IT support, or tutoring, ServLink simplifies the entire process:

**Search 🔍 → Book 📅 → Get the job done ⚡**

## [Check Report and Demo](https://drive.google.com/drive/folders/1s_GM9Vlp9CZtCL9VTXheOtBBxZ9tdx7w?usp=sharing)
---

## 🧩 Overview

Built for speed, clarity, and real-world usability, ServLink transforms traditional service hunting into a seamless digital experience. Unlike niche apps, ServLink connects all service types under one unified ecosystem, empowering both customers and service providers through data-driven decisions.

---
## 💡 Technology Stack

### 📱 Frontend & Mobile

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React](https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Native Paper](https://img.shields.io/badge/React_Native_Paper-6200EE?style=for-the-badge&logo=react&logoColor=white)

### ⚙️ Backend & AI

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_SDK-F55036?style=for-the-badge&logo=groq&logoColor=white)

### 🔌 Integrations & Libraries

![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google_Maps_API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)
![Expo Notifications](https://img.shields.io/badge/Expo_Notifications-000020?style=for-the-badge&logo=expo&logoColor=white)
![Fuse.js](https://img.shields.io/badge/Fuse.js-000000?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

---


## 🎯 Key Problem Solved

Finding verified professionals with real-time availability is often fragmented and frustrating. ServLink solves this by providing:

- **Unified Platform** — All service categories in one place.
- **Mobile-First Design** — Optimized for on-the-go requests and real-time navigation for providers.
- **AI-Driven Reliability** — Smart matching and automated fallback systems to ensure services are never interrupted.

---

## 🧠 AI Core: The Intelligence of ServLink

The project integrates advanced Large Language Models (LLMs) like **Llama 4**, **Llama 3.1**, and **GPT-OSS** via the **Groq SDK** to power its most innovative features:

- 🤖 **AI Service Provider Matcher** — Analyzes natural language descriptions from users to find the best provider based on a multi-dimensional matrix (Specialization, Price, Location, and Availability).
- 🔄 **Automated Re-booking Backup** — If a provider cancels an accepted booking, the AI triggers a 5-phase semantic match to automatically find and book a replacement, ensuring the customer is never left stranded.
- ⏱️ **AI Task Duration Estimator** — Predicts the required hours for a task based on user answers to context-specific questions and historical data.
- 💡 **Smart Recommendation Engine** — Builds a user persona from booking history and interests to suggest the top 5 services they are most likely to need next.
- 📊 **Provider Performance Insights** — Offers data-backed advice to professionals, suggesting price adjustments or geographic expansions based on market trends.

---

## 👥 User Roles & Detailed Features

### 🧑‍💼 Customer (User)

- **Smart Search & Filter** — Find services by category, keyword, price, or rating.
- **Interactive Booking** — Select dates and times via a real-time calendar that syncs with provider availability.
- **Multi-Mode Payments** — Secure transactions via Stripe API or traditional Cash.
- **Feedback System** — Rate services and write reviews to maintain platform quality.

### 🛠️ Service Provider

- **Professional Portfolio** — Manage certifications, work photos, and service areas.
- **Availability Management** — Set weekly working hours and mark "Unavailable Dates" (holidays/emergencies) to prevent conflicts.
- **In-App Wallet** — Track earnings, platform commissions, and manage debts for cash transactions.
- **Booking Timer** — A real-time timer to track actual work duration for accurate billing.

### 🧑‍💻 Administrator

- **Web Dashboard** — Monitor global metrics including total users, active providers, revenue, and bookings.
- **Provider Verification** — Review and approve/reject professional registrations.
- **AI Content Tools** — Generate smart category descriptions and professional provider summaries.

---

## 🚀 Setup and Installation

### Prerequisites

- Node.js 
- Expo CLI
- MySQL Server

### Backend Setup

```bash
cd backend
npm install
# Create a .env file with your DB credentials, Stripe keys, and Groq API key
npm run dev
```

### App Setup

```bash
cd root
npm install
npx expo start
```

---

## 📅 Future Enhancements

- 🌐 **Multi-language Support** — Full localization for Arabic and English.
- 💬 **Real-time Chat** — Direct in-app messaging between users and providers.
- 🔍 **Enhanced Verification** — Advanced background checks for providers.

---

## ❤️ Final Note

ServLink is more than an app; it is a **smart infrastructure for the local labor market**, built to make daily life simpler, faster, and more reliable. ⚡
