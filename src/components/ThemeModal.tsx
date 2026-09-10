import React from 'react';
import { X, Palette, Sparkles, Check, RotateCcw } from 'lucide-react';

export type ThemePreset = 'figma-classic' | 'emerald-green' | 'indigo-night' | 'sunset-amber';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  onReplaySplash: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  onReplaySplash,
}) => {
  if (!isOpen) return null;

  const themes: { id: ThemePreset; name: string; color: string; desc: string }[] = [
    {
      id: 'figma-classic',
      name: 'Figma Biru & Emas Asli',
      color: 'bg-[#0284c7] border-[#f5b800]',
      desc: 'Sesuai desain Figma dengan aksen biru laut dan kuning emas.',
    },
    {
      id: 'emerald-green',
      name: 'Hijau Segar & Mint',
      color: 'bg-emerald-600 border-emerald-400',
      desc: 'Nuansa segar alami untuk fokus dan relaksasi.',
    },
    {
      id: 'indigo-night',
      name: 'Indigo Modern',
      color: 'bg-indigo-600 border-indigo-400',
      desc: 'Gaya modern berkelas dengan saturasi dalam.',
    },
    {
      id: 'sunset-amber',
      name: 'Amber Hangat',
      color: 'bg-amber-600 border-amber-400',
      desc: 'Sentuhan warna hangat yang dinamis.',
    },
  ];

  return (
    <div
      id="theme-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="theme-modal-card"
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sky-50 px-5 py-3.5 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#0284c7]" />
            <h3 className="font-bold text-slate-800 text-sm">Ubah Desain & Tema</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-xs text-slate-500">
            Pilih tema warna aplikasi to-do list favorit Anda:
          </p>

          <div className="space-y-2">
            {themes.map((t) => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  id={`theme-option-${t.id}`}
                  type="button"
                  onClick={() => onSelectTheme(t.id)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-[#0284c7] bg-sky-50/70 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 shadow-xs ${t.color}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-500">{t.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0284c7] stroke-[2.5]" />}
                </button>
              );
            })}
          </div>

          {/* Replay splash screen */}
          <div className="pt-3 border-t border-slate-100">
            <button
              id="btn-replay-splash"
              type="button"
              onClick={() => {
                onClose();
                onReplaySplash();
              }}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Putar Ulang Animasi Loading Figma</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-[#0284c7] text-white rounded-lg hover:bg-sky-700"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
