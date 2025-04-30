import { env } from "../../../env";

/**
 * Type definition for the token purchase record returned from the API
 */
export type PurchaseRecord = {
  _id: string;
  walletAddress: string;
  amount: string; // The token amount in wei that the user will receive
  selectedPaymentToken: string;
  paymentAmount: string; // The amount of ETH/USDT/USDC that the user paid
  paymentTxHash: string; // Transaction hash of the payment
  fulfilled: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  txHash?: string; // Optional - may not be present if not yet fulfilled
};

/**
 * Handles GET token purchase API request
 * @param walletAddress The wallet address of the user
 * @returns API response data with purchase records
 * @throws Error if the request fails
 */
export async function getTokenPurchaseByWallet(
  walletAddress: string
): Promise<PurchaseRecord[]> {
  const response = await fetch(
    `${env.BACKEND_API_URL}/token-purchase?walletAddress=${walletAddress}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to retrieve purchase records");
  }

  return await response.json();
}
