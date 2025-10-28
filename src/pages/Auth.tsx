import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageCircle, Mail, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();
  const { isOffline } = useOffline();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    // Clear any existing errors and provide helpful feedback
    if (isLogin) {
      toast.info("💡 Switching to registration - join thousands of young people getting guidance!");
    } else {
      toast.info("👋 Welcome back! Enter your credentials to continue.");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFirebaseErrorMessage = (errorCode: string, isLogin: boolean) => {
    const errorMessages = {
      // Authentication errors
      'auth/user-not-found': `📧 No account found with this email address. ${!isLogin ? '' : 'Try creating a new account instead.'}`,
      'auth/wrong-password': '🔑 Incorrect password. Double-check your password or try signing in with Google.',
      'auth/invalid-email': '✉️ Please enter a valid email address (e.g., name@example.com).',
      'auth/user-disabled': '🚫 This account has been disabled. Please contact our support team.',
      'auth/too-many-requests': '⏰ Too many failed attempts. Please wait a few minutes before trying again.',
      'auth/invalid-credential': '🔐 Invalid login credentials. Please double-check your email and password.',
      
      // Registration errors
      'auth/email-already-in-use': `📝 An account with this email already exists. ${isLogin ? '' : 'Try signing in instead.'}`,
      'auth/weak-password': '💪 Password should be at least 6 characters long. Try adding numbers or symbols.',
      'auth/operation-not-allowed': '⚙️ Email/password registration is temporarily disabled. Try Google sign-in or contact support.',
      
      // Google sign-in errors
      'auth/popup-closed-by-user': '❌ Sign-in was cancelled. Click "Continue with Google" to try again.',
      'auth/popup-blocked': '🚫 Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.',
      'auth/cancelled-popup-request': '⏸️ Sign-in was cancelled. Please try again.',
      'auth/account-exists-with-different-credential': '🔄 This email is already registered with a different sign-in method. Try signing in with your original method.',
      
      // Network errors
      'auth/network-request-failed': '🌐 Network error. Please check your internet connection and try again.',
      'auth/timeout': '⏱️ Request timed out. Please check your connection and try again.',
      
      // General errors
      'auth/internal-error': '🔧 Something went wrong on our end. Please try again in a moment.',
    };

    return errorMessages[errorCode] || `❗ ${isLogin ? 'Sign in' : 'Registration'} failed. Please try again or contact support if the problem persists.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        toast.success("Welcome back! Ready to get guidance?");
        navigate("/chat");
      } else {
        await register(email, password);
        toast.success("🎉 Account created successfully! Let's set up your profile.");
        navigate("/profile");
      }
    } catch (error) {
      console.error('Auth error:', error);
      
      const errorMessage = getFirebaseErrorMessage(error.code, isLogin);
      toast.error(errorMessage);
      
      // Provide helpful suggestions for common issues
      if (error.code === 'auth/user-not-found' && isLogin) {
        setTimeout(() => {
          toast.info('💡 Tip: If you signed up with Google, try the Google sign-in button instead.');
        }, 2000);
      } else if (error.code === 'auth/email-already-in-use' && !isLogin) {
        setTimeout(() => {
          toast.info('💡 Tip: Click "Sign in" below if you already have an account.');
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      await loginWithGoogle();
      toast.success("Welcome! You've successfully signed in with Google.");
      navigate("/chat");
    } catch (error) {
      console.error('Google sign-in error:', error);
      
      const errorMessage = getFirebaseErrorMessage(error.code, true);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4 relative">
      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md p-8 shadow-medium">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-warm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold">YouthGuide NA</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back!" : "Create your free account"}
          </p>
        </div>

        {/* Offline Mode Alert */}
        {isOffline && (
          <Alert variant="warning" className="mb-6">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">You're currently offline</p>
                <p className="text-sm">
                  Authentication requires an internet connection. 
                  If you were previously logged in, you can still access the chat with cached data.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/chat')}
                >
                  Continue to Chat (Offline Mode)
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
            {!isLogin && (
              <div className="text-xs text-muted-foreground">
                <p>Password must be at least 6 characters</p>
                {password && (
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            password.length < 6 ? 'bg-red-500 w-1/3' :
                            password.length < 8 ? 'bg-yellow-500 w-2/3' :
                            'bg-green-500 w-full'
                          }`}
                        />
                      </div>
                    </div>
                    <span className={`text-xs ${
                      password.length < 6 ? 'text-red-500' :
                      password.length < 8 ? 'text-yellow-500' :
                      'text-green-500'
                    }`}>
                      {password.length < 6 ? 'Weak' :
                       password.length < 8 ? 'Good' :
                       'Strong'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-warm" 
            disabled={loading || isOffline}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {isLogin ? "Signing in..." : "Creating account..."}
              </span>
            ) : isOffline ? (
              <span className="flex items-center">
                <WifiOff className="mr-2 h-4 w-4" />
                Authentication Unavailable Offline
              </span>
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleSignIn}
            disabled={loading || isOffline}
          >
            {loading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            ) : isOffline ? (
              <WifiOff className="mr-2 h-4 w-4" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            {loading ? "Connecting..." : isOffline ? "Unavailable Offline" : "Continue with Google"}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleModeSwitch}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={loading}
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="font-semibold text-primary">
              {isLogin ? "Sign up" : "Sign in"}
            </span>
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="mb-2 font-semibold">Your Privacy Matters:</p>
          <ul className="space-y-1 text-xs">
            <li>✓ We only store your first name and preferences</li>
            <li>✓ No ID numbers or sensitive details required</li>
            <li>✓ You can delete your data anytime</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
