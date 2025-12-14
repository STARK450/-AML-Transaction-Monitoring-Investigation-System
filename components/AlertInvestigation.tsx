import React, { useState } from 'react';
import { Alert, Customer, Transaction, AlertStatus, RiskLevel } from '../types';
import { AlertCircle, CheckCircle, FileText, Send, User, ChevronRight, XCircle, Bot, ArrowLeft } from 'lucide-react';
import { generateInvestigationReport } from '../services/geminiService';

interface AlertInvestigationProps {
  alerts: Alert[];
  customers: Customer[];
  transactions: Transaction[];
  onUpdateAlert: (updatedAlert: Alert) => void;
}

const AlertInvestigation: React.FC<AlertInvestigationProps> = ({ alerts, customers, transactions, onUpdateAlert }) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);
  const selectedCustomer = selectedAlert ? customers.find(c => c.id === selectedAlert.customerId) : null;
  
  // Get related transactions for the selected alert
  const relatedTransactions = selectedAlert 
    ? transactions.filter(t => selectedAlert.relatedTransactionIds.includes(t.id))
    : [];

  const handleAddNote = () => {
    if (!selectedAlert || !noteInput.trim()) return;
    const updated = {
      ...selectedAlert,
      analystNotes: [...selectedAlert.analystNotes, `[${new Date().toLocaleTimeString()}] ${noteInput}`]
    };
    onUpdateAlert(updated);
    setNoteInput('');
  };

  const handleStatusChange = (status: AlertStatus) => {
    if (!selectedAlert) return;
    onUpdateAlert({ ...selectedAlert, status });
  };

  const handleGenerateAIReport = async () => {
    if (!selectedAlert || !selectedCustomer) return;
    setIsGeneratingReport(true);
    const report = await generateInvestigationReport(selectedAlert, selectedCustomer, relatedTransactions);
    const updated = {
      ...selectedAlert,
      analystNotes: [...selectedAlert.analystNotes, `--- AI GENERATED REPORT ---\n${report}`]
    };
    onUpdateAlert(updated);
    setIsGeneratingReport(false);
  };

  return (
    <div className="flex h-full overflow-hidden animate-in fade-in duration-500">
      {/* Left List Panel - Hidden on mobile if alert selected */}
      <div className={`
        w-full md:w-1/3 bg-white border-r border-slate-200 flex-col
        ${selectedAlertId ? 'hidden md:flex' : 'flex'}
      `}>
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Alert Queue</h2>
          <p className="text-sm text-slate-500">Prioritized for review</p>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              onClick={() => setSelectedAlertId(alert.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                selectedAlertId === alert.id 
                  ? 'bg-teal-50 border-teal-200 shadow-sm ring-1 ring-teal-500/20' 
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  alert.severity === RiskLevel.CRITICAL ? 'bg-red-100 text-red-700' :
                  alert.severity === RiskLevel.HIGH ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">{alert.triggerDate}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">{alert.ruleName}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <User size={12}/> {alert.customerName}
              </p>
              <div className="flex justify-between items-center mt-3">
                 <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{alert.status}</p>
                 <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Panel - Full width on mobile when active */}
      <div className={`
        w-full md:w-2/3 bg-slate-50 flex-col h-full overflow-hidden
        ${selectedAlertId ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedAlert && selectedCustomer ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-start shadow-sm z-10 gap-4">
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => setSelectedAlertId(null)}
                  className="md:hidden mt-1 p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">{selectedAlert.ruleName}</h2>
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-mono border border-slate-200">
                      {selectedAlert.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1"><User size={14}/> {selectedCustomer.name}</span>
                    <span className="flex items-center gap-1">
                      <AlertCircle size={14} className={
                        selectedCustomer.riskLevel === RiskLevel.HIGH || selectedCustomer.riskLevel === RiskLevel.CRITICAL 
                        ? 'text-red-500' : 'text-slate-400'
                      }/> 
                      Risk: {selectedCustomer.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                   onClick={() => handleStatusChange(AlertStatus.FALSE_POSITIVE)}
                   className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={16}/> <span className="hidden sm:inline">False Positive</span>
                </button>
                <button 
                   onClick={() => handleStatusChange(AlertStatus.ESCALATED_SAR)}
                   className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-200"
                >
                  <FileText size={16}/> File SAR
                </button>
              </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              
              {/* Transactions Table */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="font-semibold text-slate-700">Triggering Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">Date</th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">Type</th>
                        <th className="px-6 py-3 font-medium whitespace-nowrap">Counterparty</th>
                        <th className="px-6 py-3 font-medium text-right whitespace-nowrap">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {relatedTransactions.map(t => (
                        <tr key={t.id}>
                          <td className="px-6 py-3 whitespace-nowrap text-slate-600">{t.date}</td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap text-slate-700 font-medium">{t.merchantOrCounterparty}</td>
                          <td className="px-6 py-3 text-right font-mono font-medium text-slate-800">${t.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analyst Notes & AI Report */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="font-semibold text-slate-700">Investigation Log</h3>
                  <button 
                    onClick={handleGenerateAIReport}
                    disabled={isGeneratingReport}
                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Bot size={14} className={isGeneratingReport ? 'animate-pulse' : ''} />
                    {isGeneratingReport ? 'Analyzing...' : 'Auto-Draft Report'}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                  {selectedAlert.analystNotes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                       <FileText size={32} className="opacity-20" />
                       <p className="text-sm">No notes added yet. Start the investigation.</p>
                    </div>
                  )}
                  {selectedAlert.analystNotes.map((note, idx) => {
                    const isSystem = note.includes('--- AI GENERATED REPORT ---');
                    return (
                      <div key={idx} className={`p-4 rounded-xl border shadow-sm text-sm whitespace-pre-wrap ${
                        isSystem 
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-900' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}>
                        {isSystem && <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-wider"><Bot size={12}/> AI Analysis</div>}
                        {note.replace('--- AI GENERATED REPORT ---', '').trim()}
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Type your findings here..."
                      className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button 
                      onClick={handleAddNote}
                      className="bg-teal-600 text-white px-4 rounded-lg hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all active:scale-95"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6 border border-slate-100">
              <FileText size={48} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Select an Alert</h3>
            <p className="max-w-xs mx-auto">Choose an item from the queue to view transaction details and begin your investigation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertInvestigation;