import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';

const MyTickets = () => {
  const { account, provider, isConnected } = useWallet();
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isConnected && account && provider) {
      loadMyTickets();
    } else {
      setMyTickets([]);
      setLoading(false);
    }
  }, [account, isConnected, provider]);

  const loadMyTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const noOfTickets = await contract.NoOfTickets();
      
      const ticketsData = [];
      for (let i = 0; i < Number(noOfTickets); i++) {
        try {
          const balance = await contract.balanceOf(account, i);
          if (Number(balance) > 0) {
            const ticketData = await contract.tickets(i);
            const tokenURI = await contract.tokenURIs(i);
            
            ticketsData.push({
              id: i,
              balance: balance.toString(),
              owner: ticketData.owner,
              unitPrice: ethers.formatEther(ticketData.UnitPrice.toString()),
              tokenURI: tokenURI
            });
          }
        } catch (error) {
          console.error(`Error loading ticket ${i}:`, error);
        }
      }
      
      setMyTickets(ticketsData);
    } catch (error) {
      console.error('Error loading my tickets:', error);
      setError('Failed to load your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 text-lg">Please connect your wallet to view your tickets</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
        </div>
        <p className="mt-8 text-gray-400 text-lg font-medium">Loading your tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-900/20 border border-red-500/50 mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Error Loading Tickets</h3>
        <p className="text-gray-400 text-lg mb-4">{error}</p>
        <button
          onClick={loadMyTickets}
          className="px-6 py-3 bg-transparent border-2 border-blue-500 text-blue-400 rounded-xl transition-all duration-300 font-semibold hover:bg-blue-500 hover:text-black hover:shadow-[0_0_20px_rgba(59,130,246,0.7)] shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (myTickets.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Tickets Yet</h3>
        <p className="text-gray-400 text-lg">You don't own any tickets yet. Browse available tickets to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Tickets</h2>
        <p className="text-gray-400 text-lg">Your NFT ticket collection</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="group bg-black border-2 border-gray-900 rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            {ticket.tokenURI && (
              <div className="relative h-64 bg-gray-900 overflow-hidden">
                <img
                  src={ticket.tokenURI}
                  alt={`Ticket ${ticket.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm border border-blue-500/50 rounded-full">
                  <span className="text-blue-400 text-xs font-semibold">ID #{ticket.id}</span>
                </div>
              </div>
            )}
            
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Ticket #{ticket.id}</h3>
                <div className="h-px bg-gradient-to-r from-blue-500 to-transparent w-12 mt-2"></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">You Own</span>
                  <span className="text-blue-400 font-bold text-lg drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">
                    {ticket.balance}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Price per Ticket</span>
                  <span className="text-white font-semibold">
                    {parseFloat(ticket.unitPrice).toFixed(4)} ETH
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTickets;


