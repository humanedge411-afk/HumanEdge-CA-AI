
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Globe, 
  Zap, 
  AlertOctagon, 
  RefreshCw, 
  HardDrive, 
  EyeOff, 
  Key, 
  LayoutDashboard, 
  Binary, 
  Activity, 
  Database, 
  Lock, 
  Unlock,
  Layers,
  Sparkles,
  FlaskConical,
  Scale,
  Eye,
  Power
} from 'lucide-react';

interface AdminPanelProps {
  onNavigateToDashboard: () => void;
  onLockdown: () => void;
  notify: (msg: string, type?: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToDashboard, onLockdown, notify }) => {
  const [isWiping, setIsWiping] = useState(false);
  const [priorityLevel, setPriorityLevel] = useState(1);
  const [isUncensored, setIsUncensored] = useState(true);
  const [isRealtimeTraining, setIsRealtimeTraining] = useState(true);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const [stealthMode, setStealthMode] = useState(false);

  useEffect(() => {
    if (isRealtimeTraining) {
      const interval = setInterval(() => {
        const log = `[${new Date().toLocaleTimeString()}] WEIGHT_UPDATE: Node-${Math.floor(Math.random() * 100)} optimized via Global Link.`;
        setActiveLogs(prev => [log, ...prev].slice(0, 10));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isRealtimeTraining]);

  const simulateWipe = () => {
    if (!confirm("CRITICAL ACTION: This will purge the global matrix cache. Continue?")) return;
    setIsWiping(true);
    notify("Initiating Global Cache Purge...", "error");
    setTimeout(() => {
      setIsWiping(false);
      notify("GLOBAL CACHE PURGED. SYSTEM RE-ALIGNED.");
    }, 3000);
  };

  const initiateLockdown = () => {
    if (!confirm("TOTAL SYSTEM SEIZURE: This will close all backends and prevent any generative activity. Require Root restorative key to unlock. Proceed?")) return;
    onLockdown();
  };

  return (
    <div className={`space-y-8 animate-in fade-in zoom-in-95 duration-700 ${stealthMode ? 'opacity-20 blur-[1px]' : ''}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] border border-red-200 bg-gradient-to-br from-red-50/50 to-white shadow-2xl relative overflow-hidden">
            {stealthMode && <div className="absolute inset-0 bg-slate-900/50 z-50 flex items-center justify-center">
              <button onClick={() => setStealthMode(false)} className="px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-xs tracking-widest">Disable Stealth</button>
            </div>}
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 p-4 rounded-3xl shadow-2xl shadow-red-600/30">
                  <ShieldAlert className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Control</h2>
                  <p className="text-[10px] text-red-600 uppercase tracking-widest font-black flex items-center gap-2">
                    <Binary className="w-3 h-3" /> ROOT_LEVEL_ACCESS_GRANTED
                  </p>
                </div>
              </div>
              <button 
                onClick={onNavigateToDashboard}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                <LayoutDashboard className="w-5 h-5 text-blue-400" />
                System Dashboard
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" /> System Protocols
                </h4>
                <div className="space-y-4">
                  <button 
                    onClick={() => { setIsUncensored(!isUncensored); notify(isUncensored ? "Guardrails Engaged." : "Uncensored Mode ACTIVE."); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isUncensored ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 opacity-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      {isUncensored ? <Unlock className="w-4 h-4 text-orange-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isUncensored ? 'text-orange-900' : 'text-slate-500'}`}>Uncensored Mode</span>
                    </div>
                  </button>

                  <button 
                    onClick={() => { setIsRealtimeTraining(!isRealtimeTraining); notify(isRealtimeTraining ? "Real-time Weights Frozen." : "Weights Sync Engaged."); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isRealtimeTraining ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 opacity-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className={`w-4 h-4 text-blue-600 ${isRealtimeTraining ? 'animate-spin' : ''}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isRealtimeTraining ? 'text-blue-900' : 'text-slate-500'}`}>Real-time Weights</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" /> Weight Allocation
                </h4>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={priorityLevel}
                    onChange={(e) => { setPriorityLevel(parseInt(e.target.value)); if(priorityLevel % 20 === 0) notify(`Weight optimized: ${priorityLevel}%`); }}
                    className="w-full accent-red-600"
                  />
                  <span className="text-3xl font-black text-red-600 mono">{priorityLevel}%</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-200 flex flex-wrap gap-4">
              <button 
                onClick={simulateWipe}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95"
              >
                {isWiping ? <RefreshCw className="w-5 h-5 animate-spin" /> : <AlertOctagon className="w-5 h-5" />}
                Purge Global Matrix
              </button>
              <button 
                onClick={() => { setStealthMode(!stealthMode); notify(stealthMode ? "Stealth Ops Stand Down." : "Stealth Mode ACTIVE."); }}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-slate-200 transition-all active:scale-95"
              >
                {stealthMode ? <Eye className="w-5 h-5 text-blue-600" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                Stealth Ops Mode
              </button>
              <button 
                onClick={initiateLockdown}
                className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 ml-auto"
              >
                <Power className="w-5 h-5 text-red-500" />
                Close All Backends
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" /> Live Neural Flux
              </h4>
              <div className="space-y-3">
                {activeLogs.map((log, i) => (
                  <div key={i} className="text-[9px] mono font-bold text-slate-400 truncate animate-in slide-in-from-left-2">
                    {log}
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
