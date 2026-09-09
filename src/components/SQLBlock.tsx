import React, { useState } from "react";
import { Code, ChevronDown, ChevronUp } from "lucide-react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "./CopyButton";
import { Tooltip } from "./Tooltip";

import { UI_CLASSES, THEME } from "../ui.config";

interface SQLBlockProps {
  sql: string;
}

export const SQLBlock = ({ sql }: SQLBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`my-4 ${THEME.colors.border} rounded-xl overflow-visible bg-[#F5F5F0] dark:bg-[#1A1A1A]`}>
      <div className="flex items-center justify-between pr-2 border-b border-[#141414]/5 dark:border-white/5">
        <Tooltip content={isOpen ? "Collapse SQL" : "Expand SQL"} className="flex-1 min-w-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-4 py-2 ${UI_CLASSES.labelMono} !text-[#141414]/90 dark:!text-white/80 hover:bg-[#141414]/5 dark:hover:bg-white/5 ${UI_CLASSES.transition} overflow-hidden ${UI_CLASSES.focusRingInset}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Code className="w-3 h-3 shrink-0" />
              <span className="truncate">Generated SQL Query</span>
            </div>
            {isOpen ? <ChevronUp className="w-3 h-3 shrink-0" /> : <ChevronDown className="w-3 h-3 shrink-0" />}
          </button>
        </Tooltip>
        <CopyButton text={sql} className="ml-1 shrink-0" />
      </div>
      {isOpen && (
        <div className="p-0 bg-[#282c34] text-xs overflow-hidden rounded-b-xl">
          <SyntaxHighlighter
            language="sql"
            style={oneDark}
            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {sql}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};
