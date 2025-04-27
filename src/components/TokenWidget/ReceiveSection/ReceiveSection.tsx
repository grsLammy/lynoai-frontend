import { useEffect, useState } from "react";

interface ReceiveSectionProps {
  buyAmount: string;
  isLoading: boolean;
  paymentMethod: string;
  tokenAmount: string;
  isLoadingPrice?: boolean;
}

/**
 * Receive section showing token amount to be received
 */
const ReceiveSection = ({ 
  buyAmount, 
  isLoading, 
  paymentMethod, 
  tokenAmount,
  isLoadingPrice = false
}: ReceiveSectionProps) => {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [usdValue, setUsdValue] = useState<string>("0");

  // Fetch ETH price when component mounts or payment method changes
  useEffect(() => {
    // Only fetch ETH price if ETH is selected
    if (paymentMethod !== "ETH") return;
    
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
        const data = await response.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        setEthPrice(2000); // Fallback price if API fails
      }
    };

    fetchEthPrice();
  }, [paymentMethod]);

  // Calculate USD value whenever relevant values change
  useEffect(() => {
    if (paymentMethod !== "ETH") return;
    
    if (buyAmount && Number(buyAmount) > 0 && ethPrice > 0) {
      const valueInUsd = Number(buyAmount) * ethPrice;
      setUsdValue(valueInUsd.toLocaleString(undefined, { maximumFractionDigits: 2 }));
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
      
      {/* Only show USD value for ETH payments */}
      {paymentMethod === "ETH" && (
        <div className="receive-section" style={{ fontSize: '12px', color: '#aaa', marginTop: '5px' }}>
          <p>Value in USD:</p>
          <p>
            {isCalculating 
              ? "..." 
              : `$${usdValue}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceiveSection; 