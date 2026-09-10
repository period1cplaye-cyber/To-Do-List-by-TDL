import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedback: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenFeedback,
}) => {
  const [showFAQModal, setShowFAQModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div
        id="settings-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          id="settings-modal-card"
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-sky-50 px-5 py-4 border-b border-sky-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Pengaturan</h3>
            <button
              id="btn-close-settings"
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Settings List */}
          <div className="p-5 space-y-3">
            {/* FAQ */}
            <button
              id="btn-faq"
              type="button"
              onClick={() => setShowFAQModal(true)}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-xl text-left transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-800">FAQ (Pertanyaan Umum)</div>
                  <div className="text-[11px] text-slate-500">Pertanyaan seputar penggunaan TDL</div>
                </div>
              </div>
            </button>

            {/* Kritik dan Saran */}
            <button
              id="btn-feedback"
              type="button"
              onClick={() => {
                onClose();
                onOpenFeedback();
              }}
              className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 rounded-xl text-left transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#0284c7] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-slate-800">Kritik dan Saran</div>
                  <div className="text-[11px] text-slate-500">Kirimkan masukan pengembangan</div>
                </div>
              </div>
            </button>

            {/* Versi 1.0 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Info className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-800">Versi Aplikasi</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                Versi 1.0 (Demo)
              </span>
            </div>
          </div>

          <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 text-xs font-bold bg-[#0284c7] text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modal: FAQ */}
      {showFAQModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setShowFAQModal(false)}
        >
          <div
            className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-600">
                <HelpCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-800">Pertanyaan Umum (FAQ)</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowFAQModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Bagaimana cara menambahkan jadwal & aktivitas?</strong>
                Klik tombol (+) biru di sudut kanan bawah, ketik nama aktivitas, pilih tanggal, dan simpan.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Bagaimana cara memilih kategori aktivitas?</strong>
                Saat menambahkan tugas, klik tombol kategori untuk memilih kategori terbatas: Kesehatan, Kehidupan, Olahraga, Pikiran, atau Berhenti.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="block text-slate-900 mb-1">Apa arti logo ṪDL?</strong>
                ṪDL melambangkan To-Do List dengan tanda aksen titik kembar sebagai simbol target dan pencapaian.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowFAQModal(false)}
              className="mt-4 w-full py-2 bg-[#0284c7] text-white rounded-xl text-xs font-bold"
            >
              Tutup FAQ
            </button>
          </div>
        </div>
      )}
    </>
  );
};
