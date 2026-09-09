import React from "react";
import { 
  Zap, 
  Layers, 
  Globe, 
  GitFork, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  TrendingUp, 
  Info,
  Fuel
} from "lucide-react";
import { Token, RouteQuote, SplitsRecipient, ProtocolId } from "../../types/dex";
import { TradingChart } from "./TradingChart";
import { RoutePathVisualizer } from "./RoutePathVisualizer";
import { OrderbookDepth } from "./OrderbookDepth";
import { SwapCard } from "./SwapCard";
import { ROUTER_INVENTORY } from "../../data/dexInventory";

interface TradingTerminalViewProps {
  fromToken: Token;
  toToken: Token;
  onSelectFromToken: (token: Token) => void;
  onSelectToToken: (token: Token) => void;
  fromAmount: string;
  onChangeFromAmount: (val: string) => void;
  quote: RouteQuote | null;
  onExecuteSwap: () => void;
  preferredRouter: "auto" | ProtocolId;
  onSelectPreferredRouter: (router: "auto" | ProtocolId) => void;
  splitsEnabled: boolean;
  onToggleSplits: (enabled: boolean) => void;
  splitsRecipients: SplitsRecipient[];
  onChangeSplitsRecipients: (recipients: SplitsRecipient[]) => void;
  slippageTolerance: number;
  onChangeSlippage: (val: number) => void;
  onOpenRouterInventory: () => void;
  onOpenSplitsHub: () => void;
}

export const TradingTerminalView: React.FC<TradingTerminalViewProps> = ({
  fromToken,
  toToken,
  onSelectFromToken,
  onSelectToToken,
  fromAmount,
  onChangeFromAmount,
  quote,
  onExecuteSwap,
  preferredRouter,
  onSelectPreferredRouter,
  splitsEnabled,
  onToggleSplits,
  splitsRecipients,
  onChangeSplitsRecipients,
  slippageTolerance,
  onChangeSlippage,
  onOpenRouterInventory,
  onOpenSplitsHub,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Protocol Status Marquee / Indicator Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {ROUTER_INVENTORY.map((r) => (
          <div
            key={r.id}
            onClick={onOpenRouterInventory}
            className="cursor-pointer bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 hover:border-blue-500/50 p-2.5 rounded-xl transition-all flex items-center justify-between group shadow-xs"
          >
            <div className="truncate">
              <div className="font-bold text-xs text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                {r.shortName}
              </div>
              <div className="text-[10px] font-mono text-gray-400 truncate">
                {r.category.split(" ")[0]}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold block">
                {r.latencyMs}ms
              </span>
              <span className="text-[9px] font-mono text-gray-400">
                {r.reliabilityScore}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Terminal Layout: Left Chart & Depth, Right Swap Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chart, Route Path, Orderbook (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Pair Price Chart */}
          <TradingChart baseToken={fromToken} quoteToken={toToken} />

          {/* Execution Route Visualizer */}
          <RoutePathVisualizer quote={quote} />

          {/* Market Depth & Live Aggregated Swaps */}
          <OrderbookDepth baseToken={fromToken} quoteToken={toToken} />
        </div>

        {/* Right Column: Swap Execution Card & Diagnostics (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <SwapCard
            fromToken={fromToken}
            toToken={toToken}
            onSelectFromToken={onSelectFromToken}
            onSelectToToken={onSelectToToken}
            fromAmount={fromAmount}
            onChangeFromAmount={onChangeFromAmount}
            quote={quote}
            onExecuteSwap={onExecuteSwap}
            preferredRouter={preferredRouter}
            onSelectPreferredRouter={onSelectPreferredRouter}
            splitsEnabled={splitsEnabled}
            onToggleSplits={onToggleSplits}
            splitsRecipients={splitsRecipients}
            onChangeSplitsRecipients={onChangeSplitsRecipients}
            slippageTolerance={slippageTolerance}
            onChangeSlippage={onChangeSlippage}
          />

          {/* Router Comparison Micro-Matrix */}
          <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" />
                <h4 className="font-bold text-xs text-gray-900 dark:text-white">Active Router Health</h4>
              </div>
              <button
                onClick={onOpenRouterInventory}
                className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Full Inventory →
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-gray-700 dark:text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  1inch v5 (Pathfinder)
                </span>
                <span className="text-gray-400">185ms | Local EVM Multi-Hop</span>
              </div>

              <div className="flex items-center justify-between text-gray-700 dark:text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Relay Intent Solvers
                </span>
                <span className="text-gray-400">32ms | Sub-10s Bridge</span>
              </div>

              <div className="flex items-center justify-between text-gray-700 dark:text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Aerodrome ve(3,3) Hub
                </span>
                <span className="text-gray-400">95ms | Base Native LP</span>
              </div>

              <div className="flex items-center justify-between text-gray-700 dark:text-white/80">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  0xSplits Invariant Node
                </span>
                <span className="text-gray-400">45ms | Atomic Multi-Payout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
