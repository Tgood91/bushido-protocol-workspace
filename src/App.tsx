import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  PlusCircle, 
  Square, 
  PanelLeft, 
  Trash2, 
  Clock, 
  History, 
  X, 
  RotateCcw, 
  Settings, 
  Sparkles,
  Layers,
  ArrowLeftRight,
  GitFork,
  Droplets,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AssistantMessage } from "./components/AssistantMessage";
import { SuggestedQuestions } from "./components/SuggestedQuestions";
import { SettingsModal } from "./components/SettingsModal";
import { Tooltip } from "./components/Tooltip";
import { useChat } from "./useChat";
import { PRESET_QUESTIONS } from "./ui.config";

// DEX Terminal Imports
import { Navbar, ActiveTab } from "./components/dex/Navbar";
import { TradingTerminalView } from "./components/dex/TradingTerminalView";
import { RouterInventoryView } from "./components/dex/RouterInventoryView";
import { SplitsSettlementView } from "./components/dex/SplitsSettlementView";
import { LiquidityGaugesView } from "./components/dex/LiquidityGaugesView";
import { AiCopilotDrawer } from "./components/dex/AiCopilotDrawer";
import { SwapExecutionModal } from "./components/dex/SwapExecutionModal";
import { TOKEN_LIST } from "./data/tokens";
import { SUPPORTED_CHAINS } from "./data/dexInventory";
import { calculateRouteQuote } from "./services/routerEngine";
import { Token, RouteQuote, SplitsRecipient, ProtocolId, ChainConfig } from "./types/dex";

