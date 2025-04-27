import '@rainbow-me/rainbowkit/styles.css';
import { ReactNode, useEffect } from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider as RainbowKitProviderOriginal,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  sepolia,
  Chain
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { http } from 'wagmi';
import { env, validateEnv } from '../env';
import { isProduction } from '../utils/network-config';

// Create a new query client
const queryClient = new QueryClient();

// Determine which chains to use based on environment
const getChains = (): [Chain, ...Chain[]] => {
  if (isProduction()) {
    return [mainnet];
  }
  // In development, use Sepolia
  return [sepolia];
};

// Configure wagmi and RainbowKit with environment-specific chains
const config = getDefaultConfig({
  appName: 'Lyno AI App',
  projectId: env.WALLET_CONNECT_PROJECT_ID,
  chains: getChains(),
  ssr: false,  
  transports: {
    [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`),
    [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.ALCHEMY_API_KEY}`),
  },
});

// RainbowKit Provider component
interface RainbowKitWrapperProps {
  children: ReactNode;
}

export const RainbowKitWrapper = ({ children }: RainbowKitWrapperProps) => {
  // Validate environment variables on component mount
  useEffect(() => {
    try {
      validateEnv();
    } catch (error) {
      console.error('Environment validation failed:', error);
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProviderOriginal>
          {children}
        </RainbowKitProviderOriginal>
      </QueryClientProvider>
    </WagmiProvider>
  );
}; 