# 🧪 Demo Mode - Offline UI/UX Testing

## Overview

Demo Mode is a fully functional, offline-capable version of YouthGuide NA designed for **UI/UX testing and user research**. It requires **no authentication, no database, no LLM**, and works completely offline once loaded.

## Access Demo Mode

### URL to Access Demo:
```
http://localhost:8080/demo
```

## Features

### ✅ What Works in Demo Mode

- **Landing Page** - Full UI with stats and features
- **Auth Page** - Login/signup forms (accepts any credentials)
- **Chat Interface** - Full chat UI with mock AI responses
- **Opportunity Cards** - Display mock job/training/scholarship opportunities
- **Profile Page** - Edit profile form (no data saved)
- **Saved Opportunities** - View mock saved items
- **Navigation** - All links and buttons work
- **Responsive Design** - Mobile and desktop layouts
- **Animations** - All transitions and effects

### ❌ What Doesn't Work (Intentional)

- **Authentication** - No real accounts, any credentials work
- **Data Persistence** - Changes aren't saved
- **Real LLM** - Responses are pre-defined/mocked
- **Database Calls** - All data is mock data
- **External APIs** - No real API calls

## Demo Routes

| Route | Description |
|-------|-------------|
| `/demo` | Demo landing page |
| `/demo/auth` | Demo login/signup page |
| `/demo/chat` | Demo chat interface (main testing page) |
| `/demo/profile` | Demo profile editor |
| `/demo/saved` | Demo saved opportunities |

## Quick Start

### 1. Start Backend (if testing API integration)
```bash
cd youth-guide-na-backend
npm run dev
```

### 2. Start Frontend
```bash
cd youth-guide-na
npm run dev
```

### 3. Open Demo Mode
Navigate to:
```
http://localhost:8080/demo
```

### 4. Test the UI/UX
- Click "Start Demo" or "Try Chat Now"
- Enter any credentials (e.g., demo@test.com / password)
- Interact with the chat interface
- Try quick replies like "Jobs near me", "Free training"
- Navigate between pages using the menu

## User Research Testing

### Testing Scenarios

**Scenario 1: First-time User**
1. Start at `/demo`
2. Click "Start Demo"
3. Use login form (any credentials)
4. Experience first chat interaction
5. Try suggested quick replies

**Scenario 2: Returning User**
1. Start at `/demo/chat`
2. Ask various questions about jobs/training
3. View opportunity cards
4. Navigate to profile
5. Check saved opportunities

**Scenario 3: Mobile Testing**
1. Access on mobile device
2. Test responsive layouts
3. Try typing on mobile keyboard
4. Test menu navigation

### Questions to Ask Users

1. Is the interface intuitive?
2. Can you find what you're looking for easily?
3. Are the quick replies helpful?
4. Do the responses make sense?
5. Is the navigation clear?
6. Would you use this app?

## Mock Data

### Mock Opportunities
- 4 pre-defined opportunities (jobs, training, internships, bursaries)
- Display in chat responses when user asks about opportunities

### Mock Conversations
- 2 previous conversations shown in history
- Welcome message on first load

### Mock Profile
- Pre-filled with demo data
- Editable but not saved

## API Integration

Demo mode uses a separate backend route: `/api/demo/*`

All demo API calls go to mock endpoints that return static data instantly.

### Backend Routes (Auto-created)
- `POST /api/demo/chat` - Mock chat responses
- `GET /api/demo/users/profile` - Mock profile
- `GET /api/demo/opportunities` - Mock opportunities list
- `GET /api/demo/saved` - Mock saved items

## Benefits

### For Developers
- ✅ Test UI without backend
- ✅ Fast iteration on designs
- ✅ No database setup needed
- ✅ Works offline after first load

### For Researchers
- ✅ Show to users without infrastructure
- ✅ No privacy concerns (no real data)
- ✅ Fast and reliable
- ✅ Consistent experience for all test users

### For Demos
- ✅ Show to stakeholders anywhere
- ✅ No connectivity issues
- ✅ Always works
- ✅ Controlled experience

## Differences from Production

| Feature | Production | Demo Mode |
|---------|-----------|-----------|
| Authentication | Firebase Auth | Any credentials |
| Database | Firestore | Mock data in memory |
| LLM | OpenRouter/Ollama | Pre-defined responses |
| User Data | Persistent | Session only |
| API Calls | Real endpoints | Mock endpoints |
| Offline | Needs backend | Fully offline capable |

## Notes

### No Impact on Production
- Demo routes are completely separate
- No shared state with production routes
- No database writes
- No authentication checks

### Visual Indicators
- Yellow banner at top: "🧪 Demo Mode - UI/UX Testing"
- All buttons show "(demo mode)" toast messages
- Footer shows "Demo Mode - UI/UX Testing Only"

### Customization

To change mock data, edit:
- **Backend**: `src/routes/demo.js`
- **Frontend**: `src/config/demo.ts`

## Testing Checklist

- [ ] Landing page loads
- [ ] Auth page accepts any credentials
- [ ] Chat page shows welcome message
- [ ] Can send messages and get responses
- [ ] Quick replies work
- [ ] Opportunity cards display correctly
- [ ] Navigation menu works
- [ ] Profile page loads with demo data
- [ ] Saved page shows mock items
- [ ] All buttons show appropriate feedback
- [ ] Responsive on mobile
- [ ] Works offline (after initial load)

## Sharing Demo Mode

### With Team Members
Share the URL: `http://localhost:8080/demo`
(They need to run the project locally)

### With Remote Users
Deploy to a test server and share:
- Vercel/Netlify: Frontend only (mock backend built-in)
- Or deploy both frontend + backend with demo routes enabled

## Troubleshooting

**Demo page shows 404:**
- Make sure frontend is running
- Check URL is exactly `/demo` (not `/Demo`)

**Mock responses not working:**
- Check backend is running (if using backend mock)
- Check browser console for errors
- Try refreshing the page

**Styling looks broken:**
- Clear browser cache
- Check Tailwind CSS is working
- Verify all component imports

## Future Enhancements

Potential additions to demo mode:
- [ ] More mock conversation scenarios
- [ ] Ability to switch between different user personas
- [ ] Mock notification system
- [ ] Demo of advanced features (filters, search)
- [ ] Analytics tracking for user testing

---

**Ready to test?** Open `http://localhost:8080/demo` and start exploring! 🚀
