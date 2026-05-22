import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Flame, TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';
import { getGreeting, getTodayString, formatDate } from '../utils/dateUtils';
import { isTaskCompletedOnDate } from '../utils/taskUtils';
import { CATEGORIES, getCategoryById, MOTIVATIONAL_MESSAGES } from '../data/categories';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } } };

export default function Dashboard() {
  const { tasks, getTodayTasks, getOverdueTasks, getUpcomingTasks, toggleComplete, openEditTask, deleteTask, stats, openAddTask } = useApp();

  const today = getTodayString();
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(5).slice(0, 4);
  const todayCompleted = todayTasks.filter(t => isTaskCompletedOnDate(t, today));
  const todayLabel = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' });
  const motivational = MOTIVATIONAL_MESSAGES[new Date().getDay() % MOTIVATIONAL_MESSAGES.length];

  // Category summary
  const catSummary = CATEGORIES.map(cat => {
    const catTasks = todayTasks.filter(t => t.category === cat.id);
    const done = catTasks.filter(t => isTaskCompletedOnDate(t, today)).length;
    return { ...cat, total: catTasks.length, done };
  }).filter(c => c.total > 0);

  return (
    <motion.div className="max-w-2xl mx-auto w-full" variants={container} initial="hidden" animate="show">

      {/* ── Hero card ─────────────────────────────────── */}
      <motion.div variants={item} className="mx-4 mt-6 md:mx-8 md:mt-10">
        <div className="hero-card px-6 pt-6 pb-5 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -right-4 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative">
            <p className="text-green-200 text-sm capitalize font-medium">{todayLabel}</p>
            <h1 className="text-2xl font-bold text-white mt-1">{getGreeting()} 🏡</h1>
            <p className="text-green-200/80 text-sm mt-1">{motivational}</p>

            <div className="flex items-center justify-between mt-5">
              <div>
                <p className="text-green-100/70 text-xs font-medium uppercase tracking-wider">Progreso hoy</p>
                <p className="text-4xl font-bold text-white mt-1">
                  {todayCompleted.length}
                  <span className="text-2xl text-green-200/70 font-normal"> / {todayTasks.length}</span>
                </p>
                <p className="text-green-100/80 text-sm mt-1">
                  {stats.todayProgress === 100 && todayTasks.length > 0
                    ? '¡Todo completado! 🎉'
                    : todayTasks.length === 0 ? 'Sin tareas hoy'
                    : `${stats.todayProgress}% completado`}
                </p>
              </div>
              <ProgressRing progress={stats.todayProgress} size={90} strokeWidth={7} color="white" trackColor="rgba(255,255,255,0.2)">
                <span className="text-base font-bold text-white">{stats.todayProgress}%</span>
              </ProgressRing>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${stats.todayProgress}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }} />
            </div>

            {/* Mini stats */}
            <div className="flex gap-4 mt-4 pt-4 border-t border-white/15">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-orange-300" />
                <div>
                  <p className="text-[10px] text-green-200/60 uppercase tracking-wider">Racha</p>
                  <p className="text-sm font-semibold text-white">{stats.streak} días</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={15} className="text-green-300" />
                <div>
                  <p className="text-[10px] text-green-200/60 uppercase tracking-wider">Semana</p>
                  <p className="text-sm font-semibold text-white">{stats.weekRate}%</p>
                </div>
              </div>
              {overdueTasks.length > 0 && (
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-red-300" />
                  <div>
                    <p className="text-[10px] text-green-200/60 uppercase tracking-wider">Atrasadas</p>
                    <p className="text-sm font-semibold text-red-200">{overdueTasks.length}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Category rooms scroll ─────────────────────── */}
      {catSummary.length > 0 && (
        <motion.div variants={item} className="mt-5">
          <div className="flex items-center justify-between px-5 md:px-8 mb-3">
            <h2 className="text-sm font-bold text-warm-700 uppercase tracking-wider">Habitaciones</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 md:px-8 pb-1 scrollbar-none">
            {catSummary.map(cat => (
              <motion.div key={cat.id} whileTap={{ scale: 0.95 }}
                className="shrink-0 rounded-2xl p-4 w-28 cursor-pointer"
                style={{ background: cat.gradient, boxShadow: `0 4px 14px ${cat.color}33` }}>
                <span className="text-2xl block mb-2">{cat.emoji}</span>
                <p className="text-white text-xs font-bold leading-tight">{cat.name}</p>
                <p className="text-white/70 text-[10px] mt-1">{cat.done}/{cat.total}</p>
                <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${cat.total > 0 ? Math.round(cat.done / cat.total * 100) : 0}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Overdue ───────────────────────────────────── */}
      {overdueTasks.length > 0 && (
        <motion.div variants={item} className="mx-5 md:mx-8 mt-5">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={15} className="text-red-400" />
              <h2 className="text-sm font-bold text-red-700">
                Atrasadas <span className="bg-red-100 text-red-500 text-xs px-2 py-0.5 rounded-full ml-1">{overdueTasks.length}</span>
              </h2>
            </div>
            <div className="space-y-2">
              {overdueTasks.slice(0, 2).map(task => (
                <TaskCard key={task.id} task={task} date={task.startDate}
                  onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} compact />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Today's Tasks ─────────────────────────────── */}
      <motion.div variants={item} className="mx-5 md:mx-8 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-warm-700 uppercase tracking-wider">Tareas de hoy</h2>
          <Link to="/today" className="text-xs text-sage-600 font-semibold flex items-center gap-1 hover:text-sage-700">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <EmptyState emoji="🌿" title="Sin tareas para hoy"
            subtitle="Disfruta tu día o añade algo nuevo"
            action={<button onClick={() => openAddTask()} className="btn-sage text-sm">+ Añadir tarea</button>} />
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map(task => (
              <TaskCard key={task.id} task={task} date={today}
                onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} />
            ))}
            {todayTasks.length > 5 && (
              <Link to="/today" className="block text-center py-2.5 text-sm text-warm-400 hover:text-warm-600 font-medium">
                +{todayTasks.length - 5} más...
              </Link>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Upcoming ──────────────────────────────────── */}
      {upcomingTasks.length > 0 && (
        <motion.div variants={item} className="mx-5 md:mx-8 mt-5 mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-warm-700 uppercase tracking-wider">Próximamente</h2>
            <Link to="/calendar" className="text-xs text-sage-600 font-semibold flex items-center gap-1">
              Calendario <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task, i) => (
              <TaskCard key={`${task.id}-${i}`} task={task} date={task._dueDate}
                onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} showDate />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
