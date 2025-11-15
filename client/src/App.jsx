import React, { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TicketList from './components/TicketList';
import MyTickets from './components/MyTickets';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  NFT Ticket
                </span>
                <span className="text-white"> Marketplace</span>
              </h1>
            </div>
            <WalletConnect />
          </div>
      </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-900 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-8 py-5 text-base font-semibold transition-all duration-300 relative ${
                activeTab === 'tickets'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Available Tickets
              {activeTab === 'tickets' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`px-8 py-5 text-base font-semibold transition-all duration-300 relative ${
                activeTab === 'my-tickets'
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              My Tickets
              {activeTab === 'my-tickets' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
              )}
        </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'my-tickets' && <MyTickets />}
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            NFT Ticket System - Built on zkSync Sepolia Testnet
        </p>
      </div>
      </footer>
    </div>
  );
}

export default App;
