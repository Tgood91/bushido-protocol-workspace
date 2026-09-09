export const THEME = {
  colors: {
    primary: "#627EEA", // Ethereum Blue/Purple
    border: "border-[#141414]/10 dark:border-white/10",
    textSecondary: "text-[#141414]/60 dark:text-white/40",
    textPrimary: "text-[#141414]/90 dark:text-white/90",
  }
};

export const UI_CLASSES = {
  focusRing: "focus-visible:ring-2 focus-visible:ring-[#627EEA] outline-none",
  focusRingOffset: "focus-visible:ring-2 focus-visible:ring-[#627EEA] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0F0F0F] outline-none",
  focusRingInset: "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#627EEA] outline-none",
  card: "border border-[#141414]/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#0F0F0F] shadow-sm",
  transition: "transition-all duration-200",
  labelMono: "text-xs font-mono uppercase tracking-wider text-[#141414]/60 dark:text-white/40"
};

export const INITIAL_MESSAGE = {
  id: "initial",
  role: "assistant" as const,
  content: "Hello! I am your Ethereum Data Analytics Agent. How can I help you analyze the blockchain today?",
};

export const PRESET_QUESTIONS = [
  "Top 10 most active Ethereum addresses in the last 24 hours",
  "Average daily transaction fees in the last 7 days",
  "List the latest 5 blocks with their transaction counts",
  "Largest ETH transfer in the last hour",
  "Top 5 most used smart contracts by gas consumption",
  "Show transaction volume trend for the last week"
];

export const STORAGE_KEY = "ethereum_customProjectId";
