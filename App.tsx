
import React, { useState, useEffect, useMemo } from 'react';
import { Sector, ChecklistType, TaskStatus, ChecklistTask, DailyData, ReportEntry } from './types';
import { INITIAL_SECTORS, getInitialSectors } from './constants';
import { supabase } from './supabaseClient';
import SectorCard from './components/SectorCard';
import ChecklistItem from './components/ChecklistItem';
import ReportsDashboard from './components/ReportsDashboard';

/* ────── Tokens de design ────── */
const C = {
  bg: '#F1F5F9', // Light gray background
  surface: '#FFFFFF', // Pure white surface
  surfaceHover: '#F8FAFC',
  border: '#E2E8F0', // Clear gray border
  borderStrong: '#CBD5E1',
  violet: '#6D28D9', // Deeper violet for light mode
  violetLight: '#8B5CF6',
  amber: '#D97706',
  amberLight: '#F59E0B',
  text: '#0F172A', // Deep slate for text (near black)
  textMuted: '#475569',
  textFaint: '#94A3B8',
};

const glass = (extra = ''): React.CSSProperties => ({
  background: C.surface,
  border: `1px solid ${C.border}`,
  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
});

/* ────── Componente de ícones SVG inline ────── */
const Icon = {
  home: (filled: boolean) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? C.violetLight : 'none'} stroke={filled ? C.violetLight : C.textFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  reports: (filled: boolean) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? C.violetLight : 'none'} stroke={filled ? C.violetLight : C.textFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="m9 16 2 2 4-4" />
    </svg>
  ),
  settings: (active: boolean) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? C.violetLight : C.textFaint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

/* ────── Input estilizado ────── */
const DarkInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    style={{
      width: '100%', padding: '16px 20px',
      background: '#F8FAFC',
      border: `2px solid ${C.borderStrong}`,
      borderRadius: 16, fontSize: 16,
      color: C.text, fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, outline: 'none',
      ...props.style,
    }}
  />
);

const DarkTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    style={{
      width: '100%', padding: '16px 20px',
      background: '#F8FAFC',
      border: `2px solid ${C.borderStrong}`,
      borderRadius: 16, fontSize: 16,
      color: C.text, fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700, outline: 'none', resize: 'none',
      ...props.style,
    }}
  />
);

