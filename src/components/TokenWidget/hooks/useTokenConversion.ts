import { useEffect, useState } from "react";
import { env } from "../../../env";
import { formatUnits, parseEther } from "viem";
import toast from "react-hot-toast";

/**
 * Hook to handle token conversion calculations
 * Calculates the amount of tokens the user will receive based on the payment amount
 */
export function useTokenConversion(
  paymentAmount: string,
  paymentMethod: string
) {
  const [tokenAmount, setTokenAmount] = useState<string>("0");

  // Get the token price from environment variables
  const tokenPrice = env.CURRENT_PRICE
    ? parseEther(env.CURRENT_PRICE)
    : parseEther("0.01"); // Default to 0.01 if not set

  // Calculate token amount when payment amount or token price changes
  useEffect(() => {
    try {
      const paymentValue = parseFloat(paymentAmount);
      if (isNaN(paymentValue) || paymentValue <= 0) {
        setTokenAmount("0");
        return;
      }

      // Token price in ETH (or equivalent value in USDT/USDC)
      const tokenPriceInPaymentToken = parseFloat(formatUnits(tokenPrice, 18));

      // Calculate how many tokens the user will get
      const calculatedTokenAmount = paymentValue / tokenPriceInPaymentToken;

      // Format to 2 decimal places
      setTokenAmount(calculatedTokenAmount.toFixed(2));
    } catch (error) {
      console.error("Error calculating token amount:", error);
      toast.error(
        "Error calculating token amount. Please try a different amount."
      );
      setTokenAmount("0");
    }
  }, [paymentAmount, tokenPrice, paymentMethod]);

  return {
    tokenAmount,
  };
}
