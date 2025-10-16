# YouthGuide NA

> A free, trustworthy RAG-powered chatbot connecting unemployed youth in Havana (Windhoek, Namibia) to verified local opportunities.

![YouthGuide NA](https://img.shields.io/badge/Status-MVP-orange) ![License](https://img.shields.io/badge/License-Research-blue)

## 🎯 Project Overview

YouthGuide NA is a mobile-first chatbot designed through participatory research with youth in Windhoek. It uses Retrieval-Augmented Generation (RAG) to provide personalized, friendly guidance to jobs, free training, short courses, and community events — all verified and local.

**Key Features:**
- 🤖 RAG-powered chat using local embeddings + open LLM
- 📱 Mobile-first WhatsApp-style UI
- 🔒 Privacy-first: minimal PII, opt-in consent
- 💸 100% free-tier compatible (Firebase, Vercel, OpenRouter)
- 🎨 Youth-oriented design (Namibian warmth & accessibility)
- 📊 Built-in analytics for research evaluation

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite) + TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **React Router** for navigation

### Backend (To Be Implemented)
- **Node.js + Express** (or Next.js API routes)
- **Firebase Firestore** for database & auth
- **sentence-transformers** for embeddings (all-MiniLM-L6-v2)
- **OpenRouter** or **Hugging Face** for LLM (free models)

### Hosting
- **Frontend**: Vercel (free tier)
- **Backend**: Render free tier or Vercel serverless functions
- **Database**: Firebase Firestore (free tier)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- Firebase account (free)
- OpenRouter or Hugging Face API key (optional for LLM)

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd youthguide-na
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials (see `.env.example` for required variables).

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:8080` to see the app.

---

## 📁 Project Structure

```
youthguide-na/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Main app pages
│   │   ├── Landing.tsx   # Landing page
│   │   ├── Auth.tsx      # Login/Signup
│   │   ├── Profile.tsx   # User profile setup
│   │   ├── Chat.tsx      # Main chat interface
│   │   ├── Saved.tsx     # Saved opportunities
│   │   └── Admin.tsx     # Admin panel (add opportunities)
│   ├── index.css         # Design system & Tailwind config
│   └── App.tsx           # Main app & routing
├── backend/              # (TO CREATE) Backend API
│   ├── functions/        # Edge functions
│   ├── scripts/          # Utility scripts
│   │   └── ingest.js     # Ingest & compute embeddings
│   └── server.js         # Express server
├── data/                 # (TO CREATE) Sample data
│   └── sample_opportunities.json
├── .env.example          # Environment variables template
└── README.md             # This file
```

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project: `youthguide-na`
3. Enable **Firestore Database** (Start in production mode, then add security rules)
4. Enable **Authentication** > Email/Password

### 2. Get Firebase Credentials

1. Go to Project Settings > General
2. Scroll to "Your apps" > Add web app
3. Copy the Firebase config object
4. Add to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Add these rules to Firestore to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Everyone can read opportunities (public data)
    match /opportunities/{oppId} {
      allow read: if true;
      allow write: if request.auth != null; // TODO: Add admin role check
    }
  }
}
```

---

## 🤖 RAG Pipeline (To Be Implemented)

### Data Model

**Firestore Collections:**

1. **users**
   - `id` (uid)
   - `firstName`
   - `ageBracket` (16-20, 21-25, etc.)
   - `skills` (array)
   - `interests` (array)
   - `createdAt`

2. **opportunities**
   - `id`
   - `title`
   - `category` (job/training/education/volunteer)
   - `description`
   - `skillsRequired` (array)
   - `cost` (free/paid)
   - `location`
   - `contact`
   - `source` (organization)
   - `datePosted`
   - `embedding` (vector array - 384 dimensions for all-MiniLM-L6-v2)

3. **chats**
   - `id`
   - `userId`
   - `sessionId`
   - `messages` (array of `{ role, text, timestamp }`)

### Embedding & Retrieval

1. **Ingest Script** (`backend/scripts/ingest.js`):
   - Read `data/sample_opportunities.json`
   - Compute embeddings using `sentence-transformers` (all-MiniLM-L6-v2)
   - Store in Firestore with vector

2. **Query Flow** (`/api/chat`):
   - User sends message
   - Compute query embedding
   - Retrieve top 3 opportunities by cosine similarity
   - Construct LLM prompt with user profile + retrieved opportunities
   - Call OpenRouter/HF API
   - Return response + opportunities to frontend

### LLM System Prompt

