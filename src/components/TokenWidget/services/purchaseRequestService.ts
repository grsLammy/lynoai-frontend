import toast from "react-hot-toast";
import { parseEther } from "viem";
import { purchaseTokens } from "./tokenPurchaseService";
import { MESSAGES } from "../constants/toastMessages";

interface PurchaseRequestParams {
  address: string;
  paymentTxHash: `0x${string}`;
  paymentAmount: string;
  paymentMethod: string;
  tokenAmount: string;
  apiToast: string; // ID of the loading toast
}

interface PurchaseResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: unknown;
}

/**
 * Submits a purchase request to the backend API
 * @param params The purchase request parameters
 * @returns The result of the purchase operation
 */
export const submitPurchaseRequest = async (
  params: PurchaseRequestParams
): Promise<PurchaseResult> => {
  const {
    address,
    paymentTxHash,
    paymentAmount,
    paymentMethod,
    tokenAmount,
    apiToast,
  } = params;

  try {
    // Convert tokenAmount to wei for the API
    let tokenAmountInWei: string;
    try {
      tokenAmountInWei = parseEther(tokenAmount).toString();
    } catch (error) {
      console.error("Error converting token amount to wei:", error);
      tokenAmountInWei = parseEther("0").toString();
    }

    // Call the API with the transaction details
    const data = await purchaseTokens({
      walletAddress: address,
      amount: tokenAmountInWei, // The amount of tokens in wei that the user will receive
      selectedPaymentToken: paymentMethod,
      paymentAmount: paymentAmount, // The amount of ETH/USDT/USDC that the user will pay
      paymentTxHash: paymentTxHash, // Include the payment transaction hash
      referralCode: undefined, // Add referral handling if needed
    });

    // Dismiss API loading toast
    toast.dismiss(apiToast);

    console.log("Purchase successful:", data);

    return {
      success: true,
      data,
    };
  } catch (apiError) {
    // Backend API failed but payment was successful
    // Dismiss the API loading toast
    toast.dismiss(apiToast);

    console.error("Backend API error:", apiError);

    // Inform user about the situation and provide transaction details
    toast.error(MESSAGES.API_ERROR(paymentTxHash), {
      duration: 15000,
      style: {
        maxWidth: "450px",
        background: "#2a2a2a",
        color: "#fff",
        whiteSpace: "pre-line",
      },
    });

    // Copy transaction hash to clipboard for easy sharing
    navigator.clipboard.writeText(paymentTxHash).then(
      () => toast.success(MESSAGES.COPY_SUCCESS),
      () => console.error("Failed to copy transaction ID")
    );

    // Still open Etherscan so they can verify the transaction
    window.open(`https://sepolia.etherscan.io/tx/${paymentTxHash}`, "_blank");

    return {
      success: false,
      error: apiError,
    };
  }
};
