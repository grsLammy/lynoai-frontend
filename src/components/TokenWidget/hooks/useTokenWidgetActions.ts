import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-hot-toast";
import { usePaymentService } from "../services/paymentService";
import { submitPurchaseRequest } from "../services/purchaseRequestService";
import { showNotification } from "../utils/notificationUtils";
import { MESSAGES } from "../constants/toastMessages";

/**
 * Hook to manage token purchase actions
 * Coordinates the overall purchase flow using specialized services
 */
export function useTokenWidgetActions() {
  const { openConnectModal } = useConnectModal();
  const { handlePaymentTransaction } = usePaymentService();

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
    // Validation checks
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!termsAccepted) {
      showNotification("error", MESSAGES.TERMS_NOT_ACCEPTED);
      return;
    }

    if (!address) {
      console.error("Wallet address not available");
      return;
    }

    // Create a toast ID to track and update
    const transferToast = toast.loading(
      MESSAGES.PROCESSING_PAYMENT(paymentAmount, paymentMethod)
    );

    try {
      // Step 1: Handle the payment transaction
      const paymentResult = await handlePaymentTransaction(
        paymentMethod,
        paymentAmount,
        transferToast
      );

      if (!paymentResult.success) {
        return false;
      }

      // Verify that we have a transaction hash before proceeding
      if (!paymentResult.txHash) {
        console.error(
          "Payment transaction completed but no transaction hash returned"
        );
        showNotification(
          "error",
          MESSAGES.GENERAL_ERROR(new Error("Missing transaction hash"))
        );
        return false;
      }

      const paymentTxHash = paymentResult.txHash;

      // Step 2: Submit the purchase request to the API
      const apiToast = toast.loading(MESSAGES.FINALIZING_PURCHASE);

      const purchaseResult = await submitPurchaseRequest({
        address,
        paymentTxHash,
        paymentAmount,
        paymentMethod,
        tokenAmount,
        apiToast,
      });

      if (purchaseResult.success) {
        // Show simple success notification and refresh page
        showNotification(
          "success",
          MESSAGES.PURCHASE_SUCCESS(tokenAmount),
          5000,
          // Callback to refresh the page after notification
          () => setTimeout(() => window.location.reload(), 5000)
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      // General error handler
      console.error("Error buying tokens:", error);
      toast.dismiss(); // Dismiss any active toasts
      showNotification("error", MESSAGES.GENERAL_ERROR(error));
      return false;
    }
  };

  return {
    openConnectModal,
    handleBuyTokensClick,
  };
}
