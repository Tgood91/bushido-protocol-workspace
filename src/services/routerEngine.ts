import { Token, RouteQuote, SplitHop, SplitsRecipient, ProtocolId } from "../types/dex";
import { ROUTER_INVENTORY } from "../data/dexInventory";

export function calculateRouteQuote(
  fromToken: Token,
  toToken: Token,
  fromAmount: number,
  preferredRouter: "auto" | ProtocolId = "auto",
  splitsEnabled: boolean = false,
  splitsRecipients: SplitsRecipient[] = [],
  slippageTolerancePercent: number = 0.5
): RouteQuote | null {
  if (!fromToken || !toToken || fromAmount <= 0) return null;

  const isCrossChain = fromToken.chainId !== toToken.chainId;
  const inputUsdValue = fromAmount * fromToken.priceUsd;
  
  // Base raw output before fees and price impact
  const rawOutputAmount = inputUsdValue / toToken.priceUsd;

  // Impact calculation based on size
  let priceImpactPercent = 0.02; // baseline 0.02%
  if (inputUsdValue > 100000) {
    priceImpactPercent = Math.min(2.5, 0.05 + (inputUsdValue / 1000000) * 0.4);
  } else if (inputUsdValue > 10000) {
    priceImpactPercent = 0.08;
  }

  let primaryRouter: ProtocolId = "1inch_v5";
  let crossChainMechanism: "Relay Solver (Intent)" | "Li.Fi Meta-Router (Bridge Abstraction)" | "Direct Local EVM" = "Direct Local EVM";
  let terminalLiquidityHub: "Aerodrome" | "Velodrome / Velora" | "Uniswap v3 / Curve" | undefined;
  let estimatedGasUsd = 4.50;
  let gasUnits = 145000;
  let executionTimeSec = 12;

  const hops: SplitHop[] = [];

  if (!isCrossChain) {
    // Local Same-Chain routing
    if (fromToken.chainId === 8453) {
      // Base Network
      primaryRouter = preferredRouter === "auto" ? "aerodrome" : preferredRouter;
      terminalLiquidityHub = "Aerodrome";
      estimatedGasUsd = 0.02;
      gasUnits = 110000;
      executionTimeSec = 3;

      hops.push({
        poolName: `Aerodrome vAMM-${fromToken.symbol}/${toToken.symbol}`,
        protocol: "Aerodrome",
        chain: "Base",
        allocationPercent: 75,
        estimatedOutput: rawOutputAmount * 0.75 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.05,
        impactPercent: priceImpactPercent * 0.8,
      });
      hops.push({
        poolName: `Aerodrome sAMM-${fromToken.symbol}/USDC Hop`,
        protocol: "Aerodrome",
        chain: "Base",
        allocationPercent: 25,
        estimatedOutput: rawOutputAmount * 0.25 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.01,
        impactPercent: priceImpactPercent * 0.5,
      });

    } else if (fromToken.chainId === 10) {
      // Optimism
      primaryRouter = preferredRouter === "auto" ? "velodrome" : preferredRouter;
      terminalLiquidityHub = "Velodrome / Velora";
      estimatedGasUsd = 0.04;
      gasUnits = 120000;
      executionTimeSec = 3;

      hops.push({
        poolName: `Velodrome vAMM-${fromToken.symbol}/${toToken.symbol}`,
        protocol: "Velodrome",
        chain: "Optimism",
        allocationPercent: 70,
        estimatedOutput: rawOutputAmount * 0.70 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.05,
        impactPercent: priceImpactPercent * 0.8,
      });
      hops.push({
        poolName: `Velodrome Route via WETH Gauge`,
        protocol: "Velodrome",
        chain: "Optimism",
        allocationPercent: 30,
        estimatedOutput: rawOutputAmount * 0.30 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.05,
        impactPercent: priceImpactPercent * 0.6,
      });

    } else {
      // Ethereum Mainnet / Arbitrum / Polygon
      primaryRouter = "1inch_v5";
      terminalLiquidityHub = "Uniswap v3 / Curve";
      estimatedGasUsd = fromToken.chainId === 1 ? 14.20 : 0.45;
      gasUnits = fromToken.chainId === 1 ? 185000 : 130000;
      executionTimeSec = fromToken.chainId === 1 ? 14 : 4;

      // 1inch Pathfinder Split Allocation
      hops.push({
        poolName: `Uniswap v3 (0.05% Tier)`,
        protocol: "1inch Pathfinder (Uni v3)",
        chain: fromToken.chainId === 1 ? "Ethereum" : "Arbitrum",
        allocationPercent: 50,
        estimatedOutput: rawOutputAmount * 0.50 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.05,
        impactPercent: priceImpactPercent * 0.7,
      });
      hops.push({
        poolName: `Curve Finance Stable/Crypto Pool`,
        protocol: "1inch Pathfinder (Curve)",
        chain: fromToken.chainId === 1 ? "Ethereum" : "Arbitrum",
        allocationPercent: 30,
        estimatedOutput: rawOutputAmount * 0.30 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.04,
        impactPercent: priceImpactPercent * 0.4,
      });
      hops.push({
        poolName: `Balancer v2 Composable Pool`,
        protocol: "1inch Pathfinder (Balancer)",
        chain: fromToken.chainId === 1 ? "Ethereum" : "Arbitrum",
        allocationPercent: 20,
        estimatedOutput: rawOutputAmount * 0.20 * (1 - priceImpactPercent / 100),
        poolFeePercent: 0.03,
        impactPercent: priceImpactPercent * 0.5,
      });
    }

  } else {
    // Cross-Chain Routing (Li.Fi vs Relay)
    const isRelayCandidate = preferredRouter === "relay" || (preferredRouter === "auto" && inputUsdValue < 50000);

    if (isRelayCandidate) {
      primaryRouter = "relay";
      crossChainMechanism = "Relay Solver (Intent)";
      estimatedGasUsd = 1.80; // Relay gas delivery discount
      gasUnits = 95000;
      executionTimeSec = 6; // sub-10 second fulfillment

      // Check destination liquidity terminal
      if (toToken.chainId === 8453) {
        terminalLiquidityHub = "Aerodrome";
        hops.push({
          poolName: `Relay Intent Solver Escrow`,
          protocol: "Relay Solver",
          chain: "Cross-Chain",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount,
          poolFeePercent: 0.02,
          impactPercent: 0.01, // Near zero slippage on intent fill
        });
        hops.push({
          poolName: `Aerodrome Slipstream Terminal AMM`,
          protocol: "Aerodrome",
          chain: "Base",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount * (1 - priceImpactPercent / 100),
          poolFeePercent: 0.05,
          impactPercent: priceImpactPercent * 0.9,
        });
      } else if (toToken.chainId === 10) {
        terminalLiquidityHub = "Velodrome / Velora";
        hops.push({
          poolName: `Relay Instant Solver Execution`,
          protocol: "Relay Solver",
          chain: "Cross-Chain",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount,
          poolFeePercent: 0.02,
          impactPercent: 0.01,
        });
        hops.push({
          poolName: `Velodrome Gauge Destination Terminal`,
          protocol: "Velodrome",
          chain: "Optimism",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount * (1 - priceImpactPercent / 100),
          poolFeePercent: 0.05,
          impactPercent: priceImpactPercent * 0.9,
        });
      } else {
        hops.push({
          poolName: `Relay Solver Instant Settlement`,
          protocol: "Relay",
          chain: "Destination Hop",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount * (1 - priceImpactPercent / 100),
          poolFeePercent: 0.03,
          impactPercent: priceImpactPercent,
        });
      }

    } else {
      // Li.Fi Meta-Router
      primaryRouter = "lifi";
      crossChainMechanism = "Li.Fi Meta-Router (Bridge Abstraction)";
      estimatedGasUsd = 3.50;
      gasUnits = 240000;
      executionTimeSec = 45;

      hops.push({
        poolName: `Source Swap (1inch / Local DEX)`,
        protocol: "1inch v5 / Local",
        chain: "Source",
        allocationPercent: 100,
        estimatedOutput: rawOutputAmount * 0.99,
        poolFeePercent: 0.05,
        impactPercent: priceImpactPercent * 0.5,
      });
      hops.push({
        poolName: `Li.Fi Diamond Bridge Abstraction (Stargate/Across)`,
        protocol: "Li.Fi",
        chain: "Bridge",
        allocationPercent: 100,
        estimatedOutput: rawOutputAmount * 0.985,
        poolFeePercent: 0.08,
        impactPercent: 0.05,
      });

      if (toToken.chainId === 8453) {
        terminalLiquidityHub = "Aerodrome";
        hops.push({
          poolName: `Aerodrome Base Destination Swap`,
          protocol: "Aerodrome",
          chain: "Base",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount * (1 - priceImpactPercent / 100),
          poolFeePercent: 0.05,
          impactPercent: priceImpactPercent * 0.7,
        });
      } else if (toToken.chainId === 10) {
        terminalLiquidityHub = "Velodrome / Velora";
        hops.push({
          poolName: `Velodrome OP Destination Swap`,
          protocol: "Velodrome",
          chain: "Optimism",
          allocationPercent: 100,
          estimatedOutput: rawOutputAmount * (1 - priceImpactPercent / 100),
          poolFeePercent: 0.05,
          impactPercent: priceImpactPercent * 0.7,
        });
      }
    }
  }

  // Net output after impact
  const toAmount = rawOutputAmount * (1 - priceImpactPercent / 100);
  const rate = toAmount / fromAmount;

  return {
    id: `quote-${Date.now()}`,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    rate,
    priceImpact: priceImpactPercent,
    estimatedGasUsd,
    gasUnits,
    executionTimeSec,
    primaryRouter,
    hops,
    isCrossChain,
    crossChainMechanism,
    terminalLiquidityHub,
    splitsSettlement: splitsEnabled ? {
      enabled: true,
      contractAddress: "0x2ed6c4B5dA6378c7897AC67Ba9e43102Feb694EE",
      recipients: splitsRecipients.length > 0 ? splitsRecipients : [
        { id: "1", label: "DAO Treasury", address: "0x8B32...7C12", percentage: 60 },
        { id: "2", label: "Protocol Staking Pool", address: "0x34A1...9F04", percentage: 30 },
        { id: "3", label: "Dev & Operations", address: "0x12F8...56E1", percentage: 10 },
      ]
    } : undefined,
    slippageTolerancePercent
  };
}
