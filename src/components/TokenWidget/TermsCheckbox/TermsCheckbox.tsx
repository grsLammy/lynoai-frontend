interface TermsCheckboxProps {
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
}

/**
 * Terms and conditions checkbox
 */
const TermsCheckbox = ({ termsAccepted, setTermsAccepted }: TermsCheckboxProps) => {
  return (
    <div className="terms">
      <input 
        type="checkbox" 
        id="terms" 
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
      />
      <label htmlFor="terms">
        Yes, I have read, understood and agree to the Terms of Services, including the User Consent & Agreement. By participating in the OZAK AI Token presale, I consent to these terms and conditions.
      </label>
    </div>
  );
};

export default TermsCheckbox; 