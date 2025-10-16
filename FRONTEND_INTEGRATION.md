# YouthGuide NA - Frontend Integration Guide

This guide explains how to integrate Firebase Auth and the backend RAG API into the React frontend.

---

## 🔥 Firebase Auth Integration

### Step 1: Install Firebase SDK

```bash
npm install firebase
```

### Step 2: Create Firebase Config

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Step 3: Update Auth.tsx

```typescript
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
        navigate("/chat");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created!");
        navigate("/profile");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### Step 4: Add Auth Context

Create `src/contexts/AuthContext.tsx`:

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Wrap App in `src/main.tsx`:

```typescript
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Step 5: Protected Routes

Create `src/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};
```

Update routes in `App.tsx`:

```typescript
<Route path="/chat" element={
  <ProtectedRoute>
    <Chat />
  </ProtectedRoute>
} />
```

---

## 💬 Chat API Integration

### Step 1: Create API Client

Create `src/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendChatMessage(
  userId: string,
  message: string,
  sessionId: string
) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, message, sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
}
```

### Step 2: Update Chat.tsx

```typescript
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { sendChatMessage } from "@/lib/api";
import { toast } from "sonner";

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([...]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sessionId = useState(() => `session-${Date.now()}`)[0];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await sendChatMessage(user.uid, text, sessionId);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: response.reply,
        timestamp: new Date(),
        opportunities: response.opportunities,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  // ... rest of component
};
```

---

## 👤 Profile Management

### Update Profile.tsx

```typescript
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  // ... state variables

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!firstName || !ageBracket || skills.length === 0 || interests.length === 0) {
      toast.error("Please complete all sections");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        ageBracket,
        skills,
        interests,
        createdAt: new Date(),
      });

      toast.success(`Welcome, ${firstName}! Let's find opportunities for you.`);
      navigate("/chat");
    } catch (error) {
      toast.error("Failed to save profile");
      console.error(error);
    }
  };

  // ... rest of component
};
```

---

## 💾 Saved Opportunities

### Create Saved Opportunities Hook

Create `src/hooks/useSavedOpportunities.ts`:

```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export function useSavedOpportunities() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'saved_opportunities'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSaved(items);
    });

    return unsubscribe;
  }, [user]);

  const saveOpportunity = async (opportunity: any) => {
    if (!user) return;

    await addDoc(collection(db, 'saved_opportunities'), {
      userId: user.uid,
      ...opportunity,
      savedAt: new Date(),
    });
  };

  const unsaveOpportunity = async (id: string) => {
    await deleteDoc(doc(db, 'saved_opportunities', id));
  };

  return { saved, saveOpportunity, unsaveOpportunity };
}
```

### Update Chat.tsx to Include Save Button

```typescript
const { saveOpportunity } = useSavedOpportunities();

// In opportunity card:
<Button 
  size="sm" 
  variant="outline" 
  className="w-full"
  onClick={() => {
    saveOpportunity(opp);
    toast.success("Saved!");
  }}
>
  <Bookmark className="mr-1 h-3 w-3" /> Save This
</Button>
```

---

## 🔒 Firestore Security Rules

Update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Saved opportunities
    match /saved_opportunities/{savedId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Opportunities (public read)
    match /opportunities/{oppId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 🎨 Environment Variables

Add to `.env`:

```env
# Frontend
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend URL
VITE_API_URL=https://your-backend.render.com
```

---

## ✅ Integration Checklist

- [ ] Firebase SDK installed
- [ ] Firebase config added
- [ ] Auth context created
- [ ] Protected routes implemented
- [ ] Profile saving to Firestore
- [ ] Chat API integration
- [ ] Save opportunities hook
- [ ] Security rules configured
- [ ] Environment variables set

---

**Last Updated**: January 2025
