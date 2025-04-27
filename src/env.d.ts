/// <reference types="vite/client" />

// This file extends the base ImportMetaEnv interface from Vite
// to include our custom environment variables
interface ImportMetaEnv {
  readonly VITE_NODE_ENV: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  readonly VITE_LYNOAI_CONTRACT_ADDRESS: string;
  readonly VITE_CURRENT_PHASE: string;
  readonly VITE_CURRENT_PRICE: string;
  readonly VITE_USDT_CONTRACT_ADDRESS: string;
  readonly VITE_USDC_CONTRACT_ADDRESS: string;
  // Add other env variables as needed
}
