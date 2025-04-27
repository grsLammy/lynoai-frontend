"use client";
import { useAccount } from 'wagmi';
import { useTokenContract } from '../../hooks/useTokenContract';

// Import custom hooks
import { 
  useTokenWidgetState, 
  useTokenWidgetBalances, 
  useTokenWidgetActions,
  useTokenConversion
} from './hooks';

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
  
  // Custom hooks
  const { 
    buyAmount, 
    paymentMethod, 
    termsAccepted, 
    setBuyAmount, 
    setPaymentMethod, 
    setTermsAccepted 
  } = useTokenWidgetState();
  
  const {
    currentBalance,
    handleMaxButtonClick
  } = useTokenWidgetBalances(address, paymentMethod);
  
  const { handleBuyTokensClick } = useTokenWidgetActions();
  
  // Get the token amount based on the payment amount
  const { tokenAmount } = useTokenConversion(buyAmount, paymentMethod);

  // Contract data
  const {
    availableTokens,
    tokensSold,
    purchase,
    isLoading,
    isError,
    error
  } = useTokenContract();
  
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
          handleMaxButtonClick={onMaxButtonClick} 
        />
        
        <ReceiveSection 
          buyAmount={buyAmount} 
          isLoading={isLoading}
          paymentMethod={paymentMethod}
          tokenAmount={tokenAmount} // Pass the calculated token amount
        />
        
        <TermsCheckbox 
          termsAccepted={termsAccepted} 
          setTermsAccepted={setTermsAccepted} 
        />
        
        <ActionButtons 
          isConnected={isConnected} 
          openConnectModal={useTokenWidgetActions().openConnectModal} 
          handleBuyTokensClick={onBuyTokensClick} 
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