import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { isTaskCompletedOnDate } from '../utils/taskUtils';
import {
  getTodayString, getMonthDates, getMonthName,
  formatDate, addDays, getDateString,
} from '../utils/dateUtils';

const DOW_LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function Calendar() {
  const { getTasksForDate, toggleComplete, openEditTask, deleteTask, openAddTask } = useApp();

  const today = getTodayString();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const days = getMonthDates(year, month);
  const selectedTasks = getTasksForDate(selectedDate);
  const selectedCompleted = selectedTasks.filter(t => isTaskCompletedOnDate(t, selectedDate));

  // Count tasks per day for dots
  const taskCounts = {};
  days.forEach(({ dateStr }) => {
    const tasks = getTasksForDate(dateStr);
    if (tasks.length > 0) {
      taskCounts[dateStr] = {
        total: tasks.length,
        completed: tasks.filter(t => isTaskCompletedOnDate(t, dateStr)).length,
      };
    }
  });

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 pt-8 pb-2 md:px-8 md:pt-10">
        <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">Calendario</h1>
      </div>

      {/* Month navigator */}
      <div className="px-5 md:px-8 mt-4">
        <div className="card p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="w-9 h-9 rounded-xl hover:bg-warm-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} className="text-warm-600" />
            </button>
            <h2 className="text-sm font-semibold text-warm-900 capitalize">
              {getMonthName(month, year)}
            </h2>
            <button
              onClick={nextMonth}
              className="w-9 h-9 rounded-xl hover:bg-warm-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} className="text-warm-600" />
            </button>
          </div>

          {/* DOW headers */}
          <div className="grid grid-cols-7 mb-2">
            {DOW_LABELS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-warm-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(({ dateStr, currentMonth }) => {
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const counts = taskCounts[dateStr];
              const allDone = counts && counts.completed === counts.total;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative flex flex-col items-center justify-center h-10 rounded-xl text-xs
                              font-medium transition-all duration-150
                              ${!currentMonth ? 'opacity-30' : ''}
                              ${isSelected ? 'bg-warm-900 text-white' : ''}
                              ${isToday && !isSelected ? 'ring-2 ring-sage-400 text-sage-700' : ''}
                              ${!isSelected && !isToday ? 'hover:bg-warm-100 text-warm-700' : ''}`}
                >
                  <span>{new Date(dateStr + 'T00:00:00').getDate()}</span>
                  {counts && (
                    <span className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected
                        ? 'bg-white/60'
                        : allDone
                        ? 'bg-sage-400'
                        : 'bg-amber-400'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div className="flex justify-center mt-3">
            <button
              onClick={() => { setSelectedDate(today); setCurrentDate(new Date()); }}
              className="text-xs text-warm-500 hover:text-warm-700 transition-colors font-medium"
            >
              Ir a hoy
            </button>
          </div>
        </div>
      </div>

      {/* Selected day tasks */}
      <div className="px-5 md:px-8 mt-5 pb-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-warm-800 capitalize">
              {formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <p className="text-xs text-warm-400 mt-0.5">
              {selectedTasks.length === 0
                ? 'Sin tareas'
                : `${selectedCompleted.length} de ${selectedTasks.length} completadas`}
            </p>
          </div>
          <button
            onClick={() => openAddTask({ startDate: selectedDate })}
            className="btn-sage text-xs py-2 px-3"
          >
            + Añadir
          </button>
        </div>

        {selectedTasks.length === 0 ? (
          <EmptyState
            emoji="📅"
            title="Día libre"
            subtitle="No hay tareas programadas para este día."
            action={
              <button onClick={() => openAddTask({ startDate: selectedDate })} className="btn-secondary text-sm">
                Añadir tarea aquí
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {selectedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                date={selectedDate}
                onComplete={toggleComplete}
                onEdit={openEditTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
