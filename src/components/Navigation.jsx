import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sun, CheckSquare, Calendar, BarChart2, Settings, Plus } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';

const NAV_ITEMS = [
  { to: '/',         icon: Home,        label: 'Inicio' },
  { to: '/today',    icon: Sun,         label: 'Hoy' },
  { to: '/tasks',    icon: CheckSquare, label: 'Tareas' },
  { to: '/calendar', icon: Calendar,    label: 'Calendario' },
  { to: '/stats',    icon: BarChart2,   label: 'Stats' },
  { to: '/settings', icon: Settings,    label: 'Ajustes' },
];

export default function Navigation() {
  const { openAddTask, stats } = useApp();
  const location = useLocation();

  return (
    <>
      {/* ── Desktop Sidebar ─── */}
      <aside className="hidden md:flex flex-col w-[220px] shrink-0 h-screen sticky top-0
                        border-r border-warm-200/60 py-8 px-4"
        style={{ background: 'linear-gradient(180deg, #fff 0%, #F7F5F2 100%)' }}>
        {/* Logo */}
        <div className="px-3 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-soft text-lg"
              style={{ background: 'linear-gradient(135deg, #7FB08F, #3D7250)' }}>
              🏡
            </div>
            <div>
              <p className="font-bold text-warm-900 text-[15px] tracking-tight">Hogar</p>
              <p className="text-[10px] text-warm-400 -mt-0.5">Gestión del hogar</p>
            </div>
          </div>
        </div>

        {/* Add Task Button */}
        <button onClick={() => openAddTask()}
          className="mx-3 mb-6 flex items-center gap-2.5 text-white rounded-2xl px-4 py-2.5
                     text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
          style={{ background: 'linear-gradient(135deg, #7FB08F, #3D7250)', boxShadow: '0 4px 14px rgba(61,114,80,0.3)' }}>
          <Plus size={16} /> Nueva tarea
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive ? 'text-warm-900' : 'text-warm-500 hover:text-warm-700 hover:bg-warm-50/80'}`}
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #EEF5F0, #E0EDE5)' } : {}}>
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8}
                    style={{ color: isActive ? '#3D7250' : undefined }} />
                  <span>{label}</span>
                  {to === '/today' && stats.todayTotal > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full
                      ${stats.todayCompleted === stats.todayTotal
                        ? 'bg-sage-100 text-sage-700' : 'bg-warm-200 text-warm-600'}`}>
                      {stats.todayCompleted}/{stats.todayTotal}
                    </span>
                  )}
                  {to === '/' && stats.overdueCount > 0 && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-500">
                      {stats.overdueCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pt-4 border-t border-warm-100">
          <p className="text-xs text-warm-300">v1.0 · Uso personal</p>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around
                      px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '0.5px solid #EBE7DF' }}>
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} end={to === '/'}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative min-w-[52px]">
              {isActive && (
                <motion.div layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #EEF5F0, #E0EDE5)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6}
                  style={{ color: isActive ? '#3D7250' : '#B8B2A6' }} />
                {to === '/today' && stats.overdueCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {stats.overdueCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold relative z-10"
                style={{ color: isActive ? '#3D7250' : '#B8B2A6' }}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
