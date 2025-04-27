"use client";

import { FC, createContext, useContext, useEffect, useState } from "react";
import { useChainId } from "wagmi";
import { getSupportedChainId, isChainSupported } from "../utils/network-config";

// Define types
export interface NetworkConfigContextType {
  activeChainId: number;
  isChainSupported: boolean;
}

export interface NetworkConfigProviderProps {
  children: React.ReactNode;
}

// Create context with default values
const NetworkConfigContext = createContext<NetworkConfigContextType>({
  activeChainId: 0,
  isChainSupported: false,
});

/**
 * Provider component for network configuration state
 */
export const NetworkConfigProvider: FC<NetworkConfigProviderProps> = ({ children }) => {
  const connectedChainId = useChainId();
  const [activeChainId, setActiveChainId] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  // Update active chain when connected chain changes
  useEffect(() => {
    const supportedChainId = getSupportedChainId(connectedChainId);
    setActiveChainId(supportedChainId);
    setIsSupported(isChainSupported(connectedChainId));
  }, [connectedChainId]);

  return (
    <NetworkConfigContext.Provider
      value={{
        activeChainId,
        isChainSupported: isSupported,
      }}
    >
      {children}
    </NetworkConfigContext.Provider>
  );
};

/**
 * Hook to access network configuration state
 */
export const useNetworkConfig = (): NetworkConfigContextType => {
  return useContext(NetworkConfigContext);
}; 