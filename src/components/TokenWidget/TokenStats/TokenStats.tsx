import { formatEther } from 'viem';
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
    
    const total = Number(formatEther(availableTokens)) + Number(formatEther(tokensSold));
    const sold = Number(formatEther(tokensSold));
    return (sold / total) * 100;
  };

  return (
    <div className="token-stats">
      <div className="stat-left">
        <p className="total-sold">
          {isLoading ? "Loading..." : formatTokenAmount(tokensSold)}
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