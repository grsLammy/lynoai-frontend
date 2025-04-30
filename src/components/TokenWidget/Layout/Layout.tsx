import { TokenWidgetLayoutProps } from '../types';
import { env } from '../../../env';

// Import individual components
import NetworkInfoBar from '../NetworkInfoBar/NetworkInfoBar';
import TokenStats from '../TokenStats/TokenStats';
import PaymentOptions from '../PaymentOptions/PaymentOptions';
import AmountInput from '../AmountInput/AmountInput';
import ReceiveSection from '../ReceiveSection/ReceiveSection';
import TermsCheckbox from '../TermsCheckbox/TermsCheckbox';
import ActionButtons from '../ActionButtons/ActionButtons';
import ErrorMessages from '../ErrorMessages/ErrorMessages';
import PurchaseInfo from '../PurchaseInfo/PurchaseInfo';

/**
 * Layout component for TokenWidget - Handles only UI rendering
 */
const TokenWidgetLayout = ({
  isConnected,
  isCheckingPurchase,
  existingPurchase,
  availableTokens,
  tokensSold,
  isLoading,
  buyAmount,
  setBuyAmount,
  paymentMethod,
  setPaymentMethod,
  termsAccepted,
  setTermsAccepted,
  handleMaxButtonClick,
  handleBuyTokensClick,
  openConnectModal,
  tokenAmount,
  isLoadingPrice,
  currentBalance,
  isError,
  error,
  purchase
}: TokenWidgetLayoutProps) => {
  // Convert the balance to the format expected by AmountInput
  const formattedBalance = (): { formatted: string; symbol: string } | undefined => {
    if (!currentBalance) {
      return undefined;
    }

    if (typeof currentBalance === 'string') {
      return {
        formatted: currentBalance,
        symbol: paymentMethod
      };
    }

    return {
      formatted: currentBalance.formatted,
      symbol: currentBalance.symbol
    };
  };

  return (
    <div className="widget-wrapper">
      {/* Only show connected wallet info at the top if wallet is connected */}
      {isConnected && <NetworkInfoBar />}
      
      <div className="widget-container">
        <div className="header">
          <h1>LynoAI Token Sale</h1>
          <span className="phase">Phase {env.CURRENT_PHASE}</span>
        </div>
        
        <TokenStats 
          availableTokens={availableTokens} 
          tokensSold={tokensSold} 
          isLoading={isLoading} 
        />
        
        {/* Show existing purchase info or regular purchase interface */}
        {isCheckingPurchase ? (
          <div className="loading-purchase">Checking purchase history...</div>
        ) : existingPurchase ? (
          <PurchaseInfo purchase={existingPurchase} />
        ) : (
          <>
            <PaymentOptions 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
            />
            
            <AmountInput 
              buyAmount={buyAmount} 
              setBuyAmount={setBuyAmount} 
              paymentMethod={paymentMethod} 
              isConnected={isConnected} 
              balance={formattedBalance()} 
              handleMaxButtonClick={handleMaxButtonClick} 
            />
            
            <ReceiveSection 
              buyAmount={buyAmount} 
              isLoading={isLoading}
              paymentMethod={paymentMethod}
              tokenAmount={tokenAmount}
              isLoadingPrice={isLoadingPrice}
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
          </>
        )}
      </div>
    </div>
  );
};

export default TokenWidgetLayout; 