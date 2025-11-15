import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { NETWORK_CONFIG } from '../config/contract';

const WalletConnect = () => {
  const { account, isConnected, connectWallet, disconnect, chainId, switchNetwork } = useWallet();

  const handleConnect = async () => {
    try {
      await connectWallet();
      // Check if on correct network
      if (chainId !== NETWORK_CONFIG.chainId) {
        await switchNetwork(NETWORK_CONFIG);
      }
    } catch (error) {
      alert(error.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          {chainId !== NETWORK_CONFIG.chainId && (
            <button
              onClick={() => switchNetwork(NETWORK_CONFIG)}
              className="px-5 py-2.5 bg-transparent border-2 border-blue-500 text-blue-400 rounded-xl transition-all duration-300 text-sm font-semibold hover:bg-blue-500 hover:text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
            >
              Switch Network
            </button>
          )}
          <div className="px-5 py-2.5 bg-gray-900/50 border border-gray-800 text-blue-400 rounded-xl text-sm font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            {formatAddress(account)}
          </div>
          <button
            onClick={handleDisconnect}
            className="px-5 py-2.5 bg-transparent border-2 border-blue-500 text-blue-400 rounded-xl transition-all duration-300 text-sm font-semibold hover:bg-blue-500 hover:text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          className="px-8 py-3 bg-transparent border-2 border-blue-500 text-blue-400 rounded-xl transition-all duration-300 font-semibold hover:bg-blue-500 hover:text-black hover:shadow-[0_0_25px_rgba(59,130,246,0.8)] shadow-[0_0_15px_rgba(59,130,246,0.4)] text-base"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;


