/**
 * Centralized toast message templates
 */
export const MESSAGES = {
  // Error messages
  TERMS_NOT_ACCEPTED: "Please accept the terms and conditions",

  // Process messages
  PROCESSING_PAYMENT: (amount: string, method: string) =>
    `Processing payment of ${amount} ${method}...`,
  FINALIZING_PURCHASE: "Finalizing token purchase...",

  // Success messages
  PAYMENT_SUCCESS: "Payment successful!",
  PURCHASE_SUCCESS: (tokenAmount: string) =>
    `Purchase Request Submitted Successfully for ${tokenAmount} LYNO!`,
  COPY_SUCCESS: "Transaction ID copied to clipboard",

  // Error messages
  PAYMENT_FAILED: (error: unknown) =>
    `Payment failed: ${
      error instanceof Error ? error.message : "Unknown error"
    }`,
  API_ERROR: (txHash: string) =>
    `⚠️ Payment successful, but we couldn't record your purchase in our system.\n\nYour payment transaction: ${txHash}\n\nPlease contact support with this transaction ID to complete your purchase.`,
  GENERAL_ERROR: (error: unknown) =>
    `❌ Purchase Failed\n\n${
      error instanceof Error ? error.message : "Unknown error"
    }\n\nPlease try again later or contact support.`,
};
