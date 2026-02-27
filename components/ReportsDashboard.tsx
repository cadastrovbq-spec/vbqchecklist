
import React, { useState } from 'react';
import { ChecklistType, TaskStatus, ReportEntry, ChecklistTask } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReportsDashboardProps {
  reports: ReportEntry[];
  onReopenReport: (date: string, sectorId: string, type: ChecklistType) => void;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ reports, onReopenReport }) => {
  const [filter, setFilter] = useState<'all' | ChecklistType.OPENING | ChecklistType.CLOSING>('all');
  const [selectedReport, setSelectedReport] = useState<ReportEntry | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredReports = reports.filter(r => filter === 'all' || r.type === filter);

  const stats = React.useMemo(() => {
    let completedTasks = 0;
    let totalTasks = 0;

    reports.forEach(r => {
      r.tasks.forEach(t => {
        totalTasks++;
        if (t.status === TaskStatus.COMPLETED) completedTasks++;
      });
    });

    return {
      totalFinalized: reports.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      openingCount: reports.filter(r => r.type === ChecklistType.OPENING).length,
      closingCount: reports.filter(r => r.type === ChecklistType.CLOSING).length
    };
  }, [reports]);

  const groupedReports = React.useMemo(() => {
    const groups: { [date: string]: ReportEntry[] } = {};
    filteredReports.forEach(r => {
      if (!groups[r.date]) groups[r.date] = [];
      groups[r.date].push(r);
    });
    return groups;
  }, [filteredReports]);

  const handleReopen = (report: ReportEntry) => {
    if (confirm(`Deseja reabrir o checklist de ${report.sectorName} (${report.type === ChecklistType.OPENING ? 'Abertura' : 'Fechamento'}) para correções?`)) {
      onReopenReport(report.date, report.sectorId, report.type);
      setSelectedReport(null);
    }
  };

  const downloadReportPDF = (report: ReportEntry) => {
    const doc = new jsPDF();
    const title = `Relatório de Checklist - ${report.sectorName}`;
    const dateStr = new Date(report.date).toLocaleDateString('pt-BR');
    const typeStr = report.type === ChecklistType.OPENING ? 'Abertura' : 'Fechamento';

    doc.setFontSize(20);
    doc.text(title, 20, 20);

    doc.setFontSize(12);
    doc.text(`Data: ${dateStr}`, 20, 30);
    doc.text(`Tipo: ${typeStr}`, 20, 37);
    doc.text(`Responsável: ${report.employeeName}`, 20, 44);

    if (report.observations) {
      doc.setTextColor(220, 0, 0);
      doc.text(`Observações: ${report.observations}`, 20, 54);
      doc.setTextColor(0, 0, 0);
    }

    const tableData = report.tasks.map(t => [
      t.title,
      t.status === TaskStatus.COMPLETED ? 'OK' : 'PENDENTE/FALHOU',
      t.verificationMessage || '-'
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['Tarefa', 'Status', 'Feedback IA']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: '#F1F5F9', textColor: '#0F172A', fontStyle: 'bold' }
    });

    doc.save(`checklist-${report.sectorId}-${report.date}-${report.type}.pdf`);
  };

  return (
    <div className="space-y-6 pb-32" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Dashboard Compacto - Light High Contrast */}
      <div className="bg-white p-8 rounded-[32px] border-2 border-[#E2E8F0] shadow-sm">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B] mb-2">Conclusão Média</h4>
            <p className="text-5xl font-black text-[#0F172A]">{stats.completionRate}%</p>
          </div>
          <div className="text-right">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#64748B] mb-2">Checklists</h4>
            <p className="text-5xl font-black text-[#6D28D9]">{stats.totalFinalized}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-[#64748B]">🌤️ Aberturas: <span className="text-[#0F172A]">{stats.openingCount}</span></p>
              <p className="text-[10px] font-black text-[#64748B]">{Math.round((stats.openingCount / (stats.totalFinalized || 1)) * 100)}%</p>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#8B5CF6]" style={{ width: `${(stats.openingCount / (stats.totalFinalized || 1)) * 100}%` }}></div>
            </div>
          </div>
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-[#64748B]">🌙 Fechamentos: <span className="text-[#0F172A]">{stats.closingCount}</span></p>
              <p className="text-[10px] font-black text-[#64748B]">{Math.round((stats.closingCount / (stats.totalFinalized || 1)) * 100)}%</p>
            </div>
            <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#6D28D9]" style={{ width: `${(stats.closingCount / (stats.totalFinalized || 1)) * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Lista */}
      <div className="flex gap-2 p-1.5 bg-white rounded-2xl border-2 border-[#E2E8F0] shadow-sm">
        <button onClick={() => setFilter('all')} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#94A3B8]'}`}>Tudo</button>
        <button onClick={() => setFilter(ChecklistType.OPENING)} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === ChecklistType.OPENING ? 'bg-blue-100 text-blue-700' : 'text-[#94A3B8]'}`}>Abertura</button>
        <button onClick={() => setFilter(ChecklistType.CLOSING)} className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filter === ChecklistType.CLOSING ? 'bg-violet-100 text-violet-700' : 'text-[#94A3B8]'}`}>Fechamento</button>
      </div>

      {/* Lista de Relatórios Agrupada */}
      <div className="space-y-10">
        {Object.keys(groupedReports).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-[#CBD5E1]">
            <p className="font-black uppercase text-sm text-[#94A3B8]">Nenhum registro encontrado</p>
          </div>
        ) : (
          (Object.entries(groupedReports) as [string, ReportEntry[]][]).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <div className="sticky top-0 z-10 py-3 mb-2">
                <span className="bg-[#0F172A] text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg">
                  {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {items.map((report, idx) => (
                  <button
                    key={`${date}-${idx}`}
                    onClick={() => setSelectedReport(report)}
                    className="bg-white rounded-[32px] p-8 border-2 border-[#E2E8F0] text-left hover:border-[#8B5CF6] active:scale-[0.98] transition-all outline-none shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-4xl border-2 border-[#E2E8F0]">
                          {report.sectorIcon}
                        </div>
                        <div>
                          <h5 className="font-black text-[#0F172A] uppercase text-sm tracking-tight">{report.sectorName}</h5>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${report.type === ChecklistType.OPENING ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                              {report.type === ChecklistType.OPENING ? 'Abertura' : 'Fechamento'}
                            </span>
                            <span className="text-[11px] text-[#94A3B8] font-bold uppercase">
                              {new Date(report.finalizedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">Responsável</p>
                        <p className="text-[13px] font-black text-[#475569] tracking-tight truncate max-w-[140px]">{report.employeeName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-5 border-y-2 border-[#F1F5F9] mb-5">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">Total</p>
                        <p className="text-lg font-black text-[#0F172A]">{report.tasks.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">OK</p>
                        <p className="text-lg font-black text-[#059669]">{report.tasks.filter(t => t.status === TaskStatus.COMPLETED).length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">Fotos</p>
                        <p className="text-lg font-black text-[#3B82F6]">{report.tasks.filter(t => t.photoUrl).length}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black text-[#CBD5E1] uppercase">Toque para ver detalhes</p>
                      <div className="w-10 h-10 rounded-full border-2 border-[#F1F5F9] flex items-center justify-center text-[#94A3B8]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Detalhes do Relatório - Light Mode */}
      {selectedReport && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md z-[200] flex flex-col p-4 md:p-10 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-8 px-2">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-lg border-2 border-[#E2E8F0]">{selectedReport.sectorIcon}</div>
              <div>
                <h3 className="text-white font-black uppercase text-2xl leading-tight">{selectedReport.sectorName}</h3>
                <p className="text-white/70 text-[12px] font-black uppercase tracking-[0.2em] mt-1">
                  {new Date(selectedReport.date).toLocaleDateString('pt-BR')} • {selectedReport.type === ChecklistType.OPENING ? '🌅 ABERTURA' : '🌙 FECHAMENTO'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => downloadReportPDF(selectedReport)}
                className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
                title="Baixar PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[40px] p-8 overflow-y-auto space-y-6 shadow-2xl border-t-8 border-[#8B5CF6]">
            <div className="bg-[#F8FAFC] p-6 rounded-3xl border-2 border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[11px] font-black text-[#94A3B8] uppercase">Responsável pelo Checklist</p>
                <p className="text-lg font-black text-[#0F172A]">{selectedReport.employeeName}</p>
              </div>
              {selectedReport.observations && (
                <div className="mt-6 pt-6 border-t-2 border-[#E2E8F0]">
                  <p className="text-[11px] font-black text-red-500 uppercase mb-3">⚠️ Observações / Manutenção</p>
                  <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-100">
                    <p className="text-md text-red-800 font-bold leading-relaxed">"{selectedReport.observations}"</p>
                  </div>
                </div>
              )}
            </div>

            <h4 className="text-[12px] font-black text-[#94A3B8] uppercase tracking-[0.25em] pl-4 mb-2">Itens Verificados</h4>

            <div className="space-y-3">
              {selectedReport.tasks.map((task) => (
                <div key={task.id} className="bg-white p-5 rounded-[28px] border-2 border-[#F1F5F9] flex items-center gap-5 hover:border-[#E2E8F0] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.status === TaskStatus.COMPLETED ? 'bg-[#059669] text-white' : 'bg-[#EF4444] text-white'}`}>
                    {task.status === TaskStatus.COMPLETED
                      ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0F172A] text-sm font-black uppercase tracking-tight">{task.title}</p>
                    {task.verificationMessage && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <p className="text-[10px] text-blue-600 font-black tracking-tight">{task.verificationMessage}</p>
                      </div>
                    )}
                  </div>
                  {task.photoUrl && (
                    <button onClick={() => setPreviewImage(task.photoUrl!)} className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#F1F5F9] hover:border-[#8B5CF6] transition-all active:scale-90">
                      <img src={task.photoUrl} alt="Tarefa" className="w-full h-full object-cover" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8 mt-10 border-t-4 border-[#F1F5F9]">
              <button
                onClick={() => handleReopen(selectedReport)}
                className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-3xl font-black text-md uppercase tracking-[0.2em] shadow-xl shadow-red-200 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                <span>Reabrir para Correção</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualizador de Imagem Full Screen */}
      {previewImage && (
        <div className="fixed inset-0 bg-[#0F172A] z-[300] flex flex-col animate-in zoom-in duration-200">
          <div className="absolute top-10 right-10 z-[310]">
            <button
              onClick={() => setPreviewImage(null)}
              className="w-16 h-16 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-[40px] shadow-2xl border-4 border-white/10" />
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 20px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ReportsDashboard;