export default function App() {
  const {
    messages,
    conversations,
    currentConvId,
    isLoading,
    isComputing,
    handleSend,
    handleStop,
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
    loadingIds,
    customProjectId,
    saveCustomProjectId
  } = useChat();

  // Navigation and Modal State
  const [activeTab, setActiveTab] = useState<ActiveTab>("terminal");
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState("");

  // Wallet Simulation State
  const [selectedChain, setSelectedChain] = useState<ChainConfig>(SUPPORTED_CHAINS[0]);
  const [walletBalanceEth, setWalletBalanceEth] = useState<number>(14.85);
  const [walletBalanceUsdc, setWalletBalanceUsdc] = useState<number>(25400.0);

  // Swap Form State
  const [fromToken, setFromToken] = useState<Token>(TOKEN_LIST[0]); // ETH (Ethereum)
  const [toToken, setToToken] = useState<Token>(TOKEN_LIST[1]);   // USDC (Ethereum)
  const [fromAmount, setFromAmount] = useState<string>("1.5");
  const [preferredRouter, setPreferredRouter] = useState<"auto" | ProtocolId>("auto");
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);

  // 0xSplits Invariant Settlement State
  const [splitsEnabled, setSplitsEnabled] = useState<boolean>(false);
  const [splitsRecipients, setSplitsRecipients] = useState<SplitsRecipient[]>([
    { id: "1", label: "DAO Treasury", address: "0x8912C0929281aE3274B19349c7198eAA89124B19", percentage: 50 },
    { id: "2", label: "Liquidity Staking", address: "0x44ab7192A028448C182782b192837192A028C182", percentage: 30 },
    { id: "3", label: "Core Operations", address: "0x77ef4281B91823D0918239102839102839183D09", percentage: 20 },
  ]);

  // Chat UI state for AI Analytics tab
  const [chatInput, setChatInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Calculate live route quote whenever input parameters change
  const currentQuote: RouteQuote | null = useMemo(() => {
    const numAmount = parseFloat(fromAmount) || 0;
    if (numAmount <= 0) return null;
    return calculateRouteQuote(
      fromToken,
      toToken,
      numAmount,
      preferredRouter,
      splitsEnabled,
      splitsRecipients,
      slippageTolerance
    );
  }, [fromToken, toToken, fromAmount, preferredRouter, splitsEnabled, splitsRecipients, slippageTolerance]);

  // Responsive sidebar check
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSendChatMessage = (text?: string, isQuickStarter: boolean = false) => {
    const query = text || chatInput;
    if (!query.trim()) return;

    handleSend(query, customProjectId);
    if (!text) setChatInput("");
  };

  const handleModalSubmit = (newProjectId: string) => {
    saveCustomProjectId(newProjectId.trim());
    setIsSettingsOpen(false);
    if (pendingQuery) {
      handleSend(pendingQuery, newProjectId.trim());
      setChatInput("");
      setPendingQuery("");
    }
  };

  const handleSwapSuccess = (spentEth: number, spentUsdc: number, receivedToken: Token, receivedAmount: number) => {
    if (spentEth > 0) setWalletBalanceEth(prev => Math.max(0, prev - spentEth));
    if (spentUsdc > 0) setWalletBalanceUsdc(prev => Math.max(0, prev - spentUsdc));

    if (receivedToken.symbol === "ETH") setWalletBalanceEth(prev => prev + receivedAmount);
    if (receivedToken.symbol === "USDC") setWalletBalanceUsdc(prev => prev + receivedAmount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070707] text-gray-900 dark:text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Universal DEX Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedChain={selectedChain}
        onSelectChain={setSelectedChain}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleAiCopilot={() => setIsAiCopilotOpen(!isAiCopilotOpen)}
        isAiCopilotOpen={isAiCopilotOpen}
        walletBalanceEth={walletBalanceEth}
        walletBalanceUsdc={walletBalanceUsdc}
      />

      {/* Primary Workspace Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === "terminal" && (
          <TradingTerminalView
            fromToken={fromToken}
            toToken={toToken}
            onSelectFromToken={setFromToken}
            onSelectToToken={setToToken}
            fromAmount={fromAmount}
            onChangeFromAmount={setFromAmount}
            quote={currentQuote}
            onExecuteSwap={() => setIsSwapModalOpen(true)}
            preferredRouter={preferredRouter}
            onSelectPreferredRouter={setPreferredRouter}
            splitsEnabled={splitsEnabled}
            onToggleSplits={setSplitsEnabled}
            splitsRecipients={splitsRecipients}
            onChangeSplitsRecipients={setSplitsRecipients}
            slippageTolerance={slippageTolerance}
            onChangeSlippage={setSlippageTolerance}
            onOpenRouterInventory={() => setActiveTab("inventory")}
            onOpenSplitsHub={() => setActiveTab("splits")}
          />
        )}

        {activeTab === "inventory" && (
          <RouterInventoryView />
        )}

        {activeTab === "splits" && (
          <SplitsSettlementView />
        )}

        {activeTab === "liquidity" && (
          <LiquidityGaugesView />
        )}

        {/* Dedicated Full-Screen AI Copilot & BigQuery Analytics Tab */}
        {activeTab === "ai_analytics" && (
          <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-[#0F0F0F] rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
            {/* Sidebar for conversations */}
            <div className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-white/10 p-3.5 space-y-3 bg-gray-50/50 dark:bg-[#0D0D0D]">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-white/5">
                <span className="text-[11px] font-mono uppercase font-bold text-gray-400 tracking-wider">Analysis History</span>
                <button
                  onClick={() => handleNewChat()}
                  className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="New analysis"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`group w-full text-left p-2.5 rounded-xl transition-colors flex items-center justify-between cursor-pointer text-xs ${
                      currentConvId === conv.id
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white/70"
                    }`}
                  >
                    <div className="truncate pr-1">
                      <div className="truncate">{conv.title}</div>
                      <div className="text-[9px] text-gray-400 font-mono">{conv.timestamp.toLocaleDateString()}</div>
                    </div>

                    {conversations.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Workspace */}
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto py-12">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#627EEA] to-[#8247E5] p-0.5 flex items-center justify-center">
                      <div className="w-full h-full bg-white dark:bg-[#121212] rounded-[10px] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[#627EEA]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Ethereum & DEX AI Intelligence
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-white/60 mt-1 max-w-md">
                        Query the Phase 1 Router Inventory (1inch v5, Li.Fi, Relay, 0xSplits, Aerodrome, Velodrome), 
                        or generate on-chain BigQuery analytics with SQL and Vega visualization.
                      </p>
                    </div>

                    <div className="w-full text-left space-y-2 pt-2">
                      <span className="text-[10px] font-mono uppercase text-gray-400">Quick Starters:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PRESET_QUESTIONS.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => onSendChatMessage(q, true)}
                            className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 hover:border-blue-500 text-left text-xs text-gray-800 dark:text-white/80 transition-colors font-mono"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx}>
                        {msg.role === "user" ? (
                          <div className="flex justify-end">
                            <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs shadow-sm font-medium">
                              {msg.content}
                            </div>
                          </div>
                        ) : (
                          <AssistantMessage
                            content={msg.content}
                            status={msg.status}
                            onSelectQuestion={(q) => onSendChatMessage(q, false)}
                            isLoading={isLoading}
                          />
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-[#141414] text-xs font-mono text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        <span>Querying Google Cloud BigQuery & DEX Router Matrix...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input Bar */}
              <form 
                onSubmit={(e) => { e.preventDefault(); onSendChatMessage(); }}
                className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F0F0F]"
              >
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-colors">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about 1inch v5, Aerodrome ve(3,3), 0xSplits, or Ethereum gas..."
                    className="w-full bg-transparent text-xs text-gray-900 dark:text-white outline-none font-mono"
                  />
                  {isLoading ? (
                    <button
                      type="button"
                      onClick={handleStop}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                      title="Stop generation"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Floating / Slide-over AI Copilot Drawer */}
      <AiCopilotDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={(q) => onSendChatMessage(q, false)}
        onClearChat={() => handleNewChat()}
      />

      {/* Progressive Multi-Step Swap Execution Modal */}
      {currentQuote && (
        <SwapExecutionModal
          isOpen={isSwapModalOpen}
          onClose={() => setIsSwapModalOpen(false)}
          quote={currentQuote}
          onConfirmSuccess={handleSwapSuccess}
        />
      )}

      {/* Google Cloud Project Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProjectId={customProjectId}
        onSave={handleModalSubmit}
      />
    </div>
  );
}