/* ════════════════ APP ════════════════ */
const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'reports' | 'settings'>('home');
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ChecklistType>(ChecklistType.OPENING);
  const [dailyHistory, setDailyHistory] = useState<DailyData>({});
  const [loading, setLoading] = useState(true);
  const [errorName, setErrorName] = useState(false);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [newSector, setNewSector] = useState({ name: '', icon: '📁' });

  // Ajustes
  const [settingsSectorId, setSettingsSectorId] = useState<string | null>(null);
  const [settingsType, setSettingsType] = useState<ChecklistType>(ChecklistType.OPENING);
  const [isAddingSettingsTask, setIsAddingSettingsTask] = useState(false);
  const [newSettingsTask, setNewSettingsTask] = useState({ title: '', description: '' });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState({ title: '', description: '' });

  // Modal de finalização
  const [showFinalizeModal, setShowFinalizeModal] = useState(false);
  const [responsibleName, setResponsibleName] = useState('');
  const [sectorObs, setSectorObs] = useState('');

  // Autenticação
  const SENHA = '20262';
  const [autenticado, setAutenticado] = useState(false);
  const [senhaModal, setSenhaModal] = useState<null | 'reports' | 'settings'>(null);
  const [senhaInput, setSenhaInput] = useState('');
  const [senhaErro, setSenhaErro] = useState(false);

  const pedirSenha = (destino: 'reports' | 'settings') => {
    if (autenticado) {
      setCurrentView(destino);
      setSelectedSectorId(null);
      if (destino === 'settings') { setSettingsSectorId(null); setIsAddingSettingsTask(false); setEditingTaskId(null); }
    } else {
      setSenhaModal(destino);
      setSenhaInput('');
      setSenhaErro(false);
    }
  };

  const confirmarSenha = () => {
    if (senhaInput === SENHA) {
      setAutenticado(true);
      const destino = senhaModal!;
      setSenhaModal(null);
      setSenhaInput('');
      setCurrentView(destino);
      setSelectedSectorId(null);
      if (destino === 'settings') { setSettingsSectorId(null); setIsAddingSettingsTask(false); setEditingTaskId(null); }
    } else {
      setSenhaErro(true);
      setSenhaInput('');
    }
  };

  const handleFinalize = () => {
    if (!responsibleName.trim()) {
      setErrorName(true);
      alert("⚠️ Por favor, insira o nome do responsável.");
      return;
    }

    // Atualiza tudo em uma única chamada para evitar race conditions de estado do React
    const finalizedAt = Date.now();
    updateHistory(sectors.map(s => s.id !== selectedSectorId ? s : {
      ...s,
      employeeName: { ...s.employeeName, [activeType]: responsibleName },
      observations: { ...s.observations, [activeType]: sectorObs },
      finalizedAt: { ...s.finalizedAt, [activeType]: finalizedAt }
    }));

    // Sincronizar com Supabase
    const syncFinalize = async () => {
      try {
        await supabase
          .from('checklists')
          .upsert({
            date: currentDate,
            sector_id: selectedSectorId,
            type: activeType,
            employee_name: responsibleName,
            observations: sectorObs,
            finalized_at: new Date(finalizedAt).toISOString()
          }, { onConflict: 'date,sector_id,type' });
      } catch (err) {
        console.error("Erro ao finalizar no Supabase:", err);
      }
    };
    syncFinalize();

    setShowFinalizeModal(false);
    setSelectedSectorId(null);
    setResponsibleName('');
    setSectorObs('');
    setTimeout(() => setCurrentView('reports'), 300);
  };

  const sectors = useMemo(() => {
    return dailyHistory[currentDate] || getInitialSectors();
  }, [dailyHistory, currentDate]);

  // Carregamento inicial do Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        // Buscar checklists e tarefas
        const { data: dbChecklists, error: clError } = await supabase
          .from('checklists')
          .select('*, tasks:checklist_tasks(*)');

        if (clError) throw clError;

        if (dbChecklists && dbChecklists.length > 0) {
          const history: DailyData = {};

          dbChecklists.forEach(cl => {
            const date = cl.date;
            if (!history[date]) history[date] = getInitialSectors();

            const sectorIndex = history[date].findIndex(s => s.id === cl.sector_id);
            if (sectorIndex !== -1) {
              const sector = history[date][sectorIndex];
              const type = cl.type as ChecklistType;

              sector.employeeName[type] = cl.employee_name || '';
              sector.observations[type] = cl.observations || '';
              sector.finalizedAt[type] = cl.finalized_at ? new Date(cl.finalized_at).getTime() : undefined;

              if (cl.tasks && cl.tasks.length > 0) {
                // Mapear tarefas do DB para o formato do app
                const dbTasks: ChecklistTask[] = cl.tasks.map((t: any) => ({
                  id: t.task_id,
                  title: t.title,
                  description: t.description,
                  status: t.status as TaskStatus,
                  photoUrl: t.photo_url,
                  verificationMessage: t.verification_message,
                  lastUpdated: new Date(t.last_updated).getTime()
                }));

                // Mesclar/Substituir tarefas (preservando as que não estão no DB se houver)
                sector.tasks[type] = dbTasks;
              }
            }
          });

          setDailyHistory(history);
        } else {
          // Se não houver nada no cloud, tentar migrar local
          const saved = localStorage.getItem('checklist_history_v2');
          if (saved) {
            const localHistory: DailyData = JSON.parse(saved);
            setDailyHistory(localHistory);

            // Migrar para o Supabase (opcional, mas recomendado)
            const migrate = async () => {
              for (const [date, sectors] of Object.entries(localHistory)) {
                for (const sector of sectors) {
                  for (const type of [ChecklistType.OPENING, ChecklistType.CLOSING]) {
                    if (sector.finalizedAt[type]) {
                      await supabase.from('checklists').upsert({
                        date,
                        sector_id: sector.id,
                        type,
                        employee_name: sector.employeeName[type] || '',
                        observations: sector.observations[type] || '',
                        finalized_at: new Date(sector.finalizedAt[type]!).toISOString()
                      });

                      // Opcional: Migrar tarefas (pode ser pesado, vamos focar em checklists por enquanto)
                    }
                  }
                }
              }
            };
            migrate();
          }
        }
      } catch (err) {
        console.error("Erro ao carregar Supabase:", err);
        // Fallback para local se der erro
        const saved = localStorage.getItem('checklist_history_v2');
        if (saved) setDailyHistory(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Sync to local storage only as backup
  useEffect(() => {
    if (Object.keys(dailyHistory).length > 0) {
      localStorage.setItem('checklist_history_v2', JSON.stringify(dailyHistory));
    }
  }, [dailyHistory]);

  // Injeta/sincroniza setores automaticamente (novos setores e tarefas atualizadas)
  useEffect(() => {
    // Par de [sectorId, prefixo antigo de ID a ser substituído]
    const syncMap: Array<{ id: string; oldPrefix?: string }> = [
      { id: 'kitchen' },
      { id: 'sushi' },
      { id: 'pizzaria' },
      { id: 'salon', oldPrefix: 's-o-' }, // prefixo antigo; novas tarefas usam 'sl-o-'
      { id: 'bar', oldPrefix: 'b-o-' }, // prefixo antigo; novas tarefas usam 'br-o-'
    ];

    setDailyHistory((prev: DailyData) => {
      if (Object.keys(prev).length === 0) return prev;

      let changed = false;
      const updated: DailyData = {};

      (Object.entries(prev) as [string, Sector[]][]).forEach(([date, sectorsList]) => {
        let list = [...sectorsList];

        syncMap.forEach(({ id: sectorId, oldPrefix }) => {
          const template = INITIAL_SECTORS.find(s => s.id === sectorId);
          if (!template) return;

          const existing = list.find((s: Sector) => s.id === sectorId);
          if (!existing) {
            // Setor não existe: adicionar completo
            list = [...list, { ...template, employeeName: {}, observations: {}, finalizedAt: {} }];
            changed = true;
          } else {
            // Verificar se as tarefas estão desatualizadas
            const openingOutdated = oldPrefix && existing.tasks[ChecklistType.OPENING].some(t => t.id.startsWith(oldPrefix));
            const closingEmpty = existing.tasks[ChecklistType.CLOSING].length === 0 && template.tasks[ChecklistType.CLOSING].length > 0;

            // Caso especial para COZINHA: se for a versão antiga com muito poucas tarefas (ex: 3), forçar atualização
            const kitchenOutdated = sectorId === 'kitchen' && existing.tasks[ChecklistType.OPENING].length <= 3;

            if (openingOutdated || closingEmpty || kitchenOutdated) {
              list = list.map((s: Sector) =>
                s.id !== sectorId ? s : {
                  ...s,
                  employeeName: {
                    ...s.employeeName,
                    [ChecklistType.OPENING]: (openingOutdated || kitchenOutdated) ? '' : s.employeeName[ChecklistType.OPENING],
                    [ChecklistType.CLOSING]: (openingOutdated || closingEmpty || kitchenOutdated) ? '' : s.employeeName[ChecklistType.CLOSING],
                  },
                  finalizedAt: {
                    ...s.finalizedAt,
                    [ChecklistType.OPENING]: (openingOutdated || kitchenOutdated) ? undefined : s.finalizedAt[ChecklistType.OPENING],
                    [ChecklistType.CLOSING]: (openingOutdated || closingEmpty || kitchenOutdated) ? undefined : s.finalizedAt[ChecklistType.CLOSING],
                  },
                  tasks: {
                    [ChecklistType.OPENING]: (openingOutdated || kitchenOutdated)
                      ? template.tasks[ChecklistType.OPENING].map(t => ({ ...t, status: TaskStatus.PENDING }))
                      : s.tasks[ChecklistType.OPENING],
                    [ChecklistType.CLOSING]: (openingOutdated || closingEmpty || kitchenOutdated)
                      ? template.tasks[ChecklistType.CLOSING].map(t => ({ ...t, status: TaskStatus.PENDING }))
                      : s.tasks[ChecklistType.CLOSING],
                  }
                }
              );
              changed = true;
            }
          }
        });

        updated[date] = list;
      });

      return changed ? updated : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]); // Rodar quando o carregamento inicial terminar





  const selectedSector = sectors.find(s => s.id === selectedSectorId);
  const settingsSector = sectors.find(s => s.id === settingsSectorId);

  const updateHistory = (newSectors: Sector[]) => {
    setDailyHistory(prev => ({ ...prev, [currentDate]: newSectors }));
  };

  const handleUpdateSectorInfo = (sectorId: string, field: 'employeeName' | 'observations', value: string) => {
    if (field === 'employeeName' && value.trim() !== '') setErrorName(false);
    updateHistory(sectors.map(s => s.id !== sectorId ? s : { ...s, [field]: { ...s[field], [activeType]: value } }));

    // Sincronizar metadados do checklist
    const syncInfo = async () => {
      await supabase.from('checklists').upsert({
        date: currentDate,
        sector_id: sectorId,
        type: activeType,
        [field === 'employeeName' ? 'employee_name' : 'observations']: value
      }, { onConflict: 'date,sector_id,type' });
    };
    syncInfo();
  };


  const handleReopenReport = async (date: string, sectorId: string, type: ChecklistType) => {
    const sectorsAtDate = dailyHistory[date];
    if (!sectorsAtDate) return;
    const newSectors = sectorsAtDate.map(s => {
      if (s.id !== sectorId) return s;
      const updatedFinalizedAt = { ...s.finalizedAt };
      delete updatedFinalizedAt[type];
      return { ...s, finalizedAt: updatedFinalizedAt };
    });
    setDailyHistory(prev => ({ ...prev, [date]: newSectors }));

    // Sincronizar com Supabase (limpar data de finalização)
    await supabase
      .from('checklists')
      .update({ finalized_at: null })
      .match({ date, sector_id: sectorId, type });

    if (date === currentDate) {
      setCurrentView('home'); setActiveType(type); setSelectedSectorId(sectorId);
    } else {
      alert("Checklist reaberto no histórico.");
    }
  };

  const handleUpdateTask = async (sectorId: string, type: ChecklistType, updatedTask: ChecklistTask) => {
    updateHistory(sectors.map(s => s.id !== sectorId ? s : {
      ...s, tasks: { ...s.tasks, [type]: s.tasks[type].map(t => t.id === updatedTask.id ? updatedTask : t) }
    }));

    try {
      const { data: cl, error: clErr } = await supabase
        .from('checklists')
        .upsert({ date: currentDate, sector_id: sectorId, type }, { onConflict: 'date,sector_id,type' })
        .select()
        .single();

      if (clErr) throw clErr;

      await supabase.from('checklist_tasks').upsert({
        checklist_id: cl.id,
        task_id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        photo_url: updatedTask.photoUrl,
        verification_message: updatedTask.verificationMessage,
        last_updated: new Date().toISOString()
      }, { onConflict: 'checklist_id,task_id' });
    } catch (err) {
      console.error("Erro ao sincronizar tarefa:", err);
    }
  };

  const handleAddSector = async () => {
    if (!newSector.name.trim()) return;
    const sector: Sector = {
      id: `sector-${Date.now()}`, name: newSector.name, icon: newSector.icon,
      employeeName: {}, observations: {}, finalizedAt: {},
      tasks: { [ChecklistType.OPENING]: [], [ChecklistType.CLOSING]: [] }
    };
    updateHistory([...sectors, sector]);
    setNewSector({ name: '', icon: '📁' });
    setIsAddingSector(false);

    await supabase.from('sectors').insert({ id: sector.id, name: sector.name, icon: sector.icon });
  };

  const handleAddTask = () => {
    if (!selectedSectorId || !newTask.title.trim()) return;
    const task: ChecklistTask = { id: `task-${Date.now()}`, title: newTask.title, description: newTask.description, status: TaskStatus.PENDING };
    updateHistory(sectors.map(s => s.id !== selectedSectorId ? s : { ...s, tasks: { ...s.tasks, [activeType]: [...s.tasks[activeType], task] } }));
    setNewTask({ title: '', description: '' });
    setIsAddingTask(false);
  };

  const handleAddSettingsTask = () => {
    if (!settingsSectorId || !newSettingsTask.title.trim()) return;
    const task: ChecklistTask = { id: `task-${Date.now()}`, title: newSettingsTask.title, description: newSettingsTask.description, status: TaskStatus.PENDING };
    updateHistory(sectors.map(s => s.id !== settingsSectorId ? s : { ...s, tasks: { ...s.tasks, [settingsType]: [...s.tasks[settingsType], task] } }));
    setNewSettingsTask({ title: '', description: '' });
    setIsAddingSettingsTask(false);
  };

  const handleDeleteSettingsTask = async (taskId: string) => {
    if (!settingsSectorId) return;
    updateHistory(sectors.map(s => s.id !== settingsSectorId ? s : { ...s, tasks: { ...s.tasks, [settingsType]: s.tasks[settingsType].filter(t => t.id !== taskId) } }));

    // Sincronizar exclusão com Supabase
    try {
      const { data: cl } = await supabase
        .from('checklists')
        .select('id')
        .match({ date: currentDate, sector_id: settingsSectorId, type: settingsType })
        .single();

      if (cl) {
        await supabase.from('checklist_tasks').delete().match({ checklist_id: cl.id, task_id: taskId });
      }
    } catch (err) {
      console.error("Erro ao deletar tarefa no Supabase:", err);
    }
  };

  const handleSaveEditTask = async () => {
    if (!settingsSectorId || !editingTaskId || !editingTaskData.title.trim()) return;
    const updatedHistory = sectors.map(s => s.id !== settingsSectorId ? s : {
      ...s, tasks: { ...s.tasks, [settingsType]: s.tasks[settingsType].map(t => t.id === editingTaskId ? { ...t, ...editingTaskData } : t) }
    });
    updateHistory(updatedHistory);

    // Sincronizar edição com Supabase
    try {
      const { data: cl } = await supabase
        .from('checklists')
        .select('id')
        .match({ date: currentDate, sector_id: settingsSectorId, type: settingsType })
        .single();

      if (cl) {
        await supabase.from('checklist_tasks').update({
          title: editingTaskData.title,
          description: editingTaskData.description,
          last_updated: new Date().toISOString()
        }).match({ checklist_id: cl.id, task_id: editingTaskId });
      }
    } catch (err) {
      console.error("Erro ao salvar edição no Supabase:", err);
    }

    setEditingTaskId(null);
  };

  const handleDeleteSector = async (sectorId: string) => {
    if (!confirm('Excluir este setor?')) return;
    updateHistory(sectors.filter(s => s.id !== sectorId));
    setSettingsSectorId(null);

    // Sincronizar com Supabase
    await supabase.from('sectors').delete().eq('id', sectorId);
  };

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split('T')[0]);
    setSelectedSectorId(null);
  };

  const sectorsToShow = sectors.filter(s => !s.finalizedAt[activeType]);

  const allFinalizedReports = useMemo((): ReportEntry[] => {
    const reports: ReportEntry[] = [];
    (Object.entries(dailyHistory) as [string, Sector[]][]).forEach(([date, sl]) => {
      sl.forEach(s => {
        [ChecklistType.OPENING, ChecklistType.CLOSING].forEach(type => {
          if (s.finalizedAt[type]) {
            reports.push({ date, sectorId: s.id, sectorName: s.name, sectorIcon: s.icon, type, employeeName: s.employeeName[type] || '', observations: s.observations[type] || '', finalizedAt: s.finalizedAt[type]!, tasks: s.tasks[type] });
          }
        });
      });
    });
    return reports.sort((a, b) => b.finalizedAt - a.finalizedAt);
  }, [dailyHistory]);

  /* ────── Pill tab: Abertura / Fechamento ────── */
  const TypeSwitch = ({ value, onChange }: { value: ChecklistType; onChange: (t: ChecklistType) => void }) => (
    <div className="flex gap-2 p-1.5 rounded-[18px]" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}` }}>
      {[{ v: ChecklistType.OPENING, label: '🌅 Abertura' }, { v: ChecklistType.CLOSING, label: '🌙 Fechamento' }].map(({ v, label }) => {
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="flex-1 py-3 rounded-[14px] text-xs font-bold uppercase tracking-widest transition-all duration-300"
            style={{
              background: active ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'transparent',
              color: active ? '#fff' : C.textMuted,
              boxShadow: active ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  /* ────── RENDER ────── */
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', minHeight: '100vh', paddingBottom: 120, background: C.bg, fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ position: 'relative', padding: '40px 24px 28px', background: '#FFFFFF', borderBottom: `1px solid ${C.borderStrong}` }}>

        {/* Logo + perfil */}
        <div className="flex justify-between items-center" style={{ marginBottom: 24, position: 'relative' }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center overflow-hidden"
              style={{ width: 44, height: 44, borderRadius: 14, background: '#1e1e1e', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
              <img src="/logo.jpg" alt="VBQ Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: '-0.5px', lineHeight: 1 }}>VBQ</h1>
              <p style={{ fontSize: 9, color: C.textFaint, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 3 }}>Samambaia</p>
            </div>
          </div>
          <button
            style={{ width: 44, height: 44, borderRadius: 14, background: C.bg, border: `1px solid ${C.borderStrong}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
        </div>

        {/* Seletor de data (apenas na home) */}
        {currentView === 'home' && (
          <div className="flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: 20, padding: '6px 8px', position: 'relative' }}>
            <button onClick={() => changeDate(-1)} style={{ padding: '10px 14px', color: C.textMuted }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div style={{ textAlign: 'center', color: C.text }}>
              <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>
                {new Date(currentDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </p>
              <p style={{ fontSize: 9, color: C.textFaint, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>
                {new Date(currentDate).toLocaleDateString('pt-BR', { weekday: 'long' })}
              </p>
            </div>
            <button onClick={() => changeDate(1)} style={{ padding: '10px 14px', color: C.textMuted }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        )}

        {currentView === 'settings' && (
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.5px' }}>Ajustes</h2>
            <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, marginTop: 4 }}>Gerencie tarefas de cada setor</p>
          </div>
        )}

        {currentView === 'reports' && (
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, letterSpacing: '-0.5px' }}>Histórico</h2>
            <p style={{ fontSize: 11, color: C.textMuted, fontWeight: 500, marginTop: 4 }}>Checklists finalizados</p>
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main style={{ padding: '0 24px' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-violet-600 animate-pulse">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <>
            {/* ─── HOME ─── */}
            {currentView === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 120 }}>
                {!selectedSectorId ? (
                  <>
                    <div className="flex justify-between items-end mb-8">
                      <div>
                        <h2 className="text-3xl font-black text-[#0F172A] leading-tight">Escolha o Setor</h2>
                        <p className="text-[#64748B] font-bold text-sm mt-1">Selecione para iniciar o checklist</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <TypeSwitch value={activeType} onChange={setActiveType} />

                      {sectorsToShow.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 32px', borderRadius: 32, background: '#FFFFFF', border: `3px dashed ${C.borderStrong}` }}>
                          <div style={{ fontSize: 64, marginBottom: 20 }}>🏆</div>
                          <h3 className="text-xl font-black text-[#0F172A] mb-2 leading-tight">Tudo Pronto!</h3>
                          <p className="text-[#64748B] font-bold text-sm">
                            Os checklists de {activeType === ChecklistType.OPENING ? 'Abertura' : 'Fechamento'} foram concluídos.
                          </p>
                        </div>
                      ) : (
                        sectorsToShow.map(sector => (
                          <SectorCard key={sector.id} sector={sector} type={activeType} onClick={() => setSelectedSectorId(sector.id)} />
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  /* ─ DETALHE DO SETOR ─ */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 120 }}>
                    {/* Header do setor */}
                    <header style={{ padding: '24px 0 32px', borderBottom: `2.5px solid ${C.borderStrong}`, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => setSelectedSectorId(null)}
                        className="mr-4 w-12 h-12 rounded-2xl bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#64748B] shadow-sm active:scale-90 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                      </button>
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-4xl shadow-sm">
                        {selectedSector?.icon}
                      </div>
                      <div className="ml-2">
                        <h2 className="text-3xl font-black text-[#0F172A] leading-tight">{selectedSector?.name}</h2>
                        <p className="text-[12px] font-black uppercase tracking-widest mt-1 text-[#8b5cf6]">
                          {activeType === ChecklistType.OPENING ? '🌅 Abertura' : '🌙 Fechamento'}
                        </p>
                        {selectedSector?.employeeName[activeType] && (
                          <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-[#475569] bg-slate-100 px-3 py-1 rounded-full inline-block">
                            👤 Responsável: {selectedSector.employeeName[activeType]}
                          </p>
                        )}
                      </div>
                    </header>

                    <div className="flex flex-col" style={{ gap: 16 }}>
                      {selectedSector?.tasks[activeType].map(task => (
                        <ChecklistItem
                          key={task.id} task={task}
                          onUpdate={(updated) => handleUpdateTask(selectedSector!.id, activeType, updated)}
                        />
                      ))}
                    </div>

                    {/* Botão Finalizar */}
                    {selectedSector && !selectedSector.finalizedAt[activeType] && (
                      <div style={{ marginTop: 24, padding: '32px', borderRadius: 32, background: '#FFFFFF', border: `3.5px solid ${C.violet}`, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                        <h3 className="font-black text-xl text-[#0F172A] mb-2">Concluir Setor</h3>
                        <p className="text-md font-bold text-[#64748B] mb-8">Revise todas as tarefas acima antes de fechar o envio.</p>
                        <button
                          onClick={() => {
                            setResponsibleName(selectedSector.employeeName[activeType] || '');
                            setSectorObs(selectedSector.observations[activeType] || '');
                            setShowFinalizeModal(true);
                          }}
                          className="w-full h-18 py-5 rounded-2xl font-black text-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-4 shadow-xl"
                          style={{ background: C.violet, color: '#FFFFFF' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                          <span>FINALIZAR E ENVIAR</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ─── HISTORY/REPORTS ─── */}
            {currentView === 'reports' && (
              <div style={{ padding: '0 24px' }}>
                <header className="mb-8">
                  <h2 className="text-3xl font-black text-[#0F172A] leading-tight">Histórico</h2>
                  <p className="text-[#64748B] font-bold text-sm mt-1">Registros de checklists finalizados</p>
                </header>
                <ReportsDashboard reports={allFinalizedReports} onReopenReport={handleReopenReport} />
              </div>
            )}

            {/* ─── AJUSTES ─── */}
            {currentView === 'settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {!settingsSectorId ? (
                  <>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.textFaint, textTransform: 'uppercase', letterSpacing: '0.18em', padding: '0 4px' }}>
                      Selecione um setor
                    </p>
                    {sectors.map(sector => (
                      <button
                        key={sector.id}
                        onClick={() => setSettingsSectorId(sector.id)}
                        className="w-full p-6 rounded-[28px] bg-white border-2 border-[#E2E8F0] shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
                      >
                        <div className="flex items-center gap-5">
                          <div className="text-4xl w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center border-2 border-[#E2E8F0]">{sector.icon}</div>
                          <div>
                            <h4 className="font-black text-[#0F172A] text-lg leading-tight uppercase tracking-tight">{sector.name}</h4>
                            <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest mt-1">Configurar Tarefas</p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] group-hover:bg-[#F5F3FF] group-hover:text-[#8B5CF6] transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setIsAddingSector(true)}
                      className="w-full py-6 rounded-[28px] border-2 border-dashed border-[#CBD5E1] font-black text-[#94A3B8] flex items-center justify-center gap-3 hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                      ADICIONAR NOVO SETOR
                    </button>
                  </>
                ) : (
                  /* Ajustes do Setor Selecionado */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <header className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => setSettingsSectorId(null)}
                          className="w-12 h-12 rounded-2xl bg-white border-2 border-[#E2E8F0] flex items-center justify-center text-[#64748B] shadow-sm active:scale-90 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <div>
                          <h3 className="text-2xl font-black text-[#0F172A] leading-tight uppercase">{settingsSector?.name}</h3>
                          <p className="text-[#94A3B8] text-[12px] font-black tracking-widest leading-none mt-1">AJUSTES DE TAREFAS</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSector(settingsSector!.id)}
                        className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" /></svg>
                      </button>
                    </header>

                    <div className="flex gap-2 p-1.5 bg-white rounded-2xl border-2 border-[#E2E8F0] shadow-sm">
                      <button onClick={() => setSettingsType(ChecklistType.OPENING)} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${settingsType === ChecklistType.OPENING ? 'bg-blue-100 text-blue-700' : 'text-[#94A3B8]'}`}>Abertura</button>
                      <button onClick={() => setSettingsType(ChecklistType.CLOSING)} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${settingsType === ChecklistType.CLOSING ? 'bg-violet-100 text-violet-700' : 'text-[#94A3B8]'}`}>Fechamento</button>
                    </div>

                    <div className="space-y-4">
                      {settingsSector?.tasks[settingsType].map((task, index) => (
                        <div key={task.id} className="bg-white p-6 rounded-[28px] border-2 border-[#F1F5F9] shadow-sm border-2">
                          {editingTaskId === task.id ? (
                            <div className="space-y-4">
                              <DarkInput value={editingTaskData.title} onChange={e => setEditingTaskData(p => ({ ...p, title: e.target.value }))} autoFocus />
                              <DarkTextarea value={editingTaskData.description} onChange={e => setEditingTaskData(p => ({ ...p, description: e.target.value }))} style={{ height: 80 }} />
                              <div className="flex gap-3">
                                <button onClick={() => setEditingTaskId(null)} className="flex-1 py-4 font-black rounded-2xl text-[#64748B] bg-[#F1F5F9]">Sair</button>
                                <button onClick={handleSaveEditTask} className="flex-2 py-4 font-black rounded-2xl text-white shadow-lg" style={{ background: C.violet, flex: 2 }}>Salvar</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center font-black text-sm border border-violet-100">{index + 1}</div>
                                <div>
                                  <p className="text-[#0F172A] font-black text-md leading-tight">{task.title}</p>
                                  {task.description && <p className="text-[#94A3B8] text-xs font-bold leading-tight mt-1">{task.description}</p>}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { setEditingTaskId(task.id); setEditingTaskData({ title: task.title, description: task.description }); }}
                                  className="w-10 h-10 bg-[#F1F5F9] text-[#64748B] rounded-xl flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 transition-colors">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                </button>
                                <button onClick={() => handleDeleteSettingsTask(task.id)}
                                  className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {isAddingSettingsTask ? (
                        <div className="bg-violet-50 p-6 rounded-[28px] border-2 border-violet-200 border-dashed space-y-4">
                          <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest ml-1">Nova Tarefa</p>
                          <DarkInput value={newSettingsTask.title} onChange={e => setNewSettingsTask(p => ({ ...p, title: e.target.value }))} placeholder="Título..." />
                          <DarkTextarea value={newSettingsTask.description} onChange={e => setNewSettingsTask(p => ({ ...p, description: e.target.value }))} placeholder="Descrição..." style={{ height: 80 }} />
                          <div className="flex gap-3">
                            <button onClick={() => setIsAddingSettingsTask(false)} className="flex-1 py-4 font-black rounded-2xl text-[#64748B] bg-white border border-[#E2E8F0]">Sair</button>
                            <button onClick={handleAddSettingsTask} className="flex-2 py-4 font-black rounded-2xl text-white shadow-lg" style={{ background: C.violet, flex: 2 }}>Adicionar</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsAddingSettingsTask(true)}
                          className="w-full py-6 rounded-[28px] border-2 border-dashed border-[#CBD5E1] font-black text-[#94A3B8] flex items-center justify-center gap-3 hover:border-violet-400 hover:text-violet-600 transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                          ADICIONAR TAREFA
                        </button>
                      )
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 40px)', maxWidth: 560, background: '#FFFFFF', border: `1px solid ${C.borderStrong}`, borderRadius: 24, boxShadow: '0 12px 40px rgba(0,0,0,0.12)', padding: '12px 20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 50 }}>
        {([
          { key: 'home', label: 'Início', icon: Icon.home },
          { key: 'reports', label: 'Histórico', icon: Icon.reports },
          { key: 'settings', label: 'Ajustes', icon: Icon.settings },
        ] as const).map(({ key, label, icon }) => {
          const active = currentView === key;
          return (
            <button
              key={key}
              onClick={() => {
                if (key === 'home') { setCurrentView('home'); setSelectedSectorId(null); }
                else { pedirSenha(key); }
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s', transform: active ? 'scale(1.08)' : 'scale(1)' }}
            >
              <div style={{ width: 44, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: active ? 'rgba(139,92,246,0.15)' : 'transparent', transition: 'all 0.2s' }}>
                {icon(active)}
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: active ? C.violetLight : C.textFaint, fontFamily: "'Space Grotesk', sans-serif" }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── MODAL FINALIZAR ── */}
      {showFinalizeModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowFinalizeModal(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: 460, background: '#FFFFFF', borderRadius: 32, padding: 32, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `3px solid ${C.violet}` }}>
            <h3 className="text-2xl font-black mb-2 text-[#0F172A]">Finalização</h3>
            <p className="text-[#64748B] font-bold mb-8">Insira seu nome e observações finais.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2 ml-1">Responsável *</label>
                <DarkInput
                  value={responsibleName}
                  onChange={e => { setResponsibleName(e.target.value); setErrorName(false); }}
                  placeholder="Seu nome..."
                  style={{ border: errorName ? '2px solid #EF4444' : undefined }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2 ml-1">Ocorrências / Observações</label>
                <DarkTextarea
                  value={sectorObs}
                  onChange={e => setSectorObs(e.target.value)}
                  placeholder="Relate algo se necessário..."
                  style={{ height: 120 }}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowFinalizeModal(false)}
                  className="flex-1 py-4 font-black rounded-2xl text-[#64748B] bg-[#F1F5F9] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalize}
                  className="flex-[1.5] py-4 font-black rounded-2xl text-white shadow-lg active:scale-95 transition-all"
                  style={{ background: C.violet }}
                >
                  Confirmar e Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAIS ── */}
      {(isAddingSector || isAddingTask) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: 440, borderRadius: 32, padding: 40, border: `2.5px solid ${C.borderStrong}`, boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: 24, fontBlack: true, color: '#0F172A', marginBottom: 12 }} className="font-black">
              {isAddingSector ? 'Criar Novo Setor' : 'Adicionar Tarefa'}
            </h3>
            <p style={{ fontSize: 14, color: '#64748B', fontWeight: 700, marginBottom: 32 }}>
              {isAddingSector ? 'Preencha as informações do setor abaixo' : 'Preencha os dados da nova tarefa para a lista'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <DarkInput
                type="text"
                placeholder={isAddingSector ? 'Nome do setor...' : 'Título da tarefa...'}
                value={isAddingSector ? newSector.name : newTask.title}
                onChange={e => isAddingSector ? setNewSector({ ...newSector, name: e.target.value }) : setNewTask({ ...newTask, title: e.target.value })}
              />
              {isAddingSector ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <DarkInput
                    type="text"
                    placeholder="Ícone (ex: 🍴)"
                    value={newSector.icon}
                    onChange={e => setNewSector({ ...newSector, icon: e.target.value })}
                    style={{ textAlign: 'center', fontSize: 28, width: 80 }}
                  />
                  <p className="text-sm font-bold text-[#64748B]">Este ícone aparecerá no card principal.</p>
                </div>
              ) : (
                <DarkTextarea
                  placeholder="Descrição ou orientação para o funcionário..."
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  style={{ height: 120 }}
                />
              )}
              <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <button onClick={() => { setIsAddingSector(false); setIsAddingTask(false); }} className="flex-1 py-4 font-black rounded-2xl text-[#64748B] transition-colors" style={{ background: '#F1F5F9' }}>Cancelar</button>
                <button
                  onClick={isAddingSector ? handleAddSector : handleAddTask}
                  className="flex-2 py-4 font-black rounded-2xl text-white transition-all shadow-lg"
                  style={{ background: C.violet, flex: 2 }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE SENHA ── */}
      {senhaModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#FFFFFF', width: '100%', maxWidth: 360, borderRadius: 32, padding: 40, border: `3px solid ${C.violet}`, boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#F5F3FF', border: `2px solid ${C.violetLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.violet} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', textAlign: 'center', marginBottom: 8 }}>Área Restrita</h3>
            <p style={{ fontSize: 14, color: '#64748B', fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
              {senhaModal === 'reports' ? 'Histórico de Checklists' : 'Ajustes do Sistema'}
            </p>
            <DarkInput
              type="password"
              placeholder="Digite a senha..."
              value={senhaInput}
              autoFocus
              onChange={e => { setSenhaInput(e.target.value); setSenhaErro(false); }}
              onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') confirmarSenha(); }}
              style={{ borderColor: senhaErro ? '#EF4444' : undefined, textAlign: 'center', letterSpacing: '0.3em', fontSize: 24 }}
            />
            {senhaErro && (
              <p style={{ color: '#EF4444', fontSize: 13, fontWeight: 800, textAlign: 'center', marginTop: 12 }}>⚠️ Senha incorreta</p>
            )}
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <button onClick={() => setSenhaModal(null)} className="flex-1 py-4 font-black rounded-2xl text-[#64748B] transition-colors" style={{ background: '#F1F5F9' }}>Sair</button>
              <button
                onClick={confirmarSenha}
                className="flex-2 py-4 font-black rounded-2xl text-white transition-all shadow-lg"
                style={{ background: C.violet, flex: 2 }}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #94A3B8; }
        input:focus, textarea:focus { border-color: #8b5cf6 !important; background: #FFFFFF !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        button { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};

export default App;
