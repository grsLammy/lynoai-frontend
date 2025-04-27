# Lyno AI Frontend with RainbowKit

This project uses RainbowKit to provide a seamless wallet connection experience for web3 applications.

## Wallet Integration

### RainbowKit and wagmi

- Multiple chain support (Ethereum, Polygon, Optimism, Arbitrum, Base)
- Beautiful UI for wallet connection
- Support for multiple wallet providers
- Support for dark/light mode

## Token Purchase Flow

The application implements a comprehensive token purchase flow:

1. **Connect Wallet**: Users connect their wallets using RainbowKit's modal
2. **Select Payment Method**: Users can choose to pay with ETH, USDT, or USDC
3. **Enter Amount**: Users specify how much they want to spend
4. **Token Calculation**: The app calculates how many tokens they'll receive
5. **Payment Process**:
   - User confirms payment by sending tokens directly to the project wallet
   - Transaction hash is captured as proof of payment
   - Backend API is called with transaction details
6. **Confirmation**: User receives confirmation of their purchase

### API Integration

The token purchase flow integrates with the backend API:

```typescript
// API payload structure
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "amount": "1000", // Token amount user will receive
  "selectedPaymentToken": "ETH", // ETH, USDT, or USDC
  "paymentAmount": "0.5", // Amount user paid in the payment token
  "paymentTxHash": "0x4f9cdc85efc39d3ffcf9b659a1cb2c4c5605dde0dbc97a8e02dfc69558cad94b", // Transaction hash of the payment
  "referralCode": "OPTIONAL-CODE" // Optional referral code
}
```

## Environment Variables

This project uses environment variables for sensitive information. Create a `.env` file in the root of your project with the following variables:

```bash
# WalletConnect Project ID (get one at https://cloud.walletconnect.com/)
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Alchemy API Key (get one at https://www.alchemy.com/)
VITE_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY

# Lyno AI Contract Address
VITE_LYNOAI_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS

# Recipient wallet address for payments
VITE_WALLET_ADDRESS=YOUR_WALLET_ADDRESS

# Token price and phase information
VITE_CURRENT_PHASE=1
VITE_CURRENT_PRICE=0.01

# Backend API URL (used for production)
VITE_BACKEND_API_URL=https://api.lynoai.com

# Environment
VITE_NODE_ENV=development
```

You can copy the `.env.example` file and rename it to `.env`, then fill in your actual values.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

   - Copy `.env.example` to `.env`
   - Add your WalletConnect Project ID (get one for free at [WalletConnect Cloud](https://cloud.walletconnect.com/))
   - Add your Alchemy API Key (get one at [Alchemy](https://www.alchemy.com/))
   - Add your contract address and wallet address

3. Start the development server:

```bash
npm run dev
```

## Usage

The main component is `TokenWidget` which provides the complete token purchase experience:

```tsx
import TokenWidget from "./components/TokenWidget";

function App() {
  return (
    <div>
      <TokenWidget />
    </div>
  );
}
```

## Resources

- [RainbowKit Documentation](https://rainbowkit.com/docs/introduction)
- [wagmi Documentation](https://wagmi.sh)
- [viem Documentation](https://viem.sh)
