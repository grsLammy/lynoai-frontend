interface PaymentOptionsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

/**
 * Payment options component
 */
const PaymentOptions = ({ paymentMethod, setPaymentMethod }: PaymentOptionsProps) => {
  return (
    <div className="payment-options">
      <input 
        type="radio" 
        id="ETH" 
        name="payment" 
        checked={paymentMethod === "ETH"} 
        onChange={() => setPaymentMethod("ETH")}
      />
      <label htmlFor="ETH">ETH</label>
      
      <input 
        type="radio" 
        id="USDT" 
        name="payment" 
        checked={paymentMethod === "USDT"} 
        onChange={() => setPaymentMethod("USDT")}
      />
      <label htmlFor="USDT">USDT</label>
      
      <input 
        type="radio" 
        id="USDC" 
        name="payment" 
        checked={paymentMethod === "USDC"} 
        onChange={() => setPaymentMethod("USDC")}
      />
      <label htmlFor="USDC">USDC</label>
    </div>
  );
};

export default PaymentOptions; 