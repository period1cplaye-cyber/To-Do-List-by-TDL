import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, RotateCw, Check } from 'lucide-react';

interface DateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate?: string;
  currentTime?: string;
  currentRepeat?: 'Tidak ada' | 'Harian' | 'Mingguan' | 'Bulanan';
  onSaveDate: (data: {
    dueDate?: string;
    dueTime?: string;
    repeat?: 'Tidak ada' | 'Harian' | 'Mingguan' | 'Bulanan';
  }) => void;
}

export const DateModal: React.FC<DateModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  currentTime,
  currentRepeat = 'Tidak ada',
  onSaveDate,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(currentDate || todayStr);
  const [selectedTime, setSelectedTime] = useState<string>(currentTime || '12:00');
  const [hasTimeReminder, setHasTimeReminder] = useState<boolean>(Boolean(currentTime));
  const [repeatOption, setRepeatOption] = useState<'Tidak ada' | 'Harian' | 'Mingguan' | 'Bulanan'>(currentRepeat);

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveDate({
      dueDate: selectedDate,
      dueTime: hasTimeReminder ? selectedTime : undefined,
      repeat: repeatOption,
    });
    onClose();
  };

  const handleClear = () => {
    onSaveDate({
      dueDate: undefined,
      dueTime: undefined,
      repeat: 'Tidak ada',
    });
    onClose();
  };

  return (
    <div
      id="date-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="date-modal-card"
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sky-50 px-5 py-3.5 border-b border-sky-100 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#0284c7]" />
          <h3 className="font-bold text-slate-800 text-sm">Pilih Tanggal & Waktu</h3>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick choices matching Figma: Hari ini, Besok */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Jadwal Cepat:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-quick-today"
                onClick={() => setSelectedDate(todayStr)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                  selectedDate === todayStr
                    ? 'bg-sky-50 border-[#0284c7] text-[#0284c7] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Hari ini</span>
                {selectedDate === todayStr && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                id="btn-quick-tomorrow"
                onClick={() => setSelectedDate(tomorrowStr)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                  selectedDate === tomorrowStr
                    ? 'bg-sky-50 border-[#0284c7] text-[#0284c7] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>Besok</span>
                {selectedDate === tomorrowStr && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Custom Date Input */}
          <div>
            <label htmlFor="custom-date-picker" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Tanggal Spesifik:
            </label>
            <input
              type="date"
              id="custom-date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
            />
          </div>

          {/* Peringatan / Reminder Time */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                Peringatan Jam:
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-reminder-time"
                  checked={hasTimeReminder}
                  onChange={(e) => setHasTimeReminder(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0284c7]"></div>
              </label>
            </div>

            {hasTimeReminder && (
              <input
                type="time"
                id="input-reminder-time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
              />
            )}
          </div>

          {/* Ulangi / Repeat Option */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
              <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
              Ulangi Tugas:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Tidak ada', 'Harian', 'Mingguan', 'Bulanan'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRepeatOption(opt)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-colors ${
                    repeatOption === opt
                      ? 'bg-sky-50 border-[#0284c7] text-[#0284c7] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer matching Figma: Batal, Selesai */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <button
            id="btn-clear-date"
            type="button"
            onClick={handleClear}
            className="text-[11px] font-medium text-rose-500 hover:text-rose-700"
          >
            Hapus Jadwal
          </button>
          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-date"
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
            >
              Batal
            </button>
            <button
              id="btn-done-date"
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 text-xs font-bold bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg shadow-sm transition-all active:scale-95"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
