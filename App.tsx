import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionMonitor from './components/TransactionMonitor';
import AlertInvestigation from './components/AlertInvestigation';
import KYCProfile from './components/KYCProfile';
import SanctionsScreening from './components/SanctionsScreening';
import { Customer, Transaction, Alert, RiskLevel, TransactionType, AlertStatus } from './types';
import { Menu } from 'lucide-react';

// --- MOCK DATA INITIALIZATION ---
const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUST-001', name: 'Global Import/Export Ltd', type: 'Entity', riskLevel: RiskLevel.HIGH, occupation: 'Logistics', country: 'Panama', pepStatus: false, kycVerified: true, lastReviewDate: '2023-11-15', beneficialOwners: ['Carlos M.', 'Jean P.'] },
  { id: 'CUST-002', name: 'John Smith', type: 'Individual', riskLevel: RiskLevel.LOW, occupation: 'Software Engineer', country: 'USA', pepStatus: false, kycVerified: true, lastReviewDate: '2024-01-10' },
  { id: 'CUST-003', name: 'Elena V.', type: 'Individual', riskLevel: RiskLevel.MEDIUM, occupation: 'Consultant', country: 'Cyprus', pepStatus: true, kycVerified: true, lastReviewDate: '2023-12-05' },
  { id: 'CUST-004', name: 'Rapid Cash Services', type: 'Entity', riskLevel: RiskLevel.CRITICAL, occupation: 'Money Service Business', country: 'Mexico', pepStatus: false, kycVerified: false, lastReviewDate: '2024-02-20' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  // Structuring Pattern for CUST-001
  { id: 'TXN-8821', customerId: 'CUST-001', date: '2024-05-10 09:15', amount: 9500, currency: 'USD', type: TransactionType.WIRE_TRANSFER, counterpartyCountry: 'Cayman Islands', merchantOrCounterparty: 'Offshore Holdings', flagged: true },
  { id: 'TXN-8822', customerId: 'CUST-001', date: '2024-05-10 14:30', amount: 9800, currency: 'USD', type: TransactionType.WIRE_TRANSFER, counterpartyCountry: 'Cayman Islands', merchantOrCounterparty: 'Offshore Holdings', flagged: true },
  { id: 'TXN-8823', customerId: 'CUST-001', date: '2024-05-11 10:00', amount: 9200, currency: 'USD', type: TransactionType.WIRE_TRANSFER, counterpartyCountry: 'Cayman Islands', merchantOrCounterparty: 'Offshore Holdings', flagged: true },
  // Normal
  { id: 'TXN-1004', customerId: 'CUST-002', date: '2024-05-12 11:20', amount: 45.00, currency: 'USD', type: TransactionType.ACH, counterpartyCountry: 'USA', merchantOrCounterparty: 'Amazon', flagged: false },
  // High Velocity for CUST-004
  { id: 'TXN-9001', customerId: 'CUST-004', date: '2024-05-12 01:00', amount: 50000, currency: 'USD', type: TransactionType.CRYPTO_EXCHANGE, counterpartyCountry: 'Unknown', merchantOrCounterparty: 'CryptoBin', flagged: true },
  { id: 'TXN-9002', customerId: 'CUST-004', date: '2024-05-12 01:05', amount: 50000, currency: 'USD', type: TransactionType.CRYPTO_EXCHANGE, counterpartyCountry: 'Unknown', merchantOrCounterparty: 'CryptoBin', flagged: true },
];

const MOCK_ALERTS: Alert[] = [
  {
    id: 'ALT-2024-001',
    customerId: 'CUST-001',
    customerName: 'Global Import/Export Ltd',
    triggerDate: '2024-05-11',
    ruleName: 'Potential Structuring (Below 10k Threshold)',
    severity: RiskLevel.HIGH,
    status: AlertStatus.IN_PROGRESS,
    analystNotes: ['Initial review started. Pattern looks consistent with smurfing.'],
    relatedTransactionIds: ['TXN-8821', 'TXN-8822', 'TXN-8823']
  },
  {
    id: 'ALT-2024-002',
    customerId: 'CUST-004',
    customerName: 'Rapid Cash Services',
    triggerDate: '2024-05-12',
    ruleName: 'High Velocity / Crypto Burst',
    severity: RiskLevel.CRITICAL,
    status: AlertStatus.NEW,
    analystNotes: [],
    relatedTransactionIds: ['TXN-9001', 'TXN-9002']
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleUpdateAlert = (updatedAlert: Alert) => {
    setAlerts(prev => prev.map(a => a.id === updatedAlert.id ? updatedAlert : a));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard alerts={alerts} />;
      case 'monitoring':
        return <TransactionMonitor transactions={transactions} />;
      case 'alerts':
        return (
          <AlertInvestigation 
            alerts={alerts} 
            customers={customers} 
            transactions={transactions} 
            onUpdateAlert={handleUpdateAlert}
          />
        );
      case 'kyc':
        return <KYCProfile customers={customers} />;
      case 'sanctions':
        return <SanctionsScreening />;
      default:
        return <Dashboard alerts={alerts} />;
    }
  };

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col md:ml-64 h-screen transition-all duration-300">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-slate-800 tracking-tight">RiskLens</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
            JD
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;