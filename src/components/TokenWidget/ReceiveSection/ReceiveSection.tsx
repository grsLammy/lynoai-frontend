import { useEffect, useState } from "react";
import { env } from "../../../env";

interface ReceiveSectionProps {
  buyAmount: string;
  isLoading: boolean;
  paymentMethod: string;
}

/**
 * Receive section showing token amount to be received
 */
const ReceiveSection = ({ buyAmount, isLoading, paymentMethod }: ReceiveSectionProps) => {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);

  // Fetch ETH price when component mounts
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setIsLoadingPrice(true);
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
        setIsLoadingPrice(false);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        setEthPrice(2000); // Fallback price if API fails
        setIsLoadingPrice(false);
      }
    };

    fetchEthPrice();
  }, []);

  // Calculate tokens received based on payment method
  const calculateTokens = () => {
    if (!buyAmount || Number(buyAmount) === 0) return "0";
    
    const amount = Number(buyAmount);
    const tokenPrice = Number(env.CURRENT_PRICE);
    
    // For USDT and USDC (stablecoins), direct conversion
    if (paymentMethod === "USDT" || paymentMethod === "USDC") {
      return (amount / tokenPrice).toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    
    // For ETH, convert ETH to USD first
    if (ethPrice > 0) {
      const valueInUsd = amount * ethPrice;
      return (valueInUsd / tokenPrice).toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    
    return "...";
  };

  return (
    <div className="receive-section">
      <p>You will receive:</p>
      <p className="amount">
        {isLoading || isLoadingPrice 
          ? "..." 
          : `${calculateTokens()} LYNO`
        }
      </p>
    </div>
  );
};

export default ReceiveSection; 