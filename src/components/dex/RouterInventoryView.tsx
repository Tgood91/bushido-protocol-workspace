import React, { useState } from "react";
import { 
  Layers, 
  Zap, 
  Globe, 
  GitFork, 
  Droplets, 
  Compass, 
  Flame, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Code, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Activity,
  Sliders,
  ChevronRight
} from "lucide-react";
import { ROUTER_INVENTORY } from "../../data/dexInventory";
import { RouterProtocolInventory } from "../../types/dex";
import { Tooltip } from "../Tooltip";

export const RouterInventoryView: React.FC = () => {
  const [selectedProtocol, setSelectedProtocol] = useState<RouterProtocolInventory>(ROUTER_INVENTORY[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isSimulatingEthCall, setIsSimulatingEthCall] = useState(false);
  const [simulatedCalldataResult, setSimulatedCalldataResult] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleTestEthCall = (protocol: RouterProtocolInventory) => {
    setIsSimulatingEthCall(true);
    setSimulatedCalldataResult(null);

    setTimeout(() => {
      setIsSimulatingEthCall(false);
      if (protocol.id === "1inch_v5") {
        setSimulatedCalldataResult(`eth_call successful:
gas_estimate: 148,290
pathfinder_hops: 3 (Uniswap v3 50%, Curve 30%, Balancer 20%)
return_bytes: 0x00000000000000000000000000000000000000000000000000000000d6037a34
min_return: 3591.29 USDC`);
      } else if (protocol.id === "relay") {
        setSimulatedCalldataResult(`Relay Solver Quote Received:
solver_id: 0x92f...solver_relay_01
fulfillment_latency: 8.4s
cross_chain_quote_id: rel_88491294819
deposit_address: 0x0000000000000000000000000000000000000000 (Relay Relayer EOA)
status: Solver liquidity confirmed on destination chain`);
      } else if (protocol.id === "splits_0x") {
        setSimulatedCalldataResult(`0xSplits SplitMain.distributeERC20:
split_contract: 0x2ed6c4fe5350ec2bc4f23b9149b52c00329094ee
recipients_count: 4
distributor_fee_bps: 0 (0%)
merkle_root_verified: true
payout_status: Atomic execution ready`);
      } else {
        setSimulatedCalldataResult(`Simulation Output for ${protocol.protocolName}:
contract: ${protocol.contractAddress || "EVM Direct Router"}
latency_ping: ${protocol.latencyMs}ms
reliability_score: ${protocol.reliabilityScore}%
status: Ready for routing aggregation`);
      }
    }, 700);
  };

  const filteredProtocols = ROUTER_INVENTORY.filter((item) => {
    const matchesSearch = 
      item.protocolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techStack.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.routingRole.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "all") return matchesSearch;
    if (categoryFilter === "evm") return matchesSearch && item.id.includes("1inch");
    if (categoryFilter === "cross_chain") return matchesSearch && (item.id === "relay" || item.id === "lifi");
    if (categoryFilter === "terminal") return matchesSearch && (item.id === "aerodrome" || item.id === "velodrome");
    if (categoryFilter === "settlement") return matchesSearch && item.id === "splits_0x";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-purple-900/20 border border-blue-500/20 dark:border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
            Architecture Blueprint
          </span>
          <span className="text-[10px] font-mono text-gray-400">Phase 1 Infrastructure Specification</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
          Standardized DEX Router Inventory Mapping
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 max-w-3xl leading-relaxed">
          The standardized blueprint of your specified infrastructure components, normalized for an aggregation shell. 
          Each protocol fulfills a dedicated structural tier in the execution lifecycle: local AMM capital splitting, 
          instant solver intents, cross-chain meta-routing, terminal ve(3,3) liquidity, and post-swap settlement.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tech stack, roles, or protocol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: "all", label: "All Nodes (6)" },
            { id: "evm", label: "Local EVM" },
            { id: "cross_chain", label: "Cross-Chain" },
            { id: "terminal", label: "ve(3,3) Terminal" },
            { id: "settlement", label: "Settlement" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat.id
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-white dark:bg-[#161616] text-gray-600 dark:text-white/60 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProtocols.map((protocol) => {
          const isSelected = selectedProtocol.id === protocol.id;
          return (
            <div
              key={protocol.id}
              onClick={() => setSelectedProtocol(protocol)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-3.5 relative ${
                isSelected
                  ? "bg-blue-50/40 dark:bg-blue-950/20 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                  : "bg-white dark:bg-[#0F0F0F] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10">
                    {protocol.id === "1inch_v5" && <Layers className="w-5 h-5 text-blue-500" />}
                    {protocol.id === "lifi" && <Globe className="w-5 h-5 text-purple-500" />}
                    {protocol.id === "relay" && <Zap className="w-5 h-5 text-emerald-500" />}
                    {protocol.id === "splits_0x" && <GitFork className="w-5 h-5 text-amber-500" />}
                    {protocol.id === "aerodrome" && <Compass className="w-5 h-5 text-sky-500" />}
                    {protocol.id === "velodrome" && <Flame className="w-5 h-5 text-rose-500" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                      {protocol.protocolName}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-500 dark:text-white/40">
                      {protocol.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-2.5 h-2.5" />
                  {protocol.reliabilityScore}%
                </div>
              </div>

              {/* Tech Stack & Execution Details */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Tech Stack / Architecture</div>
                  <p className="text-gray-800 dark:text-white/80 font-medium text-[11px] mt-0.5">
                    {protocol.techStack}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Primary Execution Method</div>
                  <p className="text-gray-700 dark:text-white/70 text-[11px] mt-0.5">
                    {protocol.primaryExecutionMethod}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase text-gray-400 tracking-wider">Routing / Token Splitting Role</div>
                  <p className="text-blue-700 dark:text-blue-300 font-medium text-[11px] mt-0.5">
                    {protocol.routingRole}
                  </p>
                </div>
              </div>

              {/* Verified Contract Address */}
              {protocol.contractAddress && (
                <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Contract:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-700 dark:text-white/80 font-semibold">
                      {protocol.contractAddress.slice(0, 6)}...{protocol.contractAddress.slice(-4)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(protocol.contractAddress!);
                      }}
                      className="p-1 hover:text-blue-500 text-gray-400 transition-colors"
                    >
                      {copiedAddress === protocol.contractAddress ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Key Features Chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {protocol.keyFeatures.slice(0, 3).map((feat, i) => (
                  <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60">
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Protocol Deep-Dive & Calldata Inspector */}
      {selectedProtocol && (
        <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedProtocol.protocolName} Deep Dive
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                  Tier: {selectedProtocol.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-white/50 font-mono mt-0.5">
                Latency Ping: {selectedProtocol.latencyMs}ms | Reliability: {selectedProtocol.reliabilityScore}% | Chains: {selectedProtocol.chains.join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTestEthCall(selectedProtocol)}
                disabled={isSimulatingEthCall}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{isSimulatingEthCall ? "Simulating..." : "Test eth_call / Calldata"}</span>
              </button>

              <a
                href={selectedProtocol.documentationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Docs
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Architecture Breakdown */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider">
                  Tech Stack & Smart Contract Layer
                </h4>
                <p className="text-xs text-gray-800 dark:text-white/90 leading-relaxed mt-1">
                  {selectedProtocol.techStack}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider">
                  Primary Execution Method
                </h4>
                <p className="text-xs text-gray-800 dark:text-white/90 leading-relaxed mt-1">
                  {selectedProtocol.primaryExecutionMethod}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider">
                  Routing & Splitting Role
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold leading-relaxed mt-1">
                  {selectedProtocol.routingRole}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-gray-400 tracking-wider mb-1.5">
                  Core Architectural Capabilities
                </h4>
                <ul className="space-y-1 text-xs text-gray-700 dark:text-white/80">
                  {selectedProtocol.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Interactive Terminal / Calldata Output */}
            <div className="bg-gray-900 rounded-xl p-4 text-emerald-400 font-mono text-xs border border-white/10 flex flex-col justify-between min-h-60">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-gray-400 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-blue-400" />
                    Simulated RPC & Contract Calldata
                  </span>
                  <span>Node: EVM Mainnet</span>
                </div>

                {simulatedCalldataResult ? (
                  <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-emerald-300">
                    {simulatedCalldataResult}
                  </pre>
                ) : (
                  <div className="text-gray-500 py-6 text-center text-[11px] leading-relaxed">
                    Click "Test eth_call / Calldata" above to simulate an RPC dispatch to {selectedProtocol.protocolName}'s verified contracts.
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] text-gray-500 flex justify-between">
                <span>Verification: Solidity v0.8.20+</span>
                <span>Security: Non-Custodial</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
