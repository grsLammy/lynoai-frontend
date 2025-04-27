import { useEffect, useState } from "react";

interface ReceiveSectionProps {
  buyAmount: string;
  isLoading: boolean;
  paymentMethod: string;
  tokenAmount: string;
}

/**
 * Receive section showing token amount to be received
 */
const ReceiveSection = ({ 
  buyAmount, 
  isLoading, 
  paymentMethod, 
  tokenAmount 
}: ReceiveSectionProps) => {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<string>("0");

  // Fetch ETH price when component mounts or payment method changes
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
  }, [paymentMethod]);

  // Calculate USD value whenever relevant values change
  useEffect(() => {
    if (buyAmount && Number(buyAmount) > 0) {
      // For stablecoins, USD value is the same as the payment amount
      if (paymentMethod === "USDT" || paymentMethod === "USDC") {
        setUsdValue(Number(buyAmount).toLocaleString(undefined, { maximumFractionDigits: 2 }));
      } 
      // For ETH, convert to USD using the fetched price
      else if (paymentMethod === "ETH" && ethPrice > 0) {
        const valueInUsd = Number(buyAmount) * ethPrice;
        setUsdValue(valueInUsd.toLocaleString(undefined, { maximumFractionDigits: 2 }));
      } else {
        setUsdValue("...");
      }
    } else {
      setUsdValue("0");
    }
  }, [buyAmount, ethPrice, paymentMethod]);

  // Determine if we're in loading state
  const isCalculating = isLoading || isLoadingPrice;

  return (
    <div>
      <div className="receive-section">
        <p>You will receive:</p>
        <p className="amount">
          {isCalculating 
            ? "..." 
            : `${tokenAmount} LYNO`
          }
        </p>
      </div>
      <div className="receive-section" style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
        <p>Value in USD:</p>
        <p>
          {isCalculating 
            ? "..." 
            : `$${usdValue}`
          }
        </p>
      </div>
    </div>
  );
};

export default ReceiveSection; 