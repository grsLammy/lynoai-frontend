import { formatEther } from "viem";

interface PurchaseInfoProps {
  purchase: {
    amount: string;
    fulfilled: boolean;
    txHash?: string;
    paymentTxHash: string;
    selectedPaymentToken: string;
    paymentAmount: string;
  };
}

/**
 * Component to display existing purchase information
 */
const PurchaseInfo = ({ purchase }: PurchaseInfoProps) => {
  // Convert wei amount to formatted LYNO amount
  const formatLynoAmount = (weiAmount: string) => {
    try {
      const etherValue = formatEther(BigInt(weiAmount));
      return Number(etherValue).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error("Error formatting LYNO amount:", error);
      return "0";
    }
  };

  return (
    <div className="purchase-info">
      <h2>Your Token Purchase</h2>
      
      <div className="purchase-detail">
        <span className="label">Requested Amount:</span>
        <span className="value">{formatLynoAmount(purchase.amount)} LYNO</span>
      </div>
      
      <div className="purchase-detail">
        <span className="label">Payment:</span>
        <span className="value">{purchase.paymentAmount} {purchase.selectedPaymentToken}</span>
      </div>
      
      <div className="purchase-detail">
        <span className="label">Status:</span>
        <span className={`status ${purchase.fulfilled ? 'fulfilled' : 'pending'}`}>
          {purchase.fulfilled ? 'Completed' : 'Pending'}
        </span>
      </div>
      
      <div className="purchase-detail">
        <span className="label">Payment Transaction:</span>
        <a 
          href={`https://sepolia.etherscan.io/tx/${purchase.paymentTxHash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="tx-link"
        >
          {`${purchase.paymentTxHash.substring(0, 10)}...`}
        </a>
      </div>
      
      {purchase.fulfilled && purchase.txHash && (
        <div className="purchase-detail">
          <span className="label">Token Transfer:</span>
          <a 
            href={`https://sepolia.etherscan.io/tx/${purchase.txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="tx-link"
          >
            {`${purchase.txHash.substring(0, 10)}...`}
          </a>
        </div>
      )}
      
      <div className="purchase-note">
        {purchase.fulfilled 
          ? 'Your LYNO tokens have been transferred to your wallet.' 
          : 'Your purchase is being processed. Tokens will be delivered to your wallet after the distribution period.'}
      </div>
    </div>
  );
};

export default PurchaseInfo; 