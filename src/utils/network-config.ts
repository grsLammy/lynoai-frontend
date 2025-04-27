/**
 * Network configuration utilities
 * Helps determine which networks to use based on environment
 */
import { env } from "../env";

// Supported chain IDs
export const ETHEREUM_MAINNET_ID = 1;
export const ETHEREUM_SEPOLIA_ID = 11155111;

/**
 * Determines if we're in production mode
 * Using the imported env object
 * @returns true if in production mode, false otherwise
 */
export const isProduction = (): boolean => {
  return env.NODE_ENV === "production";
};

/**
 * Get the list of supported chains based on environment
 * @returns Array of supported chain IDs
 */
export const getSupportedChains = (): number[] => {
  if (isProduction()) {
    // In production, we only use Ethereum mainnet
    return [ETHEREUM_MAINNET_ID];
  }

  // In development/testing, we use Sepolia testnet
  return [ETHEREUM_SEPOLIA_ID];
};

/**
 * Get the default chain based on environment
 * @returns The default chain ID to use
 */
export const getDefaultChain = (): number => {
  if (isProduction()) {
    return ETHEREUM_MAINNET_ID;
  }

  // For development/testing, prefer Sepolia testnet
  return ETHEREUM_SEPOLIA_ID;
};

/**
 * Check if a chain ID is supported in the current environment
 * @param chainId The chain ID to check
 * @returns true if the chain is supported, false otherwise
 */
export const isChainSupported = (chainId: number): boolean => {
  return getSupportedChains().includes(chainId);
};

/**
 * Get a fallback chain ID if the provided one isn't supported
 * @param chainId The current chain ID
 * @returns A supported chain ID (either the provided one if supported, or a fallback)
 */
export const getSupportedChainId = (chainId: number): number => {
  return isChainSupported(chainId) ? chainId : getDefaultChain();
};
