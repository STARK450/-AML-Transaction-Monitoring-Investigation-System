import React from 'react';
import { LayoutDashboard, Activity, Users, ShieldAlert, FileText, Search, X } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Transaction Monitoring', icon: Activity },
    { id: 'alerts', label: 'Alert Investigations', icon: ShieldAlert },
    { id: 'kyc', label: 'KYC / Customer Profiles', icon: Users },
    { id: 'sanctions', label: 'Sanctions Screening', icon: Search },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    onClose(); // Close sidebar on mobile when item clicked
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-slate-300 shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:shadow-none
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20">R</div>
            <h1 className="text-xl font-bold text-white tracking-tight">RiskLens</h1>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-900/20' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 ring-2 ring-slate-800">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Jane Doe</p>
              <p className="text-xs text-slate-400">Senior Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;