
import React, { useState } from 'react';
// Added RefreshCw to imports to fix "Cannot find name 'RefreshCw'" error
import { Eye, ShieldAlert, ShieldCheck, Loader2, Search, AlertTriangle, CheckCircle2, Terminal, RefreshCw } from 'lucide-react';
import { detectFraud } from '../services/gemini';

// Added FraudDetectionProps to match App.tsx pass-through
interface FraudDetectionProps {
  notify: (msg: string, type?: any) => void;
}

const FraudDetection: React.FC<FraudDetectionProps> = ({ notify }) => {
  const [data, setData] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!data) return;
    setIsScanning(true);
    setAnalysis(null);
    try {
      const result = await detectFraud(data);
      setAnalysis(result);
      notify("Scan analysis complete.");
    } catch (err) { 
      console.error(err); 
      notify("Sentinel scan failed.", "error");
    } 
    finally { setIsScanning(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-xl text-white">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="text-slate-900 font-black uppercase tracking-tight text-sm">Integrity Sentinel</h4>
            </div>

            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste data stream for heuristic audit..."
              className="w-full h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600/10 font-bold resize-none"
            />

            <button
              onClick={handleScan}
              disabled={isScanning || !data}
              className="w-full py-4 bg-red-600 text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-600/10 hover:bg-red-700 transition-all"
            >
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Execute Scan'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!analysis && !isScanning ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center text-center p-12 bg-white">
              <ShieldCheck className="w-20 h-20 text-emerald-600/10 mb-6" />
              <h4 className="text-xl font-black text-slate-900 uppercase">Sentinel Ready</h4>
            </div>
          ) : isScanning ? (
            <div className="h-full min-h-[500px] glass rounded-3xl border border-slate-200 flex flex-col items-center justify-center bg-white space-y-4">
              <RefreshCw className="w-12 h-12 text-red-600 animate-spin" />
              <p className="text-[10px] font-black text-slate-900 uppercase">Deep Packet Inspection...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className={`p-10 rounded-3xl border glass bg-white flex items-center justify-between ${analysis.riskScore > 30 ? 'border-red-600 shadow-2xl shadow-red-600/10' : 'border-emerald-600 shadow-2xl shadow-emerald-600/10'}`}>
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-2xl ${analysis.riskScore > 30 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {analysis.riskScore > 30 ? <ShieldAlert className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Audit Status</p>
                    <h3 className={`text-4xl font-black uppercase tracking-tight ${analysis.riskScore > 30 ? 'text-red-600' : 'text-emerald-600'}`}>{analysis.integrityStatus}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Buffer</p>
                  <p className={`text-5xl font-black mono ${analysis.riskScore > 30 ? 'text-red-600' : 'text-emerald-600'}`}>{analysis.riskScore}%</p>
                </div>
              </div>

              <div className="glass p-10 rounded-3xl border border-slate-200 bg-white space-y-6">
                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" /> Audit Log
                </h5>
                <div className="space-y-4">
                  {analysis.findings.map((f: string, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
                       <AlertTriangle className={`w-4 h-4 mt-1 shrink-0 ${analysis.riskScore > 30 ? 'text-red-600' : 'text-blue-600'}`} />
                       <p className="text-sm font-bold text-slate-700">{f}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudDetection;
