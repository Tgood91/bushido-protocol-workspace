import { RouterProtocolInventory, ChainConfig } from "../types/dex";

export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    id: 1,
    name: "Ethereum Mainnet",
    slug: "ethereum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorer: "https://etherscan.io",
    rpcUrl: "https://eth.llamarpc.com",
    icon: "Ξ",
    color: "#627EEA",
    currentGasGwei: 18.4,
  },
  {
    id: 8453,
    name: "Base Network",
    slug: "base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorer: "https://basescan.org",
    rpcUrl: "https://mainnet.base.org",
    icon: "🔵",
    color: "#0052FF",
    currentGasGwei: 0.04,
  },
  {
    id: 10,
    name: "Optimism Mainnet",
    slug: "optimism",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorer: "https://optimistic.etherscan.io",
    rpcUrl: "https://mainnet.optimism.io",
    icon: "🔴",
    color: "#FF0420",
    currentGasGwei: 0.05,
  },
  {
    id: 42161,
    name: "Arbitrum One",
    slug: "arbitrum",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    blockExplorer: "https://arbiscan.io",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    icon: "🔷",
    color: "#28A0F0",
    currentGasGwei: 0.08,
  },
  {
    id: 137,
    name: "Polygon PoS",
    slug: "polygon",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    blockExplorer: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
    icon: "💜",
    color: "#8247E5",
    currentGasGwei: 32.1,
  },
];

