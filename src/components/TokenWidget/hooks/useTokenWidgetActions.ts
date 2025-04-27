import { useConnectModal } from "@rainbow-me/rainbowkit";
import { purchaseTokens } from "../services/tokenPurchaseService";

/**
 * Hook to manage token purchase actions
 */
export function useTokenWidgetActions() {
  const { openConnectModal } = useConnectModal();

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
      alert("Please accept the terms and conditions");
      return;
    }

    if (!address) {
      console.error("Wallet address not available");
      return;
    }

    try {
      const data = await purchaseTokens({
        walletAddress: address,
        amount: tokenAmount, // The amount of tokens the user will receive
        selectedPaymentToken: paymentMethod,
        paymentAmount: paymentAmount, // The amount of ETH/USDT/USDC the user will pay
        referralCode: undefined, // Add referral handling if needed
      });

      console.log("Purchase successful:", data);

      // Show success message
      alert(
        "Purchase initiated successfully! Check your wallet for transaction confirmation."
      );
      return true;
    } catch (error) {
      console.error("Error buying tokens:", error);
      alert(
        `Purchase failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  return {
    openConnectModal,
    handleBuyTokensClick,
  };
}
