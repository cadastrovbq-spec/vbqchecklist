
import React from 'react';
import { Sector, ChecklistType, TaskStatus } from '../types';

interface SectorCardProps {
  sector: Sector;
  type: ChecklistType;
  onClick: () => void;
}

const SectorCard: React.FC<SectorCardProps> = ({ sector, type, onClick }) => {
  const tasks = sector.tasks[type];
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const isFinalized = !!sector.finalizedAt[type];

  return (
    <button
      onClick={onClick}
      disabled={isFinalized}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      className={`w-full text-left transition-all duration-300 relative overflow-hidden ${isFinalized ? 'opacity-40 grayscale cursor-not-allowed' : 'active:scale-[0.98]'}`}
    >
      <div
        className="rounded-[24px] p-6 relative overflow-hidden border-2 transition-all duration-300"
        style={{
          background: '#FFFFFF',
          borderColor: progress === 100 ? '#8b5cf6' : '#E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: 16
        }}
      >
        <div className="flex items-center gap-5 relative z-10">
          {/* Ícone */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              background: progress === 100 ? '#F5F3FF' : '#F1F5F9',
              border: '2px solid #E2E8F0',
            }}
          >
            {sector.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className="font-extrabold text-xl leading-tight text-[#0F172A]"
                >
                  {sector.name}
                </h3>
                <p className="text-[12px] font-bold uppercase tracking-widest mt-1 text-[#64748B]">
                  {type === ChecklistType.OPENING ? '🌅 Abertura' : '🌙 Fechamento'}
                </p>
                {sector.employeeName[type] && (
                  <p className="text-[10px] font-black text-[#8B5CF6] uppercase mt-1 truncate max-w-[150px]">
                    👤 {sector.employeeName[type]}
                  </p>
                )}
              </div>
              <span
                className="text-[12px] font-black px-4 py-1.5 rounded-full ml-2 flex-shrink-0"
                style={{
                  background: progress === 100 ? '#8b5cf6' : '#F1F5F9',
                  color: progress === 100 ? '#FFFFFF' : '#475569',
                }}
              >
                {completedCount}/{tasks.length}
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? '#8b5cf6'
                    : '#f59e0b',
                }}
              />
            </div>
          </div>

          {/* Seta */}
          <div style={{ color: '#94A3B8' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </button>
  );
};

export default SectorCard;
