
import React, { useState, useEffect, useMemo } from 'react';
import { Sector, ChecklistType, TaskStatus, ChecklistTask, DailyData, ReportEntry } from './types';
import { INITIAL_SECTORS, getInitialSectors } from './constants';
import { supabase } from './supabaseClient';
import SectorCard from './components/SectorCard';
import ChecklistItem from './components/ChecklistItem';
import ReportsDashboard from './components/ReportsDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Home, ClipboardList, Settings, User, ChevronLeft, ChevronRight, CheckCircle2, LogOut } from 'lucide-react';

/* ────── Tokens de design ────── */
const C = {
  bg: '#F1F5F9',
  bgDark: '#0F172A',
  surface: '#FFFFFF',
  surfaceDark: '#1E293B',
  surfaceHover: '#F8FAFC',
  surfaceHoverDark: '#334155',
  border: '#E2E8F0',
  borderDark: '#334155',
  borderStrong: '#CBD5E1',
  borderStrongDark: '#475569',
  violet: '#6D28D9',
  violetLight: '#8B5CF6',
  amber: '#D97706',
  amberLight: '#F59E0B',
  text: '#0F172A',
  textDark: '#F8FAFC',
  textMuted: '#475569',
  textMutedDark: '#94A3B8',
  textFaint: '#94A3B8',
  textFaintDark: '#64748B',
};

/* ────── Input estilizado ────── */
const DarkInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold outline-none focus:border-violet-500 transition-all placeholder:text-slate-400"
  />
);

const DarkTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-bold outline-none focus:border-violet-500 transition-all resize-none placeholder:text-slate-400"
  />
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('vbq_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [currentView, setCurrentView] = useState<'home' | 'reports' | 'settings'>('home');
  const [currentDate, setCurrentDate] = useState(() => new Date().toLocaleDateString('en-CA'));
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ChecklistType>(ChecklistType.OPENING);
  const [dailyHistory, setDailyHistory] = useState<DailyData>({});
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [errorName, setErrorName] = useState(false);

  const addLog = (msg: string) => {
    console.log(msg);
    setDebugLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [newSector, setNewSector] = useState({ name: '', icon: '📁' });

  const [settingsSectorId, setSettingsSectorId] = useState<string | null>(null);
  const [settingsType, setSettingsType] = useState<ChecklistType>(ChecklistType.OPENING);
  const [isAddingSettingsTask, setIsAddingSettingsTask] = useState(false);
  const [newSettingsTask, setNewSettingsTask] = useState({ title: '', description: '' });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState({ title: '', description: '' });

  const [baseSectors, setBaseSectors] = useState<Sector[]>(INITIAL_SECTORS);

  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [responsibleName, setResponsibleName] = useState('');
  const [sectorObs, setSectorObs] = useState('');

  const SENHA = '20262';
  const [autenticado, setAutenticado] = useState(false);
  const [senhaModal, setSenhaModal] = useState<null | 'reports' | 'settings'>(null);
  const [senhaInput, setSenhaInput] = useState('');
  const [senhaErro, setSenhaErro] = useState(false);

  useEffect(() => {
    localStorage.setItem('vbq_theme', darkMode ? 'dark' : 'theme-light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const pedirSenha = (destino: 'reports' | 'settings') => {
    if (autenticado) {
      setCurrentView(destino);
      setSelectedSectorId(null);
    } else {
      setSenhaModal(destino);
      setSenhaInput('');
    }
  };

  const confirmarSenha = () => {
    if (senhaInput === SENHA) {
      setAutenticado(true);
      const destino = senhaModal!;
      setSenhaModal(null);
      setCurrentView(destino);
      setSelectedSectorId(null);
    } else {
      setSenhaErro(true);
    }
  };

  const handleFinalize = async () => {
    if (!responsibleName.trim()) {
      setErrorName(true);
      alert("⚠️ Por favor, insira o nome do responsável.");
      return;
    }

    const finalizedAt = Date.now();
    updateHistory(sectors.map(s => s.id !== selectedSectorId ? s : {
      ...s,
      employeeName: { ...s.employeeName, [activeType]: responsibleName },
      observations: { ...s.observations, [activeType]: sectorObs },
      finalizedAt: { ...s.finalizedAt, [activeType]: finalizedAt }
    }));

    try {
      await supabase.from('checklists').upsert({
        date: currentDate,
        sector_id: selectedSectorId,
        type: activeType,
        employee_name: responsibleName,
        observations: sectorObs,
        finalized_at: new Date(finalizedAt).toISOString()
      }, { onConflict: 'date,sector_id,type' });
    } catch (err) {
      console.error("Erro no Supabase:", err);
    }

    setShowFinalizeModal(false);
    setSelectedSectorId(null);
    setTimeout(() => setCurrentView('reports'), 300);
  };

  const sectors = useMemo(() => dailyHistory[currentDate] || baseSectors.map(s => ({ ...s })), [dailyHistory, currentDate, baseSectors]);

  const loadData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setLoadError(null);
    try {
      addLog("🔍 Conectando ao Banco...");
      const { data: dbSectors, error: sectorError } = await supabase.from('sectors').select('*');
      if (sectorError) throw sectorError;
      addLog(`✅ Setores: ${dbSectors?.length || 0}`);

      let currentTemplate = getInitialSectors();
      if (Array.isArray(dbSectors)) {
        dbSectors.forEach((ds: any) => {
          if (!currentTemplate.find(s => s.id === ds.id)) {
            currentTemplate.push({
              id: ds.id, name: ds.name, icon: ds.icon,
              employeeName: {}, observations: {}, finalizedAt: {},
              tasks: { [ChecklistType.OPENING]: [], [ChecklistType.CLOSING]: [] }
            });
          }
        });
      }
      setBaseSectors(currentTemplate);

      addLog("📖 Carregando Checklists...");
      const { data: dbChecklists, error: checklistError } = await supabase.from('checklists').select('*, tasks:checklist_tasks(*)');
      if (checklistError) throw checklistError;
      addLog(`✅ Relatos: ${dbChecklists?.length || 0}`);

      if (Array.isArray(dbChecklists)) {
        const history: DailyData = {};
        dbChecklists.forEach(cl => {
          const date = cl.date;
          if (!history[date]) history[date] = currentTemplate.map(s => ({ ...s, employeeName: { ...s.employeeName }, observations: { ...s.observations }, finalizedAt: { ...s.finalizedAt }, tasks: { [ChecklistType.OPENING]: [...s.tasks[ChecklistType.OPENING]], [ChecklistType.CLOSING]: [...s.tasks[ChecklistType.CLOSING]] } }));
          const sIdx = history[date].findIndex(s => s.id === cl.sector_id);
          if (sIdx !== -1) {
            const s = history[date][sIdx];
            const type = cl.type as ChecklistType;
            s.employeeName[type] = cl.employee_name || '';
            s.observations[type] = cl.observations || '';
            s.finalizedAt[type] = cl.finalized_at ? new Date(cl.finalized_at).getTime() : undefined;
            if (Array.isArray(cl.tasks)) {
              cl.tasks.forEach((t: any) => {
                const taskIdx = s.tasks[type].findIndex((templ: any) => templ.id === t.task_id);
                if (taskIdx !== -1) {
                  s.tasks[type][taskIdx] = {
                    ...s.tasks[type][taskIdx],
                    status: t.status,
                    photoUrl: t.photo_url,
                    verificationMessage: t.verification_message,
                  };
                }
              });
            }
          }
        });
        setDailyHistory(history);
      }
      addLog("🚀 Sincronizado!");
    } catch (err: any) {
      console.error("Erro no carregamento inicial:", err);
      const msg = err.message || "Erro de conexão";
      addLog(`❌ Erro Load: ${msg}`);
      setLoadError(msg);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();

    // Configurar Realtime
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklists' }, () => {
        addLog("🔔 Atualização: Checklist");
        loadData(true);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_tasks' }, () => {
        addLog("🔔 Atualização: Tarefa");
        loadData(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateHistory = (newSectors: Sector[]) => setDailyHistory(prev => ({ ...prev, [currentDate]: newSectors }));

  const handleUpdateTask = async (sectorId: string, type: ChecklistType, updatedTask: ChecklistTask) => {
    updateHistory(sectors.map(s => s.id !== sectorId ? s : { ...s, tasks: { ...s.tasks, [type]: s.tasks[type].map(t => t.id === updatedTask.id ? updatedTask : t) } }));
    setIsSaving(true);
    try {
      addLog(`Salvando ${updatedTask.title}...`);
      // 1. Upsert do checklist pai
      const { data: clArr, error: clErr } = await supabase.from('checklists').upsert({ date: currentDate, sector_id: sectorId, type }, { onConflict: 'date,sector_id,type' }).select();

      if (clErr) throw clErr;

      let cl = clArr?.[0];
      if (!cl) {
        // Fallback: Busca via select padrão
        const { data: existing, error: findErr } = await supabase
          .from('checklists')
          .select('*')
          .eq('date', currentDate)
          .eq('sector_id', sectorId)
          .eq('type', type) // FIXED: used type instead of activeType
          .maybeSingle();

        if (findErr) throw findErr;
        cl = existing;
      }

      if (cl) {
        const { error: tErr } = await supabase.from('checklist_tasks').upsert({
          checklist_id: cl.id,
          task_id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          photo_url: updatedTask.photoUrl,
          verification_message: updatedTask.verificationMessage,
          last_updated: new Date().toISOString()
        }, { onConflict: 'checklist_id,task_id' });
        if (tErr) throw tErr;
        addLog("✅ Salvo com sucesso!");
      } else {
        throw new Error("Não foi possível obter o ID do checklist.");
      }
    } catch (e: any) {
      console.error("Erro ao salvar tarefa:", e);
      const errorMsg = e.message || "Erro desconhecido";
      const detail = e.details || "";
      addLog(`❌ Erro: ${errorMsg}`);
      setLoadError(`Falha ao salvar: ${errorMsg} ${detail}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSector = async () => {
    if (!newSector.name.trim()) return;
    const s: Sector = { id: `s-${Date.now()}`, name: newSector.name, icon: newSector.icon, employeeName: {}, observations: {}, finalizedAt: {}, tasks: { [ChecklistType.OPENING]: [], [ChecklistType.CLOSING]: [] } };
    setBaseSectors(p => [...p, s]);
    setIsAddingSector(false);
    await supabase.from('sectors').insert({ id: s.id, name: s.name, icon: s.icon });
  };

  const handleAddTask = () => {
    if (!selectedSectorId || !newTask.title.trim()) return;
    updateHistory(sectors.map(s => s.id !== selectedSectorId ? s : { ...s, tasks: { ...s.tasks, [activeType]: [...s.tasks[activeType], { id: `t-${Date.now()}`, title: newTask.title, description: newTask.description, status: TaskStatus.PENDING }] } }));
    setIsAddingTask(false);
  };

  const handleAddSettingsTask = () => {
    if (!settingsSectorId || !newSettingsTask.title.trim()) return;
    updateHistory(sectors.map(s => s.id !== settingsSectorId ? s : { ...s, tasks: { ...s.tasks, [settingsType]: [...s.tasks[settingsType], { id: `t-${Date.now()}`, title: newSettingsTask.title, description: newSettingsTask.description, status: TaskStatus.PENDING }] } }));
    setNewSettingsTask({ title: '', description: '' });
    setIsAddingSettingsTask(false);
  };

  const handleSaveEditTask = () => {
    if (!settingsSectorId || !editingTaskId) return;
    updateHistory(sectors.map(s => s.id !== settingsSectorId ? s : { ...s, tasks: { ...s.tasks, [settingsType]: s.tasks[settingsType].map(t => t.id === editingTaskId ? { ...t, ...editingTaskData } : t) } }));
    setEditingTaskId(null);
  };

  const handleDeleteSettingsTask = (id: string) => {
    if (!settingsSectorId) return;
    updateHistory(sectors.map(s => s.id !== settingsSectorId ? s : { ...s, tasks: { ...s.tasks, [settingsType]: s.tasks[settingsType].filter(t => t.id !== id) } }));
  };

  const handleDeleteSector = async (id: string) => {
    if (!confirm('Excluir setor?')) return;
    setBaseSectors(p => p.filter(s => s.id !== id));
    await supabase.from('sectors').delete().eq('id', id);
  };

  const handleReopenReport = async (date: string, sId: string, type: ChecklistType) => {
    const sAtDate = dailyHistory[date];
    if (!sAtDate) return;
    setDailyHistory(prev => ({ ...prev, [date]: sAtDate.map(s => s.id !== sId ? s : { ...s, finalizedAt: { ...s.finalizedAt, [type]: undefined } }) }));
    await supabase.from('checklists').update({ finalized_at: null }).match({ date, sector_id: sId, type });
  };

  const changeDate = (n: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + n);
    setCurrentDate(d.toISOString().split('T')[0]);
    setSelectedSectorId(null);
  };

  const sectorsToShow = useMemo(() => sectors.filter(s => !s.finalizedAt[activeType]), [sectors, activeType]);
  const selectedSector = useMemo(() => sectors.find(s => s.id === selectedSectorId), [sectors, selectedSectorId]);
  const settingsSector = useMemo(() => sectors.find(s => s.id === settingsSectorId), [sectors, settingsSectorId]);

  const allFinalizedReports = useMemo((): ReportEntry[] => {
    const reports: ReportEntry[] = [];
    Object.entries(dailyHistory).forEach(([date, sl]) => {
      sl.forEach(s => {
        [ChecklistType.OPENING, ChecklistType.CLOSING].forEach(type => {
          // Mostra relatórios finalizados OU em progresso se houver tarefas marcadas
          const hasTasks = s.tasks[type].some(t => t.status !== TaskStatus.PENDING);
          if (s.finalizedAt[type] || hasTasks) {
            reports.push({
              date,
              sectorId: s.id,
              sectorName: s.name,
              sectorIcon: s.icon,
              type,
              employeeName: s.employeeName[type] || (s.finalizedAt[type] ? '' : 'Em andamento...'),
              observations: s.observations[type] || '',
              finalizedAt: s.finalizedAt[type] || new Date(date).getTime(),
              tasks: s.tasks[type]
            });
          }
        });
      });
    });
    return reports.sort((a, b) => b.finalizedAt - a.finalizedAt);
  }, [dailyHistory]);

  const TypeSwitch = ({ value, onChange }: { value: ChecklistType; onChange: (t: ChecklistType) => void }) => (
    <div className="flex gap-2 p-1.5 rounded-[18px] bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
      {[{ v: ChecklistType.OPENING, l: '🌅 Abertura' }, { v: ChecklistType.CLOSING, l: '🌙 Fechamento' }].map(({ v, l }) => (
        <button key={v} onClick={() => onChange(v)} className={`flex-1 py-3 rounded-[14px] text-xs font-black uppercase transition-all ${value === v ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500'}`}>{l}</button>
      ))}
    </div>
  );

  return (
    <div className={darkMode ? 'dark' : ''} style={{ maxWidth: 600, margin: '0 auto', minHeight: '100vh', background: darkMode ? C.bgDark : C.bg, fontFamily: "'Space Grotesk', sans-serif" }}>
      <header className="sticky top-0 z-50 p-6 bg-white dark:bg-slate-900 border-b-2 border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 overflow-hidden shadow-lg border-2 border-white dark:border-slate-700">
              <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black dark:text-white leading-tight">VBQ</h1>
              <p className="text-[10px] font-black tracking-widest text-[#8b5cf6] uppercase">Samambaia</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className={`w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-violet-500 shadow-sm border-2 border-slate-100 dark:border-slate-700 transition-all ${isRefreshing ? 'animate-spin opacity-50' : 'active:scale-90 hover:border-violet-200'}`}
            >
              <ClipboardList size={20} />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-violet-500 dark:text-yellow-400 transition-transform active:scale-90 shadow-sm border-2 border-transparent dark:border-slate-700">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 px-1 flex-wrap">
          {import.meta.env.VITE_SUPABASE_URL ? (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${loadError ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
              <div className={`w-2 h-2 rounded-full ${loadError ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              {loadError ? 'Erro de Sincronia' : 'Cloud Sync Ativo'}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-[9px] font-black tracking-widest uppercase text-amber-600">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              Modo Local (Offline)
            </div>
          )}
          {isSaving && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-violet-50 rounded-full text-[9px] font-black tracking-widest uppercase text-violet-600 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              Salvando...
            </div>
          )}
        </div>

        {debugLogs.length > 0 && (
          <div className="mb-4 p-3 bg-slate-900 rounded-xl font-mono text-[8px] text-emerald-400 overflow-hidden">
            <p className="border-b border-white/10 mb-1 pb-1 opacity-50 uppercase tracking-widest">Debug Console</p>
            {debugLogs.map((log, i) => <div key={i} className={log.includes('❌') ? 'text-red-400' : ''}>{log}</div>)}
          </div>
        )}

        {currentView === 'home' && (
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
            <button onClick={() => changeDate(-1)} className="p-2 text-slate-400"><ChevronLeft size={24} strokeWidth={3} /></button>
            <div className="text-center">
              <p className="font-black text-slate-800 dark:text-white leading-tight">{new Date(currentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}</p>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{new Date(currentDate).toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
            </div>
            <button onClick={() => changeDate(1)} className="p-2 text-slate-400"><ChevronRight size={24} strokeWidth={3} /></button>
          </div>
        )}
      </header>

      <main className="p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
              <p className="text-xs font-black text-violet-600 animate-pulse tracking-widest">SINCRONIZANDO...</p>
              {loadError && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-100 rounded-2xl text-center">
                  <p className="text-red-500 font-bold text-xs uppercase tracking-widest mb-1">Erro de Conexão</p>
                  <p className="text-red-400 text-[10px] font-medium leading-tight">{loadError}</p>
                  <p className="text-slate-400 text-[9px] mt-2">Verifique as variáveis de ambiente na Vercel.</p>
                </div>
              )}
            </motion.div>
          ) : currentView === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              {!selectedSectorId ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-3xl font-black dark:text-white leading-tight">Painel Operacional</h2>
                    <p className="text-slate-400 font-bold text-sm">Escolha um setor para conferência</p>
                  </div>
                  <TypeSwitch value={activeType} onChange={setActiveType} />
                  <div className="grid grid-cols-1 gap-4">
                    {sectorsToShow.length === 0 ? (
                      <div className="py-16 bg-white dark:bg-slate-800 rounded-[32px] border-4 border-dashed border-slate-100 dark:border-slate-700 text-center">
                        <div className="text-5xl mb-4 text-violet-500">✨</div>
                        <h3 className="font-black dark:text-white uppercase mb-1">Missão Cumprida</h3>
                        <p className="text-slate-400 text-sm font-bold">Todos os setores finalizados hoje.</p>
                      </div>
                    ) : (
                      sectorsToShow.map(s => <SectorCard key={s.id} sector={s} type={activeType} onClick={() => setSelectedSectorId(s.id)} darkMode={darkMode} />)
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-6 pb-20">
                  <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setSelectedSectorId(null)} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center border-2 border-slate-100 dark:border-slate-700 shadow-sm"><ChevronLeft size={24} strokeWidth={3} className="text-slate-500" /></button>
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-3xl border-2 border-slate-200 dark:border-slate-700">{selectedSector?.icon}</div>
                    <div>
                      <h2 className="text-2xl font-black dark:text-white leading-tight">{selectedSector?.name}</h2>
                      <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest">{activeType === ChecklistType.OPENING ? '🌅 ABERTURA' : '🌙 FECHAMENTO'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {selectedSector?.tasks[activeType].map(t => (
                      <ChecklistItem key={t.id} task={t} onUpdate={(u) => handleUpdateTask(selectedSectorId, activeType, u)} darkMode={darkMode} />
                    ))}
                  </div>
                  <button onClick={() => { setResponsibleName(selectedSector?.employeeName[activeType] || ''); setSectorObs(selectedSector?.observations[activeType] || ''); setShowFinalizeModal(true); }} className="w-full py-6 rounded-3xl bg-violet-600 text-white font-black text-lg shadow-xl shadow-violet-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <CheckCircle2 size={24} strokeWidth={3} /> FINALIZAR CHECKLIST
                  </button>
                </div>
              )}
            </motion.div>
          ) : currentView === 'reports' ? (
            <motion.div key="reports" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <ReportsDashboard reports={allFinalizedReports} onReopenReport={handleReopenReport} darkMode={darkMode} />
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="mb-4">
                <h2 className="text-2xl font-black dark:text-white leading-tight">Ajustes</h2>
                <p className="text-slate-400 font-bold text-sm">Configuração de setores e tarefas</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {baseSectors.map(s => (
                  <div key={s.id} onClick={() => setSettingsSectorId(s.id)} className={`p-5 rounded-3xl border-2 flex justify-between items-center transition-all ${settingsSectorId === s.id ? 'bg-violet-600 border-violet-500 shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{s.icon}</span>
                      <span className={`font-black ${settingsSectorId === s.id ? 'text-white' : 'dark:text-white'}`}>{s.name}</span>
                    </div>
                    {settingsSectorId !== s.id && <button onClick={(e) => { e.stopPropagation(); handleDeleteSector(s.id); }} className="text-red-400 p-2"><LogOut size={20} /></button>}
                  </div>
                ))}
                <button onClick={() => setIsAddingSector(true)} className="py-5 bg-slate-200 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 font-black text-slate-500 tracking-widest">+ NOVO SETOR</button>
              </div>
              {settingsSectorId && (
                <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-100 dark:border-slate-700 shadow-lg space-y-6">
                  <h4 className="font-black text-center dark:text-white uppercase tracking-widest text-sm">Tarefas: {settingsSector?.name}</h4>
                  <TypeSwitch value={settingsType} onChange={setSettingsType} />
                  <div className="space-y-4">
                    {settingsSector?.tasks[settingsType].map((t) => (
                      <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl border-2 border-slate-100 dark:border-slate-600 flex justify-between items-center">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{t.title}</span>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteSettingsTask(t.id)} className="text-red-400"><LogOut size={16} /></button>
                        </div>
                      </div>
                    ))}
                    {isAddingSettingsTask ? (
                      <div className="space-y-4 p-4 border-2 border-dashed border-violet-300 rounded-2xl">
                        <DarkInput value={newSettingsTask.title} onChange={e => setNewSettingsTask({ ...newSettingsTask, title: e.target.value })} placeholder="Título..." />
                        <button onClick={handleAddSettingsTask} className="w-full py-3 bg-violet-600 text-white font-black rounded-xl">ADICIONAR</button>
                      </div>
                    ) : <button onClick={() => setIsAddingSettingsTask(true)} className="w-full py-4 bg-violet-100 dark:bg-violet-900/30 text-violet-600 font-black rounded-2xl">+ ADICIONAR TAREFA</button>}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[552px] h-[84px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-2xl flex items-center justify-around z-[100]">
        {[
          { k: 'home', i: <Home />, l: 'Início', p: false },
          { k: 'reports', i: <ClipboardList />, l: 'Histórico', p: true },
          { k: 'settings', i: <Settings />, l: 'Ajustes', p: true }
        ].map(n => (
          <button key={n.k} onClick={() => n.p ? pedirSenha(n.k as any) : (setCurrentView('home'), setSelectedSectorId(null))} className="flex flex-col items-center gap-1 group">
            <div className={`p-2.5 rounded-2xl transition-all ${currentView === n.k ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 opacity-60'}`}>{n.i}</div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${currentView === n.k ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`}>{n.l}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {showFinalizeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] p-8 border-4 border-violet-500 shadow-2xl">
              <h3 className="text-2xl font-black mb-2 dark:text-white">CONCLUIR</h3>
              <p className="text-slate-400 font-bold mb-6 italic border-l-4 border-violet-500 pl-4 uppercase text-xs tracking-widest">Identifique-se para salvar o relatório</p>
              <div className="space-y-6">
                <DarkInput value={responsibleName} onChange={e => setResponsibleName(e.target.value)} placeholder="Seu Nome..." />
                <DarkTextarea value={sectorObs} onChange={e => setSectorObs(e.target.value)} placeholder="Observações (opcional)..." style={{ height: 100 }} />
                <div className="flex gap-3">
                  <button onClick={() => setShowFinalizeModal(false)} className="flex-1 py-4 font-black rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500">CANCELAR</button>
                  <button onClick={handleFinalize} className="flex-1.5 py-4 font-black rounded-2xl bg-violet-600 text-white" style={{ flex: 1.5 }}>ENVIAR</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {senhaModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-[32px] p-8 border-4 border-violet-500 shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6"><Settings className="text-violet-500" size={32} /></div>
              <h3 className="text-center font-black dark:text-white text-xl uppercase mb-8">ÁREA RESTRITA</h3>
              <DarkInput type="password" value={senhaInput} onChange={e => setSenhaInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmarSenha()} placeholder="SENHA..." style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: 20 }} />
              {senhaErro && <p className="text-center text-red-500 text-xs font-black mt-4 animate-bounce">SENHA INCORRETA!</p>}
              <button onClick={confirmarSenha} className="w-full mt-8 py-4 bg-violet-600 text-white font-black rounded-2xl shadow-lg">ENTRAR</button>
              <button onClick={() => setSenhaModal(null)} className="w-full mt-2 py-4 text-slate-400 font-bold">FECHAR</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        body { background: ${darkMode ? C.bgDark : C.bg}; overflow-x: hidden; }
        .dark body { background: ${C.bgDark}; }
        main { position: relative; width: 100%; overflow-x: hidden; }
        * { -webkit-tap-highlight-color: transparent; outline: none; }
      `}</style>
    </div>
  );
};

export default App;
