
import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Cpu, 
  Database, 
  ShieldCheck, 
  CreditCard, 
  Mail, 
  HardDrive, 
  Layout, 
  Code, 
  Terminal, 
  Zap, 
  Loader2, 
  CheckCircle,
  Monitor,
  Layers,
  Fingerprint,
  Wind,
  Moon,
  Sun,
  Palette,
  CloudLightning,
  Shield,
  Tag,
  Plus,
  X,
  Eye,
  Maximize2,
  ExternalLink
} from 'lucide-react';
import { generateCodeSolution } from '../services/gemini';
import { VibeMode, AppView } from '../types';

interface AppBuilderProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

const INTEGRATIONS = [
  { id: 'stripe', name: 'Stripe Payments', icon: CreditCard, color: 'text-indigo-500' },
  { id: 'auth', name: 'Integrity Auth', icon: Fingerprint, color: 'text-emerald-500' },
  { id: 's3', name: 'Cloud Storage', icon: HardDrive, color: 'text-blue-500' },
  { id: 'email', name: 'Email Flow', icon: Mail, color: 'text-orange-500' },
];

const VIBES: { id: VibeMode, name: string, icon: any, color: string, desc: string }[] = [
  { id: 'cyberpunk', name: 'Neon Cyber', icon: Moon, color: 'text-pink-500', desc: 'Neon, Glitch, High-Contrast' },
  { id: 'minimalist', name: 'Zen Minimal', icon: Sun, color: 'text-amber-500', desc: 'Clean, White, Spacing' },
  { id: 'organic', name: 'Bio Flow', icon: Wind, color: 'text-emerald-500', desc: 'Curved, Soft, Natural' },
  { id: 'retro-future', name: 'Retro Wave', icon: Palette, color: 'text-indigo-500', desc: 'Synth, Analog, Vibrant' },
];

