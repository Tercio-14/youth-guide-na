# YouthGuide NA — Frontend

React/TypeScript web application for the YouthGuide NA platform. Provides an AI-powered chat interface for youth to discover opportunities (jobs, training, education, volunteer programs) in Namibia, with profile management, saved bookmarks, and an admin panel.

---

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build tool**: Vite
- **Routing**: React Router v6
- **UI components**: shadcn/ui + Tailwind CSS
- **Authentication**: Firebase Auth (Google sign-in + email/password)
- **Backend API**: YouthGuide NA Backend (REST + Firebase ID token auth)
- **State management**: React Context (AuthContext, OfflineContext)

---

## Prerequisites

- Node.js 20 or higher
- A running instance of the YouthGuide NA backend
- Firebase project with Authentication enabled (Google provider + Email/Password)

---

## Installation

```bash
git clone https://github.com/your-org/youth-guide-na.git
cd youth-guide-na
npm install
cp .env.example .env
# Edit .env with your Firebase config and backend URL
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. All variables must be prefixed with `VITE_` to be exposed to the browser.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g., `http://localhost:3001/api`) |
| `VITE_FIREBASE_API_KEY` | Firebase web app API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID (optional) |

Get these values from Firebase Console under **Project Settings > Your apps > Web app**.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on `http://localhost:5173` |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
  components/
    ui/               shadcn/ui primitives
    chat/             Chat input, typing indicator, suggested actions
    AdminRoute.jsx    Route guard: redirects non-admins to /chat
    ProtectedRoute.jsx Route guard: redirects unauthenticated to /auth
    ThemeToggle.tsx   Light/dark theme switcher
  contexts/
    AuthContext.jsx   Firebase auth state, token, isAdmin flag
    OfflineContext.jsx Offline mode toggle
  pages/
    Landing.tsx       Public landing page
    Auth.tsx          Sign-in / sign-up page
    Chat.tsx          Main AI chat interface
    Profile.tsx       User profile editing
    Saved.tsx         Saved opportunities list
    Admin.tsx         Admin panel (stats, add opportunity, user management)
    demo/             Demo mode pages (no auth required)
  config/
    firebase.js       Firebase client SDK initialization
  utils/
    api.js            HTTP client (get/post/put/patch/delete with auth header)
  App.tsx             Route definitions
```

---

## Authentication

The app uses Firebase Authentication. Supported sign-in methods:

- Google (OAuth)
- Email / password

On sign-in, `AuthContext` calls `getIdTokenResult()` to read the `admin` custom claim from the token. The `isAdmin` flag is exposed throughout the app via context. Admin access is granted by setting the `admin: true` custom claim via the backend's `PUT /api/admin/users/:uid` endpoint.

Protected pages (`/chat`, `/profile`, `/saved`) redirect to `/auth` if the user is not signed in. The `/admin` route additionally redirects non-admin users to `/chat`.

---

## Deployment Notes

- Set `VITE_API_URL` to your production backend URL.
- Run `npm run build` and serve the `dist/` directory from any static host (Firebase Hosting, Vercel, Netlify, etc.).
- Firebase Hosting requires a `firebase.json` rewrite rule to serve `index.html` for all routes (single-page app).
- Do not commit `.env` to source control. Only `.env.example` should be committed.
