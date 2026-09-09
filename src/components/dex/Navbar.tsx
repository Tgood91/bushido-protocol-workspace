import React, { useState } from "react";
import { 
  ArrowLeftRight, 
  Layers, 
  GitFork, 
  Droplets, 
  Bot, 
  Wallet, 
  ChevronDown, 
  Fuel, 
  Check, 
  Copy, 
  ExternalLink,
  Settings,
  Sparkles,
  Sun,
  Moon,
  RefreshCw
} from "lucide-react";
import { SUPPORTED_CHAINS } from "../../data/dexInventory";
import { ChainConfig, ChainId } from "../../types/dex";
import { Tooltip } from "../Tooltip";

export type ActiveTab = "terminal" | "inventory" | "splits" | "liquidity" | "ai_analytics";

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  selectedChain: ChainConfig;
  onSelectChain: (chain: ChainConfig) => void;
  onOpenSettings: () => void;
  onToggleAiCopilot: () => void;
  isAiCopilotOpen: boolean;
  walletBalanceEth: number;
  walletBalanceUsdc: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  selectedChain,
  onSelectChain,
  onOpenSettings,
  onToggleAiCopilot,
  isAiCopilotOpen,
  walletBalanceEth,
  walletBalanceUsdc,
}) => {
  const [isChainMenuOpen, setIsChainMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  const dummyAddress = "0x71C838961F3a1231b2c4568eE889d12F013a9F42";
  const formattedAddress = `${dummyAddress.slice(0, 6)}...${dummyAddress.slice(-4)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dummyAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0052FF] via-[#627EEA] to-[#8247E5] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-white dark:bg-[#0F0F0F] rounded-[10px] flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-[#0052FF] dark:text-[#627EEA]" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-white">Remix DEX Terminal</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                Phase 1 Shell
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-white/40 -mt-0.5 font-mono">Aggregated Router & ve(3,3) Hub</p>
          </div>
        </div>

        {/* Primary View Switcher Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-[#141414] p-1 rounded-xl border border-gray-200 dark:border-white/5">
          <button
            onClick={() => onSelectTab("terminal")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "terminal"
                ? "bg-white dark:bg-[#202020] text-gray-900 dark:text-white shadow-sm font-semibold"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Trading Terminal</span>
          </button>

          <button
            onClick={() => onSelectTab("inventory")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "inventory"
                ? "bg-white dark:bg-[#202020] text-gray-900 dark:text-white shadow-sm font-semibold"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Router Inventory</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">6 Nodes</span>
          </button>

          <button
            onClick={() => onSelectTab("splits")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "splits"
                ? "bg-white dark:bg-[#202020] text-gray-900 dark:text-white shadow-sm font-semibold"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>0xSplits Hub</span>
          </button>

          <button
            onClick={() => onSelectTab("liquidity")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "liquidity"
                ? "bg-white dark:bg-[#202020] text-gray-900 dark:text-white shadow-sm font-semibold"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>ve(3,3) Liquidity</span>
          </button>

          <button
            onClick={() => onSelectTab("ai_analytics")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ai_analytics"
                ? "bg-white dark:bg-[#202020] text-[#627EEA] dark:text-[#8299F8] shadow-sm font-semibold"
                : "text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#627EEA]" />
            <span>AI Copilot</span>
          </button>
        </nav>

        {/* Right Section: Network, Wallet, Controls */}
        <div className="flex items-center gap-2">
          {/* Chain Selector */}
          <div className="relative">
            <button
              onClick={() => setIsChainMenuOpen(!isChainMenuOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#141414] hover:bg-gray-100 dark:hover:bg-[#1A1A1A] transition-colors text-xs font-medium text-gray-900 dark:text-white"
            >
              <span className="text-sm">{selectedChain.icon}</span>
              <span className="hidden sm:inline font-mono">{selectedChain.name.split(" ")[0]}</span>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-white/50">
                <Fuel className="w-2.5 h-2.5 text-emerald-500" />
                <span className="font-mono">{selectedChain.currentGasGwei} Gwei</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isChainMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsChainMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-mono uppercase text-gray-400 tracking-wider">Select Network</div>
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => {
                        onSelectChain(chain);
                        setIsChainMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        selectedChain.id === chain.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                          : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{chain.icon}</span>
                        <span>{chain.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{chain.currentGasGwei}g</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Connected Wallet Pill */}
          <div className="relative">
            <button
              onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-95 transition-opacity text-xs font-semibold shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-mono">{formattedAddress}</span>
            </button>

            {isWalletMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsWalletMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs font-mono uppercase text-gray-400">Simulated Account</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold">Active</span>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 dark:bg-[#1A1A1A] p-2.5 rounded-lg">
                    <span className="font-mono text-xs text-gray-700 dark:text-white/90">{dummyAddress.slice(0, 10)}...{dummyAddress.slice(-8)}</span>
                    <button onClick={handleCopy} className="p-1 hover:text-blue-500 text-gray-400 transition-colors">
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500 dark:text-white/60">
                      <span>ETH Balance</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">{walletBalanceEth.toFixed(2)} ETH (~${(walletBalanceEth * 3420.5).toLocaleString()})</span>
                    </div>
                    <div className="flex justify-between text-gray-500 dark:text-white/60">
                      <span>USDC Balance</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-white">${walletBalanceUsdc.toLocaleString()} USDC</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex gap-2">
                    <a 
                      href={`${selectedChain.blockExplorer}/address/${dummyAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Explorer
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* AI Copilot Slideover Toggle Button */}
          <Tooltip content="Toggle AI Trading Copilot">
            <button
              onClick={onToggleAiCopilot}
              className={`p-2 rounded-xl border transition-colors ${
                isAiCopilotOpen
                  ? "bg-[#627EEA] text-white border-[#627EEA]"
                  : "bg-gray-50 dark:bg-[#141414] border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <Bot className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip content="Toggle Theme">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </Tooltip>

          {/* GCP Settings */}
          <Tooltip content="GCP Configuration">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-gray-200 dark:border-white/5 py-1.5 px-2 bg-gray-50/50 dark:bg-[#0A0A0A]">
        <button
          onClick={() => onSelectTab("terminal")}
          className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-md ${
            activeTab === "terminal" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-white/50"
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Terminal</span>
        </button>
        <button
          onClick={() => onSelectTab("inventory")}
          className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-md ${
            activeTab === "inventory" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-white/50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Routers</span>
        </button>
        <button
          onClick={() => onSelectTab("splits")}
          className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-md ${
            activeTab === "splits" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-white/50"
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>0xSplits</span>
        </button>
        <button
          onClick={() => onSelectTab("liquidity")}
          className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-md ${
            activeTab === "liquidity" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-white/50"
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>ve(3,3)</span>
        </button>
        <button
          onClick={() => onSelectTab("ai_analytics")}
          className={`flex flex-col items-center gap-0.5 text-[10px] py-1 px-2 rounded-md ${
            activeTab === "ai_analytics" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-500 dark:text-white/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Copilot</span>
        </button>
      </div>
    </header>
  );
};
