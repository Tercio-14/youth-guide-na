import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bookmark, Menu, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  "Jobs near me",
  "Free training",
  "Make money fast",
  "Learn online",
  "Part-time work"
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi Tafeni — I'm YouthGuide NA. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response (TODO: Replace with actual RAG pipeline)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Great question! Here are 3 options I found for you:",
        timestamp: new Date(),
        opportunities: [
          {
            id: "opp1",
            title: "Plumbing Apprenticeship",
            category: "Training",
            cost: "Free",
            source: "City Youth Desk",
            contact: "081234567",
          },
          {
            id: "opp2",
            title: "ICT Short Course",
            category: "Training",
            cost: "Free",
            source: "NUST Outreach",
            contact: "WhatsApp 081987654",
          },
        ],
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <Menu className="h-5 w-5" />
            </Button>
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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-chat-bubble-user text-white"
                    : "bg-chat-bubble-bot shadow-soft"
                }`}
              >
                <p className="text-sm">{message.text}</p>

                {/* Render opportunities if present */}
                {message.opportunities && (
                  <div className="mt-3 space-y-2">
                    {message.opportunities.map((opp) => (
                      <Card key={opp.id} className="p-3">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-semibold">{opp.title}</h4>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {opp.cost}
                          </Badge>
                        </div>
                        <p className="mb-1 text-xs text-muted-foreground">
                          <span className="font-medium">Category:</span> {opp.category}
                        </p>
                        <p className="mb-1 text-xs text-muted-foreground">
                          <span className="font-medium">Source:</span> {opp.source}
                        </p>
                        <p className="mb-2 text-xs text-muted-foreground">
                          <span className="font-medium">Contact:</span> {opp.contact}
                        </p>
                        <Button size="sm" variant="outline" className="w-full">
                          <Bookmark className="mr-1 h-3 w-3" /> Save This
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}

                <p className="mt-1 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-chat-bubble-bot px-4 py-3 shadow-soft">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Replies */}
      <div className="border-t border-border bg-card px-4 py-2">
        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-2">
          {QUICK_REPLIES.map((reply) => (
            <Button
              key={reply}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleQuickReply(reply)}
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="mx-auto flex max-w-3xl gap-2"
        >
          <Input
            placeholder="Ask me anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="bg-gradient-warm">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
