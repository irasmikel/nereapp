import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { getTodayString } from '../utils/dateUtils';

export default function AllTasks() {
  const { tasks, toggleComplete, openEditTask, deleteTask, openAddTask } = useApp();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const today = getTodayString();

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (catFilter !== 'all') list = list.filter(t => t.category === catFilter);

    list.sort((a, b) => {
      if (sortBy === 'date') return (a.startDate || '').localeCompare(b.startDate || '');
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      return 0;
    });
    return list;
  }, [tasks, search, catFilter, sortBy]);

  const grouped = useMemo(() => {
    if (sortBy !== 'category') return null;
    const groups = {};
    filtered.forEach(t => { if (!groups[t.category]) groups[t.category] = []; groups[t.category].push(t); });
    return groups;
  }, [filtered, sortBy]);

  return (
    <motion.div className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

      {/* Header */}
      <div className="px-5 pt-8 pb-2 md:px-8 md:pt-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-warm-900 tracking-tight">Todas las tareas</h1>
          <p className="text-sm text-warm-400 mt-0.5">{tasks.length} tareas configuradas</p>
        </div>
        <button onClick={() => openAddTask()} className="btn-primary text-sm flex items-center gap-1.5">
          <Plus size={15} /> Nueva
        </button>
      </div>

      {/* Search */}
      <div className="px-5 md:px-8 mt-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input type="search" placeholder="Buscar tareas..." value={search}
            onChange={e => setSearch(e.target.value)} className="input pl-9" />
        </div>
      </div>

      {/* Category filter — visual chips */}
      <div className="px-5 md:px-8 mt-3 flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <button onClick={() => setCatFilter('all')}
          className={`chip shrink-0 ${catFilter === 'all' ? 'chip-active' : 'chip-inactive'}`}>
          Todas
        </button>
        {CATEGORIES.filter(c => tasks.some(t => t.category === c.id)).map(cat => (
          <button key={cat.id} onClick={() => setCatFilter(cat.id === catFilter ? 'all' : cat.id)}
            className="chip shrink-0 transition-all duration-150"
            style={catFilter === cat.id
              ? { background: cat.gradient, color: 'white' }
              : { backgroundColor: cat.bg, color: cat.color }}>
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="px-5 md:px-8 mt-3 flex gap-2 items-center">
        <span className="text-xs text-warm-400 font-medium">Ordenar:</span>
        {[['date', 'Fecha'], ['name', 'Nombre'], ['category', 'Habitación']].map(([id, label]) => (
          <button key={id} onClick={() => setSortBy(id)}
            className={`chip text-xs ${sortBy === id ? 'chip-active' : 'chip-inactive'}`}>
            {label}
          </button>
        ))}
      </div>

      <p className="px-5 md:px-8 mt-3 text-xs text-warm-400">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}{search && ` para "${search}"`}
      </p>

      {/* List */}
      <div className="px-5 md:px-8 mt-2 pb-10 space-y-2">
        {filtered.length === 0 && (
          <EmptyState emoji="🔍" title="Sin resultados" subtitle="Prueba otros filtros"
            action={<button onClick={() => { setSearch(''); setCatFilter('all'); }} className="btn-secondary text-sm">Limpiar filtros</button>} />
        )}

        {grouped ? (
          Object.entries(grouped).map(([catId, catTasks]) => {
            const cat = getCategoryById(catId);
            return (
              <div key={catId} className="mt-4 first:mt-0">
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>{cat.name}</span>
                  <span className="text-xs text-warm-300">({catTasks.length})</span>
                </div>
                <div className="space-y-2">
                  {catTasks.map(task => (
                    <TaskCard key={task.id} task={task} date={today}
                      onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} showDate />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((task, i) => (
              <motion.div key={task.id} layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.15) }}>
                <TaskCard task={task} date={today}
                  onComplete={toggleComplete} onEdit={openEditTask} onDelete={deleteTask} showDate />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