const AppBuilder: React.FC<AppBuilderProps> = ({ onAssetSecured, notify }) => {
  const [prompt, setPrompt] = useState('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [buildStep, setBuildStep] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<VibeMode>('standard');
  const [output, setOutput] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Tagging State
  const [tagInput, setTagInput] = useState('');
  const [appTags, setAppTags] = useState<string[]>([]);

  const handleBuild = async () => {
    if (!prompt) return;
    setIsBuilding(true);
    setOutput(null);
    
    const steps = [
      "Analyzing Intent Shards...",
      `Injecting ${selectedVibe.toUpperCase()} Aesthetic DNA...`,
      "Synchronizing Integrity Protocols...",
      "Generating Product Manifest...",
      "Polishing Adaptive Interface...",
      "Materializing Reality Shard..."
    ];

    for (const step of steps) {
      setBuildStep(step);
      await new Promise(r => setTimeout(r, 1000));
    }

    try {
      const manifest = await generateCodeSolution(
        `Build a complete standalone web product for: ${prompt}. It must have a fully developed UI, working logic, and follow the requested aesthetic vibe.`,
        selectedVibe
      );
      // Clean up the output in case the model adds markdown code blocks
      const cleaned = manifest.replace(/```html/g, '').replace(/```/g, '').trim();
      setOutput(cleaned);
      notify("Product Materialized and Verified.");
    } catch (err) {
      console.error(err);
      notify("Synthesis failure. Integrity check suggested.", "error");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    notify("Publishing Product to Global Edge...");
    await new Promise(r => setTimeout(r, 2500));
    setIsDeploying(false);
    
    onAssetSecured({ 
      name: prompt.substring(0, 30) + '...', 
      type: 'FullApp', 
      module: AppView.APP_BUILDER,
      tags: appTags.length > 0 ? appTags : [selectedVibe, 'materialized']
    });
    
    notify("Materialization Permanent. Production link live.");
    setAppTags([]);
    setTagInput('');
  };

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !appTags.includes(tag)) {
      setAppTags([...appTags, tag]);
      setTagInput('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isDeploying && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="glass bg-white p-12 rounded-[3rem] border border-blue-200 shadow-2xl max-w-lg w-full text-center space-y-8">
            <div className="relative w-24 h-24 mx-auto">
              <CloudLightning className="w-24 h-24 text-blue-600 animate-pulse" />
              <Shield className="absolute -bottom-2 -right-2 w-8 h-8 text-emerald-600 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase">Deploying Core</h3>
              <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest mt-2">HumanEdge Edge Computing</p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600 animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
        {/* Left Column: Architect */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] border border-blue-200 bg-white flex flex-col gap-8 h-full shadow-xl">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 font-black uppercase tracking-tight text-sm">Product Materializer</h4>
                <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">End-Product Engine</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3 text-blue-500" /> Vibe Aesthetic Core
              </label>
              <div className="grid grid-cols-2 gap-3">
                {VIBES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVibe(v.id); notify(`Vibe synchronized: ${v.name}`); }}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      selectedVibe === v.id 
                        ? 'bg-blue-600 border-blue-600 shadow-lg scale-105 z-10' 
                        : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <v.icon className={`w-4 h-4 mb-2 ${selectedVibe === v.id ? 'text-white' : v.color}`} />
                    <p className={`text-[9px] font-black uppercase tracking-widest ${selectedVibe === v.id ? 'text-white' : 'text-slate-900'}`}>{v.name}</p>
                    {selectedVibe === v.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-3 h-3 text-white fill-blue-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Vision</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A sleek SaaS landing page for an AI-powered logistics platform..."
                className="w-full flex-1 min-h-[160px] bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 font-semibold leading-relaxed placeholder:text-slate-300"
              />
            </div>

            <button
              onClick={handleBuild}
              disabled={isBuilding || !prompt}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.5rem] uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
            >
              {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isBuilding ? 'Synthesizing...' : 'Materialize Product'}
            </button>
          </div>
        </div>

        {/* Right Column: Materialization Viewer */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <div className="glass bg-white rounded-[3rem] border border-slate-200 flex-1 flex flex-col overflow-hidden relative shadow-inner">
            
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex gap-4">
                {[
                  { id: 'preview', label: 'Reality Viewer', icon: Eye },
                  { id: 'code', label: 'DNA Manifest', icon: Terminal },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                      activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>
              {output && (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Aesthetic Alignment Stable</span>
                </div>
              )}
            </div>

            <div className="flex-1 relative bg-slate-100">
              {!output && !isBuilding ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-32 h-32 bg-blue-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner animate-in zoom-in-50 duration-700">
                    <CloudLightning className="w-16 h-16 text-blue-200" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Materialization Portal</h4>
                  <p className="text-slate-400 font-medium max-w-sm mt-3">
                    Your intent blueprint will materialize here as a fully functional interactive product.
                  </p>
                </div>
              ) : isBuilding ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl z-20 animate-in fade-in duration-300">
                  <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                    <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-600 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[11px] text-center">{buildStep}</p>
                </div>
              ) : activeTab === 'preview' ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={output!}
                  title="Product Preview"
                  className="w-full h-full border-none bg-white animate-in fade-in duration-500"
                  sandbox="allow-scripts"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 p-10 overflow-hidden flex flex-col">
                  <pre className="mono text-xs text-blue-400 overflow-y-auto h-full custom-scrollbar leading-relaxed">
                    <code>{output}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Actions & Metadata */}
            {output && (
              <div className="p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row items-center gap-8 animate-in slide-in-from-bottom-6 duration-500">
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" /> Project Metadata
                    </label>
                    <div className="flex gap-2">
                      {appTags.map(t => (
                        <span key={t} className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-xl border border-blue-100 shadow-sm">
                          {t.toUpperCase()}
                          <button onClick={() => setAppTags(appTags.filter(tag => tag !== t))} className="hover:bg-blue-100 rounded-lg p-0.5 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <form onSubmit={addTag} className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Add tag identifier..." 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[1.2rem] pl-11 pr-4 py-3.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
                      />
                    </div>
                    <button type="submit" className="px-5 bg-slate-900 text-white rounded-[1.2rem] hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(output!); notify("Manifest DNA Securely Copied."); }}
                    className="px-6 py-4 bg-white text-slate-500 border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95"
                  >
                    Copy DNA
                  </button>
                  <button 
                    onClick={handleDeploy}
                    className="px-10 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-3"
                  >
                    <ShieldCheck className="w-5 h-5" /> Finalize Materialization
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppBuilder;
