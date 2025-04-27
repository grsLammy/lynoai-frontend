import { useEffect, useState } from "react";
import { env } from "../../../env";
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
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);

  // Fetch ETH price when component mounts or payment method changes
  useEffect(() => {
    // Only fetch ETH price if ETH is selected
    if (paymentMethod !== "ETH") return;

    const fetchEthPrice = async () => {
      try {
        setIsLoadingPrice(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
        );
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
        setIsLoadingPrice(false);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setEthPrice(2000); // Fallback price if API fails
        setIsLoadingPrice(false);
      }
    };

    fetchEthPrice();
  }, [paymentMethod]);

  // Get the token price from environment variables (in USD)
  const tokenPriceInUsd = env.CURRENT_PRICE
    ? parseFloat(env.CURRENT_PRICE)
    : 0.01; // Default to 0.01 if not set

  // Calculate token amount when payment amount or token price changes
  useEffect(() => {
    try {
      const paymentValue = parseFloat(paymentAmount);
      if (isNaN(paymentValue) || paymentValue <= 0) {
        setTokenAmount("0");
        return;
      }

      let calculatedTokenAmount: number;

      // For ETH, convert to USD first then calculate tokens
      if (paymentMethod === "ETH") {
        if (ethPrice <= 0) {
          // If ETH price isn't loaded yet, don't calculate
          return;
        }
        // Convert ETH to USD
        const valueInUsd = paymentValue * ethPrice;
        // Calculate tokens based on USD value
        calculatedTokenAmount = valueInUsd / tokenPriceInUsd;
      }
      // For stablecoins (USDT/USDC), direct calculation
      else {
        // Direct calculation as these are already in USD
        calculatedTokenAmount = paymentValue / tokenPriceInUsd;
      }

      // Format to 2 decimal places
      setTokenAmount(calculatedTokenAmount.toFixed(2));
    } catch (error) {
      console.error("Error calculating token amount:", error);
      toast.error(
        "Error calculating token amount. Please try a different amount."
      );
      setTokenAmount("0");
    }
  }, [paymentAmount, tokenPriceInUsd, paymentMethod, ethPrice]);

  return {
    tokenAmount,
    isLoadingPrice,
  };
}
