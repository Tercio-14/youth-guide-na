import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex w-full items-start gap-3"
    >
      {/* Bot Avatar */}
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 ring-2 ring-blue-100 dark:ring-blue-900">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        >
          <svg 
            className="size-4 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
        </motion.div>
      </div>

      {/* Typing Animation */}
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="size-2 rounded-full bg-zinc-400 dark:bg-zinc-500"
              animate={{
                y: [-2, 2, -2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="text-xs text-zinc-500 dark:text-zinc-400"
        >
          YouthGuide is typing...
        </motion.span>
      </div>
    </motion.div>
  );
};
