import { useConnectModal } from "@rainbow-me/rainbowkit";
import { purchaseTokens } from "../services/tokenPurchaseService";
import toast from "react-hot-toast";
import { useTokenTransfer } from "./useTokenTransfer";

/**
 * Hook to manage token purchase actions
 */
export function useTokenWidgetActions() {
  const { openConnectModal } = useConnectModal();
  const { transferTokens } = useTokenTransfer();

  /**
   * Handles the buy tokens action
   * @param isConnected Whether the wallet is connected
   * @param termsAccepted Whether the terms are accepted
   * @param address The wallet address
   * @param paymentAmount The amount of ETH/USDT/USDC that the user will pay
   * @param paymentMethod The selected payment method (ETH, USDT, USDC)
   * @param tokenAmount The calculated amount of tokens that the user will receive
   */
  const handleBuyTokensClick = async (
    isConnected: boolean,
    termsAccepted: boolean,
    address: string | undefined,
    paymentAmount: string,
    paymentMethod: string,
    tokenAmount: string
  ) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (!address) {
      console.error("Wallet address not available");
      return;
    }

    try {
      // Show payment processing toast
      const transferToast = toast.loading(
        `Processing payment of ${paymentAmount} ${paymentMethod}...`
      );

      // Step 1: Transfer tokens to the project wallet
      let paymentTxHash: `0x${string}`;

      try {
        paymentTxHash = await transferTokens(
          paymentMethod as "ETH" | "USDT" | "USDC",
          paymentAmount
        );

        // Update the toast with transaction info
        toast.success(
          `Payment successful! Transaction: ${paymentTxHash.substring(
            0,
            10
          )}...`,
          { id: transferToast, duration: 3000 }
        );
      } catch (transferError) {
        // Handle transfer error
        toast.error(
          `Payment failed: ${
            transferError instanceof Error
              ? transferError.message
              : "Unknown error"
          }`,
          { id: transferToast }
        );
        return false;
      }

      // Step 2: Call the API with the transaction hash
      const apiToast = toast.loading(`Finalizing token purchase...`);

      const data = await purchaseTokens({
        walletAddress: address,
        amount: tokenAmount, // The amount of tokens the user will receive
        selectedPaymentToken: paymentMethod,
        paymentAmount: paymentAmount, // The amount of ETH/USDT/USDC the user will pay
        paymentTxHash: paymentTxHash, // Include the payment transaction hash
        referralCode: undefined, // Add referral handling if needed
      });

      // Dismiss API loading toast
      toast.dismiss(apiToast);

      console.log("Purchase successful:", data);

      // Show detailed success toast
      toast.success(
        `🎉 Purchase Initiated!\n\nYou'll receive: ${tokenAmount} LYNO tokens in 30 days\nPaid with: ${paymentAmount} ${paymentMethod}\nPayment Transaction: ${paymentTxHash.substring(
          0,
          10
        )}...\n\nCheck your wallet for confirmation after 30 days.`,
        {
          duration: 10000,
          style: {
            maxWidth: "500px",
            whiteSpace: "pre-line", // This preserves the line breaks
          },
        }
      );
      return true;
    } catch (error) {
      console.error("Error buying tokens:", error);

      // Show detailed error toast
      toast.error(
        `❌ Purchase Failed\n\n${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nPlease try again later or contact support.`,
        {
          duration: 7000,
          style: {
            maxWidth: "500px",
            whiteSpace: "pre-line", // This preserves the line breaks
          },
        }
      );
      return false;
    }
  };

  return {
    openConnectModal,
    handleBuyTokensClick,
  };
}
