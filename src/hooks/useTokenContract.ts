import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import { env } from "../env";
import LynoAIAbi from "../ABI/LynoAI.json";
import ERC20Abi from "../ABI/ERC20.json";

export interface TokenContractInfo {
  availableTokens: bigint;
  tokensSold: bigint;
  totalSupply: bigint;
  cap: bigint;
  purchase: {
    write: (amount: string, paymentMethod?: string) => Promise<void>;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
  };
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useTokenContract(): TokenContractInfo {
  const { address, isConnected } = useAccount();

  // Local state to track combined loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Read the cap (available tokens)
  const {
    data: capData,
    refetch: refetchCap,
    isLoading: isCapLoading,
    error: capError,
  } = useReadContract({
    address: env.LYNOAI_CONTRACT_ADDRESS as `0x${string}`,
    abi: LynoAIAbi.abi,
    functionName: "cap",
  });

  // Read the total supply (tokens sold)
  const {
    data: totalSupplyData,
    refetch: refetchTotalSupply,
    isLoading: isTotalSupplyLoading,
    error: totalSupplyError,
  } = useReadContract({
    address: env.LYNOAI_CONTRACT_ADDRESS as `0x${string}`,
    abi: LynoAIAbi.abi,
    functionName: "totalSupply",
  });

  // Set up the purchase function
  const {
    writeContractAsync,
    isPending: isPurchaseLoading,
    error: purchaseError,
    isSuccess: isPurchaseSuccess,
  } = useWriteContract();

  // Combine loading states
  useEffect(() => {
    setIsLoading(isCapLoading || isTotalSupplyLoading);
  }, [isCapLoading, isTotalSupplyLoading]);

  // Combine error states
  useEffect(() => {
    const hasError = !!capError || !!totalSupplyError;
    setIsError(hasError);

    if (capError) setError(capError);
    else if (totalSupplyError) setError(totalSupplyError);
    else setError(null);
  }, [capError, totalSupplyError]);

  useEffect(() => {
    setIsSuccess(isPurchaseSuccess);
  }, [isPurchaseSuccess]);

  // Purchase function wrapper
  const purchase = async (amount: string, paymentMethod = "ETH") => {
    if (!isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      // Handle purchase based on payment method
      if (paymentMethod === "ETH") {
        // For ETH payments, we directly send ETH with the transaction
        const etherValue = parseEther(amount);
        await writeContractAsync({
          address: env.LYNOAI_CONTRACT_ADDRESS as `0x${string}`,
          abi: LynoAIAbi.abi,
          functionName: "buyTokens",
          args: [address],
          value: etherValue,
        });
      } else {
        // For ERC-20 token payments (USDT or USDC)
        const tokenValue = parseEther(amount);
        const tokenAddress =
          paymentMethod === "USDT"
            ? env.USDT_CONTRACT_ADDRESS
            : env.USDC_CONTRACT_ADDRESS;

        // First approve the contract to spend tokens
        await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: ERC20Abi.abi,
          functionName: "approve",
          args: [env.LYNOAI_CONTRACT_ADDRESS, tokenValue],
        });

        // Then call the buyWithToken function
        await writeContractAsync({
          address: env.LYNOAI_CONTRACT_ADDRESS as `0x${string}`,
          abi: LynoAIAbi.abi,
          functionName: "buyWithToken",
          args: [tokenAddress, tokenValue, address],
        });
      }

      // Refetch data after purchase
      refetchTotalSupply();
      refetchCap();
    } catch (err: unknown) {
      console.error(`Error purchasing tokens with ${paymentMethod}:`, err);
      throw err;
    }
  };

  // Derived values with proper type handling
  const totalSupply =
    totalSupplyData !== undefined ? (totalSupplyData as bigint) : BigInt(0);
  const cap = capData !== undefined ? (capData as bigint) : BigInt(0);

  // Calculate available tokens
  const availableTokens = cap > totalSupply ? cap - totalSupply : BigInt(0);

  return {
    availableTokens,
    tokensSold: totalSupply,
    totalSupply,
    cap,
    purchase: {
      write: purchase,
      isLoading: isPurchaseLoading,
      isSuccess,
      isError: !!purchaseError,
      error: purchaseError,
    },
    isLoading,
    isError,
    error,
  };
}
