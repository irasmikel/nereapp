import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, TrendingUp, Flame } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import ProgressRing from '../components/ProgressRing';
import EmptyState from '../components/EmptyState';
import { getGreeting, getTodayString, formatDate } from '../utils/dateUtils';
import { isTaskCompletedOnDate } from '../utils/taskUtils';
import { MOTIVATIONAL_MESSAGES } from '../data/categories';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { y: 16, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Dashboard() {
  const { getTodayTasks, getOverdueTasks, getUpcomingTasks, toggleComplete, openEditTask, deleteTask, stats, openAddTask, settings } = useApp();

  const today = getTodayString();
  const todayTasks = getTodayTasks();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks(5).slice(0, 5);
  const todayCompleted = todayTasks.filter(t => isTaskCompletedOnDate(t, today));

  const greeting = getGreeting();
  const motivational = MOTIVATIONAL_MESSAGES[new Date().getDay() % MOTIVATIONAL_MESSAGES.length];
  const todayFormatted = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ───────────────────────────────── */}
      <motion.div variants={item} className="px-5 pt-8 pb-2 md:px-8 md:pt-10">
        <p className="text-sm text-warm-400 capitalize">{todayFormatted}</p>
        <h1 className="text-2xl font-semibold text-warm-900 tracking-tight mt-0.5">
          {greeting} 👋
        </h1>
        {settings?.showMotivation && (
          <p className="text-sm text-warm-500 mt-1">{motivational}</p>
        )}
      </motion.div>

      {/* ── Today Summary Card ────────────────────── */}
      <motion.div variants={item} className="mx-5 md:mx-8 mt-4">
        <div className="card p-5 bg-gradient-to-br from-sage-50 to-white border-sage-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-sage-600 uppercase tracking-wider">Progreso de hoy</p>
              <p className="text-3xl font-semibold text-warm-900 mt-1">
                {todayCompleted.length}
                <span className="text-xl text-warm-400 font-normal"> / {todayTasks.length}</span>
              </p>
              <p className="text-sm text-warm-500 mt-0.5">
                {stats.todayProgress === 100 && todayTasks.length > 0
                  ? '¡Todo completado! 🎉'
                  : todayTasks.length === 0
                  ? 'Sin tareas para hoy'
                  : `${stats.todayProgress}% completado`}
              </p>
            </div>

            <ProgressRing
              progress={stats.todayProgress}
              size={88}
              strokeWidth={7}
              color="#7FB08F"
              trackColor="#D5E8DB"
            >
              <span className="text-base font-semibold text-warm-900">{stats.todayProgress}%</span>
            </ProgressRing>
          </div>

          {/* Quick stats row */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-sage-100">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-orange-400" />
              <div>
                <p className="text-xs text-warm-500">Racha</p>
                <p className="text-sm font-semibold text-warm-800">{stats.streak} días</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-sage-500" />
              <div>
                <p className="text-xs text-warm-500">Esta semana</p>
                <p className="text-sm font-semibold text-warm-800">{stats.weekRate}%</p>
              </div>
            </div>
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400" />
                <div>
                  <p className="text-xs text-warm-500">Atrasadas</p>
                  <p className="text-sm font-semibold text-red-600">{overdueTasks.length}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Overdue ───────────────────────────────── */}
      {overdueTasks.length > 0 && (
        <motion.div variants={item} className="mx-5 md:mx-8 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-warm-800 flex items-center gap-2">
              <AlertCircle size={15} className="text-red-400" />
              Atrasadas
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                {overdueTasks.length}
              </span>
            </h2>
          </div>
          <div className="space-y-2">
            {overdueTasks.slice(0, 3).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                date={task.startDate}
                onComplete={toggleComplete}
                onEdit={openEditTask}
                onDelete={deleteTask}
                compact
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Today's Tasks ─────────────────────────── */}
      <motion.div variants={item} className="mx-5 md:mx-8 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-warm-800">Tareas de hoy</h2>
          <Link to="/today" className="text-xs text-sage-600 font-medium flex items-center gap-1 hover:text-sage-700">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <EmptyState
            emoji="🌿"
            title="Sin tareas para hoy"
            subtitle="Disfruta tu día o añade algo nuevo"
            action={
              <button onClick={() => openAddTask()} className="btn-sage text-sm">
                + Añadir tarea
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {todayTasks.slice(0, 5).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                date={today}
                onComplete={toggleComplete}
                onEdit={openEditTask}
                onDelete={deleteTask}
              />
            ))}
            {todayTasks.length > 5 && (
              <Link to="/today" className="block text-center py-3 text-sm text-warm-500 hover:text-warm-700">
                Ver {todayTasks.length - 5} más...
              </Link>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Upcoming ──────────────────────────────── */}
      {upcomingTasks.length > 0 && (
        <motion.div variants={item} className="mx-5 md:mx-8 mt-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-warm-800">Próximamente</h2>
            <Link to="/calendar" className="text-xs text-sage-600 font-medium flex items-center gap-1 hover:text-sage-700">
              Calendario <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map(task => (
              <TaskCard
                key={`${task.id}-${task._dueDate}`}
                task={task}
                date={task._dueDate}
                onComplete={toggleComplete}
                onEdit={openEditTask}
                onDelete={deleteTask}
                showDate
                compact
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
