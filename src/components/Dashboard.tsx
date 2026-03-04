import { useState, useEffect, useRef } from 'react';
import { Play, Square, FolderOpen, Trash2, Copy, Terminal, Activity, Settings, Globe, Zap, Shield, Languages } from 'lucide-react';
import { Button, Input, Checkbox } from './ui-elements';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'generator' | 'quickgrab' | 'checker'>('generator');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    s1Total: 129871,
    s1Processed: 0,
    s1Pass: 0,
    s2Processed: 0,
    s2Pass: 0,
    working: 0
  });

  const logContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Mock simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setStats(prev => {
          const newS1Processed = Math.min(prev.s1Processed + Math.floor(Math.random() * 500), prev.s1Total);
          const newS1Pass = prev.s1Pass + Math.floor(Math.random() * 10);
          const newS2Processed = Math.min(prev.s2Processed + Math.floor(Math.random() * 5), newS1Pass);
          const newS2Pass = prev.s2Pass + (Math.random() > 0.2 ? 1 : 0);
          const newWorking = prev.working + (Math.random() > 0.3 ? 1 : 0);
          
          return {
            ...prev,
            s1Processed: newS1Processed,
            s1Pass: newS1Pass,
            s2Processed: newS2Processed,
            s2Pass: newS2Pass,
            working: newWorking
          };
        });

        setProgress(prev => {
            if (prev >= 100) return 100;
            return prev + 0.1;
        });

        const newLog: LogEntry = {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          message: `S1: ${Math.floor(Math.random() * 5000)}/${stats.s1Total} pass:${stats.s1Pass} | S2: ${stats.s2Pass}/${stats.s2Processed} working:${stats.working} - ${t('log.validating')}`,
          type: 'info'
        };
        
        setLogs(prev => {
            const newLogs = [...prev, newLog];
            return newLogs.slice(-200); // Keep last 200 logs
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, stats, t]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleStart = () => {
    setIsRunning(true);
    setProgress(0);
    setStats({
        s1Total: 129871,
        s1Processed: 0,
        s1Pass: 0,
        s2Processed: 0,
        s2Pass: 0,
        working: 0
    });
    setLogs(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: t('log.start'),
      type: 'info'
    }]);
  };

  const handleStop = () => {
    setIsRunning(false);
    setLogs(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      message: t('log.stop'),
      type: 'warning'
    }]);
  };

  const clearLogs = () => setLogs([]);

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-300 font-sans overflow-hidden selection:bg-blue-500/30">
      {/* Header / Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0c0c0e] px-4 pt-3 gap-1">
        <div className="flex items-center gap-1">
            <TabButton 
            active={activeTab === 'generator'} 
            onClick={() => setActiveTab('generator')}
            icon={<Zap size={16} />}
            label={t('tab.generator')}
            />
            <TabButton 
            active={activeTab === 'quickgrab'} 
            onClick={() => setActiveTab('quickgrab')}
            icon={<Globe size={16} />}
            label={t('tab.quickgrab')}
            />
            <TabButton 
            active={activeTab === 'checker'} 
            onClick={() => setActiveTab('checker')}
            icon={<Shield size={16} />}
            label={t('tab.checker')}
            />
        </div>
        <div className="flex items-center gap-3 pb-2 pr-2">
            <span className="text-xs text-zinc-600 font-mono">v2.4.0-build.892</span>
            <button 
                onClick={toggleLanguage}
                className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-xs font-medium"
                title="Switch Language"
            >
                <Languages size={16} />
                {language === 'zh' ? 'EN' : '中文'}
            </button>
            <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <Settings size={16} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden relative">
        
        {/* Tab Content */}
        <div className="bg-[#121214] border border-zinc-800 rounded-lg p-5 shadow-sm relative overflow-hidden">
            {/* Subtle background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            <AnimatePresence mode="wait">
                {activeTab === 'generator' && (
                    <motion.div 
                        key="generator"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-6">
                            <Input label={t('label.threads')} defaultValue="50" />
                            <Input label={t('label.timeout')} defaultValue="10" />
                            <Input label={t('label.retries')} defaultValue="2" />
                            <Input label={t('label.s1timeout')} defaultValue="3" />
                            <Input label={t('label.s1retries')} defaultValue="1" />
                            <Input label={t('label.sourceworkers')} defaultValue="10" />
                            <Input label={t('label.fetchtimeout')} defaultValue="15" />
                            <Input label={t('label.backfillratio')} defaultValue="0.15" />
                            <Input label={t('label.geonodepages')} defaultValue="10" />
                            <div className="md:col-span-2 lg:col-span-3">
                                <Input label={t('label.regions')} placeholder={t('placeholder.regions')} />
                            </div>
                            <div className="flex items-end pb-2">
                                <Checkbox label={t('label.regionlookup')} defaultChecked />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 border-t border-zinc-800/50 pt-5">
                            <Button variant="primary" className="w-40 gap-2 shadow-blue-900/20" onClick={handleStart} disabled={isRunning}>
                                <Play size={16} fill="currentColor" />
                                {t('btn.generate_validate')}
                            </Button>
                            <Button className="w-40 gap-2" disabled={isRunning}>
                                <Settings size={16} />
                                {t('btn.generate_only')}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'quickgrab' && (
                    <motion.div 
                        key="quickgrab"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 h-[260px] flex flex-col items-center justify-center text-zinc-500 gap-4"
                    >
                        <Globe size={48} className="opacity-20" />
                        <p>{t('msg.quickgrab_dev')}</p>
                        <Button>{t('btn.config_source')}</Button>
                    </motion.div>
                )}

                {activeTab === 'checker' && (
                    <motion.div 
                        key="checker"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 h-[260px] flex flex-col items-center justify-center text-zinc-500 gap-4"
                    >
                        <Shield size={48} className="opacity-20" />
                        <p>{t('msg.checker_dev')}</p>
                        <Button>{t('btn.import_list')}</Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between bg-[#0f172a] border border-blue-900/30 px-4 py-2.5 rounded text-blue-200 text-sm font-mono shadow-sm">
          <div className="flex items-center gap-3">
            {isRunning ? (
                <Activity size={14} className="text-blue-400 animate-pulse" />
            ) : (
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
            )}
            <span className={isRunning ? "text-blue-100" : "text-zinc-500"}>
                {isRunning ? t('status.validating') : t('status.idle')}
            </span>
          </div>
          <div className="flex gap-6 text-xs md:text-sm">
            <span>S1: <span className="text-white font-bold">{stats.s1Processed}</span>/<span className="text-zinc-400">{stats.s1Total}</span> pass:<span className="text-emerald-400 font-bold">{stats.s1Pass}</span></span>
            <span className="w-px h-4 bg-blue-800/50"></span>
            <span>S2: <span className="text-white font-bold">{stats.s2Pass}</span>/<span className="text-zinc-400">{stats.s2Processed}</span> working:<span className="text-emerald-400 font-bold">{stats.working}</span></span>
          </div>
        </div>

        {/* Log Panel */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#050505] border border-zinc-800 rounded-lg overflow-hidden shadow-inner relative group">
          <div className="flex items-center justify-between px-3 py-2 bg-[#121214] border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
              <Terminal size={14} />
              {t('header.run_log')}
            </div>
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`}></div>
                    <span className="text-[10px] text-zinc-500 uppercase">{isRunning ? t('status.live') : t('status.offline')}</span>
                 </div>
            </div>
          </div>
          
          <div 
            ref={logContainerRef}
            className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1 scroll-smooth"
          >
            {logs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-2 opacity-50">
                <Terminal size={32} />
                <p>{t('log.waiting')}</p>
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className={`break-all font-mono leading-relaxed ${
                log.type === 'error' ? 'text-red-400 bg-red-950/10' : 
                log.type === 'warning' ? 'text-amber-400 bg-amber-950/10' : 
                log.type === 'success' ? 'text-emerald-400' : 
                'text-zinc-400 hover:bg-zinc-900/30'
              } transition-colors px-1 rounded`}>
                <span className="text-zinc-600 mr-3 select-none">[{log.timestamp}]</span>
                {log.message}
              </div>
            ))}
          </div>

          {/* Floating Action for Auto-scroll */}
          {!autoScroll && (
             <button 
                onClick={() => setAutoScroll(true)}
                className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-500 transition-all opacity-0 group-hover:opacity-100"
             >
                <Activity size={16} />
             </button>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-[#121214] border border-zinc-800 p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="gap-2 text-xs h-8 px-3">
                <FolderOpen size={14} />
                {t('btn.open_folder')}
            </Button>
            <Button variant="secondary" className="gap-2 text-xs h-8 px-3" onClick={clearLogs}>
                <Trash2 size={14} />
                {t('btn.clear')}
            </Button>
            <Button variant="secondary" className="gap-2 text-xs h-8 px-3">
                <Copy size={14} />
                {t('btn.copy')}
            </Button>
          </div>
          
          <div className="hidden md:block w-px h-6 bg-zinc-800 mx-1"></div>

          <div className="flex items-center gap-2">
            <Checkbox 
              label={t('label.autoscroll')} 
              checked={autoScroll} 
              onChange={(e) => setAutoScroll(e.target.checked)} 
              className="h-3.5 w-3.5"
            />
          </div>

          <div className="flex-1 flex items-center gap-3 bg-zinc-900/50 px-3 py-1.5 rounded border border-zinc-800/50 mx-2">
            <span className="text-xs text-zinc-500 whitespace-nowrap min-w-[60px]">
              {isRunning ? t('status.running') : t('status.ready')}
            </span>
            <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-xs font-mono text-zinc-400 w-10 text-right">{Math.round(progress)}%</span>
          </div>

          <Button 
            variant="danger" 
            className="gap-2 h-8 px-6 shadow-red-900/20" 
            onClick={handleStop}
            disabled={!isRunning}
          >
            <Square size={14} fill="currentColor" />
            {t('btn.stop')}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-200
        ${active ? 'text-blue-100 bg-[#121214]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}
        rounded-t-md border-t border-x border-transparent
        ${active ? 'border-zinc-800 border-b-[#121214] -mb-px z-10' : 'border-b-zinc-800'}
      `}
    >
      <span className={active ? "text-blue-400" : "text-zinc-600"}>{icon}</span>
      {label}
      {active && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-blue-500" />
      )}
    </button>
  );
}
