export function getDexIntelligenceResponse(query: string) {
  const q = query.toLowerCase();

  if (q.includes("1inch") || q.includes("pathfinder") || q.includes("local evm") || q.includes("capital")) {
    return [
      {
        systemMessage: {
          text: {
            textType: "THOUGHT",
            parts: [
              "Analyzing 1inch v5 Aggregation Protocol architecture.",
              "Evaluating off-chain Pathfinder algorithm path distribution across EVM AMMs (Uniswap v3, Curve, Balancer).",
              "Querying BigQuery Ethereum public dataset for AggregationRouterV5 contract interactions."
            ]
          }
        }
      },
      {
        systemMessage: {
          data: {
            generatedSql: `SELECT 
  DATE(block_timestamp) AS date,
  COUNT(1) AS swap_count,
  ROUND(SUM(CAST(JSON_EXTRACT_SCALAR(data, '$.spentAmount') AS NUMERIC) / 1e18), 2) AS eth_volume,
  ROUND(AVG(receipt_gas_used), 0) AS avg_gas_used
FROM \`bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions_by_to_address\`
WHERE to_address = '0x111111125421ca6dc452d289314280a0f8842a65' -- 1inch v5 Router
  AND block_timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY date
ORDER BY date DESC;`,
            result: {
              schema: {
                fields: [
                  { name: "date", type: "DATE" },
                  { name: "swap_count", type: "INTEGER" },
                  { name: "eth_volume", type: "NUMERIC" },
                  { name: "avg_gas_used", type: "INTEGER" }
                ]
              },
              data: [
                { date: "2026-09-08", swap_count: 38412, eth_volume: 49820.4, avg_gas_used: 154200 },
                { date: "2026-09-07", swap_count: 35290, eth_volume: 44105.1, avg_gas_used: 151800 },
                { date: "2026-09-06", swap_count: 41800, eth_volume: 58240.0, avg_gas_used: 158900 },
                { date: "2026-09-05", swap_count: 39120, eth_volume: 51200.7, avg_gas_used: 153400 },
                { date: "2026-09-04", swap_count: 36700, eth_volume: 46890.3, avg_gas_used: 149800 }
              ]
            }
          }
        }
      },
      {
        systemMessage: {
          chart: {
            result: {
              vegaConfig: {
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                data: {
                  values: [
                    { date: "2026-09-04", volume: 46890 },
                    { date: "2026-09-05", volume: 51200 },
                    { date: "2026-09-06", volume: 58240 },
                    { date: "2026-09-07", volume: 44105 },
                    { date: "2026-09-08", volume: 49820 }
                  ]
                },
                mark: { type: "bar", color: "#627EEA", cornerRadiusEnd: 4 },
                encoding: {
                  x: { field: "date", type: "nominal", title: "Date" },
                  y: { field: "volume", type: "quantitative", title: "ETH Volume" }
                }
              }
            }
          }
        }
      },
      {
        systemMessage: {
          text: {
            textType: "FINAL_RESPONSE",
            parts: [
              "**1inch v5 (Aggregation Protocol)** acts as your primary local EVM aggregator in the Phase 1 blueprint. By using off-chain Pathfinder heuristics alongside `AggregationRouterV5`, it splits heavy capital across hundreds of pools (such as Uniswap v3, Curve, and Balancer) to minimize slippage and price impact via direct atomic `eth_call` routing."
            ]
          }
        }
      },
      {
        systemMessage: {
          text: {
            parts: [
              "How does 1inch Pathfinder allocate percentages across liquidity pools?",
              "Compare 1inch local EVM gas overhead with Aerodrome Base swaps",
              "How does 0xSplits connect to 1inch v5 output destinations?"
            ]
          }
        }
      }
    ];
  }

  if (q.includes("aerodrome") || q.includes("base") || q.includes("ve(3,3)") || q.includes("aero")) {
    return [
      {
        systemMessage: {
          text: {
            textType: "THOUGHT",
            parts: [
              "Parsing Aerodrome ve(3,3) metrics on Base Network.",
              "Evaluating volatile vs stable AMM pools and gauge voting yields.",
              "Computing TVL and fee efficiency for terminal liquidity hops on Base."
            ]
          }
        }
      },
      {
        systemMessage: {
          data: {
            generatedSql: `SELECT 
  pool_name,
  pool_type,
  tvl_usd,
  volume_24h_usd,
  weekly_emissions_usd,
  apr_percent
FROM \`base_analytics.aerodrome_active_gauges\`
WHERE is_active = TRUE
ORDER BY volume_24h_usd DESC
LIMIT 5;`,
            result: {
              schema: {
                fields: [
                  { name: "pool_name", type: "STRING" },
                  { name: "pool_type", type: "STRING" },
                  { name: "tvl_usd", type: "NUMERIC" },
                  { name: "volume_24h_usd", type: "NUMERIC" },
                  { name: "weekly_emissions_usd", type: "NUMERIC" },
                  { name: "apr_percent", type: "NUMERIC" }
                ]
              },
              data: [
                { pool_name: "vAMM-WETH/USDC", pool_type: "Volatile", tvl_usd: 284500000, volume_24h_usd: 68900000, weekly_emissions_usd: 1450000, apr_percent: 34.8 },
                { pool_name: "vAMM-AERO/USDC", pool_type: "Volatile", tvl_usd: 142000000, volume_24h_usd: 45200000, weekly_emissions_usd: 2100000, apr_percent: 78.4 },
                { pool_name: "sAMM-USDC/USDT", pool_type: "Stable", tvl_usd: 198000000, volume_24h_usd: 31000000, weekly_emissions_usd: 620000, apr_percent: 12.6 },
                { pool_name: "vAMM-cbBTC/WETH", pool_type: "Volatile", tvl_usd: 95000000, volume_24h_usd: 19400000, weekly_emissions_usd: 780000, apr_percent: 24.1 },
                { pool_name: "sAMM-DAI/USDC", pool_type: "Stable", tvl_usd: 64000000, volume_24h_usd: 12800000, weekly_emissions_usd: 310000, apr_percent: 9.8 }
              ]
            }
          }
        }
      },
      {
        systemMessage: {
          chart: {
            result: {
              vegaConfig: {
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                data: {
                  values: [
                    { pool: "WETH/USDC", volume: 68.9 },
                    { pool: "AERO/USDC", volume: 45.2 },
                    { pool: "USDC/USDT", volume: 31.0 },
                    { pool: "cbBTC/WETH", volume: 19.4 },
                    { pool: "DAI/USDC", volume: 12.8 }
                  ]
                },
                mark: { type: "bar", color: "#0052FF", cornerRadiusEnd: 4 },
                encoding: {
                  x: { field: "pool", type: "nominal", title: "Aerodrome Pool" },
                  y: { field: "volume", type: "quantitative", title: "24h Volume ($M)" }
                }
              }
            }
          }
        }
      },
      {
        systemMessage: {
          text: {
            textType: "FINAL_RESPONSE",
            parts: [
              "**Aerodrome** is the native ve(3,3) liquidity hub and terminal liquidity destination on Base Network. Derived from the Solidly architecture, Aerodrome provides the physical depth provider for Base-network hops via dual AMM pools (volatile x*y=k and stable x³y+y³x=k), driven by token gauge voting."
            ]
          }
        }
      },
      {
        systemMessage: {
          text: {
            parts: [
              "How does Aerodrome ve(3,3) lock mechanism reduce trading slippage?",
              "What is the difference between Aerodrome volatile and stable curves?",
              "Show me Velodrome on Optimism metrics comparison"
            ]
          }
        }
      }
    ];
  }

  if (q.includes("splits") || q.includes("0xsplits") || q.includes("settlement") || q.includes("distribution")) {
    return [
      {
        systemMessage: {
          text: {
            textType: "THOUGHT",
            parts: [
              "Investigating 0xSplits on-chain programmatic asset distribution architecture.",
              "Validating native atomic payment routing via invariant distribution matrices.",
              "Analyzing post-swap settlement node composability in the aggregation shell."
            ]
          }
        }
      },
      {
        systemMessage: {
          data: {
            generatedSql: `SELECT 
  split_contract_address,
  recipient_count,
  total_distributed_usd,
  avg_gas_cost_usd,
  execution_atomicity_rate
FROM \`splits_analytics.immutable_matrix_settlements\`
WHERE network IN ('Ethereum', 'Base', 'Optimism')
ORDER BY total_distributed_usd DESC
LIMIT 4;`,
            result: {
              schema: {
                fields: [
                  { name: "split_contract_address", type: "STRING" },
                  { name: "recipient_count", type: "INTEGER" },
                  { name: "total_distributed_usd", type: "NUMERIC" },
                  { name: "avg_gas_cost_usd", type: "NUMERIC" },
                  { name: "execution_atomicity_rate", type: "STRING" }
                ]
              },
              data: [
                { split_contract_address: "0x2ed6...94EE (SplitMain)", recipient_count: 5, total_distributed_usd: 18450000, avg_gas_cost_usd: 0.14, execution_atomicity_rate: "100.0%" },
                { split_contract_address: "0x8912...4B19 (DAO Treasury)", recipient_count: 3, total_distributed_usd: 9420000, avg_gas_cost_usd: 0.08, execution_atomicity_rate: "100.0%" },
                { split_contract_address: "0x44ab...C182 (Staking Rewards)", recipient_count: 4, total_distributed_usd: 5120000, avg_gas_cost_usd: 0.09, execution_atomicity_rate: "100.0%" },
                { split_contract_address: "0x77ef...3D09 (Operations Liquid)", recipient_count: 2, total_distributed_usd: 3200000, avg_gas_cost_usd: 0.04, execution_atomicity_rate: "100.0%" }
              ]
            }
          }
        }
      },
      {
        systemMessage: {
          text: {
            textType: "FINAL_RESPONSE",
            parts: [
              "**0xSplits** serves as the Post-Swap Settlement Node in our standardized blueprint. It executes atomic, on-chain asset distribution through invariant distribution matrices. By designating the Split contract as the `to` / recipient address of your swap, tokens are programmatically partitioned among treasury, staking, and developer wallets within the same transaction block, eliminating front-running and post-trade accounting friction."
            ]
          }
        }
      },
      {
        systemMessage: {
          text: {
            parts: [
              "How to configure a 0xSplits distribution matrix in the trading console?",
              "What is the gas overhead of atomic 0xSplits distribution?",
              "Can 0xSplits distribute across multiple ERC-20 tokens simultaneously?"
            ]
          }
        }
      }
    ];
  }

  // Default DEX & Ethereum Analytics Overview
  return [
    {
      systemMessage: {
        text: {
          textType: "THOUGHT",
          parts: [
            "Processing query regarding Ethereum DEX trading, router inventory, and cross-chain execution.",
            "Benchmarking 6-protocol inventory: 1inch v5, Li.Fi, Relay, 0xSplits, Aerodrome, and Velodrome.",
            "Compiling real-time DEX volume and latency comparison."
          ]
        }
      }
    },
    {
      systemMessage: {
        data: {
          generatedSql: `SELECT 
  router_name,
  role,
  chains_supported,
  avg_latency_ms,
  reliability_pct,
  tvl_depth_usd
FROM \`dex_aggregation_shell.inventory_matrix\`
ORDER BY tvl_depth_usd DESC;`,
          result: {
            schema: {
              fields: [
                { name: "router_name", type: "STRING" },
                { name: "role", type: "STRING" },
                { name: "chains_supported", type: "INTEGER" },
                { name: "avg_latency_ms", type: "INTEGER" },
                { name: "reliability_pct", type: "NUMERIC" },
                { name: "tvl_depth_usd", type: "NUMERIC" }
              ]
            },
            data: [
              { router_name: "1inch v5", role: "Primary Local EVM Aggregator", chains_supported: 5, avg_latency_ms: 185, reliability_pct: 99.9, tvl_depth_usd: 1250000000 },
              { router_name: "Aerodrome", role: "Terminal Liquidity (Base)", chains_supported: 1, avg_latency_ms: 95, reliability_pct: 99.9, tvl_depth_usd: 850000000 },
              { router_name: "Li.Fi", role: "Cross-Chain Meta-Router", chains_supported: 5, avg_latency_ms: 820, reliability_pct: 99.4, tvl_depth_usd: 480000000 },
              { router_name: "Velodrome", role: "Terminal Liquidity (Optimism)", chains_supported: 1, avg_latency_ms: 110, reliability_pct: 99.8, tvl_depth_usd: 320000000 },
              { router_name: "Relay", role: "Low-Latency Intent Router", chains_supported: 4, avg_latency_ms: 32, reliability_pct: 99.8, tvl_depth_usd: 210000000 },
              { router_name: "0xSplits", role: "Post-Swap Settlement Node", chains_supported: 5, avg_latency_ms: 45, reliability_pct: 100.0, tvl_depth_usd: 150000000 }
            ]
          }
        }
      }
    },
    {
      systemMessage: {
        chart: {
            result: {
              vegaConfig: {
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                data: {
                  values: [
                    { router: "1inch v5", latency: 185 },
                    { router: "Aerodrome", latency: 95 },
                    { router: "Velodrome", latency: 110 },
                    { router: "0xSplits", latency: 45 },
                    { router: "Relay", latency: 32 },
                    { router: "Li.Fi", latency: 820 }
                  ]
                },
                mark: { type: "bar", color: "#10B981", cornerRadiusEnd: 4 },
                encoding: {
                  x: { field: "router", type: "nominal", title: "Protocol" },
                  y: { field: "latency", type: "quantitative", title: "Execution Latency (ms)" }
                }
              }
            }
          }
        }
      },
      {
        systemMessage: {
          text: {
            textType: "FINAL_RESPONSE",
            parts: [
              `### Analysis for: "${query}"\n\n` +
              "The **Phase 1 Standardized DEX Router Inventory** organizes your trade execution pipeline into distinct modular layers:\n\n" +
              "1. **Primary Local EVM Aggregation**: **1inch v5** splits orders across Uniswap, Curve, and Balancer to prevent single-pool price impact.\n" +
              "2. **Cross-Chain Routing**: **Relay** executes sub-10s intent solver fulfillment with gas delivery, while **Li.Fi** provides multi-bridge fallback abstraction.\n" +
              "3. **Terminal Liquidity Hubs**: **Aerodrome** anchors Base execution through ve(3,3) AMM gauges, and **Velodrome / Velora** serves the Optimism Superchain.\n" +
              "4. **Post-Swap Settlement**: **0xSplits** programmatically and atomically routes final out-tokens across multi-wallet payout matrices without custodial risk."
            ]
          }
        }
      },
      {
        systemMessage: {
          text: {
            parts: [
              "Show Aerodrome ve(3,3) pools by 24h volume and APR",
              "How does Relay solver speed compare to Li.Fi?",
              "Explain 0xSplits post-swap atomic distribution"
            ]
          }
        }
      }
    ];
}
