import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Bookmark, Menu, User, MessageCircle, LogOut, PlusSquare, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/utils/api";
import { toast } from "sonner";
import { AnimatedMessage } from "@/components/chat/AnimatedMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ModernInput } from "@/components/chat/ModernInput";
import { SuggestedActions } from "@/components/chat/SuggestedActions";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  type: string;
  category?: string;
  description?: string;
  organization?: string;
  location?: string;
  cost?: string;
  source?: string;
  contact?: string;
  url?: string;
  date_posted?: string;
  score?: number;
}

interface ConversationSummary {
  id: string;
  firstMessage: string;
  lastUpdated: Date;
  messageCount: number;
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
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [recentConversations, setRecentConversations] = useState<ConversationSummary[]>([]);
  
  // Get or create conversationId from localStorage
  const [conversationId, setConversationId] = useState<string>(() => {
    const stored = localStorage.getItem('currentConversationId');
    if (stored) {
      console.log('🔄 [Chat] Loaded existing conversation ID from localStorage:', stored);
      return stored;
    }
    const newId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    console.log('🆔 [Chat] Generated new conversation ID:', newId);
    localStorage.setItem('currentConversationId', newId);
    return newId;
  });

  console.log('💬 [Chat] Component mounted', {
    hasUser: !!user,
    hasToken: !!token,
    hasProfile: !!userProfile,
    userEmail: user?.email,
    profileName: userProfile?.firstName,
    conversationId,
    timestamp: new Date().toISOString()
  });

  // Initialize welcome message
  const initializeWelcomeMessage = () => {
    const firstName = userProfile?.firstName || user?.displayName || 'there';
    const welcomeMessage: Message = {
      id: "welcome-" + Date.now(),
      role: "bot",
      text: `Hi ${firstName}! I'm YouthGuide NA. I can help you find job opportunities, training programs, and resources in Namibia. What are you looking for today?`,
      timestamp: new Date(),
    };
    
    setMessages([welcomeMessage]);
    
    console.log('✅ [Chat] Welcome message initialized', {
      firstName,
      messageId: welcomeMessage.id
    });
  };

