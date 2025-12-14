import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Alert, AlertStatus, RiskLevel } from '../types';
import { AlertCircle, CheckCircle, Clock, FileWarning } from 'lucide-react';

interface DashboardProps {
  alerts: Alert[];
}

const Dashboard: React.FC<DashboardProps> = ({ alerts }) => {
  // Calculate Stats
  const totalAlerts = alerts.length;
  const openAlerts = alerts.filter(a => a.status === AlertStatus.NEW || a.status === AlertStatus.IN_PROGRESS).length;
  const escalated = alerts.filter(a => a.status === AlertStatus.ESCALATED_SAR).length;
  const closed = alerts.filter(a => a.status === AlertStatus.CLOSED || a.status === AlertStatus.FALSE_POSITIVE).length;

  const dataBySeverity = [
    { name: 'Low', value: alerts.filter(a => a.severity === RiskLevel.LOW).length },
    { name: 'Medium', value: alerts.filter(a => a.severity === RiskLevel.MEDIUM).length },
    { name: 'High', value: alerts.filter(a => a.severity === RiskLevel.HIGH).length },
    { name: 'Critical', value: alerts.filter(a => a.severity === RiskLevel.CRITICAL).length },
  ];

  const dataByRule = alerts.reduce((acc: any[], alert) => {
    const existing = acc.find(item => item.name === alert.ruleName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: alert.ruleName, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#94a3b8', '#fbbf24', '#f87171', '#991b1b'];
  const BAR_COLORS = '#0d9488';

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 overflow-y-auto h-full">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Analyst Overview</h2>
        <p className="text-slate-500 mt-1">Real-time insight into transaction risks and alert queues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Alerts" value={totalAlerts} icon={AlertCircle} color="text-blue-600 bg-blue-600" />
        <StatCard title="Open Investigations" value={openAlerts} icon={Clock} color="text-amber-500 bg-amber-500" />
        <StatCard title="SARs Filed" value={escalated} icon={FileWarning} color="text-red-600 bg-red-600" />
        <StatCard title="Closed Cases" value={closed} icon={CheckCircle} color="text-emerald-500 bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Alerts by Severity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataBySeverity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Triggered Rules</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByRule} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={120} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill={BAR_COLORS} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;