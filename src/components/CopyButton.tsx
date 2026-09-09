import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Tooltip } from "./Tooltip";

import { UI_CLASSES } from "../ui.config";

interface CopyButtonProps {
  text?: string;
  onCopy?: () => Promise<void>;
  className?: string;
}

export const CopyButton = ({ text, onCopy, className = "" }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (onCopy) {
        await onCopy();
      } else if (text) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Tooltip content={copied ? "Copied!" : "Copy to clipboard"}>
      <button
        onClick={handleCopy}
        className={`flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-1 rounded-md ${UI_CLASSES.transition} text-[10px] font-medium tracking-wider uppercase ${UI_CLASSES.focusRing} focus-visible:ring-offset-1 dark:focus-visible:ring-offset-[#0F0F0F] ${
          copied 
            ? "bg-[#141414] dark:bg-white text-white dark:text-[#111827] scale-95 shadow-inner" 
            : "hover:bg-[#141414]/5 dark:hover:bg-white/5 text-[#141414]/70 dark:text-white/60 hover:text-[#141414]/90 dark:hover:text-white active:scale-90"
        } ${className}`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            <span className="hidden sm:inline">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">{onCopy ? "Copy Image" : "Copy"}</span>
          </>
        )}
      </button>
    </Tooltip>
  );
};
