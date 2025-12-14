import React, { useState } from 'react';
import { Search, Loader2, AlertOctagon, CheckCircle } from 'lucide-react';
import { screenNameAgainstAI } from '../services/geminiService';

const SanctionsScreening: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleScreening = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    // Mock delay for realism before hitting AI
    setTimeout(async () => {
      try {
        const jsonStr = await screenNameAgainstAI(query);
        const data = JSON.parse(jsonStr);
        setResult(data);
      } catch (err) {
        setResult({ isMatch: false, details: 'Error connecting to screening service.' });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Sanctions Screening</h2>
        <p className="text-slate-500">Real-time screening against OFAC, UN, EU, and UK consolidated lists.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <form onSubmit={handleScreening} className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Individual or Entity Name..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !query}
            className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Screen'}
          </button>
        </form>

        {result && (
          <div className={`p-6 rounded-xl border-l-4 ${
            result.isMatch ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${
                result.isMatch ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {result.isMatch ? <AlertOctagon size={32} /> : <CheckCircle size={32} />}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                   result.isMatch ? 'text-red-800' : 'text-green-800'
                }`}>
                  {result.isMatch ? 'Potential Match Found' : 'No Matches Found'}
                </h3>
                <p className="text-slate-600 mt-2 mb-4 leading-relaxed">
                  {result.details}
                </p>
                
                {result.isMatch && (
                  <div className="flex gap-4 text-sm font-mono text-slate-500">
                     <span className="bg-white px-2 py-1 rounded border border-slate-200">
                       Source: {result.source}
                     </span>
                     <span className="bg-white px-2 py-1 rounded border border-slate-200">
                       Confidence: {result.confidence}%
                     </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-slate-400">
        <p>This system uses AI to simulate watchlist hits. Actual OFAC screening requires official database access.</p>
      </div>
    </div>
  );
};

export default SanctionsScreening;