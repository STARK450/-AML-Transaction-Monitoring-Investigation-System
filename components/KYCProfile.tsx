import React from 'react';
import { Customer, RiskLevel } from '../types';
import { Shield, MapPin, Briefcase, Calendar, CheckCircle } from 'lucide-react';

interface KYCProfileProps {
  customers: Customer[];
}

const KYCProfile: React.FC<KYCProfileProps> = ({ customers }) => {
  return (
    <div className="p-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">KYC / CDD Profiles</h2>
        <p className="text-slate-500">Customer Due Diligence and Enhanced Due Diligence (EDD) records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-2 w-full ${
              customer.riskLevel === RiskLevel.CRITICAL ? 'bg-red-500' :
              customer.riskLevel === RiskLevel.HIGH ? 'bg-orange-500' :
              customer.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-400' : 'bg-green-500'
            }`} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{customer.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">{customer.id}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  customer.riskLevel === RiskLevel.HIGH || customer.riskLevel === RiskLevel.CRITICAL
                   ? 'bg-red-50 text-red-700 border border-red-100'
                   : 'bg-green-50 text-green-700 border border-green-100'
                }`}>
                  {customer.riskLevel}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Briefcase size={16} className="text-slate-400" />
                  <span>{customer.occupation}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{customer.country}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Shield size={16} className="text-slate-400" />
                  <span>PEP Status: {customer.pepStatus ? 'YES' : 'No'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Last Review: {customer.lastReviewDate}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">KYC Status</span>
                {customer.kycVerified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-teal-600">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-orange-500">Pending</span>
                )}
              </div>
            </div>
            {customer.beneficialOwners && (
               <div className="bg-slate-50 px-6 py-3 text-xs text-slate-500 border-t border-slate-100">
                 <strong>UBOs:</strong> {customer.beneficialOwners.join(', ')}
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCProfile;