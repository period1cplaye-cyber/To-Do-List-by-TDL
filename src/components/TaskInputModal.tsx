import React, { useState, useRef, useEffect } from 'react';
import { CategoryType, Task } from '../types';
import { Tag, Send, X, Calendar, Clock } from 'lucide-react';
import { CategoryModal } from './CategoryModal';

interface TaskInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  availableCategories: string[];
  initialCategory?: CategoryType;
  initialDueDate?: string;
  onAddNewCategory?: (newCat: string) => void;
}

// Rekomendasi string tanggal sederhana (murni teks tanpa integer)
const QUICK_DATE_STRINGS = ['Hari ini', 'Besok', 'Lusa', 'Senin depan', 'Akhir pekan'];

export const TaskInputModal: React.FC<TaskInputModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  availableCategories,
  initialCategory = 'Kesehatan',
  initialDueDate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>(
    initialCategory === 'Semua' ? 'Kesehatan' : initialCategory
  );
  // Pure string text box for date / deadline as requested
  const [dateString, setDateString] = useState<string>(initialDueDate || '');

  // Sub-modal state for limited categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      if (initialCategory && initialCategory !== 'Semua') {
        setCategory(initialCategory);
      }
      setDateString(initialDueDate || '');
    }
  }, [isOpen, initialCategory, initialDueDate]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category: category || 'Kesehatan',
      // Pure string date without integer
      dueDate: dateString.trim() || undefined,
    });

    // Reset and close
    setTitle('');
    setDateString('');
    onClose();
  };

  return (
    <>
      <div
        id="task-input-backdrop"
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
        onClick={onClose}
      >
        {/* Figma-friendly Card Layout: standard 16px corner, clean auto-layout */}
        <div
          id="task-input-container"
          className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header indicator for mobile drawer */}
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:hidden" />

          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Tambah Tugas / Aktivitas Baru
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. Nama Aktivitas Input Field (Figma Auto-layout) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                Nama Aktivitas
              </label>
              <input
                ref={inputRef}
                id="input-task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tugas/Aktivitas/Acara/dsb..."
                className="w-full text-sm font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] focus:bg-white text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* 2. Pemilihan Tanggal / Deadline Murni Text Box & String (Tanpa Integer) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Tanggal / Batas Waktu (Murni Teks)</span>
                </label>
                {dateString && (
                  <button
                    type="button"
                    onClick={() => setDateString('')}
                    className="text-[10px] text-slate-400 hover:text-rose-500"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Text Box Murni String */}
              <div className="relative">
                <input
                  id="input-task-date-text"
                  type="text"
                  value={dateString}
                  onChange={(e) => setDateString(e.target.value)}
                  placeholder="Ketik tanggal bebas (cth: Besok sore, Hari ini, Senin depan, 15 Okt)..."
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] focus:bg-white text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Quick String Chips: Simple pills easily drawn in free Figma */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-slate-400">Pilihan cepat:</span>
                {QUICK_DATE_STRINGS.map((str) => (
                  <button
                    key={str}
                    type="button"
                    onClick={() => setDateString(str)}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-colors ${
                      dateString === str
                        ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {str}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Action Bar: Kategori terbatas button & Tombol Simpan */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {/* Kategori Button */}
              <button
                id="btn-input-category"
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-sky-50 text-[#0284c7] border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Kategori: {category}</span>
              </button>

              {/* Submit Button */}
              <button
                id="btn-submit-task"
                type="submit"
                disabled={!title.trim()}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  title.trim()
                    ? 'bg-[#0284c7] hover:bg-sky-700 text-white active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Aktivitas</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sub-modal: Limited Categories */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        selectedCategory={category}
        onSelectCategory={(cat) => setCategory(cat)}
        availableCategories={availableCategories}
      />
    </>
  );
};
