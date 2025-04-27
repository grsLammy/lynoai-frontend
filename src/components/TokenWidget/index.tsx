"use client";
import { useState, useMemo } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useTokenContract } from '../../hooks/useTokenContract';

// Import individual components
import NetworkInfoBar from './NetworkInfoBar/NetworkInfoBar';
import TokenStats from './TokenStats/TokenStats';
import PaymentOptions from './PaymentOptions/PaymentOptions';
import AmountInput from './AmountInput/AmountInput';
import ReceiveSection from './ReceiveSection/ReceiveSection';
import TermsCheckbox from './TermsCheckbox/TermsCheckbox';
import ActionButtons from './ActionButtons/ActionButtons';
import ErrorMessages from './ErrorMessages/ErrorMessages';

// Import styles
import '../../styles/TokenWidget.css';
import { env } from '../../env';

/**
 * TokenWidget Component - Displays token sale information and allows users to purchase tokens
 */
const TokenWidget = () => {
  const { address, isConnected } = useAccount();
  const [buyAmount, setBuyAmount] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("ETH");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Get ETH balance
  const { data: ethBalance } = useBalance({ 
    address,
  });

  // Get USDT balance
  const { data: usdtBalance } = useBalance({
    address,
    token: env.USDT_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address,
    token: env.USDC_CONTRACT_ADDRESS as `0x${string}`,
  });

  // Get current balance based on selected payment method
  const currentBalance = useMemo(() => {
    switch (paymentMethod) {
      case 'ETH':
        return ethBalance;
      case 'USDT':
        return usdtBalance;
      case 'USDC':
        return usdcBalance;
      default:
        return ethBalance;
    }
  }, [paymentMethod, ethBalance, usdtBalance, usdcBalance]);

  const { openConnectModal } = useConnectModal();

  // Use the token contract hook instead of direct contract calls
  const {
    availableTokens,
    tokensSold,
    purchase,
    isLoading,
    isError,
    error
  } = useTokenContract();

  // Handle max button click
  const handleMaxButtonClick = () => {
    if (currentBalance && currentBalance.formatted) {
      // Set the buy amount to the wallet balance, leaving a small amount for gas if ETH
      const gasFeeBuffer = paymentMethod === 'ETH' ? 0.01 : 0;
      const maxAmount = parseFloat(currentBalance.formatted) > gasFeeBuffer 
        ? (parseFloat(currentBalance.formatted) - gasFeeBuffer).toString()
        : "0";
      setBuyAmount(maxAmount);
    }
  };

  // Event handlers
  const handleBuyTokensClick = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions");
      return;
    }

    try {
      await purchase.write(buyAmount, paymentMethod);
    } catch (error) {
      console.error("Error buying tokens:", error);
    }
  };

  return (
    <div className="widget-wrapper">
      {/* Only show connected wallet info at the top if wallet is connected */}
      {isConnected && <NetworkInfoBar />}
      
      <div className="widget-container">
        <div className="header">
          <h1>Buy Token</h1>
          <span className="phase">Phase {env.CURRENT_PHASE}</span>
        </div>
        
        <TokenStats 
          availableTokens={availableTokens} 
          tokensSold={tokensSold} 
          isLoading={isLoading} 
        />
        
        <PaymentOptions 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
        />
        
        <AmountInput 
          buyAmount={buyAmount} 
          setBuyAmount={setBuyAmount} 
          paymentMethod={paymentMethod} 
          isConnected={isConnected} 
          balance={currentBalance} 
          handleMaxButtonClick={handleMaxButtonClick} 
        />
        
        <ReceiveSection 
          buyAmount={buyAmount} 
          isLoading={isLoading}
          paymentMethod={paymentMethod}
        />
        
        <TermsCheckbox 
          termsAccepted={termsAccepted} 
          setTermsAccepted={setTermsAccepted} 
        />
        
        <ActionButtons 
          isConnected={isConnected} 
          openConnectModal={openConnectModal} 
          handleBuyTokensClick={handleBuyTokensClick} 
          purchase={purchase} 
          termsAccepted={termsAccepted} 
        />

        <ErrorMessages 
          isError={isError} 
          error={error} 
          purchase={purchase} 
        />
      </div>
    </div>
  );
};

export default TokenWidget; 