import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { useApp } from '../hooks/useAppContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import { CATEGORIES, getCategoryById } from '../data/categories';
import { isTaskDueOnDate, isTaskCompletedOnDate } from '../utils/taskUtils';
import { getTodayString } from '../utils/dateUtils';

const SORT_OPTIONS = [
  { id: 'priority', label: 'Prioridad' },
  { id: 'date',     label: 'Fecha' },
  { id: 'category', label: 'Categoría' },
  { id: 'name',     label: 'Nombre' },
];

export default function AllTasks() {
  const { tasks, toggleComplete, openEditTask, deleteTask, openAddTask } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  const today = getTodayString();

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'all') {
      list = list.filter(t => t.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      list = list.filter(t => t.priority === priorityFilter);
    }

    const prio = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      switch (sortBy) {
        case 'priority': return (prio[a.priority] ?? 1) - (prio[b.priority] ?? 1);
        case 'date':     return (a.startDate || '').localeCompare(b.startDate || '');
        case 'category': return (a.category || '').localeCompare(b.category || '');
        case 'name':     return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return list;
  }, [tasks, search, categoryFilter, priorityFilter, sortBy]);

  // Group by category when sorted by category
  const grouped = useMemo(() => {
    if (sortBy !== 'category') return null;
    const groups = {};
    filtered.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filtered, sortBy]);

  return (
    <motion.div
      className="max-w-2xl mx-auto w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader
        title="Todas las tareas"
        subtitle={`${tasks.length} tareas en total`}
        action={
          <button onClick={() => openAddTask()} className="btn-primary text-sm">
            <Plus size={15} className="inline -mt-0.5 mr-1" /> Nueva
          </button>
        }
      />

      {/* Search */}
      <div className="px-5 md:px-8">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="search"
            placeholder="Buscar tareas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {/* Filter toggle */}
      <div className="px-5 md:px-8 mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`chip shrink-0 ${showFilters ? 'chip-active' : 'chip-inactive'}`}
        >
          <Filter size={12} /> Filtros
        </button>

        {/* Category quick filters */}
        <button
          onClick={() => setCategoryFilter('all')}
          className={`chip shrink-0 ${categoryFilter === 'all' ? 'chip-active' : 'chip-inactive'}`}
        >
          Todas
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id === categoryFilter ? 'all' : cat.id)}
            className={`chip shrink-0 transition-all duration-150`}
            style={categoryFilter === cat.id
              ? { backgroundColor: cat.color, color: '#fff' }
              : { backgroundColor: cat.bg, color: cat.color }}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-8 mt-3 flex flex-wrap gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-warm-500 font-medium">Prioridad:</span>
                {['all', 'high', 'medium', 'low'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`chip text-xs ${priorityFilter === p ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {p === 'all' ? 'Todas' : p === 'high' ? '🔴 Alta' : p === 'medium' ? '🟡 Media' : '🟢 Baja'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-warm-500 font-medium">Ordenar:</span>
                {SORT_OPTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id)}
                    className={`chip text-xs ${sortBy === s.id ? 'chip-active' : 'chip-inactive'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="px-5 md:px-8 mt-3 text-xs text-warm-400">
        {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
        {search && ` para "${search}"`}
      </p>

      {/* Task list */}
      <div className="px-5 md:px-8 mt-2 pb-10 space-y-2">
        {filtered.length === 0 && (
          <EmptyState
            emoji="🔍"
            title="Sin resultados"
            subtitle="Prueba con otros filtros o crea una nueva tarea."
            action={
              <button onClick={() => { setSearch(''); setCategoryFilter('all'); setPriorityFilter('all'); }}
                      className="btn-secondary text-sm">
                Limpiar filtros
              </button>
            }
          />
        )}

        {/* Grouped by category */}
        {grouped ? (
          Object.entries(grouped).map(([catId, catTasks]) => {
            const cat = getCategoryById(catId);
            return (
              <div key={catId} className="mt-4 first:mt-0">
                <div className="flex items-center gap-2 mb-2">
                  <span>{cat.emoji}</span>
                  <span className="text-xs font-semibold text-warm-600">{cat.name}</span>
                  <span className="text-xs text-warm-400">({catTasks.length})</span>
                </div>
                <div className="space-y-2">
                  {catTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      date={today}
                      onComplete={toggleComplete}
                      onEdit={openEditTask}
                      onDelete={deleteTask}
                      showDate
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.2) }}
              >
                <TaskCard
                  task={task}
                  date={today}
                  onComplete={toggleComplete}
                  onEdit={openEditTask}
                  onDelete={deleteTask}
                  showDate
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
