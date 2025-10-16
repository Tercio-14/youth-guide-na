# YouthGuide NA - Backend Setup Guide

This document provides step-by-step instructions for setting up the backend RAG pipeline.

---

## 🏗️ Architecture Overview

```
Frontend (React)
    ↓
Backend API (Express/Node)
    ↓
Firestore (Database)
    ↓
Embedding Model (sentence-transformers)
    ↓
LLM (OpenRouter/HuggingFace)
```

---

## 📦 Backend Structure (To Create)

```
backend/
├── server.js              # Express server
├── functions/
│   ├── chat.js            # POST /api/chat - Main RAG endpoint
│   ├── opportunities.js   # GET /api/opportunities - List/filter
│   └── admin.js           # Admin CRUD endpoints
├── scripts/
│   ├── ingest.js          # Ingest & compute embeddings
│   └── similarity.js      # Cosine similarity utilities
├── utils/
│   ├── firebase.js        # Firebase admin SDK setup
│   ├── embeddings.js      # Embedding computation
│   └── llm.js             # LLM API client
├── .env                   # Environment variables
└── package.json
```

---

## 🚀 Step 1: Initialize Backend

```bash
mkdir backend
cd backend
npm init -y
```

---

## 📦 Step 2: Install Dependencies

```bash
npm install express cors dotenv
npm install firebase-admin
npm install @xenova/transformers  # For embeddings
npm install node-fetch             # For LLM API calls
```

---

## 🔥 Step 3: Firebase Admin Setup

Create `backend/utils/firebase.js`:

```javascript
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
```

**Add to `.env`:**
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Get these from Firebase Console → Project Settings → Service Accounts → Generate New Private Key

---

## 🧠 Step 4: Embeddings Setup

Create `backend/utils/embeddings.js`:

```javascript
const { pipeline } = require('@xenova/transformers');

let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function computeEmbedding(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data); // Convert to array
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = { computeEmbedding, cosineSimilarity };
```

---

## 🤖 Step 5: LLM Client Setup

Create `backend/utils/llm.js`:

```javascript
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.LLM_MODEL || 'mistralai/mistral-7b-instruct:free';

const SYSTEM_PROMPT = `You are "YouthGuide NA" — a local, friendly, respectful assistant for unemployed youth in Havana (Windhoek, Namibia). Always respond in simple, direct Namibian English. Be kind, short, and practical. Use the user's first name when present. Prioritise free or low-cost opportunities. When you mention an opportunity, include: title, cost (free/paid), location (if known), how to contact/apply, and the source. If you are uncertain, admit it and offer next steps (e.g., 'I can check again' or 'Would you like me to save this for you?'). Never ask for sensitive personal details (ID numbers, banking PINs). Respect user privacy: store only first name and general profile. Keep replies under 120 words. End with a simple call-to-action (e.g., 'Would you like me to save this?').`;

async function generateResponse(userProfile, retrievedOpportunities, userMessage) {
  const profileSummary = `User: ${userProfile.firstName}, age ${userProfile.ageBracket}, skills: ${userProfile.skills.join(', ')}, interests: ${userProfile.interests.join(', ')}`;
  
  const retrievalContext = retrievedOpportunities.map((opp, i) => 
    `${i+1}. ${opp.title} - ${opp.source} (${opp.cost}) - Contact: ${opp.contact} - Source: ${opp.source}`
  ).join('\n');

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `USER_PROFILE:\n${profileSummary}\n\nRETRIEVALS:\n${retrievalContext}\n\nUSER_MESSAGE:\n${userMessage}` }
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { generateResponse };
```

---

## 📝 Step 6: Ingest Script

Create `backend/scripts/ingest.js`:

```javascript
const fs = require('fs');
const path = require('path');
const { db } = require('../utils/firebase');
const { computeEmbedding } = require('../utils/embeddings');

async function ingestOpportunities() {
  const dataPath = path.join(__dirname, '../../data/sample_opportunities.json');
  const opportunities = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Ingesting ${opportunities.length} opportunities...`);

  for (const opp of opportunities) {
    const text = `${opp.title} ${opp.description} ${opp.category} ${opp.skillsRequired.join(' ')}`;
    const embedding = await computeEmbedding(text);

    await db.collection('opportunities').add({
      ...opp,
      embedding: embedding,
      createdAt: new Date(),
    });

    console.log(`✓ Ingested: ${opp.title}`);
  }

  console.log('✅ Ingestion complete!');
}

ingestOpportunities().catch(console.error);
```

**Run ingestion:**
```bash
node backend/scripts/ingest.js
```

---

## 🔄 Step 7: Chat Endpoint

Create `backend/functions/chat.js`:

```javascript
const { db } = require('../utils/firebase');
const { computeEmbedding, cosineSimilarity } = require('../utils/embeddings');
const { generateResponse } = require('../utils/llm');

async function handleChat(req, res) {
  try {
    const { userId, message, sessionId } = req.body;

    // 1. Fetch user profile
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userProfile = userDoc.data();

    // 2. Compute query embedding
    const queryEmbedding = await computeEmbedding(message);

    // 3. Retrieve all opportunities (TODO: optimize with location filter)
    const oppSnapshot = await db.collection('opportunities').get();
    const opportunities = oppSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 4. Compute similarities and get top 3
    const scored = opportunities.map(opp => ({
      ...opp,
      similarity: cosineSimilarity(queryEmbedding, opp.embedding),
    }));
    scored.sort((a, b) => b.similarity - a.similarity);
    const topOpportunities = scored.slice(0, 3);

    // 5. Generate LLM response
    const reply = await generateResponse(userProfile, topOpportunities, message);

    // 6. Save chat message
    await db.collection('chats').add({
      userId,
      sessionId,
      messages: [
        { role: 'user', text: message, timestamp: new Date() },
        { role: 'bot', text: reply, timestamp: new Date() },
      ],
    });

    // 7. Return response
    return res.json({
      reply,
      opportunities: topOpportunities.map(opp => ({
        id: opp.id,
        title: opp.title,
        category: opp.category,
        cost: opp.cost,
        source: opp.source,
        contact: opp.contact,
        location: opp.location,
      })),
    });

  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { handleChat };
```

---

## 🖥️ Step 8: Express Server

Create `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { handleChat } = require('./functions/chat');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/chat', handleChat);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## 🧪 Step 9: Test Locally

```bash
cd backend
node server.js
```

Test with curl:
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "message": "I need a free plumbing course",
    "sessionId": "session-1"
  }'
```

---

## 🚢 Step 10: Deploy

### Option A: Vercel Serverless

1. Add `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "backend/server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/server.js" }
  ]
}
```

2. Deploy:
```bash
vercel
```

### Option B: Render

1. Create new Web Service on Render
2. Connect GitHub repo
3. Set:
   - Build command: `cd backend && npm install`
   - Start command: `node backend/server.js`
4. Add environment variables
5. Deploy

---

## 🔐 Security Best Practices

1. **CORS**: Restrict to frontend domain only
2. **Rate Limiting**: Add `express-rate-limit`
3. **Auth**: Verify Firebase tokens on requests
4. **Input Validation**: Sanitize user messages
5. **Environment Variables**: Never commit `.env`

---

## 📊 Monitoring & Logging

Add logging:
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

Track errors:
```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## ✅ Testing Checklist

- [ ] Firebase Admin SDK connected
- [ ] Embedding model loads and computes vectors
- [ ] Ingest script populates Firestore
- [ ] Chat endpoint returns relevant opportunities
- [ ] LLM generates friendly, localized responses
- [ ] CORS allows frontend requests
- [ ] Environment variables secured
- [ ] Deployed and accessible from frontend

---

**Last Updated**: January 2025
