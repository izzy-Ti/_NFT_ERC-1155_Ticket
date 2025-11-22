import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import TicketList from './components/TicketList';
import MyTickets from './components/MyTickets';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue opacity-10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-blue-light opacity-5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue-dark opacity-5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <h1 className="heading-large">
                <span className="bg-gradient-to-r from-neon-blue-light via-neon-blue to-neon-blue-dark bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                  NFT Ticket
                </span>
                <span className="text-white"> Marketplace</span>
              </h1>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative border-b border-dark-border bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <span className="label-text px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-neon-blue-light">
                Powered by zkSync Sepolia
              </span>
            </div>
            <h2 className="heading-display text-5xl md:text-6xl lg:text-7xl">
              Secure Your Spot with
              <br />
              <span className="bg-gradient-to-r from-neon-blue-light to-neon-blue bg-clip-text text-transparent">
                NFT Tickets
              </span>
            </h2>
            <p className="body-text-large text-gray-400 max-w-2xl mx-auto">
              Experience the future of event ticketing. Buy, own, and trade authentic NFT tickets on the blockchain.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-b border-dark-border glass-effect">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-8 py-5 label-text transition-all duration-300 relative ${
                activeTab === 'tickets'
                  ? 'text-neon-blue-light'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Available Tickets
              {activeTab === 'tickets' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue-light to-neon-blue neon-glow-blue"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`px-8 py-5 label-text transition-all duration-300 relative ${
                activeTab === 'my-tickets'
                  ? 'text-neon-blue-light'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              My Tickets
              {activeTab === 'my-tickets' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue-light to-neon-blue neon-glow-blue"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {activeTab === 'tickets' && <TicketList />}
        {activeTab === 'my-tickets' && <MyTickets />}
      </main>

      {/* Footer */}
      <footer className="relative mt-24 border-t border-dark-border py-12 glass-effect">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="body-text text-gray-500">
              NFT Ticket System - Built on zkSync Sepolia Testnet
            </p>
            <div className="flex items-center justify-center space-x-6">
              <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors label-text">
                About
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors label-text">
                Documentation
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="text-gray-500 hover:text-neon-blue transition-colors label-text">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;