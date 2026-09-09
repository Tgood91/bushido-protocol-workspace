import React, { useState, useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { TrendingUp, TrendingDown, Clock, BarChart2, Maximize2 } from "lucide-react";
import { Token } from "../../types/dex";

interface TradingChartProps {
  baseToken: Token;
  quoteToken: Token;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  baseToken,
  quoteToken,
}) => {
  const [timeframe, setTimeframe] = useState<"15m" | "1h" | "4h" | "1D" | "1W">("1D");
  const [chartType, setChartType] = useState<"price" | "volume">("price");

  // Generate synthetic price points for the selected pair and timeframe
  const chartData = useMemo(() => {
    const pointsCount = 28;
    const currentPairPrice = baseToken.priceUsd / (quoteToken.priceUsd || 1);
    const data = [];
    const volatility = 0.025;

    let price = currentPairPrice * (1 - volatility * 2);

    for (let i = 0; i < pointsCount; i++) {
      const delta = (Math.sin(i * 0.45) + (Math.random() - 0.48)) * volatility * currentPairPrice;
      price = Math.max(price + delta, currentPairPrice * 0.85);

      const hourOffset = (pointsCount - i) * (timeframe === "15m" ? 0.25 : timeframe === "1h" ? 1 : timeframe === "4h" ? 4 : 24);
      const timeLabel = new Date(Date.now() - hourOffset * 3600 * 1000).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit",
        month: timeframe === "1W" ? "short" : undefined,
        day: timeframe === "1W" ? "numeric" : undefined
      });

      const volume = Math.floor((Math.sin(i) * 500000 + 1200000) * (baseToken.priceUsd / 2000));

      data.push({
        time: timeLabel,
        price: parseFloat(price.toFixed(4)),
        volume: volume,
      });
    }

    // Force final point to current pair price
    data[data.length - 1].price = parseFloat(currentPairPrice.toFixed(4));
    return data;
  }, [baseToken, quoteToken, timeframe]);

  const firstPrice = chartData[0]?.price || 1;
  const lastPrice = chartData[chartData.length - 1]?.price || 1;
  const isPositive = lastPrice >= firstPrice;
  const priceChangePct = ((lastPrice - firstPrice) / firstPrice) * 100;

  return (
    <div className="bg-white dark:bg-[#0F0F0F] border border-gray-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 items-center">
            <img src={baseToken.logoURI} alt={baseToken.symbol} className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#0F0F0F]" />
            <img src={quoteToken.logoURI} alt={quoteToken.symbol} className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-[#0F0F0F]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-gray-900 dark:text-white font-mono">
                {baseToken.symbol}/{quoteToken.symbol}
              </span>
              <span className={`flex items-center gap-0.5 text-xs font-mono font-bold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isPositive ? "+" : ""}{priceChangePct.toFixed(2)}%
              </span>
            </div>
            <div className="text-xl font-bold font-mono text-gray-900 dark:text-white">
              {lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              <span className="text-xs text-gray-400 font-normal ml-1.5">{quoteToken.symbol}</span>
            </div>
          </div>
        </div>

        {/* Timeframe & Chart Type Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-[#1A1A1A] p-1 rounded-lg border border-gray-200 dark:border-white/5 text-[11px] font-mono">
            {(["15m", "1h", "4h", "1D", "1W"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  timeframe === tf
                    ? "bg-white dark:bg-[#282828] text-gray-900 dark:text-white font-bold shadow-xs"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-[#1A1A1A] p-1 rounded-lg border border-gray-200 dark:border-white/5 text-[11px]">
            <button
              onClick={() => setChartType("price")}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                chartType === "price"
                  ? "bg-white dark:bg-[#282828] text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-500 dark:text-white/50"
              }`}
            >
              Price
            </button>
            <button
              onClick={() => setChartType("volume")}
              className={`px-2 py-0.5 rounded-md font-mono transition-colors ${
                chartType === "volume"
                  ? "bg-white dark:bg-[#282828] text-blue-600 dark:text-blue-400 font-bold"
                  : "text-gray-500 dark:text-white/50"
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Recharts Chart Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "price" ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={isPositive ? "#10B981" : "#F43F5E"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: "#888" }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                domain={["auto", "auto"]} 
                tick={{ fontSize: 10, fill: "#888" }} 
                axisLine={false} 
                tickLine={false} 
                orientation="right"
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 20, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#fff",
                  fontFamily: "monospace",
                }}
                formatter={(val: any) => [`${val} ${quoteToken.symbol}`, "Price"]}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10B981" : "#F43F5E"} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#priceGradient)" 
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10, fill: "#888" }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                domain={["auto", "auto"]} 
                tick={{ fontSize: 10, fill: "#888" }} 
                axisLine={false} 
                tickLine={false} 
                orientation="right"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(20, 20, 20, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#fff",
                  fontFamily: "monospace",
                }}
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Volume"]}
              />
              <Bar dataKey="volume" fill="#627EEA" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 24h Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-white/5 text-xs font-mono">
        <div>
          <div className="text-[10px] text-gray-400">24h High</div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {(lastPrice * 1.034).toFixed(4)} {quoteToken.symbol}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400">24h Low</div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {(lastPrice * 0.968).toFixed(4)} {quoteToken.symbol}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400">24h Volume (EVM Total)</div>
          <div className="font-semibold text-gray-800 dark:text-white">
            $42.8M USD
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-400">On-chain Routers</div>
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            1inch, Aero, Velo, Relay
          </div>
        </div>
      </div>
    </div>
  );
};
