import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  category: string;
  onAddTask: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ category, onAddTask }) => {
  return (
    <div id="empty-state-container" className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-sm mx-auto">
      {/* Hand-drawn style vector illustration matching Figma */}
      <div className="w-56 h-56 relative mb-6">
        <svg
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-slate-800"
        >
          {/* Desk line */}
          <line x1="20" y1="190" x2="220" y2="190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="198" x2="210" y2="198" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.4" />

          {/* Notebook on desk */}
          <path
            d="M 85 185 L 145 185 L 155 170 L 95 170 Z"
            fill="#f8fafc"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line x1="120" y1="170" x2="115" y2="185" stroke="currentColor" strokeWidth="1.5" />
          <line x1="95" y1="175" x2="110" y2="175" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="93" y1="180" x2="112" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="125" y1="175" x2="145" y2="175" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="123" y1="180" x2="142" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Pencil cup holder with pencils */}
          <rect x="165" y="165" width="22" height="24" rx="2" fill="#e2e8f0" stroke="currentColor" strokeWidth="2" />
          <line x1="170" y1="165" x2="167" y2="145" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="176" y1="165" x2="176" y2="140" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="181" y1="165" x2="184" y2="148" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Character Body / Sleeves / Arms */}
          <path
            d="M 65 190 C 65 160 85 150 115 150 C 145 150 160 165 160 190"
            fill="#f1f5f9"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Arm resting on desk */}
          <path
            d="M 90 155 Q 75 168 85 185"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Arm holding chin */}
          <path
            d="M 125 152 Q 138 140 135 125"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hand at chin */}
          <circle cx="135" cy="123" r="5" fill="#fed7aa" stroke="currentColor" strokeWidth="1.5" />

          {/* Character Head */}
          <circle cx="118" cy="105" r="22" fill="#fff" stroke="currentColor" strokeWidth="2" />
          {/* Hair / bang */}
          <path
            d="M 98 100 C 100 85 125 85 138 95 C 130 92 110 93 102 104"
            fill="currentColor"
          />
          {/* Eyes & smile (closed thoughtful eyes) */}
          <path d="M 108 106 Q 112 103 115 106" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 122 106 Q 126 103 129 106" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Subtle gentle smile */}
          <path d="M 116 116 Q 120 119 125 116" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Soft cheek blush */}
          <circle cx="106" cy="112" r="3" fill="#fecdd3" opacity="0.6" />
          <circle cx="130" cy="112" r="3" fill="#fecdd3" opacity="0.6" />

          {/* Thought bubble with idea */}
          <path
            d="M 148 85 C 145 80 148 72 156 70 C 158 62 169 60 176 64 C 183 58 194 62 195 70 C 202 74 201 83 196 88 C 198 94 190 99 184 97 C 178 102 168 99 164 94 C 156 96 150 91 148 85 Z"
            fill="#fef9c3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="140" cy="94" r="3" fill="#fef9c3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="134" cy="99" r="2" fill="#fef9c3" stroke="currentColor" strokeWidth="1.5" />

          {/* Lightbulb / Idea symbol inside thought bubble */}
          <path
            d="M 172 74 C 170 77 172 80 174 81 L 178 81 C 180 80 182 77 180 74 C 179 70 173 70 172 74 Z"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <line x1="174" y1="83" x2="178" y2="83" stroke="#b45309" strokeWidth="1.2" />
          <line x1="176" y1="67" x2="176" y2="69" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="168" y1="71" x2="170" y2="72" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="184" y1="71" x2="182" y2="72" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-1 font-sans">
        Belum ada tugas di kategori {category}
      </h3>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-xs">
        Rencanakan hari Anda dengan rapi. Tambahkan tugas baru, acara, atau target impian Anda!
      </p>

      <button
        id="btn-empty-add-task"
        type="button"
        onClick={onAddTask}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-sky-700 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        Tambah Tugas Baru
      </button>
    </div>
  );
};
