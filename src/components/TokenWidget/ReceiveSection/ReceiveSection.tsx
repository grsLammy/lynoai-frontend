import { env } from "../../../env";

interface ReceiveSectionProps {
  buyAmount: string;
  isLoading: boolean;
}

/**
 * Receive section showing token amount to be received
 */
const ReceiveSection = ({ buyAmount, isLoading }: ReceiveSectionProps) => {
  return (
    <div className="receive-section">
      <p>You will receive:</p>
      <p className="amount">
        {isLoading 
          ? "..." 
          : `${(Number(buyAmount) * (1/Number(env.CURRENT_PRICE))).toLocaleString(undefined, {maximumFractionDigits: 2})} LYNO`
        }
      </p>
    </div>
  );
};

export default ReceiveSection; 