import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Sun, CheckSquare, Calendar, BarChart2, Settings, Plus,
} from 'lucide-react';
import { useApp } from '../hooks/useAppContext';

const NAV_ITEMS = [
  { to: '/',          icon: Home,         label: 'Inicio' },
  { to: '/today',     icon: Sun,          label: 'Hoy' },
  { to: '/tasks',     icon: CheckSquare,  label: 'Tareas' },
  { to: '/calendar',  icon: Calendar,     label: 'Calendario' },
  { to: '/stats',     icon: BarChart2,    label: 'Stats' },
  { to: '/settings',  icon: Settings,     label: 'Ajustes' },
];

export default function Navigation() {
  const { openAddTask, stats } = useApp();
  const location = useLocation();

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 h-screen sticky top-0 border-r border-warm-200/60 bg-white/80 backdrop-blur-xl py-8 px-4">
        {/* Logo */}
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-sage-500 rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-white text-base">🏡</span>
            </div>
            <span className="font-semibold text-warm-900 tracking-tight text-[15px]">Hogar</span>
          </div>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => openAddTask()}
          className="mx-3 mb-6 flex items-center gap-2.5 bg-warm-900 text-white rounded-2xl px-4 py-2.5
                     text-sm font-medium transition-all duration-200 hover:bg-warm-800 active:scale-[0.97]"
        >
          <Plus size={16} />
          Nueva tarea
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-warm-100 text-warm-900'
                   : 'text-warm-500 hover:text-warm-700 hover:bg-warm-50'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{label}</span>
                  {to === '/today' && stats.todayTotal > 0 && (
                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full
                      ${stats.todayCompleted === stats.todayTotal
                        ? 'bg-sage-100 text-sage-700'
                        : 'bg-warm-200 text-warm-600'}`}>
                      {stats.todayCompleted}/{stats.todayTotal}
                    </span>
                  )}
                  {to === '/' && stats.overdueCount > 0 && (
                    <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      {stats.overdueCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pt-4 border-t border-warm-100">
          <p className="text-xs text-warm-400">v1.0.0 · Solo para uso personal</p>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl
                      border-t border-warm-200/60 flex items-center justify-around
                      px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label }) => {
          const isActive = to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-warm-100 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.6}
                  className={isActive ? 'text-warm-900' : 'text-warm-400'}
                />
                {to === '/today' && stats.overdueCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {stats.overdueCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium relative z-10 ${isActive ? 'text-warm-900' : 'text-warm-400'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
