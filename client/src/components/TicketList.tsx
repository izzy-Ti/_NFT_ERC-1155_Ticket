import { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../config/contract';

interface Ticket {
  id: number;
  owner: string;
  amount: string;
  totalMinted: string;
  unitPrice: string;
  tokenURI: string;
  maxSupply: string;
}

const TicketList = () => {
  const { provider, signer, isConnected } = useWallet();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buying, setBuying] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (provider) {
      loadTickets();
    } else {
      setLoading(false);
    }
  }, [provider]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const noOfTickets = await contract.NoOfTickets();
      
      const ticketsData: Ticket[] = [];
      for (let i = 0; i < Number(noOfTickets); i++) {
        try {
          const ticketData = await contract.tickets(i);
          const tokenURI = await contract.tokenURIs(i);
          const maxSupply = await contract.maxSupply(i);
          
          ticketsData.push({
            id: i,
            owner: ticketData.owner,
            amount: ticketData.amount.toString(),
            totalMinted: ticketData.totalMinted.toString(),
            unitPrice: ethers.formatEther(ticketData.UnitPrice.toString()),
            tokenURI: tokenURI,
            maxSupply: maxSupply.toString()
          });
        } catch (error) {
          console.error(`Error loading ticket ${i}:`, error);
        }
      }
      
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTicket = async (ticketId: number, amount: number, unitPrice: string) => {
    if (!isConnected || !signer) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setBuying(prev => ({ ...prev, [ticketId]: true }));
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const totalPrice = ethers.parseEther((parseFloat(unitPrice) * amount).toString());
      
      const tx = await contract.buyTicket(ticketId, amount, { value: totalPrice });
      await tx.wait();
      
      alert('Ticket purchased successfully!');
      await loadTickets();
    } catch (error: any) {
      console.error('Error buying ticket:', error);
      const errorMessage = error.reason || error.message || 'Failed to buy ticket. Please check your balance and try again.';
      alert(errorMessage);
    } finally {
      setBuying(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-800 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin absolute top-0 left-0 neon-glow-blue"></div>
        </div>
        <p className="mt-8 text-gray-400 body-text-large">Loading available tickets...</p>
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
          onClick={loadTickets}
          className="px-6 py-3 glass-effect border-2 border-neon-blue text-neon-blue-light rounded-xl transition-all duration-300 label-text hover:bg-neon-blue hover:text-black hover:neon-glow-blue-strong neon-glow-blue"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900/50 border border-gray-800 mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No Tickets Available</h3>
        <p className="text-gray-400 text-lg">Check back later for new ticket releases</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="heading-large text-white">Available Tickets</h2>
        <p className="body-text-large text-gray-400">Browse and purchase NFT tickets for events</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="group glass-effect border-2 border-dark-border rounded-2xl overflow-hidden hover:border-neon-blue transition-all duration-500 hover:neon-glow-blue-strong transform hover:-translate-y-1"
          >
            {ticket.tokenURI && (
              <div className="relative h-64 bg-gray-900 overflow-hidden">
                <img
                  src={ticket.tokenURI}
                  alt={`Ticket ${ticket.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-4 right-4 px-3 py-1 glass-effect border border-neon-blue/50 rounded-full">
                  <span className="text-neon-blue-light label-text">ID #{ticket.id}</span>
                </div>
              </div>
            )}
            
            <div className="p-6 space-y-5">
              <div>
                <h3 className="heading-medium text-white mb-1">Ticket #{ticket.id}</h3>
                <div className="h-px bg-gradient-to-r from-neon-blue to-transparent w-16 mt-2"></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 label-text">Available</span>
                  <span className="text-white body-text font-semibold">{ticket.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 label-text">Price</span>
                  <span className="text-neon-blue-light heading-small drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]">
                    {parseFloat(ticket.unitPrice).toFixed(4)} ETH
                  </span>
                </div>
                {ticket.maxSupply !== "0" && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 label-text">Max Supply</span>
                    <span className="text-white body-text font-semibold">{ticket.maxSupply}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-dark-border">
                <BuyTicketForm
                  ticketId={ticket.id}
                  available={parseInt(ticket.amount)}
                  unitPrice={ticket.unitPrice}
                  onBuy={handleBuyTicket}
                  buying={buying[ticket.id]}
                  disabled={!isConnected || parseInt(ticket.amount) === 0}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface BuyTicketFormProps {
  ticketId: number;
  available: number;
  unitPrice: string;
  onBuy: (ticketId: number, amount: number, unitPrice: string) => void;
  buying?: boolean;
  disabled?: boolean;
}

const BuyTicketForm = ({ ticketId, available, unitPrice, onBuy, buying, disabled }: BuyTicketFormProps) => {
  const [amount, setAmount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > 0 && amount <= available) {
      onBuy(ticketId, amount, unitPrice);
    }
  };

  const totalPrice = parseFloat(unitPrice) * amount;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block label-text text-gray-400 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            max={available}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Math.min(available, parseInt(e.target.value) || 1)))}
            className="w-full px-4 py-3 glass-effect border-2 border-dark-border rounded-xl text-white body-text font-semibold focus:border-neon-blue focus:outline-none focus:neon-glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled || buying}
          />
        </div>
        <div className="pt-6">
          <button
            type="submit"
            disabled={disabled || buying || amount > available || amount < 1}
            className="px-8 py-3 glass-effect border-2 border-neon-blue text-neon-blue-light rounded-xl transition-all duration-300 label-text hover:bg-neon-blue hover:text-black hover:neon-glow-blue-strong disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none neon-glow-blue whitespace-nowrap"
          >
            {buying ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
      
      {amount > 0 && totalPrice > 0 && (
        <div className="pt-3 border-t border-dark-border">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 label-text">Total Price</span>
            <span className="text-neon-blue-light heading-small drop-shadow-[0_0_15px_rgba(96,165,250,0.7)]">
              {totalPrice.toFixed(6)} ETH
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

export default TicketList;