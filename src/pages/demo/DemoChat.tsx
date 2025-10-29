/**
 * Demo Chat Page
 * Simplified version for offline UI/UX testing with mock data
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Bookmark, Menu, User, LogOut, PlusSquare, Send, Bot, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { demoApi } from "@/config/demo";
import { VoiceToggle } from "@/components/VoiceToggle";
import { tts, speakPageWelcome } from "@/utils/tts";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  opportunities?: Array<{
    id: string;
    title: string;
    type: string;
    organization?: string;
    location?: string;
    description?: string;
    url?: string;
  }>;
}

const DemoChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome-1",
      role: "assistant",
      content: "Hi! I'm YouthGuide NA. I can help you find job opportunities, training programs, and scholarships in Namibia. What are you looking for today?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message after a short delay
    setTimeout(() => {
      speakPageWelcome('demoChatWelcome');
    }, 1000);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await demoApi.sendMessage(inputText, conversationId);
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.response,
        timestamp: response.timestamp,
        opportunities: response.opportunities
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response with opportunity titles
      if (tts.isEnabled()) {
        let speechText = response.response;
        if (response.opportunities && response.opportunities.length > 0) {
          speechText += ". I found the following opportunities: ";
          speechText += response.opportunities.map((opp: { title: string }) => opp.title).join(". ");
        }
        tts.speak(speechText);
      }
      
      toast.success("Response received (demo mode)");
    } catch (error) {
      console.error("Demo chat error:", error);
      toast.error("Failed to send message (demo mode)");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const startNewConversation = () => {
    setMessages([{
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Starting a new conversation! What would you like to explore today?",
      timestamp: new Date().toISOString()
    }]);
    setConversationId("");
    toast.info("New conversation started (demo mode)");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-hero">
      {/* Banner */}
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-b border-yellow-300 dark:border-yellow-700 py-2 text-center">
        <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
          🧪 <strong>Demo Mode</strong> - UI/UX Testing | Mock responses only
        </p>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-bold mb-6">Menu (Demo)</h2>
                
                <nav className="flex-1 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      startNewConversation();
                      setIsMenuOpen(false);
                    }}
                  >
                    <PlusSquare className="mr-2 h-4 w-4" />
                    New Conversation
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/demo/profile");
                      setIsMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/demo/saved");
                      setIsMenuOpen(false);
                    }}
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Opportunities
                  </Button>
                </nav>

                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      toast.info("Logging out (demo mode)");
                      navigate("/demo");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Exit Demo
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-lg font-semibold">YouthGuide NA</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <VoiceToggle />
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
          >
            <PlusSquare className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        style={{
          background: `linear-gradient(to bottom, hsl(var(--chat-bg)), hsl(var(--muted)))`,
          backgroundImage: `
            linear-gradient(to bottom, hsl(var(--chat-bg)), hsl(var(--muted))),
            radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, hsl(var(--primary) / 0.02) 0%, transparent 50%),
            radial-gradient(hsl(var(--muted-foreground) / 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 40px 40px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <Card
              className={`max-w-[80%] p-4 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border-border"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.opportunities && message.opportunities.length > 0 && (
                <div className="mt-4 space-y-2">
                  {message.opportunities.map((opp) => (
                    <Card key={opp.id} className="p-3 bg-muted border-border">
                      <h4 className="font-semibold text-sm text-foreground">{opp.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {opp.type}
                        </span>
                        {opp.location && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded border border-border">
                            📍 {opp.location}
                          </span>
                        )}
                      </div>
                      {opp.organization && (
                        <p className="text-xs text-muted-foreground mt-1">
                          🏢 {opp.organization}
                        </p>
                      )}
                      {opp.description && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {opp.description.substring(0, 100)}...
                        </p>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => toast.info("View details (demo mode)")}
                      >
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-4 bg-card border-border">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto bg-card border-t border-border">
          {["Jobs near me", "Free training", "Internships", "Scholarships", "Make money"].map((text) => (
            <Button
              key={text}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(text)}
              className="whitespace-nowrap"
            >
              {text}
            </Button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border bg-card px-4 py-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about jobs, training, scholarships..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Demo Mode - All responses are mocked for UI/UX testing
        </p>
      </div>
    </div>
  );
};

export default DemoChat;
