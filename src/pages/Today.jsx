import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CheckCircle2 } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import { getTodayString, formatDate } from '../utils/dateUtils';
import { isTaskCompletedOnDate } from '../utils/taskUtils';

export default function Today() {
  const { getTodayTasks, toggleComplete, openEditTask, deleteTask, openAddTask } = useApp();
  const [filter, setFilter] = useState('all'); // all | pending | done

  const today = getTodayString();
  const allTasks = getTodayTasks();
  const completed = allTasks.filter(t => isTaskCompletedOnDate(t, today));
  const pending   = allTasks.filter(t => !isTaskCompletedOnDate(t, today));
  const progress  = allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0;

  const displayed = filter === 'all' ? allTasks : filter === 'pending' ? pending : completed;

  // Sort: pending first, then completed
  const sorted = [...displayed].sort((a, b) => {
    const aC = isTaskCompletedOnDate(a, today);
    const bC = isTaskCompletedOnDate(b, today);
    if (aC !== bC) return aC ? 1 : -1;
    const prio = { high: 0, medium: 1, low: 2 };
    return (prio[a.priority] ?? 1) - (prio[b.priority] ?? 1);
  });

  const todayLabel = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 pt-8 md:px-8 md:pt-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sun size={20} className="text-amber-400" />
              <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">Hoy</h1>
            </div>
            <p className="text-sm text-warm-400 mt-0.5 capitalize">{todayLabel}</p>
          </div>

          <ProgressRing progress={progress} size={64} strokeWidth={5} color="#7FB08F" trackColor="#D5E8DB">
            <span className="text-xs font-semibold text-warm-700">{progress}%</span>
          </ProgressRing>
        </div>

        {/* All-done state */}
        {progress === 100 && allTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-sage-50 border border-sage-100 rounded-2xl px-4 py-3 flex items-center gap-3"
          >
            <CheckCircle2 size={20} className="text-sage-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-sage-800">¡Todo listo por hoy! 🎉</p>
              <p className="text-xs text-sage-600">Has completado todas las tareas del día.</p>
            </div>
          </motion.div>
        )}

        {/* Filter chips */}
        {allTasks.length > 0 && (
          <div className="flex gap-2 mt-4">
            {[
              { id: 'all',     label: `Todas (${allTasks.length})` },
              { id: 'pending', label: `Pendientes (${pending.length})` },
              { id: 'done',    label: `Hechas (${completed.length})` },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`chip text-xs ${filter === f.id ? 'chip-active' : 'chip-inactive'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="px-5 md:px-8 mt-4 pb-10 space-y-2">
        {sorted.length === 0 && allTasks.length === 0 && (
          <EmptyState
            emoji="☀️"
            title="Sin tareas para hoy"
            subtitle="Añade tareas o configura repeticiones para verlas aquí cada día."
            action={
              <button onClick={() => openAddTask({ startDate: today })} className="btn-sage text-sm">
                + Nueva tarea para hoy
              </button>
            }
          />
        )}

        {sorted.length === 0 && allTasks.length > 0 && (
          <EmptyState emoji="✅" title="Sección vacía" subtitle="Prueba otro filtro." />
        )}

        <AnimatePresence mode="popLayout">
          {sorted.map((task, i) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
            >
              <TaskCard
                task={task}
                date={today}
                onComplete={toggleComplete}
                onEdit={openEditTask}
                onDelete={deleteTask}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add more */}
        {allTasks.length > 0 && (
          <button
            onClick={() => openAddTask({ startDate: today })}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-warm-200
                       text-sm text-warm-400 hover:border-warm-300 hover:text-warm-500
                       transition-all duration-200 mt-2"
          >
            + Añadir tarea para hoy
          </button>
        )}
      </div>
    </motion.div>
  );
}
