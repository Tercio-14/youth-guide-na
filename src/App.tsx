import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { OfflineProvider } from "./contexts/OfflineContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./utils/debug.js";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Saved from "./pages/Saved";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Demo pages (no auth required)
import DemoLanding from "./pages/demo/DemoLanding";
import DemoAuth from "./pages/demo/DemoAuth";
import DemoChat from "./pages/demo/DemoChat";
import DemoProfile from "./pages/demo/DemoProfile";
import DemoSaved from "./pages/demo/DemoSaved";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OfflineProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Production Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/saved" element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* Demo/Test Routes - No Authentication */}
              <Route path="/demo" element={<DemoLanding />} />
              <Route path="/demo/auth" element={<DemoAuth />} />
              <Route path="/demo/chat" element={<DemoChat />} />
              <Route path="/demo/profile" element={<DemoProfile />} />
              <Route path="/demo/saved" element={<DemoSaved />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </OfflineProvider>
  </QueryClientProvider>
);

export default App;
