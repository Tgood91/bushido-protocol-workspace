import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Layers, 
  GitFork, 
  Droplets, 
  Zap, 
  Loader2,
  Trash2
} from "lucide-react";
import { Message } from "../../types";
import { AssistantMessage } from "../AssistantMessage";

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (query: string) => void;
  onClearChat: () => void;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
}) => {
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickStarters = [
    "Explain 1inch v5 Pathfinder multi-AMM token splitting",
    "How does Relay solver speed compare to Li.Fi?",
    "Show Aerodrome ve(3,3) pools by 24h volume and APR",
    "Explain 0xSplits post-swap atomic distribution",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onSendMessage(inputVal.trim());
    setInputVal("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-[#0D0D0D] border-l border-gray-200 dark:border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-[#0D0D0D]/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#627EEA] to-[#8247E5] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#627EEA]" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                  Ethereum & DEX AI Copilot
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                    BigQuery + Inventory
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">Real-time DEX analysis and query assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={onClearChat}
                  className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">Ask your DEX Routing Copilot</h4>
                  <p className="text-xs text-gray-500 dark:text-white/50 max-w-sm mt-1">
                    Ask about token routing splits, Pathfinder algorithm, Aerodrome/Velodrome pools, Relay solvers, or 0xSplits settlement.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="space-y-2 w-full max-w-md pt-2">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block text-left">Quick Starters:</span>
                  {quickStarters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(starter)}
                      className="w-full text-left p-2.5 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 hover:border-blue-500 text-xs text-gray-700 dark:text-white/80 transition-all font-mono"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div key={index}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs shadow-sm font-medium">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <AssistantMessage
                        content={msg.content}
                        status={msg.status}
                        onSelectQuestion={onSendMessage}
                        isLoading={isLoading}
                      />
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-[#141414] text-xs font-mono text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span>Analyzing DEX router matrix & mempool...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0D0D0D]">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about 1inch, Relay, Aerodrome, 0xSplits, or SQL..."
                className="w-full bg-transparent text-xs text-gray-900 dark:text-white outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isLoading}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
