// Environment variables configuration
// This file centralizes access to environment variables and provides type safety

// For Vite projects, we access environment variables through import.meta.env
export const env = {
  NODE_ENV: import.meta.env.VITE_NODE_ENV || "",
  WALLET_ADDRESS: import.meta.env.VITE_WALLET_ADDRESS || "",
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "",
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || "",
  LYNOAI_CONTRACT_ADDRESS: import.meta.env.VITE_LYNOAI_CONTRACT_ADDRESS || "",
  CURRENT_PHASE: import.meta.env.VITE_CURRENT_PHASE || "",
  CURRENT_PRICE: import.meta.env.VITE_CURRENT_PRICE || "",
  USDT_CONTRACT_ADDRESS:
    import.meta.env.VITE_USDT_CONTRACT_ADDRESS ||
    "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet USDT address
  USDC_CONTRACT_ADDRESS:
    import.meta.env.VITE_USDC_CONTRACT_ADDRESS ||
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC address

  // Backend API URL configuration
  BACKEND_API_URL:
    import.meta.env.VITE_BACKEND_API_URL || "https://api.widget.lynoai.com",
};

// Validate that required environment variables are set
export function validateEnv(): void {
  const requiredVars = [
    "NODE_ENV",
    "WALLET_ADDRESS",
    "WALLET_CONNECT_PROJECT_ID",
    "ALCHEMY_API_KEY",
    "LYNOAI_CONTRACT_ADDRESS",
    "CURRENT_PHASE",
    "CURRENT_PRICE",
  ];

  // In production, ensure we have a backend API URL
  if (env.NODE_ENV === "production" && !import.meta.env.VITE_BACKEND_API_URL) {
    console.warn("VITE_BACKEND_API_URL is not set in production environment");
  }

  requiredVars.forEach((variable) => {
    if (!env[variable as keyof typeof env]) {
      throw new Error(`Missing required environment variable: ${variable}`);
    }
  });
}
