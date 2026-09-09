import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Layers, Clock, ShieldCheck, Activity } from "lucide-react";
import { Token } from "../../types/dex";

interface OrderbookDepthProps {
  baseToken: Token;
  quoteToken: Token;
}

interface Trade {
  id: string;
  time: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  router: string;
  txHash: string;
}

export const OrderbookDepth: React.FC<OrderbookDepthProps> = ({
  baseToken,
  quoteToken,
}) => {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");
  const [trades, setTrades] = useState<Trade[]>([]);

  const midPrice = baseToken.priceUsd / (quoteToken.priceUsd || 1);

  // Generate simulated orderbook entries
  const asks = [
    { price: midPrice * 1.004, size: 2.45, total: 2.45 },
    { price: midPrice * 1.003, size: 4.82, total: 7.27 },
    { price: midPrice * 1.002, size: 1.15, total: 8.42 },
    { price: midPrice * 1.001, size: 6.90, total: 15.32 },
  ].reverse();

  const bids = [
    { price: midPrice * 0.999, size: 3.20, total: 3.20 },
    { price: midPrice * 0.998, size: 5.40, total: 8.60 },
    { price: midPrice * 0.997, size: 8.10, total: 16.70 },
    { price: midPrice * 0.996, size: 2.75, total: 19.45 },
  ];

  // Seed initial trades and simulate periodic incoming swaps
  useEffect(() => {
    const routers = ["1inch v5", "Relay", "Aerodrome", "Velodrome", "Li.Fi"];
    const initialTrades: Trade[] = [
      { id: "1", time: "14:22:04", type: "buy", amount: 1.84, price: midPrice * 1.0005, router: "1inch v5", txHash: "0x4e29...91a2" },
      { id: "2", time: "14:21:49", type: "sell", amount: 0.95, price: midPrice * 0.9998, router: "Aerodrome", txHash: "0x81bd...3319" },
      { id: "3", time: "14:21:12", type: "buy", amount: 4.12, price: midPrice * 1.0008, router: "Relay", txHash: "0x19ca...4f77" },
      { id: "4", time: "14:20:55", type: "buy", amount: 2.50, price: midPrice * 1.0002, router: "1inch v5", txHash: "0x53ef...08ec" },
      { id: "5", time: "14:20:30", type: "sell", amount: 3.80, price: midPrice * 0.9992, router: "Velodrome", txHash: "0x98ab...7710" },
    ];
    setTrades(initialTrades);

    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.45;
      const router = routers[Math.floor(Math.random() * routers.length)];
      const amount = parseFloat(((Math.random() * 3 + 0.2) * (baseToken.symbol === "ETH" ? 1 : 250)).toFixed(2));
      const delta = (Math.random() * 0.003 - 0.0015);
      const newPrice = midPrice * (1 + delta);

      const newTrade: Trade = {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        type: isBuy ? "buy" : "sell",
        amount,
        price: newPrice,
        router,
        txHash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
      };

      setTrades(prev => [newTrade, ...prev.slice(0, 7)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [midPrice, baseToken.symbol]);

  return (
    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 flex flex-col justify-between">
      {/* Header and Mode Selector */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-2.5">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#181818] p-1 rounded-lg border border-gray-200 dark:border-white/5 text-xs font-mono">
          <button
            onClick={() => setActiveTab("book")}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === "book"
                ? "bg-white dark:bg-[#252525] text-gray-900 dark:text-white font-bold shadow-xs"
                : "text-gray-500 dark:text-white/50"
            }`}
          >
            Orderbook
          </button>
          <button
            onClick={() => setActiveTab("trades")}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "trades"
                ? "bg-white dark:bg-[#252525] text-gray-900 dark:text-white font-bold shadow-xs"
                : "text-gray-500 dark:text-white/50"
            }`}
          >
            <span>Live Swaps</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>

        <span className="text-[10px] font-mono text-gray-400">
          Spread: 0.02%
        </span>
      </div>

      {activeTab === "book" ? (
        <div className="space-y-2 text-xs font-mono">
          <div className="grid grid-cols-3 text-gray-400 text-[10px] pb-1 border-b border-gray-100 dark:border-white/5">
            <span>Price ({quoteToken.symbol})</span>
            <span className="text-right">Size ({baseToken.symbol})</span>
            <span className="text-right">Depth</span>
          </div>

          {/* Asks (Sells) */}
          <div className="space-y-1">
            {asks.map((ask, idx) => (
              <div key={idx} className="grid grid-cols-3 relative py-0.5 group">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/10 dark:bg-rose-500/15 pointer-events-none rounded-sm transition-all"
                  style={{ width: `${Math.min(100, (ask.total / 20) * 100)}%` }}
                />
                <span className="text-rose-600 dark:text-rose-400 font-semibold relative z-10">
                  {ask.price.toFixed(4)}
                </span>
                <span className="text-right text-gray-700 dark:text-white/80 relative z-10">
                  {ask.size.toFixed(2)}
                </span>
                <span className="text-right text-gray-400 relative z-10">
                  {ask.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Mid Market Price Divider */}
          <div className="py-2 my-1 border-y border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-bold">
            <span className="text-gray-900 dark:text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              Mid: {midPrice.toFixed(4)} {quoteToken.symbol}
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-normal">
              High Liquidity
            </span>
          </div>

          {/* Bids (Buys) */}
          <div className="space-y-1">
            {bids.map((bid, idx) => (
              <div key={idx} className="grid grid-cols-3 relative py-0.5 group">
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 dark:bg-emerald-500/15 pointer-events-none rounded-sm transition-all"
                  style={{ width: `${Math.min(100, (bid.total / 20) * 100)}%` }}
                />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold relative z-10">
                  {bid.price.toFixed(4)}
                </span>
                <span className="text-right text-gray-700 dark:text-white/80 relative z-10">
                  {bid.size.toFixed(2)}
                </span>
                <span className="text-right text-gray-400 relative z-10">
                  {bid.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Live Aggregated Swaps Feed */
        <div className="space-y-2 text-xs font-mono">
          <div className="grid grid-cols-4 text-gray-400 text-[10px] pb-1 border-b border-gray-100 dark:border-white/5">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Router</span>
            <span className="text-right">Time</span>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {trades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-4 items-center py-1 hover:bg-gray-50 dark:hover:bg-white/5 rounded px-1 transition-colors">
                <span className={`font-semibold ${trade.type === "buy" ? "text-emerald-500" : "text-rose-500"}`}>
                  {trade.price.toFixed(4)}
                </span>
                <span className="text-right text-gray-800 dark:text-white/80">
                  {trade.amount} {baseToken.symbol}
                </span>
                <span className="text-center">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    {trade.router}
                  </span>
                </span>
                <span className="text-right text-gray-400 text-[10px]">
                  {trade.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          MEV-Protected Routing
        </span>
        <span>Depth: $1.2B</span>
      </div>
    </div>
  );
};
