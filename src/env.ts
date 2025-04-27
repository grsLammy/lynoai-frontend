// Environment variables configuration
// This file centralizes access to environment variables and provides type safety

// For Vite projects, we access environment variables through import.meta.env
export const env = {
  WALLET_CONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "",
  ALCHEMY_API_KEY: import.meta.env.VITE_ALCHEMY_API_KEY || "",
  // Add other env variables as needed
};

// Validate that required environment variables are set
export function validateEnv(): void {
  const requiredVars = ["WALLET_CONNECT_PROJECT_ID", "ALCHEMY_API_KEY"];

  const missingVars = requiredVars.filter(
    (varName) => !env[varName as keyof typeof env]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}. ` +
        `Make sure they are defined in your .env file with the VITE_ prefix.`
    );
  }
}
