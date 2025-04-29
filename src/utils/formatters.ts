import { formatEther } from "viem";

/**
 * Format token amounts with commas
 */
export const formatTokenAmount = (amount: bigint | undefined): string => {
  if (!amount) return "Loading...";

  // If amount is 0, return "0" immediately
  if (amount === 0n) return "0";

  // First convert from wei to ether using formatEther
  const etherValue = formatEther(amount);

  // Then format with commas
  return Number(etherValue).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
};
