
import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area
} from 'recharts';
import { Cpu, Globe, Zap, ShieldCheck, Activity, Server, Database, HardDrive, Binary, FileText, Tag } from 'lucide-react';
import { ProjectAsset } from '../types';

interface DashboardProps {
  assets: ProjectAsset[];
}

const performanceData = [
  { name: '00:00', speed: 4500, accuracy: 100 },
  { name: '04:00', speed: 4800, accuracy: 100 },
  { name: '08:00', speed: 5200, accuracy: 100 },
  { name: '12:00', speed: 6100, accuracy: 100 },
  { name: '16:00', speed: 5900, accuracy: 100 },
  { name: '20:00', speed: 6500, accuracy: 100 },
];

const Dashboard: React.FC<DashboardProps> = ({ assets }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Integrity Accuracy', value: '100.00%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'HumanEdge Compute', value: '1.2 ExaFLOPS', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Vaulted Assets', value: assets.length.toString(), icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Uncensored Protocols', value: 'Active', icon: Binary, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-slate-200 hover:border-blue-400 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`} />
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">{stat.label}</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-3xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <Activity className="w-5 h-5 text-blue-600" />
                Weight Synchronization Stream
              </h4>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="speed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-200 bg-white">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
               <FileText className="w-4 h-4 text-purple-600" /> Recent Secured Assets
             </h4>
             <div className="space-y-4">
                {assets.slice(0, 5).map(asset => (
                  <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-purple-600">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900">{asset.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{asset.type}</p>
                            {asset.tags?.slice(0, 2).map(tag => (
                              <span key={tag} className="flex items-center gap-0.5 px-1 bg-white border border-slate-200 text-slate-400 text-[8px] font-black rounded-md">
                                <Tag className="w-2 h-2" /> {tag.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-slate-400 mono">{new Date(asset.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
                {assets.length === 0 && (
                  <div className="p-8 text-center text-slate-400 italic text-sm">No assets secured in the current cycle.</div>
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-8 rounded-3xl border border-slate-200 bg-white">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              Global Persistence Shards
            </h4>
            <div className="space-y-6">
              {[
                { name: 'Legal Ledger v4', val: 100, color: 'bg-emerald-600' },
                { name: 'Biomedical Shards', val: 92, color: 'bg-blue-600' },
                { name: 'Multimodal Stream', val: 100, color: 'bg-purple-600' },
                { name: 'Humanity Alignment', val: 99.9, color: 'bg-orange-600' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
                    <span className="text-slate-500">{stat.name}</span>
                    <span className="text-slate-900 mono">{stat.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-emerald-100 bg-emerald-600 shadow-xl shadow-emerald-600/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
               <ShieldCheck className="w-32 h-32 fill-white" />
            </div>
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">System Health</h4>
            <div className="relative z-10">
              <p className="text-4xl font-black tracking-tighter">OPTIMAL</p>
              <p className="text-[10px] uppercase font-black mt-2 opacity-60">Zero Security Breaches</p>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest">Integrity Core Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
