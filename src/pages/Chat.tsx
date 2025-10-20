import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Bookmark, Menu, User, MessageCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";
import { toast } from "sonner";
import { AnimatedMessage } from "@/components/chat/AnimatedMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ModernInput } from "@/components/chat/ModernInput";
import { SuggestedActions } from "@/components/chat/SuggestedActions";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  opportunities?: Opportunity[];
}

interface Opportunity {
  id: string;
  title: string;
  category: string;
  cost: string;
  source: string;
  contact: string;
}

const QUICK_REPLIES = [
  { text: "Jobs near me", icon: "💼" },
  { text: "Free training", icon: "📚" },
  { text: "Make money fast", icon: "💰" },
  { text: "Learn online", icon: "💻" },
  { text: "Part-time work", icon: "⏰" }
];

const Chat = () => {
  const navigate = useNavigate();
  const { user, token, userProfile, logout } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => {
    // Generate new conversation ID on component mount
    const newId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log('🆔 [Chat] Generated new conversation ID:', newId);
    return newId;
  });

  console.log('💬 [Chat] Component mounted', {
    hasUser: !!user,
    hasToken: !!token,
    hasProfile: !!userProfile,
    userEmail: user?.email,
    profileName: userProfile?.firstName,
    timestamp: new Date().toISOString()
  });

  // Initialize chat with personalized welcome message
  useEffect(() => {
    console.log('🎯 [Chat] Initializing chat with welcome message');
    
    const firstName = userProfile?.firstName || user?.displayName || 'there';
    const welcomeMessage: Message = {
      id: "welcome-" + Date.now(),
      role: "bot",
      text: `Hi ${firstName}! I'm YouthGuide NA. I can help you find job opportunities, training programs, and resources in Namibia. What are you looking for today?`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    console.log('✅ [Chat] Welcome message set', {
      firstName,
      messageId: welcomeMessage.id
    });
  }, [userProfile, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) {
      console.warn('⚠️ [Chat] Empty message attempted');
      return;
    }

    console.log('📝 [Chat] Sending message', {
      message: text,
      conversationId,
      hasToken: !!token,
      hasProfile: !!userProfile,
      userId: user?.uid
    });

    if (!token) {
      console.error('❌ [Chat] No authentication token available');
      toast.error("Please log in to continue chatting");
      navigate("/auth");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    console.log('🔄 [Chat] Starting chat API call...');

    try {
      const chatData = {
        message: text,
        conversationId,
        context: {
          skills: userProfile?.skills || [],
          interests: userProfile?.interests || [],
          ageBracket: userProfile?.ageBracket,
          firstName: userProfile?.firstName
        }
      };

      console.log('📤 [Chat] Sending chat request with context', chatData);

      const response = await apiClient.post('/chat', chatData, token);
      
      console.log('✅ [Chat] Received chat response', {
        hasResponse: !!response.response,
        hasOpportunities: !!response.opportunities,
        opportunityCount: response.opportunities?.length || 0,
        conversationId: response.conversationId
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: response.response || "I'm sorry, I couldn't generate a response right now. Please try again.",
        timestamp: new Date(),
        opportunities: response.opportunities || []
      };

      setMessages((prev) => [...prev, botMessage]);
      
      console.log('💬 [Chat] Bot message added to conversation', {
        messageId: botMessage.id,
        opportunityCount: botMessage.opportunities?.length || 0
      });

    } catch (error) {
      console.error('💥 [Chat] Chat API call failed', {
        error: error.message,
        stack: error.stack,
        message: text,
        hasToken: !!token,
        userId: user?.uid
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error("Chat service temporarily unavailable");
    } finally {
      setIsTyping(false);
      console.log('🏁 [Chat] Message handling completed');
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    console.log('🚪 [Chat] Logout requested from menu');
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/auth");
    } catch (error) {
      console.error('💥 [Chat] Logout failed from menu', error);
      toast.error("Unable to log out. Please try again.");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-xs">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Signed in as</p>
                    <p className="font-semibold">{userProfile?.firstName || user?.email}</p>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start gap-3" onClick={() => handleNavigate("/chat")}>
                      <MessageCircle className="h-4 w-4" /> Continue Chatting
                    </Button>
                    <Button variant="ghost" className="justify-start gap-3" onClick={() => handleNavigate("/saved")}>
                      <Bookmark className="h-4 w-4" /> Saved Opportunities
                    </Button>
                    <Button variant="ghost" className="justify-start gap-3" onClick={() => handleNavigate("/profile")}>
                      <User className="h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="destructive" className="justify-start gap-3" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" /> Log out
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">YouthGuide NA</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/saved")}>
              <Bookmark className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4" 
        style={{
          backgroundColor: 'hsl(var(--chat-pattern-bg))',
          opacity: 0.95,
          backgroundImage: `
            radial-gradient(circle, transparent 20%, hsl(var(--chat-pattern-bg)) 20%, hsl(var(--chat-pattern-bg)) 80%, transparent 80%, transparent),
            radial-gradient(circle, transparent 20%, hsl(var(--chat-pattern-bg)) 20%, hsl(var(--chat-pattern-bg)) 80%, transparent 80%, transparent),
            linear-gradient(hsl(var(--chat-pattern-color)) 2px, transparent 2px),
            linear-gradient(90deg, hsl(var(--chat-pattern-color)) 2px, hsl(var(--chat-pattern-bg)) 2px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px',
          backgroundPosition: '0 0, 25px 25px, 0 -1px, -1px 0'
        }}
      >
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message, index) => (
            <AnimatedMessage 
              key={message.id} 
              role={message.role}
              text={message.text}
              timestamp={message.timestamp}
              opportunities={message.opportunities}
              isLast={index === messages.length - 1}
            />
          ))}

          {isTyping && <TypingIndicator />}
          
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && (
        <div className="border-t border-border bg-card px-4 py-2">
          <div className="mx-auto max-w-3xl">
            <SuggestedActions 
              suggestions={QUICK_REPLIES}
              onSelect={handleQuickReply}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="mx-auto max-w-3xl">
          <ModernInput 
            value={inputText}
            onChange={setInputText}
            onSend={() => handleSendMessage(inputText)}
            disabled={isTyping}
            placeholder="Ask me anything..."
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
