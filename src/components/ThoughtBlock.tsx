import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Tooltip } from "./Tooltip";

interface ThoughtBlockProps {
  parts: string[];
  isStreaming: boolean;
}

export const ThoughtBlock = ({ parts, isStreaming }: ThoughtBlockProps) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isStreaming) {
      const timer = setTimeout(() => setIsOpen(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isStreaming]);

  return (
    <div className="my-2 border border-[#141414]/5 dark:border-white/5 rounded-lg bg-[#F5F5F0]/30 dark:bg-white/5 transition-all duration-500">
      <Tooltip content={isOpen ? "Collapse reasoning" : "Expand reasoning"} className="w-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-[#141414]/90 dark:text-white/80 hover:text-[#141414] dark:hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            {isStreaming && isOpen && <RefreshCw className="w-2 h-2 animate-spin" />}
            <span>Agent Reasoning</span>
          </div>
          {isOpen ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />}
        </button>
      </Tooltip>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              {parts.map((part, i) => (
                <div key={i} className="text-[11px] text-[#141414]/80 dark:text-white/60 italic leading-relaxed border-l-2 border-[#141414]/10 dark:border-white/10 pl-2">
                  {part}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
