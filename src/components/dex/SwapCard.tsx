import React, { useState, useEffect } from "react";
import { 
  ArrowDownUp, 
  Settings2, 
  GitFork, 
  Fuel, 
  Zap, 
  ChevronDown, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Layers, 
  Plus, 
  Trash2,
  Sparkles
} from "lucide-react";
import { Token, RouteQuote, SplitsRecipient, ProtocolId, ChainConfig } from "../../types/dex";
import { TOKEN_LIST } from "../../data/tokens";
import { SUPPORTED_CHAINS, ROUTER_INVENTORY } from "../../data/dexInventory";
import { Tooltip } from "../Tooltip";

interface SwapCardProps {
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
}

export const SwapCard: React.FC<SwapCardProps> = ({
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
}) => {
  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tokenSearch, setTokenSearch] = useState("");

  const handleInvertTokens = () => {
    onSelectFromToken(toToken);
    onSelectToToken(fromToken);
  };

  const handleMaxAmount = () => {
    if (fromToken.balance) {
      onChangeFromAmount(fromToken.balance.toString());
    }
  };

  const addSplitRecipient = () => {
    if (splitsRecipients.length >= 5) return;
    const newRecipient: SplitsRecipient = {
      id: crypto.randomUUID(),
      label: `Recipient #${splitsRecipients.length + 1}`,
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      percentage: 10,
    };
    // Normalize percentages to total 100
    const totalCurrent = splitsRecipients.reduce((acc, r) => acc + r.percentage, 0);
    const scale = 90 / (totalCurrent || 1);
    const updated = splitsRecipients.map(r => ({
      ...r,
      percentage: Math.max(1, Math.round(r.percentage * scale))
    }));
    onChangeSplitsRecipients([...updated, newRecipient]);
  };

  const removeSplitRecipient = (id: string) => {
    if (splitsRecipients.length <= 1) return;
    const filtered = splitsRecipients.filter(r => r.id !== id);
    // Renormalize to 100%
    const total = filtered.reduce((acc, r) => acc + r.percentage, 0);
    const scale = 100 / (total || 1);
    const updated = filtered.map(r => ({
      ...r,
      percentage: Math.max(1, Math.round(r.percentage * scale))
    }));
    onChangeSplitsRecipients(updated);
  };

  const updateSplitPercentage = (id: string, newPct: number) => {
    const updated = splitsRecipients.map(r => r.id === id ? { ...r, percentage: newPct } : r);
    onChangeSplitsRecipients(updated);
  };

  const filteredTokens = TOKEN_LIST.filter(t => 
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const splitsSum = splitsRecipients.reduce((acc, r) => acc + r.percentage, 0);

  return (
    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-md relative space-y-4">
      {/* Header with Title and Settings */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">DEX Aggregation Terminal</h2>
          <p className="text-xs text-gray-500 dark:text-white/40 font-mono">Normalized multi-router swap engine</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Tooltip content="Trading & Slippage Settings">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                isSettingsOpen
                  ? "bg-gray-200 dark:bg-white/20 border-transparent text-gray-900 dark:text-white"
                  : "border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Slippage & Settings Dropdown Panel */}
      {isSettingsOpen && (
        <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700 dark:text-white/80">Slippage Tolerance</span>
            <div className="flex items-center gap-1">
              {[0.1, 0.5, 1.0].map(val => (
                <button
                  key={val}
                  onClick={() => onChangeSlippage(val)}
                  className={`px-2 py-1 rounded-md font-mono text-[11px] ${
                    slippageTolerance === val
                      ? "bg-blue-600 text-white font-bold"
                      : "bg-white dark:bg-[#202020] text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/10"
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-white/5">
            <span className="font-semibold text-gray-700 dark:text-white/80">Preferred Router Mode</span>
            <select
              value={preferredRouter}
              onChange={(e) => onSelectPreferredRouter(e.target.value as any)}
              className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-gray-800 dark:text-white/90 font-mono focus:outline-none"
            >
              <option value="auto">Auto (Best Rate & Gas)</option>
              <option value="1inch_v5">1inch v5 (Pathfinder)</option>
              <option value="relay">Relay (Low-Latency Intent)</option>
              <option value="lifi">Li.Fi (Multi-Bridge)</option>
              <option value="aerodrome">Aerodrome (Base veAMM)</option>
              <option value="velodrome">Velodrome (OP veAMM)</option>
            </select>
          </div>
        </div>
      )}

      {/* From Token Section */}
      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
          <span>You Pay</span>
          <div className="flex items-center gap-1.5">
            <span>Balance: {fromToken.balance ?? 0}</span>
            <button 
              onClick={handleMaxAmount}
              className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-[10px] hover:bg-blue-500/20"
            >
              MAX
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => onChangeFromAmount(e.target.value)}
            placeholder="0.0"
            className="w-full text-2xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 font-mono"
          />

          <button
            onClick={() => setIsFromPickerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#202020] border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-colors shrink-0 shadow-sm"
          >
            <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-xs text-gray-900 dark:text-white">{fromToken.symbol}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-gray-100 dark:bg-white/10 text-gray-400">
              {SUPPORTED_CHAINS.find(c => c.id === fromToken.chainId)?.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-gray-400 dark:text-white/40">
          ~${((parseFloat(fromAmount) || 0) * fromToken.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </div>

      {/* Invert Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleInvertTokens}
          className="p-2 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 hover:border-blue-500 text-gray-600 dark:text-white/80 hover:text-blue-500 shadow-sm transition-all"
        >
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      {/* To Token Section */}
      <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/50">
          <span>You Receive (Estimated)</span>
          <span>Balance: {toToken.balance ?? 0}</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white truncate">
            {quote ? quote.toAmount.toFixed(4) : "0.0"}
          </div>

          <button
            onClick={() => setIsToPickerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#202020] border border-gray-200 dark:border-white/10 hover:border-blue-500 transition-colors shrink-0 shadow-sm"
          >
            <img src={toToken.logoURI} alt={toToken.symbol} className="w-5 h-5 rounded-full" />
            <span className="font-bold text-xs text-gray-900 dark:text-white">{toToken.symbol}</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-gray-100 dark:bg-white/10 text-gray-400">
              {SUPPORTED_CHAINS.find(c => c.id === toToken.chainId)?.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>

        <div className="text-[11px] font-mono text-gray-400 dark:text-white/40">
          ~${quote ? (quote.toAmount * toToken.priceUsd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"} USD
        </div>
      </div>

      {/* 0xSplits Post-Swap Settlement Engine Section */}
      <div className="border border-amber-500/20 dark:border-amber-500/30 rounded-xl p-3 bg-amber-500/5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-gray-900 dark:text-white">0xSplits Settlement Node</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={splitsEnabled} 
              onChange={(e) => onToggleSplits(e.target.checked)} 
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
          </label>
        </div>

        <p className="text-[11px] text-gray-600 dark:text-white/60 leading-relaxed">
          Route final out-tokens atomically across an immutable multi-wallet distribution matrix in the same swap transaction.
        </p>

        {splitsEnabled && (
          <div className="pt-2 border-t border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-gray-700 dark:text-white/80">Recipient Payout Matrix</span>
              <span className={`font-mono font-bold ${splitsSum === 100 ? "text-emerald-500" : "text-amber-500"}`}>
                Total: {splitsSum}% {splitsSum !== 100 && "(Must equal 100%)"}
              </span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {splitsRecipients.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between gap-2 bg-white dark:bg-[#1A1A1A] p-2 rounded-lg border border-gray-200 dark:border-white/10 text-xs">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={rec.label}
                      onChange={(e) => {
                        const updated = splitsRecipients.map(r => r.id === rec.id ? { ...r, label: e.target.value } : r);
                        onChangeSplitsRecipients(updated);
                      }}
                      className="w-full bg-transparent font-semibold text-gray-900 dark:text-white outline-none text-xs"
                      placeholder="Label"
                    />
                    <span className="font-mono text-[10px] text-gray-400 block truncate">{rec.address}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={rec.percentage}
                      onChange={(e) => updateSplitPercentage(rec.id, parseInt(e.target.value) || 0)}
                      className="w-12 px-1.5 py-0.5 rounded bg-gray-50 dark:bg-[#242424] border border-gray-200 dark:border-white/10 font-mono text-center text-xs font-bold text-gray-900 dark:text-white"
                    />
                    <span className="font-mono text-xs text-gray-400">%</span>

                    {splitsRecipients.length > 1 && (
                      <button
                        onClick={() => removeSplitRecipient(rec.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {splitsRecipients.length < 5 && (
              <button
                onClick={addSplitRecipient}
                className="w-full py-1 text-center text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:underline flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Distribution Recipient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quote Breakdown & Diagnostics */}
      {quote && (
        <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 space-y-1.5 text-xs font-mono">
          <div className="flex justify-between text-gray-500 dark:text-white/60">
            <span>Exchange Rate</span>
            <span className="text-gray-900 dark:text-white">
              1 {fromToken.symbol} = {quote.rate.toFixed(4)} {toToken.symbol}
            </span>
          </div>

          <div className="flex justify-between text-gray-500 dark:text-white/60">
            <span>Price Impact</span>
            <span className={quote.priceImpact > 1 ? "text-amber-500 font-bold" : "text-emerald-500"}>
              {quote.priceImpact.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between text-gray-500 dark:text-white/60">
            <span>Est. Network Gas</span>
            <span className="text-gray-900 dark:text-white flex items-center gap-1">
              <Fuel className="w-3 h-3 text-emerald-500" />
              ~${quote.estimatedGasUsd.toFixed(2)} USD
            </span>
          </div>

          <div className="flex justify-between text-gray-500 dark:text-white/60">
            <span>Primary Routing Node</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              {ROUTER_INVENTORY.find(r => r.id === quote.primaryRouter)?.shortName}
            </span>
          </div>
        </div>
      )}

      {/* Execute Swap CTA Button */}
      <button
        onClick={onExecuteSwap}
        disabled={!quote || parseFloat(fromAmount) <= 0 || (splitsEnabled && splitsSum !== 100)}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4 fill-current" />
        <span>
          {!fromAmount || parseFloat(fromAmount) <= 0
            ? "Enter an amount"
            : splitsEnabled && splitsSum !== 100
            ? "Adjust Splits to 100%"
            : "Review & Execute Swap"}
        </span>
      </button>

      {/* Token Picker Modal (From or To) */}
      {(isFromPickerOpen || isToPickerOpen) && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Select {isFromPickerOpen ? "Source" : "Destination"} Token
              </h3>
              <button 
                onClick={() => { setIsFromPickerOpen(false); setIsToPickerOpen(false); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              placeholder="Search token symbol or name..."
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
            />

            <div className="max-h-72 overflow-y-auto space-y-1">
              {filteredTokens.map((token) => (
                <button
                  key={`${token.chainId}-${token.address}-${token.symbol}`}
                  onClick={() => {
                    if (isFromPickerOpen) {
                      onSelectFromToken(token);
                      setIsFromPickerOpen(false);
                    } else {
                      onSelectToToken(token);
                      setIsToPickerOpen(false);
                    }
                    setTokenSearch("");
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <img src={token.logoURI} alt={token.symbol} className="w-7 h-7 rounded-full" />
                    <div>
                      <div className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        {token.symbol}
                        <span className="text-[10px] font-mono px-1 rounded bg-gray-100 dark:bg-white/10 text-gray-400">
                          {SUPPORTED_CHAINS.find(c => c.id === token.chainId)?.name.split(" ")[0]}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-white/40">{token.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
                      ${token.priceUsd.toLocaleString()}
                    </div>
                    {token.balance !== undefined && (
                      <div className="text-[10px] font-mono text-gray-400">
                        Bal: {token.balance}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
