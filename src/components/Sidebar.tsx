import React from 'react';
import { Settings, BookOpen, MessageSquare, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  onOpenFeedback: () => void;
  stats: {
    total: number;
    completed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  onOpenGuide,
  onOpenFeedback,
  stats,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="sidebar-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="sidebar-drawer"
        className="w-72 sm:w-80 h-full bg-white shadow-2xl flex flex-col justify-between border-r border-slate-200 animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with deep blue banner and yellow ṪDL logo matching Figma */}
        <div>
          <div className="bg-[#0284c7] px-6 py-6 text-white relative">
            <button
              id="btn-close-sidebar"
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-sky-200 hover:text-white p-1.5 rounded-full hover:bg-sky-800/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Figma Logo ṪDL */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5b800]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f5b800]" />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-[#f5b800] font-serif leading-none">
                  ṪDL
                </h2>
              </div>
              <div className="ml-2 pl-2 border-l border-sky-400/40">
                <p className="text-xs font-bold uppercase tracking-wider text-white">To-Do List</p>
                <p className="text-[10px] text-sky-100">Rencanakan & Selesaikan</p>
              </div>
            </div>

            {/* Quick mini stats */}
            <div className="mt-4 pt-3 border-t border-sky-500/40 flex items-center justify-between text-xs text-sky-100">
              <span>Tersisa: {stats.total - stats.completed}</span>
              <span>Selesai: {stats.completed}/{stats.total}</span>
            </div>
          </div>

          {/* Nav Menu List matching Figma without language, theme, and star */}
          <nav className="p-4 space-y-1.5">
            {/* Pengaturan */}
            <button
              id="sidebar-item-pengaturan"
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-sky-50 hover:text-[#0284c7] rounded-xl text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 group-hover:bg-sky-100 rounded-lg text-slate-600 group-hover:text-[#0284c7] transition-colors">
                  <Settings className="w-4 h-4" />
                </div>
                <span>Pengaturan</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284c7]" />
            </button>

            {/* Panduan Pengguna */}
            <button
              id="sidebar-item-panduan-pengguna"
              type="button"
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-sky-50 hover:text-[#0284c7] rounded-xl text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 group-hover:bg-sky-100 rounded-lg text-slate-600 group-hover:text-[#0284c7] transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span>Panduan Pengguna</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284c7]" />
            </button>

            {/* Kritik dan Saran */}
            <button
              id="sidebar-item-kritik-saran"
              type="button"
              onClick={() => {
                onClose();
                onOpenFeedback();
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-sky-50 hover:text-[#0284c7] rounded-xl text-xs font-semibold transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 group-hover:bg-sky-100 rounded-lg text-slate-600 group-hover:text-[#0284c7] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span>Kritik dan Saran</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284c7]" />
            </button>
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 m-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>To Do List BY Team TDL</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Versi demo &bull; Versi ini merupakan demo</p>
        </div>
      </div>
    </div>
  );
};