```
System: You are "YouthGuide NA" — a local, friendly, respectful assistant for unemployed youth in Havana (Windhoek, Namibia). Always respond in simple, direct Namibian English. Be kind, short, and practical. Use the user's first name when present. Prioritise free or low-cost opportunities. When you mention an opportunity, include: title, cost (free/paid), location (if known), how to contact/apply, and the source. If you are uncertain, admit it and offer next steps (e.g., 'I can check again' or 'Would you like me to save this for you?'). Never ask for sensitive personal details (ID numbers, banking PINs). Respect user privacy: store only first name and general profile. Keep replies under 120 words. End with a simple call-to-action (e.g., 'Would you like me to save this?').
```

---

## 📊 Sample Data

Create `data/sample_opportunities.json` with 10-20 entries:

```json
[
  {
    "title": "Plumbing Apprenticeship",
    "category": "training",
    "description": "Learn basic plumbing skills over 6 weeks. No experience needed.",
    "skillsRequired": [],
    "cost": "free",
    "location": "Havana, Windhoek",
    "contact": "081234567",
    "source": "City Youth Desk",
    "datePosted": "2025-01-05"
  },
  {
    "title": "ICT Short Course",
    "category": "training",
    "description": "Weekend ICT classes covering basic computer skills.",
    "skillsRequired": [],
    "cost": "free",
    "location": "NUST Campus",
    "contact": "WhatsApp 081987654",
    "source": "NUST Outreach",
    "datePosted": "2025-01-08"
  }
]
```

Run ingestion:

```bash
node backend/scripts/ingest.js
```

---

## 🔐 Privacy & Ethics

YouthGuide NA follows strict privacy principles:

- **Minimal PII**: Only first name, age bracket, skills, interests
- **Opt-in Consent**: Clear consent popup on first use
- **No Sensitive Data**: No ID numbers, bank details, health info
- **Anonymized Logs**: Store hashed userId for analytics
- **Data Deletion**: Users can delete all their data from settings

---

## 🧪 Testing

### In-Field Testing Plan

1. **Recruit**: 10 youth from participatory workshops
2. **Tasks**: 
   - Find a free training program
   - Find a part-time job
   - Save an opportunity
   - Ask for help
3. **Metrics**:
   - Success rate per task
   - Time to complete
   - Satisfaction (1-5 scale)
   - Trustworthiness rating
4. **Qualitative**: Open-ended feedback on tone, helpfulness

### Unit Tests (To Add)

```bash
npm run test
```

Test coverage:
- Embedding computation
- Cosine similarity retrieval
- LLM prompt construction
- UI message rendering

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env`
4. Deploy

### Backend (Render)

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `node backend/server.js`
5. Add environment variables

---

## 🎨 Design System

**Colors:**
- Primary: Warm sunset orange (hsl(18 85% 55%))
- Secondary: Turquoise (hsl(175 65% 45%))
- Accent: Coral (hsl(15 75% 62%))

**Typography:**
- Clear, readable sans-serif
- Large touch targets (min 44px)
- Mobile-first layout

**Accessibility:**
- High contrast
- Screen reader friendly
- Low-bandwidth optimized

---

## 📝 TODO / Roadmap

### Phase 1: MVP (Current)
- [x] Frontend UI (Landing, Auth, Profile, Chat, Saved, Admin)
- [x] Design system with Namibian warmth
- [ ] Firebase Auth integration
- [ ] Firestore setup
- [ ] Sample data ingestion

### Phase 2: RAG Pipeline
- [ ] Backend API (`/api/chat`)
- [ ] Embedding script (sentence-transformers)
- [ ] Vector retrieval (cosine similarity)
- [ ] LLM integration (OpenRouter/HF)
- [ ] Personalization using user profile

### Phase 3: Features
- [ ] Save opportunities (persistent)
- [ ] Share via WhatsApp/SMS
- [ ] Admin bulk import (CSV/JSON)
- [ ] Analytics dashboard
- [ ] Offline fallback

### Phase 4: Evaluation
- [ ] In-field testing with 10 youth
- [ ] Collect metrics (success rate, satisfaction)
- [ ] Bias audit (gender, age)
- [ ] Iterate based on feedback

---

## 🤝 Contributing

This is a research project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

This project is for research purposes. Data and code are owned by the research team.

---

## 📞 Contact

For questions or feedback:
- **Researcher**: [Your Email]
- **Support**: [Local Youth Desk Contact]

---

## 🙏 Acknowledgments

Built with input from youth in Havana, Windhoek. Special thanks to:
- City Youth Desk
- NUST Outreach
- Community organizations in Windhoek

---

**Last Updated**: January 2025
