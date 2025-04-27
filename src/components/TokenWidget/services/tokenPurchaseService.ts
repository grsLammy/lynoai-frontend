import { env } from "../../../env";

type PurchaseRequest = {
  walletAddress: string;
  amount: string; // The token amount in wei that the user will receive
  selectedPaymentToken: string;
  paymentAmount: string; // The amount of ETH/USDT/USDC that the user will pay
  paymentTxHash: `0x${string}`; // Transaction hash of the payment
  referralCode?: string;
};

/**
 * Handles token purchase API requests
 * @param request Purchase request data
 * @returns API response data
 * @throws Error if the purchase fails
 */
export async function purchaseTokens(request: PurchaseRequest) {
  const response = await fetch(`${env.BACKEND_API_URL}/token-purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to process purchase");
  }

  return await response.json();
}
