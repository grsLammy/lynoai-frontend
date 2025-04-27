# Lyno AI Frontend with RainbowKit

This project uses RainbowKit to provide a seamless wallet connection experience for web3 applications.

## Wallet Integration

### RainbowKit and wagmi

- Multiple chain support (Ethereum, Polygon, Optimism, Arbitrum, Base)
- Beautiful UI for wallet connection
- Support for multiple wallet providers
- Support for dark/light mode

## Environment Variables

This project uses environment variables for sensitive information. Create a `.env` file in the root of your project with the following variables:

```bash
# WalletConnect Project ID (get one at https://cloud.walletconnect.com/)
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID

# Alchemy API Key (get one at https://www.alchemy.com/)
VITE_ALCHEMY_API_KEY=YOUR_ALCHEMY_API_KEY
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

3. Start the development server:

```bash
npm run dev
```

## Usage

Use the `ConnectWallet` component to enable wallet connections in your app:

```tsx
import { ConnectWallet } from "./components/ConnectWallet";

function YourComponent() {
  return (
    <div>
      <ConnectWallet />
      {/* Your other components */}
    </div>
  );
}
```

## Resources

- [RainbowKit Documentation](https://rainbowkit.com/docs/introduction)
- [wagmi Documentation](https://wagmi.sh)
- [viem Documentation](https://viem.sh)
