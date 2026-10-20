export type ChainId = 1 | 8453 | 10 | 42161 | 137;

export interface ChainConfig {
  id: ChainId;
  name: string;
  slug: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string;
  rpcUrl: string;
  icon: string;
  color: string;
  currentGasGwei: number;
}

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
  logoURI: string;
  priceUsd: number;
  change24h: number;
  volume24hUsd: number;
  balance?: number;
}

export type ProtocolId = 
  | "1inch_v5" 
  | "lifi" 
  | "relay" 
  | "splits_0x" 
  | "aerodrome" 
  | "velodrome";

export interface RouterProtocolInventory {
  id: ProtocolId;
  protocolName: string;
  shortName: string;
  category: "Local EVM Aggregator" | "Cross-Chain Meta-Router" | "Low-Latency Intent Router" | "Post-Swap Settlement Node" | "Terminal Base Liquidity" | "Terminal OP Liquidity";
  techStack: string;
  primaryExecutionMethod: string;
  routingRole: string;
  chains: ChainId[];
  contractAddress: string;
  explorerUrl: string;
  offChainComponents: string[];
  latencyMs: number;
  reliabilityScore: number;
  solverCapacityPercent?: number;
  badgeColor: string;
  iconName: string;
  documentationUrl: string;
  keyFeatures: string[];
  calldataSnippet: string;
}

export interface SplitHop {
  poolName: string;
  protocol: string;
  chain: string;
  allocationPercent: number;
  estimatedOutput: number;
  poolFeePercent: number;
  impactPercent: number;
}

export interface SplitsRecipient {
  id: string;
  label: string;
  address: string;
  percentage: number; // 0 - 100
}

export interface RouteQuote {
  id: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: number;
  toAmount: number;
  minimumReceivedAmount: number;
  rate: number;
  priceImpact: number;
  estimatedGasUsd: number;
  gasUnits: number;
  executionTimeSec: number;
  primaryRouter: ProtocolId;
  hops: SplitHop[];
  isCrossChain: boolean;
  crossChainMechanism?: "Relay Solver (Intent)" | "Li.Fi Meta-Router (Bridge Abstraction)" | "Direct Local EVM";
  terminalLiquidityHub?: "Aerodrome" | "Velodrome / Velora" | "Uniswap v3 / Curve";
  splitsSettlement?: {
    enabled: boolean;
    contractAddress: string;
    recipients: SplitsRecipient[];
  };
  slippageTolerancePercent: number;
}

export interface LiquidityPoolInfo {
  id: string;
  name: string;
  pair: string;
  protocol: "Aerodrome" | "Velodrome" | "1inch Pathfinder" | "Uniswap v3";
  chainId: ChainId;
  chainName: string;
  poolType: "Volatile (vAMM)" | "Stable (sAMM)" | "Concentrated" | "Split Aggregated";
  tvlUsd: number;
  volume24hUsd: number;
  aprPercent: number;
  feePercent: number;
  veEmissionsWeeklyUsd?: number;
  gaugeVotersCount?: number;
  tokens: [string, string];
}

export interface OrderbookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface TradeHistoryItem {
  id: string;
  txHash: string;
  timestamp: Date;
  fromToken: string;
  fromAmount: number;
  toToken: string;
  toAmount: number;
  fromChain: string;
  toChain: string;
  routerUsed: string;
  gasFeeEth: number;
  status: "Completed" | "Pending" | "Failed";
  splitsDistributed?: boolean;
}
