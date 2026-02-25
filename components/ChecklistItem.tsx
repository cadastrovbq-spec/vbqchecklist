
import React, { useState, useRef } from 'react';
import { ChecklistTask, TaskStatus } from '../types';
import { verifyTaskPhoto } from '../services/geminiService';

interface ChecklistItemProps {
  task: ChecklistTask;
  onUpdate: (updatedTask: ChecklistTask) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ task, onUpdate }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const compressImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject("Could not get canvas context");
          return;
        }

        // Redimensionar para no máximo 800px preservando proporção
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para JPEG com qualidade 0.6
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        console.log(`[Image] Original Dimensions: ${img.width}x${img.height}`);
        console.log(`[Image] Compressed Dimensions: ${width}x${height}`);
        console.log(`[Image] Compressed Size: ${Math.round(compressedBase64.length / 1024)} KB`);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    });
  };

  const handleManualCheck = () => {
    onUpdate({ ...task, status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log(`[Upload] File selected: ${file.name} (${Math.round(file.size / 1024)} KB)`);

    setIsVerifying(true);
    onUpdate({ ...task, status: TaskStatus.VERIFYING });

    const objectUrl = URL.createObjectURL(file);

    try {
      const compressedBase64 = await compressImage(objectUrl);
      URL.revokeObjectURL(objectUrl);

      const verification = await verifyTaskPhoto(task.title, task.description, compressedBase64);

      onUpdate({
        ...task,
        status: verification.approved ? TaskStatus.COMPLETED : TaskStatus.FAILED,
        photoUrl: compressedBase64,
        verificationMessage: verification.feedback,
        lastUpdated: Date.now()
      });
    } catch (err) {
      console.error("[Upload] Error processing image:", err);
      alert("Erro ao processar imagem. Tente novamente com uma foto menor ou em um ambiente com melhor conexão.");
      onUpdate({ ...task, status: TaskStatus.PENDING });
    } finally {
      setIsVerifying(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isDone = task.status === TaskStatus.COMPLETED;
  const isFailed = task.status === TaskStatus.FAILED;

  return (
    <div
      className="rounded-[24px] p-6 transition-all duration-300 relative overflow-hidden"
      style={{
        background: isDone
          ? '#F5F3FF'
          : isFailed
            ? '#FEF2F2'
            : '#FFFFFF',
        border: isDone
          ? '2px solid #8b5cf6'
          : isFailed
            ? '2px solid #EF4444'
            : '2px solid #E2E8F0',
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center gap-5 relative z-10">
        {/* Botão de check */}
        <button
          onClick={handleManualCheck}
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
          style={{
            background: isDone
              ? '#8b5cf6'
              : '#F1F5F9',
            border: isDone
              ? 'none'
              : '2.5px solid #CBD5E1',
          }}
        >
          {isDone && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className="font-black text-[20px] leading-tight"
            style={{
              color: isDone ? '#4C1D95' : isFailed ? '#991B1B' : '#0F172A',
              textDecoration: isDone ? 'line-through' : 'none',
              letterSpacing: '-0.5px',
            }}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-[16px] mt-2 leading-relaxed font-bold" style={{ color: isDone ? '#7C3AED' : '#475569' }}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Foto */}
          {task.photoUrl ? (
            <img src={task.photoUrl} alt="Foto" className="w-14 h-14 rounded-2xl object-cover" style={{ border: '2px solid #E2E8F0' }} />
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isVerifying}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300"
              style={{
                background: isVerifying ? '#FEF3C7' : '#F1F5F9',
                border: isVerifying ? '2.5px solid #F59E0B' : '2.5px solid #CBD5E1',
                color: isVerifying ? '#D97706' : '#94A3B8',
              }}
            >
              {isVerifying ? (
                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
              )}
            </button>
          )}
        </div>
      </div>

      {task.verificationMessage && (
        <div
          className="mt-5 px-5 py-3 rounded-2xl text-[14px] font-black"
          style={{
            background: isDone ? '#EDE9FE' : '#FEE2E2',
            color: isDone ? '#5B21B6' : '#991B1B',
            border: isDone ? '2.5px solid #C4B5FD' : '2.5px solid #FCA5A5',
          }}
        >
          🤖 {task.verificationMessage}
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileUpload} />
    </div>
  );
};

export default ChecklistItem;
