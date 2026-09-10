import React, { useState } from 'react';
import { X, Send, MessageSquareHeart, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback('');
      onClose();
    }, 1800);
  };

  return (
    <div
      id="feedback-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="feedback-modal-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sky-50 px-5 py-3.5 border-b border-sky-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-[#0284c7]" />
            <h3 className="font-bold text-slate-800 text-sm">Kritik dan Saran</h3>
          </div>
          <button
            id="btn-close-feedback"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-slate-800 text-sm">Terima Kasih!</h4>
              <p className="text-xs text-slate-500">
                Saran dan masukan Anda sangat berharga untuk kesempurnaan TDL.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Ada fitur yang ingin ditambahkan atau masukan terkait antarmuka? Ceritakan kepada kami:
              </p>

              <textarea
                id="input-feedback-text"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tulis kritik dan saran Anda di sini..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0284c7] focus:bg-white text-slate-800 placeholder-slate-400"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!feedback.trim()}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg shadow-xs transition-all ${
                    feedback.trim()
                      ? 'bg-[#0284c7] hover:bg-sky-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Saran</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
