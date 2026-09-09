import React from "react";
import { 
  ArrowRight, 
  GitFork, 
  Layers, 
  Zap, 
  Globe, 
  Compass, 
  Flame, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { RouteQuote, ProtocolId } from "../../types/dex";
import { ROUTER_INVENTORY } from "../../data/dexInventory";
import { Tooltip } from "../Tooltip";

interface RoutePathVisualizerProps {
  quote: RouteQuote | null;
  onSelectRouter?: (routerId: ProtocolId) => void;
}

export const RoutePathVisualizer: React.FC<RoutePathVisualizerProps> = ({
  quote,
  onSelectRouter,
}) => {
  if (!quote) {
    return (
      <div className="p-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 text-center text-xs text-gray-400 dark:text-white/40 font-mono">
        Enter an amount to compute standardized DEX routing path
      </div>
    );
  }

  const primaryInventory = ROUTER_INVENTORY.find((r) => r.id === quote.primaryRouter);

  return (
    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-mono uppercase font-bold text-gray-800 dark:text-white/90 tracking-wider">
            Standardized Execution Routing Path
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            {quote.isCrossChain ? quote.crossChainMechanism : "Local EVM Atomic Split"}
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            ~{quote.executionTimeSec}s latency
          </span>
        </div>
      </div>

      {/* Interactive Path Flow Diagram */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="min-w-[620px] flex items-center justify-between gap-3 relative py-2">
          {/* Step 1: Inflow Token */}
          <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/10 w-36 shrink-0 text-center">
            <div className="flex items-center gap-1.5">
              <img src={quote.fromToken.logoURI} alt={quote.fromToken.symbol} className="w-5 h-5 rounded-full" />
              <span className="font-bold text-xs text-gray-900 dark:text-white">{quote.fromToken.symbol}</span>
            </div>
            <div className="text-[11px] font-mono font-semibold text-gray-700 dark:text-white/80">
              {quote.fromAmount.toLocaleString()} {quote.fromToken.symbol}
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40">
              Chain {quote.fromToken.chainId}
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />

          {/* Step 2: Primary Aggregation Protocol */}
          <div 
            onClick={() => onSelectRouter?.(quote.primaryRouter)}
            className="group cursor-pointer flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 w-44 shrink-0 text-center hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              {quote.primaryRouter === "1inch_v5" && <Layers className="w-4 h-4 text-blue-500" />}
              {quote.primaryRouter === "relay" && <Zap className="w-4 h-4 text-emerald-500" />}
              {quote.primaryRouter === "lifi" && <Globe className="w-4 h-4 text-purple-500" />}
              {quote.primaryRouter === "aerodrome" && <Compass className="w-4 h-4 text-sky-500" />}
              {quote.primaryRouter === "velodrome" && <Flame className="w-4 h-4 text-rose-500" />}
              <span className="font-bold text-xs text-blue-600 dark:text-blue-400 truncate">
                {primaryInventory?.shortName || "Router"}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-600 dark:text-white/60 leading-tight line-clamp-1">
              {primaryInventory?.category}
            </span>
            <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {primaryInventory?.latencyMs}ms RPC benchmark
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />

          {/* Step 3: Liquidity Hops / Splitting */}
          <div className="flex flex-col gap-1.5 w-48 shrink-0">
            {quote.hops.map((hop, idx) => (
              <div 
                key={idx} 
                className="p-2 rounded-lg bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/10 text-left flex items-center justify-between text-[10px] font-mono"
              >
                <div className="truncate pr-1">
                  <div className="font-semibold text-gray-800 dark:text-white/90 truncate">{hop.poolName}</div>
                  <div className="text-gray-400 dark:text-white/40 text-[9px]">{hop.protocol} ({hop.chain})</div>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  {hop.allocationPercent}%
                </span>
              </div>
            ))}
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />

          {/* Step 4: Terminal Destination or 0xSplits Settlement */}
          {quote.splitsSettlement?.enabled ? (
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/50 w-48 shrink-0 text-center">
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400">0xSplits Settlement</span>
              </div>
              <div className="text-[10px] font-mono text-gray-600 dark:text-white/60">
                {quote.splitsSettlement.recipients.length} Recipient Matrix
              </div>
              <div className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                Atomic Distribution
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/10 w-36 shrink-0 text-center">
              <div className="flex items-center gap-1.5">
                <img src={quote.toToken.logoURI} alt={quote.toToken.symbol} className="w-5 h-5 rounded-full" />
                <span className="font-bold text-xs text-gray-900 dark:text-white">{quote.toToken.symbol}</span>
              </div>
              <div className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                ~{quote.toAmount.toFixed(4)} {quote.toToken.symbol}
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40">
                Chain {quote.toToken.chainId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Blueprint Role Annotation Footnote */}
      <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2 text-gray-600 dark:text-white/60 font-mono">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Role: <strong className="text-gray-900 dark:text-white">{primaryInventory?.routingRole.split(":")[0]}</strong></span>
        </div>

        {quote.terminalLiquidityHub && (
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-white/50 text-[10px] font-mono">
            <span>Terminal Liquidity Hub:</span>
            <span className="font-bold text-gray-800 dark:text-white">{quote.terminalLiquidityHub}</span>
          </div>
        )}
      </div>
    </div>
  );
};
