import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, User, Bookmark, BookmarkCheck, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { apiClient } from "@/utils/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Opportunity {
  id: string;
  title: string;
  type: string;
  description?: string;
  organization?: string;
  location?: string;
  date_posted?: string;
  source?: string;
  url?: string;
  score?: number;
}

interface AnimatedMessageProps {
  role: "user" | "bot";
  text: string;
  timestamp: Date;
  opportunities?: Opportunity[];
  isLast?: boolean;
  conversationId?: string;
}

export const AnimatedMessage = ({ 
  role, 
  text, 
  timestamp, 
  opportunities,
  isLast,
  conversationId
}: AnimatedMessageProps) => {
  const isUser = role === "user";
  const { token } = useAuth();
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [feedbackStates, setFeedbackStates] = useState<Record<string, 'helpful' | 'not_relevant' | null>>({});
  const [feedbackSubmitting, setFeedbackSubmitting] = useState<Record<string, boolean>>({});

  const handleSaveToggle = async (opportunity: Opportunity) => {
    if (!token) {
      toast.error("Please log in to save opportunities");
      return;
    }

    const isSaved = savedStates[opportunity.id];
    setSavingStates(prev => ({ ...prev, [opportunity.id]: true }));

    try {
      if (isSaved) {
        // Unsave
        await apiClient.delete(`/saved/${opportunity.id}`, token);
        setSavedStates(prev => ({ ...prev, [opportunity.id]: false }));
        toast.success("Opportunity removed from saved");
      } else {
        // Save
        await apiClient.post('/saved', { opportunity }, token);
        setSavedStates(prev => ({ ...prev, [opportunity.id]: true }));
        toast.success("Opportunity saved!");
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      toast.error(isSaved ? "Failed to remove" : "Failed to save");
    } finally {
      setSavingStates(prev => ({ ...prev, [opportunity.id]: false }));
    }
  };

  const handleOpenURL = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFeedback = async (opportunityId: string, feedbackType: 'helpful' | 'not_relevant') => {
    if (!token) {
      toast.error("Please log in to provide feedback");
      return;
    }

    // Prevent duplicate feedback submission
    if (feedbackStates[opportunityId]) {
      toast.info("You've already provided feedback for this opportunity");
      return;
    }

    setFeedbackSubmitting(prev => ({ ...prev, [opportunityId]: true }));

    try {
      await apiClient.submitFeedback(
        opportunityId,
        feedbackType,
        conversationId || 'unknown',
        token
      );
      
      setFeedbackStates(prev => ({ ...prev, [opportunityId]: feedbackType }));
      toast.success(
        feedbackType === 'helpful' 
          ? "Thanks for your feedback! 👍" 
          : "Feedback noted. We'll improve our recommendations. 👎"
      );
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setFeedbackSubmitting(prev => ({ ...prev, [opportunityId]: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      className={cn(
        "flex w-full items-start gap-3 group",
        isUser ? "justify-end" : "justify-start",
        isLast && !isUser && "mb-24" // Extra padding for last bot message
      )}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-blue-100 dark:ring-blue-900"
        >
          <Bot className="size-4 text-white" />
        </motion.div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          "flex flex-col gap-2",
          isUser ? "items-end" : "items-start",
          isUser ? "max-w-[85%] sm:max-w-[75%]" : "max-w-[90%] sm:max-w-[80%]"
        )}
      >
        {/* Message Bubble */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15 }}
          className={cn(
            "relative rounded-2xl px-4 py-2.5 shadow-sm",
            "transition-all duration-200",
            isUser
              ? "bg-[#25D366] text-white rounded-tr-sm"
              : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-sm",
            // Hover effects
            "group-hover:shadow-md"
          )}
        >
          {/* Message Text */}
          <p className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser ? "text-white" : "text-zinc-900 dark:text-zinc-100"
          )}>
            {text}
          </p>

          {/* Timestamp */}
          <span className={cn(
            "mt-1 flex items-center justify-end gap-1 text-[10px]",
            isUser ? "text-white/70" : "text-zinc-500"
          )}>
            {timestamp.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
            {isUser && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ✓✓
              </motion.span>
            )}
          </span>
        </motion.div>

        {/* Opportunities Cards */}
        {opportunities && opportunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2 w-full"
          >
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-3 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
                          {opp.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="shrink-0 h-8 w-8 p-0"
                          onClick={() => handleSaveToggle(opp)}
                          disabled={savingStates[opp.id]}
                        >
                          {savedStates[opp.id] ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {opp.type}
                        </Badge>
                        {opp.location && (
                          <Badge variant="outline" className="text-xs">
                            📍 {opp.location}
                          </Badge>
                        )}
                        {opp.organization && (
                          <Badge variant="outline" className="text-xs">
                            🏢 {opp.organization}
                          </Badge>
                        )}
                      </div>

                      {opp.description && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 line-clamp-2">
                          {opp.description}
                        </p>
                      )}

                      {/* Feedback Buttons */}
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant={feedbackStates[opp.id] === 'helpful' ? 'default' : 'outline'}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleFeedback(opp.id, 'helpful')}
                          disabled={feedbackSubmitting[opp.id] || !!feedbackStates[opp.id]}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Helpful
                        </Button>
                        <Button
                          variant={feedbackStates[opp.id] === 'not_relevant' ? 'default' : 'outline'}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleFeedback(opp.id, 'not_relevant')}
                          disabled={feedbackSubmitting[opp.id] || !!feedbackStates[opp.id]}
                        >
                          <ThumbsDown className="h-3 w-3 mr-1" />
                          Not Relevant
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        {opp.date_posted && (
                          <span>Posted: {new Date(opp.date_posted).toLocaleDateString()}</span>
                        )}
                        {opp.url && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => handleOpenURL(opp.url!)}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 ring-2 ring-zinc-100 dark:ring-zinc-800"
        >
          <User className="size-4 text-zinc-700 dark:text-zinc-300" />
        </motion.div>
      )}
    </motion.div>
  );
};
