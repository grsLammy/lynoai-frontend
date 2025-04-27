import { useState } from "react";

/**
 * Hook to manage TokenWidget state
 * Centralizes state management for the token widget component
 */
export function useTokenWidgetState() {
  const [buyAmount, setBuyAmount] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("ETH");
  const [termsAccepted, setTermsAccepted] = useState(false);

  return {
    // State values
    buyAmount,
    paymentMethod,
    termsAccepted,

    // State setters
    setBuyAmount,
    setPaymentMethod,
    setTermsAccepted,
  };
}
