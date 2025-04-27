import { formatEther } from "viem";

/**
 * Format token amounts with commas
 */
export const formatTokenAmount = (amount: bigint | undefined): string => {
  if (!amount) return "Loading...";

  // First convert from wei to ether using formatEther
  const etherValue = formatEther(amount);

  // Then format with commas
  return Number(etherValue).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
};
