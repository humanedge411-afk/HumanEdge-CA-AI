
import React, { useState } from 'react';
// Added RefreshCw to imports to fix "Cannot find name 'RefreshCw'" error
import { Database, Globe, Map as MapIcon, Layers, Zap, Loader2, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import { searchRealTimeDataset, generateGeospatialData } from '../services/gemini';

// Added DataCoreProps to match App.tsx pass-through
interface DataCoreProps {
  notify: (msg: string, type?: any) => void;
}

const DataCore: React.FC<DataCoreProps> = ({ notify }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'realtime' | 'geospatial' | 'historical'>('realtime');
  const [result, setResult] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!query) return;
    setIsSyncing(true);
    try {
      if (mode === 'realtime') {
        const data = await searchRealTimeDataset(query);
        setResult(data);
      } else if (mode === 'geospatial') {
        const data = await generateGeospatialData(query);
        setResult(data);
      } else {
        const data = await searchRealTimeDataset(query);
        setResult(data);
      }
      notify("Intelligence shards synchronized.");
    } catch (err) {
      console.error(err);
      notify("Dataset synchronization failed.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-200 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/10 p-2 rounded-xl">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-slate-900 font-black uppercase tracking-tight text-sm">Omni Dataset</h4>
            </div>

            <div className="space-y-2">
              {[
                { id: 'realtime', icon: Globe, label: 'Live Global Index' },
                { id: 'geospatial', icon: MapIcon, label: 'Geo-Intelligence' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id as any)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    mode === opt.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <opt.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query world knowledge matrix..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 font-semibold"
            />

            <button
              onClick={handleSync}
              disabled={isSyncing || !query}
              className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all"
            >
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Sync Dataset'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!result && !isSyncing ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center p-12 bg-white">
              <Globe className="w-20 h-20 text-blue-600/10 mb-6" />
              <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">OmniCore Active</h4>
              <p className="text-slate-500 font-medium">Access HumanEdge specialized datasets instantly.</p>
            </div>
          ) : isSyncing ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-4 bg-white">
              <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-900 font-black uppercase tracking-widest text-[10px]">Aggregating Intelligence Shards...</p>
            </div>
          ) : (
            <div className="glass p-10 rounded-3xl border border-slate-200 bg-white min-h-[500px] space-y-6 flex flex-col">
              <div className="border-b border-slate-100 pb-6 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 uppercase">Synchronized Knowledge</h3>
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1 prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed whitespace-pre-wrap overflow-y-auto">
                {result.text}
              </div>
              
              {/* Display Grounding Sources (URLs) as required by Gemini API guidelines */}
              {result.sources && result.sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Grounding Sources</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((chunk: any, i: number) => {
                      const web = chunk.web;
                      const maps = chunk.maps;
                      if (web) {
                        return (
                          <a key={i} href={web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            {web.title || 'Web Result'}
                          </a>
                        );
                      }
                      if (maps) {
                        return (
                          <a key={i} href={maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors">
                            <MapIcon className="w-3 h-3" />
                            {maps.title || 'Location Result'}
                          </a>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCore;
