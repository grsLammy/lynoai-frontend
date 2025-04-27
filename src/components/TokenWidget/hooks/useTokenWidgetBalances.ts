import { useMemo } from "react";
import { useBalance } from "wagmi";
import { env } from "../../../env";

/**
 * Hook to manage balance-related functionality
 * Gets different token balances and provides utility functions
 */
export function useTokenWidgetBalances(
  address: `0x${string}` | undefined,
  paymentMethod: string
) {
  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Get USDT balance
  const { data: usdtBalance } = useBalance({
    address,
    token: env.USDT_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address,
    token: env.USDC_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Get current balance based on selected payment method
  const currentBalance = useMemo(() => {
    switch (paymentMethod) {
      case "ETH":
        return ethBalance;
      case "USDT":
        return usdtBalance;
      case "USDC":
        return usdcBalance;
      default:
        return ethBalance;
    }
  }, [paymentMethod, ethBalance, usdtBalance, usdcBalance]);

  // Handle max button click
  const handleMaxButtonClick = (setBuyAmount: (amount: string) => void) => {
    if (currentBalance && currentBalance.formatted) {
      // Set the buy amount to the wallet balance, leaving a small amount for gas if ETH
      const gasFeeBuffer = paymentMethod === "ETH" ? 0.01 : 0;
      const maxAmount =
        parseFloat(currentBalance.formatted) > gasFeeBuffer
          ? (parseFloat(currentBalance.formatted) - gasFeeBuffer).toString()
          : "0";
      setBuyAmount(maxAmount);
    }
  };

  return {
    ethBalance,
    usdtBalance,
    usdcBalance,
    currentBalance,
    handleMaxButtonClick,
  };
}
