import { motion } from 'framer-motion';
import { Flame, TrendingUp, CheckCircle, Target } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { formatDate, getDateString, addDays } from '../utils/dateUtils';

function MiniBar({ value, max, color = '#7FB08F' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="relative h-full w-full flex flex-col justify-end">
      <div
        className="rounded-sm w-full transition-all duration-700"
        style={{ height: `${pct}%`, backgroundColor: color, minHeight: value > 0 ? 3 : 0 }}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = 'text-warm-900', bg = 'bg-warm-50' }) {
  return (
    <div className={`card p-4 ${bg}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-warm-500 font-medium">{label}</p>
          <p className={`text-2xl font-semibold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-warm-400 mt-0.5">{sub}</p>}
        </div>
        {Icon && <Icon size={20} className={`${color} opacity-60 mt-0.5`} />}
      </div>
    </div>
  );
}

export default function Statistics() {
  const { stats, tasks } = useApp();

  const { weekStats, monthStats, categoryStats, streak, totalCompleted, weekRate } = stats;

  const maxWeekDue = Math.max(...(weekStats || []).map(d => d.due), 1);

  const categoryBreakdown = CATEGORIES.map(cat => {
    const cs = categoryStats?.[cat.id] || { total: 0, completed: 0 };
    return {
      ...cat,
      total: cs.total,
      completed: cs.completed,
      rate: cs.total > 0 ? Math.round((cs.completed / cs.total) * 100) : 0,
    };
  }).filter(c => c.total > 0).sort((a, b) => b.completed - a.completed);

  const maxCatCompleted = Math.max(...categoryBreakdown.map(c => c.completed), 1);

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-8 pb-2 md:px-8 md:pt-10">
        <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">Estadísticas</h1>
        <p className="text-sm text-warm-400 mt-0.5">Tu progreso y constancia</p>
      </div>

      {/* Key stats */}
      <div className="px-5 md:px-8 mt-4 grid grid-cols-2 gap-3">
        <StatCard
          icon={Flame}
          label="Racha actual"
          value={`${streak} días`}
          sub="sin romper"
          color="text-orange-500"
          bg="bg-orange-50"
        />
        <StatCard
          icon={CheckCircle}
          label="Total completadas"
          value={totalCompleted}
          sub="tareas históricas"
          color="text-sage-600"
          bg="bg-sage-50"
        />
        <StatCard
          icon={TrendingUp}
          label="Esta semana"
          value={`${weekRate}%`}
          sub="completado"
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <StatCard
          icon={Target}
          label="Tareas activas"
          value={tasks.length}
          sub="configuradas"
          color="text-warm-700"
        />
      </div>

      {/* Weekly chart */}
      <div className="px-5 md:px-8 mt-5">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-warm-800 mb-4">Últimos 7 días</h2>
          <div className="flex items-end gap-2 h-28">
            {(weekStats || []).map((day, i) => {
              const date = getDateString(addDays(new Date(), -(6 - i)));
              const label = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' });
              const pctDue  = day.due > 0 ? Math.round((day.due / maxWeekDue) * 100) : 0;
              const pctDone = day.due > 0 ? Math.round((day.completed / maxWeekDue) * 100) : 0;
              const isToday = i === 6;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex-1 flex gap-0.5 items-end relative">
                    {/* Due bar (background) */}
                    {day.due > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-sm bg-warm-100"
                        style={{ height: `${pctDue}%` }}
                      />
                    )}
                    {/* Completed bar (foreground) */}
                    {day.completed > 0 && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 rounded-sm"
                        style={{ backgroundColor: isToday ? '#7FB08F' : '#AECFB9' }}
                        initial={{ height: 0 }}
                        animate={{ height: `${pctDone}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5, ease: 'easeOut' }}
                      />
                    )}
                    {day.rate !== null && (
                      <div className="absolute -top-5 left-0 right-0 text-center text-[9px] font-medium text-warm-400">
                        {day.rate}%
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium capitalize ${isToday ? 'text-sage-600' : 'text-warm-400'}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-warm-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-sage-300" />
              <span className="text-[11px] text-warm-500">Completadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-warm-100" />
              <span className="text-[11px] text-warm-500">Planificadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="px-5 md:px-8 mt-5 pb-10">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-warm-800 mb-4">Por habitación</h2>
            <div className="space-y-3">
              {categoryBreakdown.map(cat => (
                <div key={cat.id} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center shrink-0">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-warm-700">{cat.name}</span>
                      <span className="text-xs text-warm-400">{cat.completed}/{cat.total}</span>
                    </div>
                    <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.rate}%` }}
                        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-warm-600 w-9 text-right shrink-0">
                    {cat.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
