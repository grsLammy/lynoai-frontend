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
        
        <button className="referral-btn">
          Use Referral Code
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