  // Load conversation history from backend
  useEffect(() => {
    const loadConversationHistory = async () => {
      if (!token || !conversationId) {
        console.log('⚠️ [Chat] Skipping history load - no token or conversationId');
        setIsLoadingHistory(false);
        return;
      }

      try {
        console.log('📜 [Chat] Loading conversation history', { conversationId });
        
        const response = await apiClient.get(`/chat/conversation/${conversationId}`, token);
        
        if (response.messages && response.messages.length > 0) {
          console.log('✅ [Chat] Loaded conversation history', {
            messageCount: response.messages.length,
            conversationId
          });

          // Convert backend messages to frontend format
          const loadedMessages: Message[] = response.messages.map((msg: { 
            id?: string; 
            role: string; 
            content?: string; 
            text?: string; 
            timestamp: string; 
            opportunities?: Opportunity[] 
          }) => ({
            id: msg.id || `${msg.role}-${msg.timestamp}`,
            role: msg.role === 'assistant' ? 'bot' : msg.role as "user" | "bot",
            text: msg.content || msg.text || '',
            timestamp: new Date(msg.timestamp),
            opportunities: msg.opportunities || []
          }));

          setMessages(loadedMessages);
          console.log('💬 [Chat] Messages set from history', { count: loadedMessages.length });
        } else {
          console.log('ℹ️ [Chat] No existing history, showing welcome message');
          initializeWelcomeMessage();
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error('💥 [Chat] Failed to load conversation history', {
          error: err.message,
          conversationId
        });
        // If loading fails, just show welcome message
        initializeWelcomeMessage();
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadConversationHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, token]);

  // Load recent conversations
  useEffect(() => {
    const loadRecentConversations = async () => {
      if (!token) return;

      try {
        console.log('📋 [Chat] Loading recent conversations');
        const response = await apiClient.get('/chat/conversations/recent?limit=5', token);
        
        if (response.conversations) {
          setRecentConversations(response.conversations.map((conv: {
            id: string;
            firstMessage: string;
            lastUpdated: string;
            messageCount: number;
          }) => ({
            id: conv.id,
            firstMessage: conv.firstMessage,
            lastUpdated: new Date(conv.lastUpdated),
            messageCount: conv.messageCount
          })));
          console.log('✅ [Chat] Loaded recent conversations', { count: response.conversations.length });
        }
      } catch (error) {
        console.error('💥 [Chat] Failed to load recent conversations', error);
      }
    };

    loadRecentConversations();
  }, [token]);

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

  const handleClearChat = () => {
    console.log('🗑️ [Chat] Clearing chat and starting new conversation');
    
    // Generate new conversation ID
    const newId = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setConversationId(newId);
    localStorage.setItem('currentConversationId', newId);
    
    // Initialize with welcome message
    initializeWelcomeMessage();
    
    toast.success("Started a new conversation");
    setIsMenuOpen(false);
    
    console.log('✅ [Chat] New conversation started', { newConversationId: newId });
  };

  const handleSwitchConversation = (convId: string) => {
    console.log('🔄 [Chat] Switching to conversation', { convId });
    
    setConversationId(convId);
    localStorage.setItem('currentConversationId', convId);
    setIsLoadingHistory(true);
    setIsMenuOpen(false);
    
    toast.success("Loaded conversation");
    console.log('✅ [Chat] Switched to conversation', { conversationId: convId });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    console.log('🚪 [Chat] Logout requested from menu');
    try {
      // Clear conversation ID on logout
      localStorage.removeItem('currentConversationId');
      await logout();
      setIsMenuOpen(false);
      navigate("/auth");
    } catch (error: unknown) {
      const err = error as Error;
      console.error('💥 [Chat] Logout failed from menu', err);
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
                <div className="flex flex-col gap-6 h-full">
                  <div>
                    <p className="text-sm text-muted-foreground">Signed in as</p>
                    <p className="font-semibold">{userProfile?.firstName || user?.email}</p>
                  </div>
                  
                  {/* Recent Conversations Section */}
                  <div className="flex-1 overflow-hidden flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-muted-foreground">Recent Chats</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClearChat}
                        className="h-7 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <PlusSquare className="h-3 w-3 mr-1" />
                        New
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                      <AnimatePresence mode="popLayout">
                        {recentConversations.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center text-muted-foreground py-4"
                          >
                            <MessageCircle className="h-8 w-8 mx-auto mb-1 opacity-20" />
                            <p className="text-xs">No recent chats</p>
                          </motion.div>
                        ) : (
                          recentConversations.map((conv, index) => (
                            <motion.button
                              key={conv.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleSwitchConversation(conv.id)}
                              className={`w-full text-left p-2.5 rounded-md border transition-colors ${
                                conv.id === conversationId
                                  ? 'bg-primary/10 border-primary'
                                  : 'bg-card border-border hover:bg-accent'
                              }`}
                            >
                              <p className="font-medium text-xs line-clamp-2 mb-1">
                                {conv.firstMessage}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <MessageCircle className="h-2.5 w-2.5" />
                                <span>{conv.messageCount}</span>
                                <span>•</span>
                                <span>{formatRelativeTime(conv.lastUpdated)}</span>
                              </div>
                            </motion.button>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2 border-t border-border pt-4">
                    <Button variant="ghost" className="justify-start gap-3" onClick={() => handleNavigate("/saved")}>
                      <Bookmark className="h-4 w-4" /> Saved Opportunities
                    </Button>
                    <Button variant="ghost" className="justify-start gap-3" onClick={() => handleNavigate("/profile")}>
                      <User className="h-4 w-4" /> Edit Profile
                    </Button>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeToggle />
                    </div>
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
            <ThemeToggle />
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
        <div className="mx-auto max-w-3xl space-y-4">
          {isLoadingHistory ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20"
            >
              {/* Bot Avatar with pulse animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }}
                className="mb-6 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg ring-4 ring-blue-100 dark:ring-blue-900"
              >
                <Bot className="size-8 text-white" />
              </motion.div>

              {/* Loading dots */}
              <div className="mb-4 flex gap-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="size-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    animate={{
                      y: [-4, 4, -4],
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Loading text with fade animation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <motion.p
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                  className="text-lg font-medium text-foreground"
                >
                  Loading your conversation
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  Retrieving your chat history...
                </motion.p>
              </motion.div>
            </motion.div>
          ) : (
            <>
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
            </>
          )}
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
