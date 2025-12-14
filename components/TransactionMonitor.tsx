import React, { useState } from 'react';
import { Transaction, TransactionType, RiskLevel } from '../types';
import { Search, Filter, AlertTriangle, Calendar, RefreshCcw } from 'lucide-react';

interface TransactionMonitorProps {
  transactions: Transaction[];
}

const TransactionMonitor: React.FC<TransactionMonitorProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.merchantOrCounterparty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.amount.toString().includes(searchTerm);
    const matchesType = filterType === 'All' || t.type === filterType;

    let matchesDate = true;
    if (startDate && t.date < startDate) matchesDate = false;
    if (endDate && t.date > (endDate + ' 23:59')) matchesDate = false;

    return matchesSearch && matchesType && matchesDate;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Transaction Monitoring</h2>
        <p className="text-slate-500 mt-1">Live feed of processed transactions with automated anomaly detection.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col xl:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full xl:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search ID, Entity, Amount..." 
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Date Filters */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
              <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <input 
                type="date" 
                className="text-sm text-slate-600 outline-none bg-transparent w-full md:w-32 border-none p-0 focus:ring-0 font-medium"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-300 mx-1">|</span>
              <input 
                type="date" 
                className="text-sm text-slate-600 outline-none bg-transparent w-full md:w-32 border-none p-0 focus:ring-0 font-medium"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <select 
                className="w-full md:w-auto pl-9 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none appearance-none cursor-pointer shadow-sm font-medium text-slate-700"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                {Object.values(TransactionType).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

             <button 
                onClick={resetFilters}
                className="px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                title="Reset Filters"
             >
               <RefreshCcw size={18} />
             </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto flex-1 w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Date</th>
                <th className="px-6 py-4 border-b border-slate-200">Transaction ID</th>
                <th className="px-6 py-4 border-b border-slate-200">Type</th>
                <th className="px-6 py-4 border-b border-slate-200">Counterparty</th>
                <th className="px-6 py-4 border-b border-slate-200">Country</th>
                <th className="px-6 py-4 border-b border-slate-200 text-right">Amount</th>
                <th className="px-6 py-4 border-b border-slate-200 text-center">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-slate-500">{t.date}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400 group-hover:text-slate-600">{t.id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      t.type === TransactionType.WIRE_TRANSFER ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      t.type === TransactionType.CASH_DEPOSIT ? 'bg-green-50 text-green-700 border-green-200' :
                      t.type === TransactionType.CRYPTO_EXCHANGE ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{t.merchantOrCounterparty}</td>
                  <td className="px-6 py-4 text-slate-600">{t.counterpartyCountry}</td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                    {t.amount.toLocaleString('en-US', { style: 'currency', currency: t.currency })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {t.flagged ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" /> Flagged
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="font-medium">No transactions found</p>
              <p className="text-sm opacity-70">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitor;