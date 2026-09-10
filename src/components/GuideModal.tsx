import React from 'react';
import { X, BookOpen, CheckSquare, Calendar, Star, Tag, Smartphone } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: CheckSquare,
      title: '1. Membuat Tugas Baru',
      desc: 'Klik tombol bulat (+) di pojok kanan bawah. Masukkan nama tugas, pilih kategori, dan atur tanggal jika perlu.',
    },
    {
      icon: Tag,
      title: '2. Memilih Kategori',
      desc: 'Gunakan filter tab di atas (Kerja, Wishlist, Kesehatan, dll.) untuk melihat tugas berdasarkan jenis aktivitas.',
    },
    {
      icon: Calendar,
      title: '3. Jadwal & Kalender',
      desc: 'Buka tab Kalender di navigasi bawah untuk melihat jadwal tugas bulanan atau merencanakan tugas per hari.',
    },
    {
      icon: Star,
      title: '4. Bintangi Tugas Prioritas',
      desc: 'Klik ikon bintang pada tugas penting. Anda bisa memfilter tugas berbintang lewat Sidebar menu.',
    },
    {
      icon: Smartphone,
      title: '5. Navigasi & Profil',
      desc: 'Buka menu samping melalui ikon garis tiga di kiri atas untuk pengaturan dan ubah tampilan desain.',
    },
  ];

  return (
    <div
      id="guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="guide-modal-card"
        className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sky-50 px-5 py-3.5 border-b border-sky-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0284c7]" />
            <h3 className="font-bold text-slate-800 text-sm">Panduan Pengguna TDL</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Selamat datang di aplikasi To-Do List (TDL). Berikut adalah panduan cepat untuk memaksimalkan produktivitas Anda:
          </p>

          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="p-2 bg-sky-100 text-[#0284c7] rounded-lg shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{step.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-2 bg-[#0284c7] text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition-colors shadow-xs"
          >
            Siap Menggunakan Aplikasi!
          </button>
        </div>
      </div>
    </div>
  );
};
