/// <reference types="vite/client" />

// This file extends the base ImportMetaEnv interface from Vite
// to include our custom environment variables
interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_ALCHEMY_API_KEY: string;
  // Add other env variables as needed
}
