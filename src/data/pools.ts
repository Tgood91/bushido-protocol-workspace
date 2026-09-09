import { LiquidityPoolInfo } from "../types/dex";

export const LIQUIDITY_POOLS: LiquidityPoolInfo[] = [
  // Aerodrome (Base Network)
  {
    id: "aero-weth-usdc",
    name: "vAMM-WETH/USDC",
    pair: "WETH / USDC",
    protocol: "Aerodrome",
    chainId: 8453,
    chainName: "Base",
    poolType: "Volatile (vAMM)",
    tvlUsd: 284500000,
    volume24hUsd: 68900000,
    aprPercent: 34.8,
    feePercent: 0.05,
    veEmissionsWeeklyUsd: 1450000,
    gaugeVotersCount: 3840,
    tokens: ["WETH", "USDC"]
  },
  {
    id: "aero-aero-usdc",
    name: "vAMM-AERO/USDC",
    pair: "AERO / USDC",
    protocol: "Aerodrome",
    chainId: 8453,
    chainName: "Base",
    poolType: "Volatile (vAMM)",
    tvlUsd: 142000000,
    volume24hUsd: 45200000,
    aprPercent: 78.4,
    feePercent: 0.30,
    veEmissionsWeeklyUsd: 2100000,
    gaugeVotersCount: 5120,
    tokens: ["AERO", "USDC"]
  },
  {
    id: "aero-usdc-usdt",
    name: "sAMM-USDC/USDT",
    pair: "USDC / USDT",
    protocol: "Aerodrome",
    chainId: 8453,
    chainName: "Base",
    poolType: "Stable (sAMM)",
    tvlUsd: 198000000,
    volume24hUsd: 31000000,
    aprPercent: 12.6,
    feePercent: 0.01,
    veEmissionsWeeklyUsd: 620000,
    gaugeVotersCount: 1920,
    tokens: ["USDC", "USDT"]
  },

  // Velodrome (Optimism)
  {
    id: "velo-weth-usdc",
    name: "vAMM-WETH/USDC",
    pair: "WETH / USDC",
    protocol: "Velodrome",
    chainId: 10,
    chainName: "Optimism",
    poolType: "Volatile (vAMM)",
    tvlUsd: 112000000,
    volume24hUsd: 29400000,
    aprPercent: 28.5,
    feePercent: 0.05,
    veEmissionsWeeklyUsd: 890000,
    gaugeVotersCount: 2750,
    tokens: ["WETH", "USDC"]
  },
  {
    id: "velo-op-usdc",
    name: "vAMM-OP/USDC",
    pair: "OP / USDC",
    protocol: "Velodrome",
    chainId: 10,
    chainName: "Optimism",
    poolType: "Volatile (vAMM)",
    tvlUsd: 78500000,
    volume24hUsd: 21800000,
    aprPercent: 46.2,
    feePercent: 0.30,
    veEmissionsWeeklyUsd: 1150000,
    gaugeVotersCount: 3100,
    tokens: ["OP", "USDC"]
  },
  {
    id: "velo-velo-usdc",
    name: "vAMM-VELO/USDC",
    pair: "VELO / USDC",
    protocol: "Velodrome",
    chainId: 10,
    chainName: "Optimism",
    poolType: "Volatile (vAMM)",
    tvlUsd: 54000000,
    volume24hUsd: 16500000,
    aprPercent: 64.9,
    feePercent: 0.30,
    veEmissionsWeeklyUsd: 940000,
    gaugeVotersCount: 2240,
    tokens: ["VELO", "USDC"]
  },

  // 1inch Local EVM Aggregated Depth (Ethereum Mainnet)
  {
    id: "1inch-eth-usdc-deep",
    name: "Pathfinder Tri-Pool Route",
    pair: "ETH / USDC",
    protocol: "1inch Pathfinder",
    chainId: 1,
    chainName: "Ethereum",
    poolType: "Split Aggregated",
    tvlUsd: 890000000,
    volume24hUsd: 310000000,
    aprPercent: 18.2,
    feePercent: 0.03,
    tokens: ["ETH", "USDC"]
  },
  {
    id: "1inch-wbtc-eth",
    name: "Curve + Balancer Split",
    pair: "WBTC / ETH",
    protocol: "1inch Pathfinder",
    chainId: 1,
    chainName: "Ethereum",
    poolType: "Split Aggregated",
    tvlUsd: 420000000,
    volume24hUsd: 98000000,
    aprPercent: 14.1,
    feePercent: 0.04,
    tokens: ["WBTC", "ETH"]
  }
];
