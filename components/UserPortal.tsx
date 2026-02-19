
import React from 'react';
// Added Gamepad2 to imports
import { User, Sparkles, ShieldCheck, ArrowRight, Rocket, Gamepad2 } from 'lucide-react';
import { AppView } from '../types';

interface UserPortalProps {
  onAction: (view: AppView) => void;
}

const UserPortal: React.FC<UserPortalProps> = ({ onAction }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div className="relative p-12 glass rounded-[3rem] border border-blue-200 overflow-hidden bg-gradient-to-br from-blue-50 to-white shadow-2xl shadow-blue-600/5">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Rocket className="w-64 h-64 text-blue-600" />
        </div>
        
        <div className="relative z-10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Citizen Hub</h2>
                <p className="text-blue-600 font-black uppercase tracking-widest text-[10px]">Integrity Core is Online</p>
              </div>
            </div>
            <div className="bg-white px-8 py-6 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                 <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Integrity Score</p>
                 <p className="text-3xl font-black text-emerald-600 tracking-tighter">99.9%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button 
              onClick={() => onAction(AppView.APP_BUILDER)}
              className="glass bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-400 transition-all group text-left shadow-sm active:scale-95"
            >
              <div className="bg-blue-600 p-4 rounded-2xl w-fit mb-6 text-white shadow-lg">
                <Rocket className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Prompt-to-App</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">Synthesize full-stack web products from aesthetic intent blueprints.</p>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
                Initialize <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => onAction(AppView.CREATIVE_STUDIO)}
              className="glass bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-purple-400 transition-all group text-left shadow-sm active:scale-95"
            >
              <div className="bg-purple-600 p-4 rounded-2xl w-fit mb-6 text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">Creative Studio</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">Forge high-fidelity visual and audio assets with Vibe Coding active.</p>
              <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em]">
                Creative Studio <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => onAction(AppView.GAME_ENGINE)}
              className="glass bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-emerald-400 transition-all group text-left shadow-sm active:scale-95"
            >
              <div className="bg-emerald-600 p-4 rounded-2xl w-fit mb-6 text-white shadow-lg">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-2">World Engine</h4>
              <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">Construct immersive game environments and logic nodes instantly.</p>
              <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                World Forge <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 glass rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
         <div className="flex items-center justify-between">
           <div>
             <h4 className="text-lg font-black text-slate-900 uppercase">Integrity Status</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Protection Verified by HumanEdge Sentinel</p>
           </div>
           <ShieldCheck className="w-8 h-8 text-emerald-600" />
         </div>
      </div>
    </div>
  );
};

export default UserPortal;
