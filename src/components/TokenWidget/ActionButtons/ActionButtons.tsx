interface ActionButtonsProps {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  handleBuyTokensClick: () => void;
  purchase: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: Error | null;
    write: (amount: string, paymentMethod?: string) => Promise<void>;
  };
  termsAccepted: boolean;
}

/**
 * Action buttons component based on connection state
 */
const ActionButtons = ({
  isConnected,
  openConnectModal,
  handleBuyTokensClick,
  purchase,
  termsAccepted
}: ActionButtonsProps) => {
  if (isConnected) {
    return (
      <>
        <button
          className="buy-btn"
          onClick={handleBuyTokensClick}
          disabled={purchase.isLoading || !termsAccepted}
        >
          {purchase.isLoading ? "Processing..." : "Buy Tokens"}
        </button>
        
        <button 
          className="referral-btn" 
          disabled={true}
          title="Referral functionality is not available at this time"
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        >
          Use Referral Code (Coming Soon)
        </button>
      </>
    );
  }
  
  return (
    <button
      className="buy-btn"
      onClick={openConnectModal}
    >
      Connect Wallet
    </button>
  );
};

export default ActionButtons; 