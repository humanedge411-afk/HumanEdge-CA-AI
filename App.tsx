
import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Wrench, 
  Gamepad2, 
  Zap, 
  Globe, 
  ShieldCheck,
  Cpu,
  RefreshCw,
  Activity,
  Eye,
  Database,
  User,
  ShieldAlert,
  Search,
  X,
  FileText,
  ImageIcon,
  Play,
  Music,
  Code,
  Gamepad,
  Rocket,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  Lock,
  Shield,
  Power,
  ChevronRight
} from 'lucide-react';
import { AppView, ProjectAsset } from './types';
import Dashboard from './components/Dashboard';
import CreativeStudio from './components/CreativeStudio';
import CodeRepair from './components/CodeRepair';
import GameEngine from './components/GameEngine';
import FraudDetection from './components/FraudDetection';
import DataCore from './components/DataCore';
import AdminPanel from './components/AdminPanel';
import UserPortal from './components/UserPortal';
import AdminLogin from './components/AdminLogin';
import AppBuilder from './components/AppBuilder';
import ChatAssistant from './components/ChatAssistant';

const INITIAL_ASSETS: ProjectAsset[] = [
  { id: '1', name: 'Cyberpunk Cityscape 4K', type: 'Photo', module: AppView.CREATIVE_STUDIO, timestamp: Date.now() - 3600000, tags: ['cyber', 'neon', '4k'] },
  { id: '2', name: 'Ambient Synth Loop v1', type: 'Audio', module: AppView.CREATIVE_STUDIO, timestamp: Date.now() - 7200000, tags: ['synth', 'lofi'] },
  { id: '3', name: 'Secure RPG Blueprint', type: 'Game', module: AppView.GAME_ENGINE, timestamp: Date.now() - 10800000, tags: ['rpg', 'logic'] },
  { id: '4', name: 'Auth Module Regenerated', type: 'Code', module: AppView.CODE_REPAIR, timestamp: Date.now() - 14400000, tags: ['security', 'auth'] },
  { id: '5', name: 'Toronto Node Geo-Map', type: 'Data', module: AppView.DATA_CORE, timestamp: Date.now() - 18000000, tags: ['map', 'toronto'] },
  { id: '6', name: 'Cinematic Drone Flight', type: 'Video', module: AppView.CREATIVE_STUDIO, timestamp: Date.now() - 21600000, tags: ['cinematic', 'aerial'] },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.USER_PORTAL);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProMode, setIsProMode] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isSystemLocked, setIsSystemLocked] = useState(false);
  const [assets, setAssets] = useState<ProjectAsset[]>(INITIAL_ASSETS);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchFocused(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  const handleLogoClick = () => {
    if (isSystemLocked) {
      setShowLogin(true);
      return;
    }
    if (isAdminAuthenticated) {
       setActiveView(AppView.ADMIN);
       return;
    }
    const next = logoClicks + 1;
    if (next >= 5) {
      setShowLogin(true);
      setLogoClicks(0);
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  const addAsset = (asset: Omit<ProjectAsset, 'id' | 'timestamp'>) => {
    const newAsset: ProjectAsset = {
      ...asset,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    setAssets(prev => [newAsset, ...prev]);
    notify(`Asset "${asset.name}" secured to Vault.`);
  };

  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase();
    const nameMatch = asset.name.toLowerCase().includes(query);
    const typeMatch = asset.type.toLowerCase().includes(query);
    const tagMatch = asset.tags?.some(tag => tag.toLowerCase().includes(query));
    return nameMatch || typeMatch || tagMatch;
  });

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Photo': return <ImageIcon className="w-4 h-4" />;
      case 'Video': return <Play className="w-4 h-4" />;
      case 'Audio': return <Music className="w-4 h-4" />;
      case 'Code': return <Code className="w-4 h-4" />;
      case 'Game': return <Gamepad className="w-4 h-4" />;
      case 'FullApp': return <Rocket className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleSystemLockdown = () => {
    setIsSystemLocked(true);
    setIsAdminAuthenticated(false);
    setActiveView(AppView.SYSTEM_LOCKED);
    notify("CRITICAL: All Backends Sealed. System in deep-lockdown.", "error");
  };

  const handleSystemUnlock = () => {
    setIsSystemLocked(false);
    setIsAdminAuthenticated(true);
    setActiveView(AppView.ADMIN);
    notify("System Restoration Successful. All backends live.");
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f8fafc] text-blue-600">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          <Cpu className="absolute inset-0 m-auto w-10 h-10 animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold tracking-widest uppercase mono">HumanEdge(CA) AI</h1>
        <p className="mt-2 text-blue-500/60 mono text-sm">Synchronizing Integrity Core v4.0.1...</p>
      </div>
    );
  }

  // Lockdown View
  if (isSystemLocked) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="network-bg"></div>
        </div>
        
        {showLogin && (
          <AdminLogin 
            onSuccess={handleSystemUnlock} 
            onCancel={() => setShowLogin(false)} 
          />
        )}

        <div className="glass bg-slate-900/40 border-slate-800 p-16 rounded-[4rem] shadow-2xl max-w-2xl w-full text-center space-y-12 animate-in zoom-in-95 duration-1000 relative z-10">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-red-600/20 blur-3xl animate-pulse rounded-full"></div>
            <div className="relative glass bg-slate-800 border-red-900/50 w-full h-full rounded-[2.5rem] flex items-center justify-center">
              <Shield className="w-16 h-16 text-red-600 animate-pulse" />
            </div>
            <Lock className="absolute -bottom-2 -right-2 w-10 h-10 text-white fill-red-600 p-2 glass bg-red-600 border-none rounded-2xl" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Backend Locked</h1>
            <p className="text-red-500 font-black uppercase tracking-[0.4em] text-xs">HumanEdge Integrity Protocol 0x00F</p>
            <div className="pt-8 flex flex-col items-center gap-6">
              <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-3xl text-slate-400 text-xs font-bold leading-relaxed max-w-md">
                All generative neural paths have been severed. MongoDB persistence layers are in read-only deep-freeze. 
                External API requests are currently discarded.
              </div>
              <button 
                onClick={() => setShowLogin(true)}
                className="group px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-2xl"
              >
                Restore Core Access <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-6">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-red-600"></div> SENSORS: ACTIVE
            </div>
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-red-600"></div> GEN-AI: OFFLINE
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: AppView.USER_PORTAL, icon: User, label: 'Consumer Hub', pro: false },
    { id: AppView.APP_BUILDER, icon: Rocket, label: 'App Architect', pro: false },
    { id: AppView.CREATIVE_STUDIO, icon: Palette, label: 'Creative Studio', pro: false },
    { id: AppView.DATA_CORE, icon: Database, label: 'Omni Data Core', pro: true },
    { id: AppView.CODE_REPAIR, icon: Wrench, label: 'Regeneration Hub', pro: true },
    { id: AppView.GAME_ENGINE, icon: Gamepad2, label: 'World Engine', pro: true },
    { id: AppView.FRAUD_DETECTION, icon: Eye, label: 'Integrity Sentinel', pro: true },
  ];

  const filteredNav = navItems.filter(item => isProMode || !item.pro);

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden relative">
      {/* Global Secure Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-right-8 duration-300">
          <div className={`glass px-6 py-4 rounded-2xl border flex items-center gap-3 shadow-2xl ${
            notification.type === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
            <span className={`text-sm font-black uppercase tracking-tight ${
              notification.type === 'success' ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      {showLogin && (
        <AdminLogin 
          onSuccess={() => { setIsAdminAuthenticated(true); setShowLogin(false); setActiveView(AppView.ADMIN); notify("Admin Root Authenticated."); }} 
          onCancel={() => setShowLogin(false)} 
        />
      )}

      {/* Sidebar */}
      <nav className="w-64 glass border-r border-slate-200 flex flex-col z-50">
        <div className="p-6">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 mb-8 text-left hover:translate-x-1 transition-transform active:scale-95"
          >
            <div className={`p-2 rounded-lg shadow-lg transition-colors ${activeView === AppView.ADMIN ? 'bg-red-600' : 'bg-blue-600'}`}>
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 tracking-tight">HumanEdge</h2>
              <p className="text-[10px] text-blue-600 uppercase tracking-widest mono font-bold">Canada AI</p>
            </div>
          </button>

          <div className="space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeView === item.id 
                    ? 'bg-blue-600/10 text-blue-600 border border-blue-600/10 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={() => { setIsProMode(!isProMode); notify(isProMode ? "User Access Restricted." : "Pro Modalities Engaged."); }}
            className="w-full text-left p-4 rounded-xl bg-slate-200/50 border border-slate-300/50 hover:bg-slate-200 transition-colors group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className={`w-4 h-4 transition-colors ${isProMode ? 'text-blue-600' : 'text-green-600'}`} />
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Access Tier</span>
              </div>
              <div className={`text-[9px] px-2 py-0.5 rounded-full font-black transition-all ${isProMode ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                {isProMode ? 'PRO' : 'USER'}
              </div>
            </div>
            <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${isProMode ? 'w-full bg-blue-600' : 'w-1/3 bg-green-500'}`}></div>
            </div>
          </button>
          <div className="text-[10px] text-slate-400 flex justify-between mono font-bold">
            <span>CORE-SECURE</span>
            <span>V4.1.0-INTEGRITY</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto relative bg-white/50">
        <div className="network-bg" aria-hidden="true"></div>
        <div className="network-overlay" aria-hidden="true"></div>

        <header className="sticky top-0 z-40 px-8 py-4 glass border-b border-slate-200 flex justify-between items-center gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <h3 className={`text-sm font-black uppercase tracking-widest ${activeView === AppView.ADMIN ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>
              {activeView === AppView.ADMIN ? 'HUMANEDGE ADMIN CORE' : (navItems.find(i => i.id === activeView)?.label || 'System')}
            </h3>
            <div className="h-4 w-[1px] bg-slate-200"></div>
          </div>

          <div className="flex-1 max-w-2xl relative" ref={searchRef}>
            <div className={`flex items-center bg-slate-100 border transition-all rounded-2xl px-4 py-2 ${isSearchFocused ? 'bg-white border-blue-400 shadow-xl ring-4 ring-blue-600/5' : 'border-slate-200'}`}>
              <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-blue-600' : 'text-slate-400'}`} />
              <input 
                type="text"
                placeholder="Search projects, assets, code or datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="bg-transparent border-none focus:ring-0 w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 px-3"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-3 h-3 text-slate-500" />
                </button>
              )}
            </div>

            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 glass bg-white rounded-[2rem] border border-slate-200 shadow-2xl z-[100] max-h-[480px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Intelligent Vault Retrieval</span>
                  <span className="text-[10px] font-black text-blue-600 mono px-2 py-1 bg-blue-50 rounded-lg">{filteredAssets.length} Secured Hits</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {filteredAssets.length > 0 ? (
                    <div className="p-3 space-y-1.5">
                      {filteredAssets.map(asset => (
                        <button
                          key={asset.id}
                          onClick={() => { setActiveView(asset.module); setIsSearchFocused(false); setSearchQuery(''); }}
                          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all">
                              {getAssetIcon(asset.type)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight">{asset.name}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mr-2">{asset.type} • SECURE</p>
                                {asset.tags?.map(tag => (
                                  <span key={tag} className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black rounded-md border border-blue-100">
                                    <Tag className="w-2 h-2" /> {tag.toUpperCase()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-16 text-center">
                      <Search className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                      <p className="text-sm font-black text-slate-900 uppercase">No matches verified</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {isAdminAuthenticated && (
              <div className="px-3 py-1 bg-red-600/10 text-red-600 text-[10px] font-black rounded-lg border border-red-600/20 flex items-center gap-2">
                <ShieldAlert className="w-3 d-3" /> ROOT ACCESS
              </div>
            )}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-slate-500 font-semibold">Integrity Sync</span>
            </div>
            <button 
              onClick={() => { setIsInitializing(true); setTimeout(() => { setIsInitializing(false); notify("System Re-synchronized."); }, 1000); }}
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg border border-slate-200 transition-colors active:scale-90"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto relative z-10">
          {activeView === AppView.USER_PORTAL && <UserPortal onAction={(view) => setActiveView(view)} />}
          {activeView === AppView.APP_BUILDER && <AppBuilder onAssetSecured={addAsset} notify={notify} />}
          {activeView === AppView.CREATIVE_STUDIO && <CreativeStudio onAssetSecured={addAsset} notify={notify} />}
          {activeView === AppView.CODE_REPAIR && <CodeRepair onAssetSecured={addAsset} notify={notify} />}
          {activeView === AppView.GAME_ENGINE && <GameEngine onAssetSecured={addAsset} notify={notify} />}
          {activeView === AppView.FRAUD_DETECTION && <FraudDetection notify={notify} />}
          {activeView === AppView.DATA_CORE && <DataCore notify={notify} />}
          {activeView === AppView.ADMIN && <AdminPanel onNavigateToDashboard={() => setActiveView(AppView.DASHBOARD)} onLockdown={handleSystemLockdown} notify={notify} />}
          {activeView === AppView.DASHBOARD && <Dashboard assets={assets} />}
        </div>
        
        {/* Chat Assistant */}
        {!isSystemLocked && <ChatAssistant />}
      </main>
    </div>
  );
};

export default App;