export const ROUTER_INVENTORY: RouterProtocolInventory[] = [
  {
    id: "1inch_v5",
    protocolName: "1inch v5 (Aggregation Protocol)",
    shortName: "1inch v5",
    category: "Local EVM Aggregator",
    techStack: "EVM Smart Contracts (AggregationRouterV5) & Off-chain Pathfinder API",
    primaryExecutionMethod: "Direct eth_call routing with split-destination execution swaps.",
    routingRole: "Primary Local EVM Aggregator: Splits heavy capital across hundreds of pools.",
    chains: [1, 8453, 10, 42161, 137],
    contractAddress: "0x111111125421cA6dc452d289314280a0f8842A65",
    explorerUrl: "https://etherscan.io/address/0x111111125421cA6dc452d289314280a0f8842A65",
    offChainComponents: ["Pathfinder Path Algorithm", "Spot Price Engine", "Orderbook RPC Aggregator"],
    latencyMs: 185,
    reliabilityScore: 99.9,
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    iconName: "Layers",
    documentationUrl: "https://docs.1inch.io/docs/aggregation-protocol/introduction",
    keyFeatures: [
      "Dynamic capital splitting across 400+ AMM liquidity sources",
      "Gas-optimized Pathfinder algorithm finding multi-hop paths",
      "Direct eth_call execution preventing front-running",
      "Partial fill and RFQ limit order aggregation support"
    ],
    calldataSnippet: `// 1inch v5 swap execution signature
function swap(
  IAggregationExecutor executor,
  SwapDescription calldata desc,
  bytes calldata permit,
  bytes calldata data
) external payable returns (uint256 returnAmount, uint256 spentAmount);`
  },
  {
    id: "lifi",
    protocolName: "Li.Fi",
    shortName: "Li.Fi",
    category: "Cross-Chain Meta-Router",
    techStack: "Cross-chain Bridging & Aggregation SDK / Stargate / Connext / Wormhole",
    primaryExecutionMethod: "Multi-chain contract abstraction bridging + destination swapping.",
    routingRole: "Cross-Chain Meta-Router: Computes paths bridging Asset X on Chain A to Asset Y on Chain B.",
    chains: [1, 8453, 10, 42161, 137],
    contractAddress: "0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE",
    explorerUrl: "https://etherscan.io/address/0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE",
    offChainComponents: ["Li.Fi Route Calculator", "Bridge Liquidity Indexer", "Fall-through Estimator"],
    latencyMs: 820,
    reliabilityScore: 99.4,
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    iconName: "Globe",
    documentationUrl: "https://docs.li.fi/",
    keyFeatures: [
      "Unified multi-bridge aggregation (Stargate, Across, Connext, Hop)",
      "Swap-and-bridge contract abstraction (Source DEX -> Bridge -> Dest DEX)",
      "Automatic fallback routing when bridge paths congest",
      "Support for 25+ EVM chains and Layer 2 rollups"
    ],
    calldataSnippet: `// Li.Fi Diamond swapAndStartBridgeTokensViaGenericCrossChain
function swapAndStartBridgeTokensViaGenericCrossChain(
  ILiFi.BridgeData memory _bridgeData,
  LibSwap.SwapData[] memory _swapData,
  GenericCrossChainData memory _crossChainData
) external payable;`
  },
  {
    id: "relay",
    protocolName: "Relay",
    shortName: "Relay",
    category: "Low-Latency Intent Router",
    techStack: "Cross-chain intent-based bridging, gas delivery, and instant fulfillment.",
    primaryExecutionMethod: "Solvers/Market Makers instantly fulfill execution on destination; settle on-chain asynchronously.",
    routingRole: "Low-Latency Cross-Chain Router: Skips standard bridging latency using liquidity pools/solvers.",
    chains: [1, 8453, 10, 42161],
    contractAddress: "0xa59c4033C87a0225d30A093e839218206d288d6c",
    explorerUrl: "https://basescan.org/address/0xa59c4033C87a0225d30A093e839218206d288d6c",
    offChainComponents: ["Relay Intent Solver Network", "Decentralized Gas Relayers", "Mempool Monitor"],
    latencyMs: 32,
    reliabilityScore: 99.8,
    solverCapacityPercent: 98.6,
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    iconName: "Zap",
    documentationUrl: "https://relay.link/docs",
    keyFeatures: [
      "Sub-10 second cross-chain execution via active Solver bonds",
      "Native gas delivery (receives native destination gas simultaneously)",
      "Zero slippage guarantee on intent execution quotes",
      "Asynchronous batch settlement lowering end-user gas overhead by 65%"
    ],
    calldataSnippet: `// Relay Solver Intent Submission
struct Intent {
  bytes32 intentHash;
  uint256 destinationChainId;
  address solverRecipient;
  uint256 outputMin;
  uint256 deadline;
}
function executeIntent(Intent calldata intent, bytes calldata signature) external payable;`
  },
  {
    id: "splits_0x",
    protocolName: "0xSplits",
    shortName: "0xSplits",
    category: "Post-Swap Settlement Node",
    techStack: "On-chain programmatic asset distribution and splitter modules.",
    primaryExecutionMethod: "Native atomic payment routing via invariant distribution matrices.",
    routingRole: "Post-Swap Settlement Node: Automatically distributes out-tokens to multiple wallets post-routing.",
    chains: [1, 8453, 10, 42161, 137],
    contractAddress: "0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE",
    explorerUrl: "https://etherscan.io/address/0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE",
    offChainComponents: ["Split Subgraph Indexer", "Merkle Recipient Registry", "Liquid Split Vaults"],
    latencyMs: 45,
    reliabilityScore: 100.0,
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    iconName: "GitFork",
    documentationUrl: "https://docs.splits.org/",
    keyFeatures: [
      "Atomic non-custodial multi-recipient distribution in a single transaction",
      "Immutable distribution matrices with configurable basis points (10,000 max)",
      "Composability: Integrates directly as the swap destination address",
      "Gas-efficient batch payout and liquid split streaming support"
    ],
    calldataSnippet: `// 0xSplits SplitMain.createSplit
function createSplit(
  address[] calldata accounts,
  uint32[] calldata percentAllocations,
  uint32 distributorFee,
  address controller
) external returns (address split);`
  },
  {
    id: "aerodrome",
    protocolName: "Aerodrome",
    shortName: "Aerodrome",
    category: "Terminal Base Liquidity",
    techStack: "Base Network ve(3,3) Core Native Liquidity Hub (Solidly fork).",
    primaryExecutionMethod: "Direct on-chain Automated Market Maker (AMM) pools (Stable & Volatile).",
    routingRole: "Terminal Liquidity Destination: The physical depth provider for Base-network hops.",
    chains: [8453],
    contractAddress: "0xcF664087a5bB0237a0BAd6742852ec6c8d58505e",
    explorerUrl: "https://basescan.org/address/0xcF664087a5bB0237a0BAd6742852ec6c8d58505e",
    offChainComponents: ["Gauge Voting Engine", "Epoch Bribe Monitor", "veAERO Lock Analytics"],
    latencyMs: 95,
    reliabilityScore: 99.9,
    badgeColor: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    iconName: "Compass",
    documentationUrl: "https://aerodrome.finance/docs",
    keyFeatures: [
      "#1 Liquidity Hub on Base with over $850M+ total value locked",
      "Dual AMM curves: Volatile (x*y=k) and Stable (x^3*y+y^3*x=k)",
      "ve(3,3) gauge-driven emissions creating hyper-deep liquidity pools",
      "Negligible Base L2 gas fees (< $0.01 per swap)"
    ],
    calldataSnippet: `// Aerodrome Router swapExactTokensForTokens
function swapExactTokensForTokens(
  uint256 amountIn,
  uint256 amountOutMin,
  Route[] calldata routes,
  address to,
  uint256 deadline
) external returns (uint256[] memory amounts);`
  },
  {
    id: "velodrome",
    protocolName: "Velodrome / Velora",
    shortName: "Velodrome",
    category: "Terminal OP Liquidity",
    techStack: "Velodrome-based core AMM framework on Optimism/Ecosystem branches.",
    primaryExecutionMethod: "On-chain AMM pools utilizing gauge-driven token incentives.",
    routingRole: "Terminal Liquidity Destination: The physical depth provider for OP Stack ecosystem hops.",
    chains: [10],
    contractAddress: "0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858",
    explorerUrl: "https://optimistic.etherscan.io/address/0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858",
    offChainComponents: ["Superchain Gauge Synthesizer", "Bribe Relayer", "veVELO Voting Gauge"],
    latencyMs: 110,
    reliabilityScore: 99.8,
    badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    iconName: "Flame",
    documentationUrl: "https://velodrome.finance/docs",
    keyFeatures: [
      "The liquidity flywheel for the Optimism Superchain ecosystem",
      "Gauge-incentivized routing with optimal depth for OP & ecosystem tokens",
      "Sub-second execution confirmations on Optimism Bedrock",
      "Universal Router interface with multi-hop route auto-discovery"
    ],
    calldataSnippet: `// Velodrome Universal Router swap
function swapExactTokensForTokensSimple(
  uint256 amountIn,
  uint256 amountOutMin,
  address tokenFrom,
  address tokenTo,
  bool stable,
  address to,
  uint256 deadline
) external returns (uint256[] memory amounts);`
  },
];
