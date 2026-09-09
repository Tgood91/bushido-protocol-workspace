import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
}

export const SuggestedQuestions = ({ questions, onSelect, disabled }: SuggestedQuestionsProps) => {
  if (!questions || questions.length === 0) return null;
  
  return (
    <div className="mt-6 flex flex-col gap-3">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-xs font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-700 dark:text-indigo-300 px-4 py-2.5 rounded-md self-start border border-indigo-500/20 dark:border-indigo-500/30 shadow-sm"
      >
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span>Try these preset questions instantly—no GCP Project ID required!</span>
      </motion.div>
      <div className="flex flex-wrap gap-2.5 mt-2">
        {questions.map((q, i) => (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            onClick={() => !disabled && onSelect(q)}
            disabled={disabled}
            className={`relative px-4 py-2 border rounded-full text-xs font-medium transition-all flex items-center gap-2 outline-none overflow-hidden group ${
              disabled
                ? "border-[#141414]/10 dark:border-white/10 bg-[#141414]/5 dark:bg-white/5 text-[#141414]/20 dark:text-white/20 cursor-not-allowed"
                : "border-transparent bg-white dark:bg-[#1A1A1A] text-[#141414]/90 dark:text-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.02)] hover:shadow-[0_4px_15px_rgba(99,102,241,0.25)] hover:-translate-y-0.5"
            }`}
          >
            {!disabled && (
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-300" />
            )}
            {!disabled && (
              <span className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-[0.15] group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            )}
            {!disabled && (
              <span className="absolute inset-[1px] bg-white dark:bg-[#1A1A1A] rounded-full -z-10" />
            )}
            <MessageSquare className={`w-3.5 h-3.5 ${disabled ? '' : 'text-indigo-500 group-hover:text-pink-500 transition-colors duration-300'}`} />
            <span className={`z-10 transition-all duration-300 ${!disabled ? "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-500 dark:group-hover:from-indigo-400 dark:group-hover:to-pink-400" : ""}`}>
              {q}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
