import { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  useEffect(() => {
    checkConnection();

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setChainId(network.chainId.toString());
        setIsConnected(true);

        return { provider, signer, account: accounts[0] };
      } catch (error) {
        console.error('Error connecting wallet:', error);
        throw error;
      }
    } else {
      throw new Error('Please install MetaMask');
    }
  };

  const switchNetwork = async (networkConfig: any) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networkConfig.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkConfig],
            });
          } catch (addError) {
            throw addError;
          }
        } else {
          throw switchError;
        }
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setChainId(null);
  };

  return {
    account,
    provider,
    signer,
    isConnected,
    chainId,
    connectWallet,
    disconnect,
    switchNetwork
  };
};