import { PurchaseRecord } from "../services/getTokenPurchaseByWalletService";

/**
 * Types related to the TokenWidget component
 */

// Export existing types
export type { PurchaseRecord };

// Props for the TokenWidgetContainer component
// This interface is intentionally empty but may be used for future props
//export interface TokenWidgetContainerProps {
//}

// Type for token balances that may be complex objects
export interface FormattedBalance {
  formatted: string;
  symbol: string;
  value?: bigint;
  decimals?: number;
}

// Type for the purchase contract interface
export interface PurchaseContract {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  write: (amount: string, paymentMethod?: string) => Promise<void>;
}

// Props for the TokenWidgetLayout component
export interface TokenWidgetLayoutProps {
  isConnected: boolean;
  isCheckingPurchase: boolean;
  existingPurchase: PurchaseRecord | null;

  // Stats data
  availableTokens: bigint;
  tokensSold: bigint;
  isLoading: boolean;

  // Form state
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;

  // Actions
  handleMaxButtonClick: () => void;
  handleBuyTokensClick: () => void;
  openConnectModal?: () => void;

  // Derived values
  tokenAmount: string;
  isLoadingPrice: boolean;
  currentBalance: FormattedBalance | string | undefined;

  // Error handling
  isError: boolean;
  error: Error | null;
  purchase: PurchaseContract;
}
