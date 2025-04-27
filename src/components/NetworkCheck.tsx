"use client";

import { FC, useEffect, useState } from "react";
import { useNetworkConfig } from "../providers/NetworkConfigProvider";
import { ETHEREUM_MAINNET_ID, ETHEREUM_SEPOLIA_ID, isProduction } from "../utils/network-config";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

interface NetworkCheckProps {
  children: React.ReactNode;
}

/**
 * Component that checks if the user is connected to the correct network based on the environment
 * In production, it ensures Ethereum Mainnet is used
 * In development/testing, it allows or Sepolia testnet
 */
export const NetworkCheck: FC<NetworkCheckProps> = ({ children }) => {
  const { isChainSupported } = useNetworkConfig();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showBanner, setShowBanner] = useState(false);

  // Check if we need to show the network warning banner
  useEffect(() => {
    if (isConnected && !isChainSupported) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isConnected, isChainSupported, chainId]);

  // Determine which network to suggest switching to
  const getTargetNetwork = (): string => {
    if (isProduction()) {
      return "Ethereum Mainnet";
    }
    return "Sepolia Testnet";
  };

  // Handler for switching to the correct network
  const handleSwitchNetwork = async () => {
    try {
      // In production use Ethereum Mainnet, otherwise use Sepolia for testnet
      const targetChainId = isProduction() ? ETHEREUM_MAINNET_ID : ETHEREUM_SEPOLIA_ID;
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  return (
    <>
      {showBanner && (
        <div className="bg-warning text-warning-content py-2 px-4 text-center fixed top-0 left-0 right-0 z-50">
          <p>
            You are connected to an unsupported network. Please switch to{" "}
            <button className="underline font-bold" onClick={handleSwitchNetwork}>
              {getTargetNetwork()}
            </button>
          </p>
        </div>
      )}
      <div className={showBanner ? "pt-12" : ""}>{children}</div>
    </>
  );
};

export default NetworkCheck; 