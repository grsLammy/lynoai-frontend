import { parseEther, parseUnits } from "viem";
import { useSendTransaction, useWriteContract } from "wagmi";
import { env } from "../../../env";

// ERC20 ABI for token transfers
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

/**
 * Hook for transferring crypto tokens (ETH, USDT, USDC) to the project wallet
 */
export function useTokenTransfer() {
  // Get the necessary hooks for transactions
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  /**
   * Transfer tokens to the project wallet
   * @param tokenType The type of token to transfer (ETH, USDT, USDC)
   * @param amount The amount to transfer in the token's decimal format
   * @returns The transaction hash of the transfer
   */
  const transferTokens = async (
    tokenType: "ETH" | "USDT" | "USDC",
    amount: string
  ): Promise<`0x${string}`> => {
    // Check if the WALLET_ADDRESS is set
    if (!env.WALLET_ADDRESS) {
      throw new Error(
        "Recipient wallet address is not set in environment variables"
      );
    }

    const recipientAddress = env.WALLET_ADDRESS as `0x${string}`;

    try {
      if (tokenType === "ETH") {
        // For ETH payments, use sendTransaction
        return await sendTransactionAsync({
          to: recipientAddress,
          value: parseEther(amount),
        });
      } else {
        // For ERC20 tokens (USDT or USDC)
        const tokenAddress =
          tokenType === "USDT"
            ? (env.USDT_CONTRACT_ADDRESS as `0x${string}`)
            : (env.USDC_CONTRACT_ADDRESS as `0x${string}`);

        // Both USDT and USDC use 6 decimals
        const decimals = 6;
        const tokenAmount = parseUnits(amount, decimals);

        // Call the token's transfer function
        return await writeContractAsync({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipientAddress, tokenAmount],
        });
      }
    } catch (error) {
      console.error(`Error transferring ${tokenType}:`, error);
      throw new Error(
        `Failed to transfer ${tokenType}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return { transferTokens };
}
