import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement Firebase Auth
    // For now, simulate successful auth and navigate to profile setup
    toast.success(isLogin ? "Welcome back!" : "Account created!");
    
    if (isLogin) {
      navigate("/chat");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email or Phone</Label>
            <Input
              id="email"
              type="text"
              placeholder="your@email.com or 081234567"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-warm">
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground"
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
