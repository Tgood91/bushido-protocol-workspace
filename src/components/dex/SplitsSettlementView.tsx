import React, { useState } from "react";
import { 
  GitFork, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  Fuel, 
  DollarSign,
  ArrowRight,
  Zap
} from "lucide-react";
import { SplitsRecipient } from "../../types/dex";
import { Tooltip } from "../Tooltip";

export const SplitsSettlementView: React.FC = () => {
  const [recipients, setRecipients] = useState<SplitsRecipient[]>([
    { id: "1", label: "DAO Treasury", address: "0x8912C0929281aE3274B19349c7198eAA89124B19", percentage: 50 },
    { id: "2", label: "Liquidity Provider Staking", address: "0x44ab7192A028448C182782b192837192A028C182", percentage: 30 },
    { id: "3", label: "Core Contributors & Ops", address: "0x77ef4281B91823D0918239102839102839183D09", percentage: 20 },
  ]);

  const [distributorFeeBps, setDistributorFeeBps] = useState<number>(0);
  const [testAmount, setTestAmount] = useState<string>("10000");
  const [testToken, setTestToken] = useState<string>("USDC");
  const [copiedContract, setCopiedContract] = useState(false);

  const splitMainAddress = "0x2ed6c4Fe5350Ec2BC4F23B9149B52c00329094EE";

  const totalPercentage = recipients.reduce((acc, r) => acc + r.percentage, 0);

  const addRecipient = () => {
    if (recipients.length >= 6) return;
    const newR: SplitsRecipient = {
      id: crypto.randomUUID(),
      label: `Recipient #${recipients.length + 1}`,
      address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      percentage: 10,
    };
    // Renormalize
    const scale = 90 / (totalPercentage || 1);
    const updated = recipients.map(r => ({
      ...r,
      percentage: Math.max(1, Math.round(r.percentage * scale))
    }));
    setRecipients([...updated, newR]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length <= 1) return;
    const filtered = recipients.filter(r => r.id !== id);
    const total = filtered.reduce((acc, r) => acc + r.percentage, 0);
    const scale = 100 / (total || 1);
    const updated = filtered.map(r => ({
      ...r,
      percentage: Math.max(1, Math.round(r.percentage * scale))
    }));
    setRecipients(updated);
  };

  const updatePercentage = (id: string, newPct: number) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, percentage: newPct } : r));
  };

  const updateLabel = (id: string, newLabel: string) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, label: newLabel } : r));
  };

  const updateAddress = (id: string, newAddr: string) => {
    setRecipients(recipients.map(r => r.id === id ? { ...r, address: newAddr } : r));
  };

  const copyContract = () => {
    navigator.clipboard.writeText(splitMainAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const numericAmount = parseFloat(testAmount) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
            Post-Swap Settlement Node
          </span>
          <span className="text-[10px] font-mono text-gray-400">0xSplits Protocol Layer</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          0xSplits Distribution Hub & Invariant Settlement
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-3xl leading-relaxed">
          The 0xSplits node functions as the terminal settlement layer in your DEX aggregation shell. 
          When swaps are executed, out-tokens can be atomically routed into this non-custodial contract, 
          instantly dividing proceeds across a trustless recipient matrix without additional multi-sig transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Distribution Matrix Builder */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <GitFork className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Split Matrix</h3>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md ${
                  totalPercentage === 100 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}>
                  Total: {totalPercentage}% {totalPercentage !== 100 && "(Must be 100%)"}
                </span>

                {recipients.length < 6 && (
                  <button
                    onClick={addRecipient}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Recipient
                  </button>
                )}
              </div>
            </div>

            {/* Recipient Cards */}
            <div className="space-y-3">
              {recipients.map((rec) => (
                <div 
                  key={rec.id} 
                  className="bg-gray-50 dark:bg-[#141414] p-3.5 rounded-xl border border-gray-200 dark:border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={rec.label}
                      onChange={(e) => updateLabel(rec.id, e.target.value)}
                      placeholder="Recipient Label"
                      className="font-bold text-xs bg-transparent text-gray-900 dark:text-white outline-none flex-1 border-b border-transparent focus:border-amber-500 pb-0.5"
                    />

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white dark:bg-[#202020] px-2 py-1 rounded-lg border border-gray-200 dark:border-white/10">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={rec.percentage}
                          onChange={(e) => updatePercentage(rec.id, parseInt(e.target.value) || 0)}
                          className="w-10 bg-transparent font-mono text-center font-bold text-xs text-gray-900 dark:text-white outline-none"
                        />
                        <span className="font-mono text-xs text-gray-400">%</span>
                      </div>

                      {recipients.length > 1 && (
                        <button
                          onClick={() => removeRecipient(rec.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={rec.address}
                    onChange={(e) => updateAddress(rec.id, e.target.value)}
                    placeholder="0x Ethereum Address"
                    className="w-full font-mono text-[11px] bg-white dark:bg-[#1C1C1C] px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/80 outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>

            {/* Split Parameters */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-gray-600 dark:text-white/70 font-mono">
                <span>Distributor Incentive Fee:</span>
                <select
                  value={distributorFeeBps}
                  onChange={(e) => setDistributorFeeBps(parseInt(e.target.value))}
                  className="bg-gray-100 dark:bg-[#202020] border border-gray-200 dark:border-white/10 rounded px-2 py-0.5 text-xs font-mono text-gray-900 dark:text-white"
                >
                  <option value="0">0% (Default - Public Free)</option>
                  <option value="50">0.5% (Incentivized Relayer)</option>
                  <option value="100">1.0% (Fast Bot Execution)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Non-Custodial & Immutable</span>
              </div>
            </div>
          </div>

          {/* Architecture Insights Card */}
          <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase font-mono text-gray-400 tracking-wider">
              Integration Mechanism with DEX Aggregation Shell
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 space-y-1">
                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Single-Tx Pipeline
                </div>
                <p className="text-[11px] text-gray-500 dark:text-white/60 leading-relaxed">
                  Swap tokens on 1inch/Aerodrome and set `recipient` to the 0xSplits immutable clone address.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 space-y-1">
                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  Zero Custodial Risk
                </div>
                <p className="text-[11px] text-gray-500 dark:text-white/60 leading-relaxed">
                  Funds cannot be frozen or upgraded; splits contracts enforce strict mathematical invariants.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 space-y-1">
                <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-blue-500" />
                  Minimal Gas Overhead
                </div>
                <p className="text-[11px] text-gray-500 dark:text-white/60 leading-relaxed">
                  Lazy evaluation or push payouts: batch distribution costs as low as 40,000 gas on L2.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Test Payout Simulator */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Live Payout Simulator
            </h3>
            <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
              Test how an incoming swap payout will be atomically partitioned across your active recipients.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-gray-400">Incoming Swap Out-Token Amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#181818] px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-amber-500"
                />
                <select
                  value={testToken}
                  onChange={(e) => setTestToken(e.target.value)}
                  className="bg-gray-50 dark:bg-[#181818] px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 font-mono text-xs font-bold text-gray-900 dark:text-white outline-none"
                >
                  <option value="USDC">USDC</option>
                  <option value="ETH">ETH</option>
                  <option value="AERO">AERO</option>
                  <option value="OP">OP</option>
                </select>
              </div>
            </div>

            {/* Calculated Breakdown */}
            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300/30 space-y-2.5 font-mono text-xs">
              <div className="text-gray-500 dark:text-white/60 text-[10px] uppercase tracking-wider">
                Simulated Output Partition:
              </div>

              <div className="space-y-2">
                {recipients.map((rec) => {
                  const recipientShare = (numericAmount * rec.percentage) / 100;
                  return (
                    <div key={rec.id} className="flex items-center justify-between pb-1.5 border-b border-amber-200/40 dark:border-amber-900/40">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-xs">{rec.label}</div>
                        <div className="text-[9px] text-gray-400">{rec.percentage}% share</div>
                      </div>
                      <div className="font-bold text-amber-600 dark:text-amber-400 text-right">
                        {recipientShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {testToken}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verified Contract Pill */}
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#141414] border border-gray-200 dark:border-white/5 space-y-1.5">
              <div className="text-[10px] font-mono text-gray-400 uppercase">SplitMain Contract Address:</div>
              <div className="flex items-center justify-between font-mono text-xs text-gray-900 dark:text-white">
                <span>{splitMainAddress.slice(0, 10)}...{splitMainAddress.slice(-6)}</span>
                <div className="flex items-center gap-1">
                  <button onClick={copyContract} className="p-1 hover:text-blue-500 text-gray-400">
                    {copiedContract ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`https://etherscan.io/address/${splitMainAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:text-blue-500 text-gray-400"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
