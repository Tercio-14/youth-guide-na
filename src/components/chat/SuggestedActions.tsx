import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuickReply {
  text: string;
  icon?: string;
}

const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { text: "Jobs near me", icon: "💼" },
  { text: "Free training", icon: "📚" },
  { text: "Make money fast", icon: "💰" },
  { text: "Learn online", icon: "💻" },
  { text: "Part-time work", icon: "⏰" }
];

interface SuggestedActionsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
  suggestions?: QuickReply[];
}

export const SuggestedActions = ({ 
  onSelect, 
  disabled = false,
  suggestions = DEFAULT_QUICK_REPLIES 
}: SuggestedActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex flex-wrap gap-2 px-4 pb-4"
    >
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.text}
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ 
            delay: 0.6 + index * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        >
          <Badge
            variant="secondary"
            className={cn(
              "cursor-pointer px-4 py-2 text-sm font-normal",
              "bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700",
              "border border-zinc-200 dark:border-zinc-700",
              "transition-all duration-200 hover:scale-105 hover:shadow-md",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && onSelect(suggestion.text)}
          >
            {suggestion.icon && <span className="mr-1.5">{suggestion.icon}</span>}
            {suggestion.text}
          </Badge>
        </motion.div>
      ))}
    </motion.div>
  );
};
