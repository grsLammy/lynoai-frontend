import { formatTokenAmount } from '../../../utils/formatters';
import { env } from '../../../env';
interface TokenStatsProps {
  availableTokens: bigint | undefined;
  tokensSold: bigint | undefined;
  isLoading: boolean;
}

/**
 * Token stats component with progress bar
 */
const TokenStats = ({ availableTokens, tokensSold, isLoading }: TokenStatsProps) => {
  // Calculate progress percentage
  const calculateProgress = () => {
    if (isLoading || !availableTokens || !tokensSold) return 0;
    
    // Total supply is the sum of available and sold tokens
    const totalSupply = availableTokens + tokensSold;
    
    // Calculate the percentage sold of total supply
    if (totalSupply === 0n) return 0;
    
    // Convert to number for percentage calculation
    const soldPercentage = Number((tokensSold * 100n) / totalSupply);
    return Math.min(soldPercentage, 100); // Cap at 100%
  };

  // Function to determine what to display for tokensSold
  const getTokensSoldDisplay = () => {
    // If tokensSold exists and is 0, show "0" regardless of loading state
    if (tokensSold !== undefined && tokensSold === 0n) {
      return "0";
    }
    // Otherwise, show loading or the formatted amount
    return isLoading ? "Loading..." : formatTokenAmount(tokensSold);
  };

  return (
    <div className="token-stats">
      <div className="stat-left">
        <p className="total-sold">
          {getTokensSoldDisplay()}
        </p>
        <p className="label">Tokens Sold</p>
      </div>

      <div className="stat-right">
        <p className="remaining-amount">
          {isLoading ? "Loading..." : formatTokenAmount(availableTokens)}
        </p>
        <p className="remaining">Tokens Available</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      
      <div>
        <div className="status_price">
          Current Price = <span>${env.CURRENT_PRICE}</span>/token
        </div>
      </div>
    </div>
  );
};

export default TokenStats; 