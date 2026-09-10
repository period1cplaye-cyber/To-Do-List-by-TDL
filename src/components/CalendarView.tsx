import React, { useState } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onToggleStar,
  onDelete,
  onAddTaskForDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (t.dueDate) {
      if (!tasksByDate[t.dueDate]) tasksByDate[t.dueDate] = [];
      tasksByDate[t.dueDate].push(t);
    }
  });

  const selectedDayTasks = tasksByDate[selectedDateStr] || [];

  return (
    <div id="calendar-view-container" className="max-w-xl mx-auto px-4 py-4 space-y-4 pb-20">
      {/* Calendar Header Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              {monthNames[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="btn-prev-month"
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-today-month"
              type="button"
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDateStr(now.toISOString().split('T')[0]);
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#0284c7] bg-sky-50 rounded-lg hover:bg-sky-100"
            >
              Hari Ini
            </button>
            <button
              id="btn-next-month"
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center mb-2">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={`text-[11px] font-bold py-1 ${
                idx === 0 ? 'text-rose-500' : 'text-slate-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 sm:h-10" />
          ))}

          {/* Actual month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
            const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const isSelected = selectedDateStr === dateStr;
            const isToday = todayStr === dateStr;
            const dayTasks = tasksByDate[dateStr] || [];
            const hasTasks = dayTasks.length > 0;
            const allDone = hasTasks && dayTasks.every((t) => t.completed);

            return (
              <button
                key={dateStr}
                id={`cal-day-${dateStr}`}
                type="button"
                onClick={() => setSelectedDateStr(dateStr)}
                className={`relative h-9 sm:h-10 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0284c7] text-white shadow-sm scale-105 z-10'
                    : isToday
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{dayNum}</span>
                {hasTasks && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected
                        ? 'bg-[#f5b800]'
                        : allDone
                        ? 'bg-emerald-500'
                        : 'bg-[#0284c7]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800">
              Jadwal: {selectedDateStr}
            </h3>
            <p className="text-[11px] text-slate-500">
              {selectedDayTasks.length} tugas terjadwal
            </p>
          </div>

          <button
            id="btn-calendar-add-task"
            type="button"
            onClick={() => onAddTaskForDate(selectedDateStr)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-sky-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>

        {selectedDayTasks.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
            <p>Tidak ada tugas untuk tanggal ini.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Klik &quot;Tambah&quot; untuk menjadwalkan tugas.
            </p>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {selectedDayTasks.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
