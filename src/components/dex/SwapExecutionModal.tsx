import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Copy, 
  Check, 
  GitFork,
  Fuel,
  Clock
} from "lucide-react";
import { RouteQuote, Token } from "../../types/dex";
import { ROUTER_INVENTORY } from "../../data/dexInventory";

interface SwapExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: RouteQuote;
  onConfirmSuccess: (spentEth: number, spentUsdc: number, receivedToken: Token, receivedAmount: number) => void;
}

type ExecutionStep = 
  | "idle"
  | "verifying"
  | "approving"
  | "routing"
  | "splitting"
  | "completed"
  | "error";

export const SwapExecutionModal: React.FC<SwapExecutionModalProps> = ({
  isOpen,
  onClose,
  quote,
  onConfirmSuccess,
}) => {
  const [step, setStep] = useState<ExecutionStep>("verifying");
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep("verifying");
      setTxHash("");
      return;
    }

    const randomHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setTxHash(randomHash);

    // Progressive execution simulation
    const t1 = setTimeout(() => setStep("approving"), 1200);
    const t2 = setTimeout(() => setStep("routing"), 2400);
    
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout;

    if (quote.splitsSettlement?.enabled) {
      t3 = setTimeout(() => setStep("splitting"), 3600);
      t4 = setTimeout(() => {
        setStep("completed");
        finalizeBalances();
      }, 5000);
    } else {
      t4 = setTimeout(() => {
        setStep("completed");
        finalizeBalances();
      }, 3800);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (t3) clearTimeout(t3);
      if (t4) clearTimeout(t4);
    };
  }, [isOpen, quote]);

  const finalizeBalances = () => {
    let spentEth = 0;
    let spentUsdc = 0;
    if (quote.fromToken.symbol === "ETH") spentEth = quote.fromAmount;
    if (quote.fromToken.symbol === "USDC") spentUsdc = quote.fromAmount;
    onConfirmSuccess(spentEth, spentUsdc, quote.toToken, quote.toAmount);
  };

  const copyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const primaryInventory = ROUTER_INVENTORY.find((r) => r.id === quote.primaryRouter);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {step === "completed" ? "Transaction Confirmed" : "Executing Standardized DEX Swap"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-white/40 font-mono">
              Via {primaryInventory?.protocolName || "Automated Routing Engine"}
            </p>
          </div>
          {step === "completed" && (
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Pair Summary Card */}
        <div className="bg-gray-50 dark:bg-[#181818] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img src={quote.fromToken.logoURI} alt={quote.fromToken.symbol} className="w-6 h-6 rounded-full" />
            <div>
              <div className="font-bold text-gray-900 dark:text-white font-mono">
                {quote.fromAmount} {quote.fromToken.symbol}
              </div>
              <div className="text-[10px] text-gray-400">Chain {quote.fromToken.chainId}</div>
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-gray-400" />

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {quote.toAmount.toFixed(4)} {quote.toToken.symbol}
              </div>
              <div className="text-[10px] text-gray-400">Chain {quote.toToken.chainId}</div>
            </div>
            <img src={quote.toToken.logoURI} alt={quote.toToken.symbol} className="w-6 h-6 rounded-full" />
          </div>
        </div>

        {/* Multi-step Pipeline Progress */}
        <div className="space-y-3 font-mono text-xs">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            {step === "verifying" ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">1. Verify RPC Quoting & Calldata</div>
              <div className="text-[10px] text-gray-400">Pre-flight checks simulated successfully</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            {step === "verifying" ? (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20 shrink-0" />
            ) : step === "approving" ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">2. Token Spend Allowance (ERC20.approve)</div>
              <div className="text-[10px] text-gray-400">Permit2 / Infinite token authorization verified</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            {["verifying", "approving"].includes(step) ? (
              <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20 shrink-0" />
            ) : step === "routing" ? (
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white">
                3. Dispatch through {primaryInventory?.shortName}
              </div>
              <div className="text-[10px] text-gray-400">
                {quote.isCrossChain 
                  ? `${quote.crossChainMechanism} intent fulfillment`
                  : `Pathfinder token splitting across ${quote.hops.length} AMM pools`}
              </div>
            </div>
          </div>

          {/* Step 4: 0xSplits (If Enabled) */}
          {quote.splitsSettlement?.enabled && (
            <div className="flex items-center gap-3">
              {["verifying", "approving", "routing"].includes(step) ? (
                <div className="w-4 h-4 rounded-full border border-gray-300 dark:border-white/20 shrink-0" />
              ) : step === "splitting" ? (
                <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <div className="flex-1">
                <div className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5" />
                  4. 0xSplits Atomic Settlement Execution
                </div>
                <div className="text-[10px] text-gray-400">
                  Splitting {quote.toAmount.toFixed(4)} {quote.toToken.symbol} across {quote.splitsSettlement.recipients.length} recipients
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirmed Details State */}
        {step === "completed" && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600 dark:text-white/60">Transaction Hash</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900 dark:text-white">
                  {txHash.slice(0, 8)}...{txHash.slice(-6)}
                </span>
                <button onClick={copyHash} className="p-1 hover:text-blue-500 text-gray-400">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600 dark:text-white/60">Gas Used</span>
              <span className="text-gray-900 dark:text-white flex items-center gap-1">
                <Fuel className="w-3 h-3 text-emerald-500" />
                142,850 gas (~${quote.estimatedGasUsd.toFixed(2)})
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-600 dark:text-white/60">Execution Latency</span>
              <span className="text-gray-900 dark:text-white flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-500" />
                {quote.executionTimeSec}s on-chain
              </span>
            </div>

            {quote.splitsSettlement?.enabled && (
              <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-gray-700 dark:text-white/80 space-y-1">
                <div className="font-bold text-emerald-600 dark:text-emerald-400">0xSplits Distribution Summary:</div>
                {quote.splitsSettlement.recipients.map((r, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span>{r.label} ({r.percentage}%)</span>
                    <span className="font-bold">
                      {((quote.toAmount * r.percentage) / 100).toFixed(4)} {quote.toToken.symbol}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 flex gap-3">
          {step === "completed" ? (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-sm hover:opacity-90 transition-opacity"
            >
              Done & Return to Terminal
            </button>
          ) : (
            <div className="w-full py-3 rounded-xl bg-gray-100 dark:bg-[#202020] text-gray-500 dark:text-white/40 text-center font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
              Broadcasting to EVM Mempool...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
