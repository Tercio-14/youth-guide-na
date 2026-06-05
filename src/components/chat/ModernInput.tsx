import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Smile, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VoiceToggle } from "@/components/VoiceToggle";

interface ModernInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  isOffline?: boolean;
}

export const ModernInput = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type a message...",
  isOffline = false
}: ModernInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const canSend = value.trim().length > 0 && !disabled;
  
  // Update placeholder when offline
  const effectivePlaceholder = isOffline 
    ? "Offline mode - Limited functionality..." 
    : placeholder;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "relative flex items-end gap-2 rounded-3xl bg-white dark:bg-zinc-800",
        "border-2 transition-all duration-200",
        isOffline
          ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10"
          : isFocused 
            ? "border-[#25D366] shadow-lg shadow-[#25D366]/10" 
            : "border-zinc-200 dark:border-zinc-700 shadow-sm",
        "p-2"
      )}
    >
      {/* Offline Indicator */}
      {isOffline && (
        <div className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
          <WifiOff className="size-3" />
          <span>Offline mode</span>
        </div>
      )}

      {/* Voice Toggle Button */}
      <VoiceToggle />

      {/* Emoji Button (Optional) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 size-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
        disabled={disabled}
      >
        <Smile className="size-5 text-zinc-500" />
      </Button>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={effectivePlaceholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none bg-transparent px-2 py-2",
            "text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400",
            "outline-none",
            "max-h-[120px] overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600"
          )}
        />
      </div>

      {/* Attachment Button (Optional) */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 size-9 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700"
        disabled={disabled}
      >
        <Paperclip className="size-5 text-zinc-500" />
      </Button>

      {/* Send Button */}
      <AnimatePresence mode="wait">
        <motion.div
          key={canSend ? 'can-send' : 'cannot-send'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className={cn(
              "size-9 rounded-full p-0 transition-all duration-200",
              canSend
                ? "bg-[#25D366] hover:bg-[#20BD5B] shadow-lg shadow-[#25D366]/30"
                : "bg-zinc-200 dark:bg-zinc-700 cursor-not-allowed"
            )}
          >
            <motion.div
              animate={canSend ? { rotate: 360 } : {}}
              transition={{ duration: 0.3 }}
            >
              <Send className={cn(
                "size-4",
                canSend ? "text-white" : "text-zinc-400"
              )} />
            </motion.div>
          </Button>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
