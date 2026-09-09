import React from "react";
import { Sparkles, ArrowRight, BarChart3, List, Code2 } from "lucide-react";
import { motion } from "motion/react";

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage = ({ onLaunch }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0A0A] text-[#111827] dark:text-white/90 font-sans selection:bg-[#0784C3] selection:text-white overflow-hidden flex flex-col relative transition-colors duration-500">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      
      {/* Dots Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden text-[#0784C3]/10 dark:text-[#0784C3]/5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex-1 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-0">
          {/* Left Column: Hero Content */}
          <div className="space-y-10 order-1 lg:order-1 lg:pr-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start items-center gap-4"
            >
              <div className="flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-[#1A1A1A] border border-[#0784C3]/10 dark:border-white/5 rounded-full shadow-sm opacity-90 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0784C3] animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0784C3]">Web3 X AI</span>
              </div>
            </motion.div>

            <div className="space-y-8 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-6xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95]">
                  Ethereum <br />
                  <span className="text-[#0784C3] whitespace-nowrap">AI Analytics</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg md:text-xl text-[#141414]/80 dark:text-white/60 leading-relaxed max-w-md"
              >
                The premier interface for deep blockchain insights. <br className="hidden md:block" />
                Leveraging BigQuery to bridge the gap between raw bytes and real decisions.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-start gap-6"
            >
              <button
                onClick={onLaunch}
                className="group flex items-center gap-3 px-10 py-5 bg-[#0784C3] text-white rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#0784C3]/30 active:scale-95 focus-visible:ring-4 focus-visible:ring-[#0784C3]/50 outline-none"
              >
                Start Analysis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[#141414]/60 dark:text-white/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-[#0784C3]" />
                  Speed to Insights
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Showcase Cards with Hover Fan-Out */}
          <motion.div 
            className="relative order-2 lg:order-2 h-[600px] lg:h-[750px] flex items-center justify-center cursor-default group origin-center scale-[0.85] xl:scale-100 transition-transform duration-500 lg:translate-y-12"
            initial="initial"
            whileHover="hover"
          >
            <div className="relative w-full max-w-md xl:max-w-lg h-full">
              {/* Card 1: Dashboard Visualization - Topmost */}
              <motion.div 
                variants={{
                  initial: { x: 0, y: 0, rotate: -2, zIndex: 30, opacity: 0.85 },
                  hover: { x: -60, y: -60, rotate: -3, zIndex: 30, opacity: 1 }
                }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="absolute top-[5%] left-0 w-full bg-white dark:bg-[#0F0F0F] p-6 rounded-[32px] border border-[#0784C3]/10 dark:border-white/10 shadow-2xl h-[420px] flex flex-col transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#0784C3]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-[#111827] dark:text-white">Data Visualization</span>
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 bg-[#0784C3]/5 text-[#0784C3] rounded-full uppercase tracking-tighter">AI Capabilities</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                  {/* Distribution (Pie) */}
                  <div className="bg-slate-50/50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-center border border-slate-100/50 dark:border-white/5 min-h-[100px]">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="32" fill="transparent" stroke="#0784C3" strokeWidth="16" strokeDasharray="65 135" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="32" fill="transparent" stroke="#34D399" strokeWidth="16" strokeDasharray="50 150" strokeDashoffset="-65" />
                      <circle cx="50" cy="50" r="32" fill="transparent" stroke="#FBBF24" strokeWidth="16" strokeDasharray="50 150" strokeDashoffset="-115" />
                      <circle cx="50" cy="50" r="32" fill="transparent" stroke="#A78BFA" strokeWidth="16" strokeDasharray="35 165" strokeDashoffset="-165" />
                    </svg>
                  </div>

                  {/* Volume (Bar) */}
                  <div className="bg-slate-50/50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-center border border-slate-100/50 dark:border-white/5 min-h-[100px]">
                    <svg className="w-full h-16 px-1" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <rect x="5" y="25" width="12" height="25" rx="3" fill="#0784C3" opacity="0.6" />
                      <rect x="25" y="8" width="12" height="42" rx="3" fill="#34D399" opacity="0.6" />
                      <rect x="45" y="30" width="12" height="20" rx="3" fill="#FBBF24" opacity="0.6" />
                      <rect x="65" y="16" width="12" height="34" rx="3" fill="#F87171" opacity="0.6" />
                      <rect x="85" y="4" width="12" height="46" rx="3" fill="#A78BFA" opacity="0.6" />
                    </svg>
                  </div>

                  {/* Trend (Area) */}
                  <div className="col-span-2 bg-slate-50/50 dark:bg-white/5 rounded-2xl p-3 flex items-center justify-center border border-slate-100/50 dark:border-white/5 min-h-[110px]">
                    <svg className="w-full h-20" viewBox="0 0 240 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradientPreview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0784C3" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0784C3" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 0,35 Q 35,45 60,25 T 120,12 T 180,28 T 240,8 L 240,60 L 0,60 Z" 
                        fill="url(#gradientPreview)" 
                      />
                      <path 
                        d="M 0,35 Q 35,45 60,25 T 120,12 T 180,28 T 240,8" 
                        fill="none" 
                        stroke="#0784C3" 
                        strokeWidth="2.5" 
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Log - Middle */}
              <motion.div 
                variants={{
                  initial: { x: 20, y: 180, rotate: 2, zIndex: 20, opacity: 0.85 },
                  hover: { x: 40, y: 220, rotate: 3, zIndex: 20, opacity: 1 }
                }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="absolute top-[5%] left-0 w-[95%] bg-white dark:bg-[#0F0F0F] p-6 rounded-[32px] border border-[#0784C3]/10 dark:border-white/10 shadow-2xl h-[340px] flex flex-col transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <List className="w-4 h-4 text-[#0784C3]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-[#111827] dark:text-white">Live Event Stream</span>
                </div>
                <div className="space-y-3 flex-1 overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5 last:border-0 text-[10px] font-mono tracking-tighter text-[#111827] dark:text-white/60">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                        <span className="text-[#0784C3] font-bold">TX_{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                      </div>
                      <span className="opacity-40">{ (Math.random() * 5).toFixed(4) } ETH</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Card 3: Generated SQL - Bottom */}
              <motion.div 
                variants={{
                  initial: { x: -10, y: 360, rotate: -3, zIndex: 10, opacity: 0.85 },
                  hover: { x: -20, y: 460, rotate: -4, zIndex: 10, opacity: 1 }
                }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="absolute top-[5%] left-0 w-[90%] bg-[#111827] dark:bg-[#0A0A0A] p-6 rounded-[32px] border border-white/10 shadow-2xl h-[260px] flex flex-col transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="w-4 h-4 text-[#0784C3]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Synthesized Analytics SQL</span>
                </div>
                <div className="flex-1 font-mono text-[10px] text-white/80 space-y-1 overflow-hidden">
                  <p className="text-[#0784C3]">SELECT</p>
                  <p className="pl-4 leading-tight">block_number, hash,</p>
                  <p className="pl-4 leading-tight text-white/60">value / 1e18 as ether_value</p>
                  <p className="text-[#0784C3]">FROM</p>
                  <p className="pl-4 truncate leading-tight opacity-50">`bigquery-public-data.goog_blockchain_ethereum_mainnet_us.transactions`</p>
                  <p className="text-[#0784C3]">WHERE</p>
                  <p className="pl-4 leading-tight whitespace-nowrap">block_timestamp &gt; TIMESTAMP_SUB(NOW(), INTERVAL 24H)</p>
                  <p className="text-[#0784C3]">ORDER BY</p>
                  <p className="pl-4 leading-tight">value DESC LIMIT 10</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="relative z-10 py-12 px-6 flex justify-center">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#111827]/40 dark:text-white/20">
          <span>v1.0.0</span>
          <div className="w-1 h-1 rounded-full bg-[#111827]/10 dark:bg-white/10" />
          <span>Ethereum Blockchain Analytics Agent</span>
          <div className="w-1 h-1 rounded-full bg-[#111827]/10 dark:bg-white/10" />
          <Sparkles className="w-3 h-3" />
        </div>
      </footer>
    </div>
  );
};
