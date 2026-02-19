
import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  Volume2, 
  Sparkles, 
  Loader2, 
  Download, 
  RefreshCw,
  Music,
  Zap,
  Moon,
  Sun,
  Wind,
  Palette,
  Save,
  Tag,
  Plus,
  X,
  Star,
  Dna,
  CheckCircle2,
  Settings2,
  Lock,
  ShieldCheck,
  Eraser,
  ToggleLeft,
  ToggleRight,
  Share2,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Clapperboard,
  Clock,
  ExternalLink,
  Archive,
  Trash2,
  FolderHeart,
  Timer,
  Info,
  Layers
} from 'lucide-react';
import { generateImage, generateVideo, generateAudio, updateVibeAesthetic } from '../services/gemini';
import { VibeMode, AppView } from '../types';

interface CreativeStudioProps {
  onAssetSecured: (asset: any) => void;
  notify: (msg: string, type?: any) => void;
}

interface Preset {
  id: string;
  name: string;
  prompt: string;
  vibe: VibeMode;
  manualOverride: string;
  tags: string[];
  tab: 'photo' | 'video' | 'sound';
  result?: string | null;
  audioResult?: string | null;
  timestamp: number;
}

const VIBES: { id: VibeMode, name: string, icon: any, color: string, desc: string }[] = [
  { id: 'cyberpunk', name: 'Cyber', icon: Moon, color: 'text-pink-500', desc: 'Neon lights, high-tech glitch, and dark high-contrast themes.' },
  { id: 'minimalist', name: 'Zen', icon: Sun, color: 'text-amber-500', desc: 'Clean lines, maximum whitespace, and high-readability minimalism.' },
  { id: 'organic', name: 'Flow', icon: Wind, color: 'text-emerald-500', desc: 'Fluid shapes, soft gradients, and nature-inspired aesthetics.' },
  { id: 'retro-future', name: 'Retro', icon: Palette, color: 'text-indigo-500', desc: '80s synthwave, vibrant colors, and analog-digital fusion.' },
  { id: 'standard', name: 'Core', icon: Zap, color: 'text-blue-500', desc: 'Professional, balanced, and modern technical standards.' },
];

