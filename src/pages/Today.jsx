import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CheckCircle2, Plus } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';
import { getTodayString, formatDate } from '../utils/dateUtils';
import { isTaskCompletedOnDate } from '../utils/taskUtils';

export default function Today() {
  const { getTodayTasks, toggleComplete, openEditTask, deleteTask, openAddTask } = useApp();
  const [filter, setFilter] = useState('all');

  const today = getTodayString();
  const allTasks = getTodayTasks();
  const completed = allTasks.filter(t => isTaskCompletedOnDate(t, today));
  const pending   = allTasks.filter(t => !isTaskCompletedOnDate(t, today));
  const progress  = allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0;
  const todayLabel = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' });

  const displayed = filter === 'all' ? allTasks : filter === 'pending' ? pending : completed;
  const sorted = [...displayed].sort((a, b) => {
    const ac = isTaskCompletedOnDate(a, today), bc = isTaskCompletedOnDate(b, today);
    return ac === bc ? 0 : ac ? 1 : -1;
  });

  return (
    <motion.div className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-4 md:px-8 md:pt-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FDE68A, #F59E0B)' }}>
                <Sun size={18} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-warm-900 tracking-tight">Hoy</h1>
            </div>
            <p className="text-sm text-warm-400 mt-1 capitalize ml-11">{todayLabel}</p>
          </div>
          <ProgressRing progress={progress} size={64} strokeWidth={5} color="#3D7250" trackColor="#D5E8DB">
            <span className="text-xs font-bold text-warm-800">{progress}%</span>
          </ProgressRing>
        </div>

        {/* All done banner */}
        {progress === 100 && allTasks.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mt-4 rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, #EEF5F0, #D5E8DB)', border: '1px solid #AECFB9' }}>
            <CheckCircle2 size={20} style={{ color: '#3D7250' }} className="shrink-0" />
            <div>
              <p className="text-sm font-bold" style={{ color: '#3D7250' }}>¡Todo listo por hoy! 🎉</p>
              <p className="text-xs" style={{ color: '#5A9470' }}>Has completado todas las tareas del día.</p>
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
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`chip text-xs ${filter === f.id ? 'chip-active' : 'chip-inactive'}`}>
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="px-5 md:px-8 pb-10 space-y-2">
        {sorted.length === 0 && allTasks.length === 0 && (
          <EmptyState emoji="☀️" title="Sin tareas para hoy"
            subtitle="Añade tareas o configura repeticiones para verlas aquí cada día."
            action={<button onClick={() => openAddTask({ startDate: today })} className="btn-sage text-sm">+ Nueva tarea para hoy</button>} />
        )}
        {sorted.length === 0 && allTasks.length > 0 && (
          <EmptyState emoji="✅" title="Sección vacía" subtitle="Prueba otro filtro." />
        )}

        <AnimatePresence mode="popLayout">
          {sorted.map((task, i) => (
            <motion.div key={task.id} layout
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15 } }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 }}>
              <TaskCard task={task} date={today}
                onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} />
            </motion.div>
          ))}
        </AnimatePresence>

        {allTasks.length > 0 && (
          <button onClick={() => openAddTask({ startDate: today })}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-warm-200
                       text-sm text-warm-400 hover:border-sage-300 hover:text-sage-500
                       transition-all duration-200 mt-2 font-medium">
            + Añadir tarea para hoy
          </button>
        )}
      </div>
    </motion.div>
  );
}
