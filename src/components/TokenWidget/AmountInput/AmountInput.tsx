interface AmountInputProps {
  buyAmount: string;
  setBuyAmount: (amount: string) => void;
  paymentMethod: string;
  isConnected: boolean;
  balance: { formatted: string; symbol: string } | undefined;
  handleMaxButtonClick: () => void;
}

/**
 * Amount input component with max button
 */
const AmountInput = ({
  buyAmount,
  setBuyAmount,
  paymentMethod,
  isConnected,
  balance,
  handleMaxButtonClick
}: AmountInputProps) => {
  // Handler to select all text when input is focused
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Handler to validate input to only allow numbers and a single decimal point
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      setBuyAmount('0');
      return;
    }
    
    // Check if the input matches our pattern (numbers and at most one decimal point)
    const regex = /^[0-9]*\.?[0-9]*$/;
    
    if (regex.test(value)) {
      // If valid, update the state
      setBuyAmount(value);
    }
  };

  return (
    <div className="input-section">
      <div className="input-label-row">
        <label className="amount-label">Enter amount:</label>
        {isConnected && (
          <span className="wallet-bal">
            Balance: {balance ? parseFloat(balance.formatted).toLocaleString(undefined, {maximumFractionDigits: 4}) : "0"} {balance?.symbol || paymentMethod}
          </span>
        )}
      </div>
      <div className="input-wrapper">
        <input
          type="text"
          inputMode="decimal"
          value={buyAmount}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={`Amount in ${paymentMethod}`}
        />
        <button 
          className="max-btn" 
          onClick={handleMaxButtonClick}
          disabled={!isConnected}
        >
          MAX
        </button>
      </div>
    </div>
  );
};

export default AmountInput; 