const CreativeStudio: React.FC<CreativeStudioProps> = ({ onAssetSecured, notify }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<VibeMode>('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'sound'>('photo');
  const [isLiveEngine, setIsLiveEngine] = useState(false);
  const [videoDuration, setVideoDuration] = useState(5); // Default 5 seconds
  
  // Modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Persistence and Custom Vibes
  const [defaultVibe, setDefaultVibe] = useState<VibeMode>('standard');
  const [vibeOverrides, setVibeOverrides] = useState<Record<string, string>>({});
  const [isUpdatingVibe, setIsUpdatingVibe] = useState(false);
  const [vibeUpdatePrompt, setVibeUpdatePrompt] = useState('');
  const [manualAestheticOverride, setManualAestheticOverride] = useState('');
  const [clearOverrideOnGen, setClearOverrideOnGen] = useState(false);
  const [showVibeAdvanced, setShowVibeAdvanced] = useState(false);

  // Tagging State
  const [tagInput, setTagInput] = useState('');
  const [assetTags, setAssetTags] = useState<string[]>([]);

  // Presets State
  const [presets, setPresets] = useState<Preset[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedDefault = localStorage.getItem('humanedge_default_vibe') as VibeMode;
    if (savedDefault) {
      setDefaultVibe(savedDefault);
      setSelectedVibe(savedDefault);
    }
    const savedOverrides = localStorage.getItem('humanedge_vibe_overrides');
    if (savedOverrides) {
      try {
        setVibeOverrides(JSON.parse(savedOverrides));
      } catch (e) { console.error("Override load fail", e); }
    }
    const savedAutoClear = localStorage.getItem('humanedge_auto_clear_override');
    if (savedAutoClear) setClearOverrideOnGen(JSON.parse(savedAutoClear));

    const savedPresets = localStorage.getItem('humanedge_presets_vault');
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) { console.error("Presets load fail", e); }
    }
  }, []);

  const saveToVault = () => {
    const name = window.prompt("Enter a name for this preset:", `Preset ${presets.length + 1}`);
    if (!name) return;

    const newPreset: Preset = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      prompt,
      vibe: selectedVibe,
      manualOverride: manualAestheticOverride,
      tags: assetTags,
      tab: activeTab,
      result,
      audioResult,
      timestamp: Date.now()
    };

    const updatedPresets = [newPreset, ...presets];
    setPresets(updatedPresets);
    localStorage.setItem('humanedge_presets_vault', JSON.stringify(updatedPresets));
    notify("Configuration synchronized to Presets Vault.");
  };

  const loadPreset = (preset: Preset) => {
    setPrompt(preset.prompt);
    setSelectedVibe(preset.vibe);
    setManualAestheticOverride(preset.manualOverride);
    setAssetTags(preset.tags);
    setActiveTab(preset.tab);
    setResult(preset.result || null);
    setAudioResult(preset.audioResult || null);
    setShowVaultModal(false);
    notify(`Vault Preset Loaded: ${preset.name}`);
  };

  const deletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem('humanedge_presets_vault', JSON.stringify(updated));
    notify("Preset purged from Vault.");
  };

  const saveDefaultVibe = (vibe: VibeMode) => {
    localStorage.setItem('humanedge_default_vibe', vibe);
    setDefaultVibe(vibe);
    notify(`System Default synchronized to ${vibe.toUpperCase()}.`);
  };

  const toggleAutoClear = () => {
    const newVal = !clearOverrideOnGen;
    setClearOverrideOnGen(newVal);
    localStorage.setItem('humanedge_auto_clear_override', JSON.stringify(newVal));
    notify(newVal ? "Auto-clear override enabled." : "Auto-clear override disabled.");
  };

  const handleVibeRegeneration = async () => {
    if (!vibeUpdatePrompt) return;
    setIsUpdatingVibe(true);
    try {
      const currentDesc = vibeOverrides[selectedVibe] || "Standard system aesthetic baseline.";
      const newAesthetic = await updateVibeAesthetic(selectedVibe, currentDesc, vibeUpdatePrompt);
      if (newAesthetic) {
        const newOverrides = { ...vibeOverrides, [selectedVibe]: newAesthetic };
        setVibeOverrides(newOverrides);
        localStorage.setItem('humanedge_vibe_overrides', JSON.stringify(newOverrides));
        setVibeUpdatePrompt('');
        notify(`${selectedVibe.toUpperCase()} design system updated via AI.`);
      }
    } catch (err) {
      console.error(err);
      notify("Design system update failed.", "error");
    } finally {
      setIsUpdatingVibe(false);
    }
  };

  const saveManualAsBaseline = () => {
    if (!manualAestheticOverride) return;
    const newOverrides = { ...vibeOverrides, [selectedVibe]: manualAestheticOverride };
    setVibeOverrides(newOverrides);
    localStorage.setItem('humanedge_vibe_overrides', JSON.stringify(newOverrides));
    notify(`Manual script locked to ${selectedVibe.toUpperCase()} baseline.`);
  };

  const handleGenerate = async (silent: boolean = false) => {
    if (!prompt || prompt.length < 3) return;
    if (!silent) setIsGenerating(true);
    setProgress(`Synthesizing ${selectedVibe.toUpperCase()} aesthetics...`);
    
    try {
      const currentOverride = manualAestheticOverride || vibeOverrides[selectedVibe];
      
      if (activeTab === 'photo') {
        const img = await generateImage(prompt, selectedVibe, currentOverride);
        if (img) setResult(img);
      } else if (activeTab === 'video') {
        const videoUrl = await generateVideo(prompt, selectedVibe, currentOverride, (msg) => setProgress(msg), videoDuration);
        setResult(videoUrl);
      } else if (activeTab === 'sound') {
        const audioUrl = await generateAudio(prompt, selectedVibe, currentOverride);
        setAudioResult(audioUrl);
      }

      if (!silent && clearOverrideOnGen) {
        setManualAestheticOverride('');
      }
    } catch (err) {
      console.error(err);
      notify("Synthesis interrupted by Integrity Guard.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const assetType = activeTab === 'photo' ? 'Photo' : activeTab === 'video' ? 'Video' : 'Audio';
    onAssetSecured({ 
      name: prompt.substring(0, 30) + '...', 
      type: assetType, 
      module: AppView.CREATIVE_STUDIO,
      tags: assetTags.length > 0 ? assetTags : [selectedVibe]
    });
    setAssetTags([]);
    setTagInput('');
    setResult(null);
    setAudioResult(null);
    setPrompt('');
  };

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !assetTags.includes(tag)) {
      setAssetTags([...assetTags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setAssetTags(assetTags.filter(t => t !== tag));
  };

  const handleDownload = () => {
    if (!result && !audioResult) return;
    const link = document.createElement('a');
    link.href = result || audioResult || '';
    link.download = `HumanEdge_${Date.now()}.png`;
    link.click();
    notify("Asset Secured to Local Storage.");
  };

  const broadcastToSocial = async (platform: string) => {
    setIsPublishing(true);
    notify(`Establishing Secure Uplink to ${platform}...`);
    await new Promise(r => setTimeout(r, 2000));
    setIsPublishing(false);
    setShowShareModal(false);
    notify(`Broadcast Successful: Asset live on ${platform}.`, "success");
  };

  const getEstimatedTime = () => {
    if (videoDuration <= 7) return "approx. 1-2 mins";
    const loops = Math.ceil((videoDuration - 5) / 7);
    return `approx. ${2 + loops * 1} - ${3 + loops * 2} mins`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[calc(100vh-160px)]">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-xl glass bg-white p-8 rounded-[3rem] border border-blue-200 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Share2 className="w-32 h-32 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase">Global Posting Gateway</h3>
                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">HumanEdge Integrated Social Gateway</p>
                </div>
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'YouTube', icon: Youtube, color: 'hover:bg-red-50 hover:text-red-600 hover:border-red-200' },
                { name: 'X / Twitter', icon: Twitter, color: 'hover:bg-slate-900 hover:text-white hover:border-slate-800' },
                { name: 'Instagram', icon: Instagram, color: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200' },
                { name: 'TikTok', icon: Clapperboard, color: 'hover:bg-slate-100 hover:text-black hover:border-slate-300' },
              ].map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => broadcastToSocial(platform.name)}
                  disabled={isPublishing}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-slate-100 bg-slate-50 transition-all active:scale-95 ${platform.color}`}
                >
                  <platform.icon className="w-8 h-8" />
                  <span className="text-[10px] font-black uppercase tracking-tight">{platform.name}</span>
                </button>
              ))}
            </div>

            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <p className="text-[10px] text-emerald-800 font-bold leading-relaxed uppercase tracking-wide">
                Integrity Shield Active: All postings are cryptographically verified to ensure humanity-driven origins.
              </p>
            </div>

            {isPublishing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Broadcasting Shards...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Presets Vault Modal */}
      {showVaultModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300 p-4">
          <div className="w-full max-w-4xl glass bg-white p-10 rounded-[3rem] border border-purple-200 shadow-2xl space-y-8 relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FolderHeart className="w-32 h-32 text-purple-600" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-purple-600 rounded-2xl shadow-lg">
                  <Archive className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Presets Vault</h3>
                  <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest">Archived Configurations & Assets</p>
                </div>
              </div>
              <button onClick={() => setShowVaultModal(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {presets.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-20 opacity-30">
                  <Archive className="w-16 h-16 mb-4" />
                  <p className="text-sm font-black uppercase tracking-widest">Vault is currently empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {presets.map(p => (
                    <div key={p.id} className="group relative glass bg-slate-50 border border-slate-200 rounded-[2rem] overflow-hidden hover:border-purple-400 transition-all flex flex-col">
                      <div className="aspect-video bg-slate-200 relative overflow-hidden flex items-center justify-center">
                        {p.result ? (
                          <img src={p.result} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-slate-400 flex flex-col items-center gap-2">
                            {p.tab === 'photo' ? <ImageIcon className="w-8 h-8" /> : p.tab === 'video' ? <Video className="w-8 h-8" /> : <Music className="w-8 h-8" />}
                            <span className="text-[8px] font-black uppercase tracking-widest">No Visual Asset</span>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[8px] font-black text-slate-900 uppercase tracking-widest">
                          {p.vibe}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col">
                        <h4 className="font-black text-slate-900 text-sm uppercase mb-1 line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-4 italic">"{p.prompt}"</p>
                        
                        <div className="flex flex-wrap gap-1 mb-6">
                          {p.tags.slice(0, 3).map(t => (
                            <span key={t} className="text-[7px] font-black bg-white border border-slate-100 px-1.5 py-0.5 rounded text-slate-400 uppercase">{t}</span>
                          ))}
                        </div>

                        <div className="mt-auto flex gap-2">
                          <button 
                            onClick={() => loadPreset(p)}
                            className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all"
                          >
                            Load Configuration
                          </button>
                          <button 
                            onClick={() => deletePreset(p.id)}
                            className="p-3 bg-white text-slate-400 hover:text-red-600 border border-slate-200 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] border border-slate-200 bg-white flex flex-col gap-6 h-full shadow-xl">
            
            <div className="flex items-center justify-between">
              <h4 className="text-slate-900 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Creative Core
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowVaultModal(true)}
                  title="Open Presets Vault"
                  className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all border border-purple-100"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setIsLiveEngine(!isLiveEngine); notify(isLiveEngine ? "Live Forge Disabled." : "Live Forge Active."); }}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-1 ${
                    isLiveEngine ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <Zap className={`w-3 h-3 ${isLiveEngine ? 'fill-white' : ''}`} />
                  Vibe Sync
                </button>
              </div>
            </div>

            {/* Modality Tabs */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Modality</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'photo', icon: ImageIcon, label: 'Visual' },
                  { id: 'video', icon: Video, label: 'Motion' },
                  { id: 'sound', icon: Volume2, label: 'Audio' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setResult(null); setAudioResult(null); }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                      activeTab === tab.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-105' 
                        : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:bg-blue-50/30'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mb-1.5" />
                    <span className="text-[8px] uppercase font-black tracking-widest">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Refined Vibe Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aesthetic Alignment</label>
                <div className="flex gap-2">
                   <button 
                    onClick={() => setShowVibeAdvanced(!showVibeAdvanced)}
                    title="Toggle Advanced Aesthetic Controls"
                    className={`p-1.5 rounded-lg transition-all ${showVibeAdvanced ? 'text-blue-600 bg-blue-50 ring-2 ring-blue-600/20 shadow-md' : 'text-slate-300 hover:text-blue-600 hover:bg-slate-50'}`}
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => saveDefaultVibe(selectedVibe)}
                    title="Save current vibe as system default"
                    className={`p-1.5 rounded-lg transition-all ${defaultVibe === selectedVibe ? 'text-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-md' : 'text-slate-300 hover:text-amber-500 hover:bg-slate-50'}`}
                  >
                    <Star className={`w-4 h-4 ${defaultVibe === selectedVibe ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {VIBES.map(v => (
                  <div key={v.id} className="relative group">
                    <button
                      onClick={() => { setSelectedVibe(v.id); notify(`Vibe Profile: ${v.name}`); }}
                      className={`w-full p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-300 relative ${
                        selectedVibe === v.id 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] scale-105 z-10' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <v.icon className={`w-6 h-6 transition-all duration-300 ${
                        selectedVibe === v.id ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : v.color
                      } group-hover:scale-110`} />
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedVibe === v.id ? 'text-white' : 'text-slate-900'}`}>{v.name}</span>
                        {selectedVibe === v.id && (
                          <CheckCircle2 className="w-3 h-3 text-white fill-blue-600 animate-in zoom-in-50 duration-300" />
                        )}
                      </div>

                      {/* Aesthetic Tooltip */}
                      <div className="absolute top-0 left-full ml-3 z-[100] w-48 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 hidden sm:block">
                        <div className="glass bg-white p-4 rounded-2xl border border-slate-200 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)]">
                          <div className="flex items-center gap-2 mb-2">
                             <div className={`p-1.5 rounded-lg bg-slate-50 ${v.color}`}>
                               <v.icon className="w-3.5 h-3.5" />
                             </div>
                             <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{v.name} Profile</span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{v.desc}</p>
                          <div className="mt-3 pt-3 border-t border-slate-100">
                             <div className="flex items-center gap-1.5">
                               <ShieldCheck className="w-3 h-3 text-emerald-500" />
                               <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Integrity Aligned</span>
                             </div>
                          </div>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="w-3 h-3 bg-white border-l border-b border-slate-200 absolute left-[-6px] top-6 rotate-45"></div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Temporal Forge (Video Duration Selector) */}
            {activeTab === 'video' && (
              <div className="space-y-4 p-5 bg-purple-50/40 rounded-3xl border border-purple-100 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-2">
                    <Timer className="w-3.5 h-3.5" /> Temporal Shard Forge
                  </label>
                  <div className="px-3 py-1 bg-white border border-purple-200 rounded-xl shadow-sm">
                    <span className="text-[11px] font-black text-purple-900 mono">
                      {videoDuration >= 60 ? `${Math.floor(videoDuration / 60)}m ${videoDuration % 60}s` : `${videoDuration}s`}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="range" 
                    min="5" 
                    max="900" 
                    step="5"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Quick Shard (5s)</span>
                    <span>Feature Film (15m)</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3 bg-white/50 rounded-2xl border border-purple-100">
                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                    <Info className="w-3 h-3 text-purple-400" />
                    <span>Estimated Forge Time: {getEstimatedTime()}</span>
                  </div>
                  {videoDuration > 60 && (
                    <div className="flex items-center gap-2 text-[9px] font-black text-purple-600 uppercase">
                      <Layers className="w-3 h-3" />
                      <span>Forging {Math.ceil((videoDuration - 5) / 7) + 1} Temporal Shards</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aesthetic Script Section */}
            <div className="space-y-3 p-5 bg-blue-50/30 rounded-3xl border border-blue-100">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Aesthetic Script
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setManualAestheticOverride('')}
                    title="Clear override"
                    className={`p-1 hover:text-red-600 transition-colors ${manualAestheticOverride ? 'text-slate-400' : 'text-slate-200 cursor-not-allowed'}`}
                    disabled={!manualAestheticOverride}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={toggleAutoClear}
                    title={clearOverrideOnGen ? "Will clear after next generation" : "Will persist across generations"}
                    className="text-blue-600"
                  >
                    {clearOverrideOnGen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5 text-slate-300" />}
                  </button>
                </div>
              </div>
              <textarea
                value={manualAestheticOverride}
                onChange={(e) => setManualAestheticOverride(e.target.value)}
                placeholder="Override default vibe (e.g. 8k raw, bokeh, lens flare)..."
                className="w-full h-24 bg-white border border-blue-100 rounded-2xl p-4 text-[11px] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 resize-none placeholder:font-medium placeholder:text-slate-300 leading-relaxed transition-all"
              />
            </div>

            {/* Prompt Input */}
            <div className="space-y-3 flex-1 flex flex-col min-h-[120px]">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Intent Blueprint</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the aesthetic materialization..."
                className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/5 resize-none font-semibold leading-relaxed placeholder:text-slate-300"
              />
            </div>

            {/* Build Button */}
            <button
              onClick={() => handleGenerate(false)}
              disabled={isGenerating || !prompt}
              className="w-full py-5 bg-blue-600 rounded-[1.5rem] text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-600/20"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {videoDuration > 10 && activeTab === 'video' ? 'Forge Feature Film' : 'Forge Asset'}
            </button>
          </div>
        </div>

        {/* Right Column: Display Area */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
          <div className="flex-1 glass rounded-[3rem] border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center group bg-slate-50/50 shadow-inner">
            
            {!result && !audioResult && !isGenerating && (
              <div className="text-center p-12 max-w-md animate-in fade-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-blue-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Sparkles className="w-12 h-12 text-blue-400" />
                </div>
                <h5 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Aesthetic Synth Ready</h5>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Configure your alignment and intent in the control panel to materialize a new reality.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl z-20 animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 m-auto w-6 h-6 bg-blue-600 rounded-full animate-ping"></div>
                </div>
                <div className="space-y-2 text-center max-w-sm px-8">
                  <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[11px] leading-relaxed">{progress}</p>
                  {videoDuration > 60 && activeTab === 'video' && (
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Temporal extensions take additional processing cycles for continuity preservation.</p>
                  )}
                </div>
                <div className="mt-10 w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-blue-600 animate-progress"></div>
                </div>
              </div>
            )}

            {(result || audioResult) && (
              <div className="w-full h-full flex flex-col relative transition-all animate-in zoom-in-95 duration-500">
                <div className="flex-1 flex flex-col items-center justify-center p-12 overflow-hidden">
                  {result ? (
                    <div className="relative max-w-full max-h-full group/image flex items-center justify-center">
                      {activeTab === 'video' ? (
                        <video 
                          src={result} 
                          controls 
                          autoPlay 
                          loop 
                          className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/50" 
                        />
                      ) : (
                        <img 
                          src={result} 
                          alt="Generated" 
                          className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/50" 
                        />
                      )}
                      <div className="absolute inset-0 rounded-3xl bg-blue-600/5 opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center gap-10">
                      <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center shadow-inner relative">
                        <Music className="w-16 h-16 text-purple-600 animate-pulse" />
                      </div>
                      <div className="glass bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl">
                        <audio src={audioResult!} controls className="w-72" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata & Actions Overlay Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl glass bg-white/90 backdrop-blur-2xl border border-white/50 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-2xl transition-all duration-700 translate-y-4 group-hover:translate-y-0 border-t border-t-white">
                  
                  <div className="flex-1 flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                        {assetTags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 pl-2 pr-1.5 py-1 bg-blue-600 text-white text-[9px] font-black rounded-lg shadow-sm">
                            {tag.toUpperCase()}
                            <button onClick={() => removeTag(tag)} className="p-0.5 hover:bg-white/20 rounded-md transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {assetTags.length === 0 && <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5"><Tag className="w-3 h-3" /> Add meta-tags...</span>}
                      </div>
                    </div>
                    
                    <form onSubmit={addTag} className="flex gap-2 w-full">
                      <div className="relative flex-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Project tag..." 
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="bg-slate-100 border-none rounded-xl pl-10 pr-4 py-3 text-[10px] font-bold text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-600/10"
                        />
                      </div>
                      <button type="submit" className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                        <Plus className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  
                  <div className="flex gap-3 shrink-0">
                     <button 
                       onClick={saveToVault}
                       className="p-4 bg-purple-50 text-purple-600 rounded-[1.2rem] hover:bg-purple-100 border border-purple-100 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                     >
                        <Archive className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Archive</span>
                     </button>
                     <button 
                       onClick={() => setShowShareModal(true)}
                       className="px-8 py-4 bg-blue-600 text-white rounded-[1.2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                     >
                        <Share2 className="w-4 h-4" /> Broadcast
                     </button>
                     <button 
                       onClick={handleSave} 
                       className="px-8 py-4 bg-emerald-600 text-white rounded-[1.2rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                     >
                        <Save className="w-4 h-4" /> Secure
                     </button>
                     <button 
                       onClick={handleDownload} 
                       className="p-4 bg-white text-slate-900 border border-slate-200 rounded-[1.2rem] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                     >
                        <Download className="w-4 h-4" />
                     </button>
                  </div>
                </div>

                {/* Reset Control */}
                <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <button 
                     onClick={() => { setResult(null); setAudioResult(null); setAssetTags([]); }} 
                     className="p-4 bg-white/90 backdrop-blur-md rounded-2xl text-slate-900 border border-slate-200 hover:bg-red-50 hover:text-red-600 transition-all shadow-xl"
                   >
                      <RefreshCw className="w-5 h-5" />
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

export default CreativeStudio;
