"use client";
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { useTokenContract } from '../../../hooks/useTokenContract';
import { getTokenPurchaseByWallet } from '../services/getTokenPurchaseByWalletService';
import { FormattedBalance, PurchaseContract, PurchaseRecord } from '../types';

// Import custom hooks
import { 
  useTokenWidgetState, 
  useTokenWidgetBalances, 
  useTokenWidgetActions,
  useTokenConversion
} from '../hooks';

// Import the layout component
import TokenWidgetLayout from '../Layout/Layout';

// Import styles
import '../../../styles/TokenWidget.css';

/**
 * TokenWidgetContainer Component - Handles the logic and state management
 * Separates the business logic from the UI
 */
const TokenWidgetContainer = () => {
  const { address, isConnected } = useAccount();
  const [existingPurchase, setExistingPurchase] = useState<PurchaseRecord | null>(null);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState<boolean>(false);
  
  // Custom hooks for state management
  const { 
    buyAmount, 
    paymentMethod, 
    termsAccepted, 
    setBuyAmount, 
    setPaymentMethod, 
    setTermsAccepted 
  } = useTokenWidgetState();
  
  // Custom hook for balances
  const {
    currentBalance,
    handleMaxButtonClick
  } = useTokenWidgetBalances(address, paymentMethod);
  
  // Custom hook for actions
  const { handleBuyTokensClick, openConnectModal } = useTokenWidgetActions();
  
  // Get the token amount based on the payment amount
  const { tokenAmount, isLoadingPrice } = useTokenConversion(buyAmount, paymentMethod);

  // Contract data
  const {
    availableTokens,
    tokensSold,
    purchase,
    isLoading,
    isError,
    error
  } = useTokenContract();
  
  // Check for existing purchases when wallet is connected
  useEffect(() => {
    const checkExistingPurchase = async () => {
      if (!isConnected || !address) return;
      
      try {
        setIsCheckingPurchase(true);
        const purchases = await getTokenPurchaseByWallet(address);
        
        // Check if there's a purchase that meets our criteria
        const validPurchase = purchases.find(purchase => 
          // Check if fulfilled is explicitly true or false (not undefined or null)
          (purchase.fulfilled === true || purchase.fulfilled === false) &&
          // Ensure txHash exists if purchase is fulfilled
          (purchase.fulfilled === false || purchase.txHash) &&
          // Ensure paymentTxHash exists
          purchase.paymentTxHash
        );
        
        if (validPurchase) {
          setExistingPurchase(validPurchase);
        } else {
          setExistingPurchase(null);
        }
      } catch (error) {
        console.error("Error checking purchase history:", error);
        setExistingPurchase(null);
      } finally {
        setIsCheckingPurchase(false);
      }
    };
    
    checkExistingPurchase();
  }, [isConnected, address]);
  
  // Handle max amount button click
  const onMaxButtonClick = () => {
    handleMaxButtonClick(setBuyAmount);
  };
  
  // Handle buy tokens button click
  const onBuyTokensClick = () => {
    handleBuyTokensClick(
      isConnected,
      termsAccepted,
      address,
      buyAmount, // Payment amount (what user pays)
      paymentMethod,
      tokenAmount // Token amount (what user receives)
    );
  };

  // Return the layout component with all necessary props
  return (
    <TokenWidgetLayout
      isConnected={isConnected}
      isCheckingPurchase={isCheckingPurchase}
      existingPurchase={existingPurchase}
      availableTokens={availableTokens}
      tokensSold={tokensSold}
      isLoading={isLoading}
      buyAmount={buyAmount}
      setBuyAmount={setBuyAmount}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      termsAccepted={termsAccepted}
      setTermsAccepted={setTermsAccepted}
      handleMaxButtonClick={onMaxButtonClick}
      handleBuyTokensClick={onBuyTokensClick}
      openConnectModal={openConnectModal}
      tokenAmount={tokenAmount}
      isLoadingPrice={isLoadingPrice}
      currentBalance={currentBalance as FormattedBalance | string | undefined}
      isError={isError}
      error={error}
      purchase={purchase as unknown as PurchaseContract}
    />
  );
};

export default TokenWidgetContainer; 