import toast from "react-hot-toast";
import { useTokenTransfer } from "../hooks/useTokenTransfer";
import { MESSAGES } from "../constants/toastMessages";

interface PaymentResult {
  success: boolean;
  txHash?: `0x${string}`;
  error?: Error | unknown;
}

/**
 * Custom hook that provides payment transaction functionality
 */
export function usePaymentService() {
  // Use the token transfer hook within this component
  const { transferTokens } = useTokenTransfer();

  /**
   * Handles the payment transaction process
   * @param paymentMethod The payment method (ETH, USDT, USDC)
   * @param paymentAmount The amount to pay
   * @param toastId The ID of the loading toast to update
   * @returns Success status and transaction hash if successful
   */
  const handlePaymentTransaction = async (
    paymentMethod: string,
    paymentAmount: string,
    toastId: string
  ): Promise<PaymentResult> => {
    try {
      // Execute the token transfer
      const paymentTxHash = await transferTokens(
        paymentMethod as "ETH" | "USDT" | "USDC",
        paymentAmount
      );

      // Dismiss the loading toast
      toast.dismiss(toastId);

      return {
        success: true,
        txHash: paymentTxHash,
      };
    } catch (error) {
      // Handle transfer error
      toast.error(MESSAGES.PAYMENT_FAILED(error), { id: toastId });

      return {
        success: false,
        error,
      };
    }
  };

  return { handlePaymentTransaction };
}
