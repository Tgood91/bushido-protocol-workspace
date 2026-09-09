import React, { useState } from "react";
import { 
  Droplets, 
  Compass, 
  Flame, 
  Search, 
  TrendingUp, 
  Vote, 
  Lock, 
  ExternalLink, 
  Sliders, 
  Sparkles,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { LIQUIDITY_POOLS } from "../../data/pools";
import { LiquidityPoolInfo } from "../../types/dex";
import { Tooltip } from "../Tooltip";

export const LiquidityGaugesView: React.FC = () => {
  const [selectedChainFilter, setSelectedChainFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lockDurationYears, setLockDurationYears] = useState<number>(4);
  const [stakeAmountUsd, setStakeAmountUsd] = useState<string>("5000");

  const filteredPools = LIQUIDITY_POOLS.filter((pool) => {
    const matchesChain = selectedChainFilter === "all" || pool.protocol.toLowerCase().includes(selectedChainFilter);
    const matchesSearch = 
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChain && matchesSearch;
  });

  // ve(3,3) boost formula calculation: boost multiplier = 1 + 1.5 * (lockYears / 4)
  const boostMultiplier = 1 + 1.5 * (lockDurationYears / 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-rose-500/10 border border-sky-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 font-bold">
            Terminal Liquidity Destinations
          </span>
          <span className="text-[10px] font-mono text-gray-400">ve(3,3) AMM Ecosystem</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Aerodrome (Base) & Velodrome (Optimism) Terminal Pools
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-3xl leading-relaxed">
          The aggregation shell routes direct execution swaps through Aerodrome on Base and Velodrome on Optimism. 
          Both protocols anchor their respective L2 ecosystems via ve(3,3) tokenomics—aligning liquidity providers, 
          traders, and voters with gauge bribes and minimal swap slippage.
        </p>
      </div>

      {/* Protocol Summary Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Aerodrome Card */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
                <Compass className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Aerodrome Finance</h3>
                <span className="text-[10px] font-mono text-gray-400">Base Network Native Hub</span>
              </div>
            </div>
            <a
              href="https://aerodrome.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
            The central trading and liquidity marketplace on Base. Employs Slipstream concentrated liquidity and 
            automated gauge voting to subsidize high-volume pairs like WETH/USDC, cbBTC, and AERO.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-white/5 text-xs font-mono">
            <div>
              <div className="text-[10px] text-gray-400">Total TVL</div>
              <div className="font-bold text-gray-900 dark:text-white">$850.4M</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">24h Volume</div>
              <div className="font-bold text-gray-900 dark:text-white">$142.6M</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">Avg Stable Fee</div>
              <div className="font-bold text-emerald-500">0.01% - 0.05%</div>
            </div>
          </div>
        </div>

        {/* Velodrome Card */}
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <Flame className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Velodrome / Velora</h3>
                <span className="text-[10px] font-mono text-gray-400">Optimism Superchain Hub</span>
              </div>
            </div>
            <a
              href="https://velodrome.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs text-gray-600 dark:text-white/70 leading-relaxed">
            The liquidity engine of the Optimism Superchain. Powers seamless token routing across OP Mainnet, 
            Mode, and Fraxtal with unified veVELO voting gauges and meta-governance bribes.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-white/5 text-xs font-mono">
            <div>
              <div className="text-[10px] text-gray-400">Total TVL</div>
              <div className="font-bold text-gray-900 dark:text-white">$320.1M</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">24h Volume</div>
              <div className="font-bold text-gray-900 dark:text-white">$58.4M</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400">Avg Volatile Fee</div>
              <div className="font-bold text-rose-500">0.30%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Gauge Multiplier Simulator */}
      <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-purple-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              ve(3,3) Voting Gauge & Boost Multiplier Simulator
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
            Boost: {boostMultiplier.toFixed(2)}x
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase">Lock Duration (Years)</label>
            <div className="flex items-center gap-2 mt-1.5">
              {[1, 2, 3, 4].map((years) => (
                <button
                  key={years}
                  onClick={() => setLockDurationYears(years)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                    lockDurationYears === years
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-gray-100 dark:bg-[#1A1A1A] text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/5"
                  }`}
                >
                  {years}y
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-gray-400 uppercase">Simulated Stake Capital</label>
            <div className="flex items-center gap-1.5 mt-1.5 bg-gray-50 dark:bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 font-mono">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={stakeAmountUsd}
                onChange={(e) => setStakeAmountUsd(e.target.value)}
                className="w-full bg-transparent outline-none font-bold text-gray-900 dark:text-white"
              />
              <span className="text-gray-400 text-[10px]">USD</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-300/30 flex items-center justify-between font-mono">
            <div>
              <div className="text-[10px] text-gray-500 dark:text-white/60">Estimated Boosted APR:</div>
              <div className="text-base font-bold text-purple-600 dark:text-purple-400">
                {(18.4 * boostMultiplier).toFixed(2)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 dark:text-white/60">Base APR:</div>
              <div className="text-xs text-gray-400 line-through">18.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pools Table */}
      <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Terminal Liquidity Pools</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search pool or token..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex items-center bg-gray-100 dark:bg-[#181818] p-1 rounded-lg border border-gray-200 dark:border-white/5 text-xs font-mono">
              <button
                onClick={() => setSelectedChainFilter("all")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedChainFilter === "all" ? "bg-white dark:bg-[#252525] text-gray-900 dark:text-white font-bold" : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedChainFilter("aerodrome")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedChainFilter === "aerodrome" ? "bg-white dark:bg-[#252525] text-sky-600 dark:text-sky-400 font-bold" : "text-gray-500"
                }`}
              >
                Base
              </button>
              <button
                onClick={() => setSelectedChainFilter("velodrome")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedChainFilter === "velodrome" ? "bg-white dark:bg-[#252525] text-rose-600 dark:text-rose-400 font-bold" : "text-gray-500"
                }`}
              >
                Optimism
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-400 text-[10px] uppercase">
                <th className="py-2.5 px-3">Pool Pair</th>
                <th className="py-2.5 px-3">Protocol / Hub</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Fee Tier</th>
                <th className="py-2.5 px-3 text-right">TVL (USD)</th>
                <th className="py-2.5 px-3 text-right">24h Volume</th>
                <th className="py-2.5 px-3 text-right">Base APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredPools.map((pool) => (
                <tr key={pool.id} className="hover:bg-gray-50/60 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900 dark:text-white">
                    {pool.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1.5">
                      {pool.protocol === "Aerodrome" ? (
                        <Compass className="w-3.5 h-3.5 text-sky-500" />
                      ) : (
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span>{pool.protocol}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                      pool.poolType.includes("Stable") 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}>
                      {pool.poolType}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-gray-500 dark:text-white/60">
                    {pool.feePercent}%
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-gray-900 dark:text-white">
                    ${(pool.tvlUsd / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-right text-gray-600 dark:text-white/70">
                    ${(pool.volume24hUsd / 1000000).toFixed(1)}M
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {pool.aprPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
