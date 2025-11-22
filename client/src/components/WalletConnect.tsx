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
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <>
          {chainId !== NETWORK_CONFIG.chainId && (
            <button
              onClick={() => switchNetwork(NETWORK_CONFIG)}
              className="px-6 py-3 glass-effect border-2 border-neon-blue/80 text-neon-blue-light rounded-2xl transition-all duration-300 label-text hover:border-neon-blue hover:bg-neon-blue/10 hover:neon-glow-blue-strong neon-glow-blue"
            >
              Switch Network
            </button>
          )}
          <div className="flex items-center gap-3 px-5 py-3 glass-effect border-2 border-neon-blue/50 rounded-2xl neon-glow-blue">
            <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse neon-glow-blue"></div>
            <span className="text-neon-blue-light label-text tracking-wide">{formatAddress(account)}</span>
          </div>
          <button
            onClick={handleDisconnect}
            className="px-6 py-3 glass-effect border-2 border-neon-blue/80 text-neon-blue-light rounded-2xl transition-all duration-300 label-text hover:border-neon-blue hover:bg-neon-blue/10 hover:neon-glow-blue-strong neon-glow-blue"
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={handleConnect}
          className="px-8 py-3.5 glass-effect border-2 border-neon-blue text-neon-blue-light rounded-2xl transition-all duration-300 label-text hover:border-neon-blue-light hover:bg-neon-blue/10 hover:neon-glow-blue-strong neon-glow-blue tracking-wide"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;