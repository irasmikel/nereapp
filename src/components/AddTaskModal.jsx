import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import RecurrenceSelector from './RecurrenceSelector';
import { CATEGORIES } from '../data/categories';
import { getTodayString } from '../utils/dateUtils';
import { createEmptyTask } from '../utils/taskUtils';

export default function AddTaskModal({ initialData, onSave, onClose }) {
  const isEditing = !!(initialData?.id);
  const [form, setForm] = useState(() => ({ ...createEmptyTask(), ...initialData }));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 100); }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const { id, createdAt, updatedAt, ...taskData } = form;
    onSave(taskData);
  };

  const selectedCat = CATEGORIES.find(c => c.id === form.category) || CATEGORIES[0];

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-warm-900/40 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative w-full md:max-w-lg bg-white rounded-t-[28px] md:rounded-[28px] shadow-large
                   max-h-[92dvh] max-h-[92vh] flex flex-col overflow-hidden"
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        onClick={e => e.stopPropagation()}>

        {/* Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-warm-200 rounded-full" />
        </div>

        {/* Header with category color */}
        <div className="px-5 pt-3 pb-4 flex items-center justify-between"
          style={{ borderBottom: `2px solid ${selectedCat.bg}` }}>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedCat.emoji}</span>
            <h2 className="text-base font-semibold text-warm-900">
              {isEditing ? 'Editar tarea' : 'Nueva tarea'}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-100 transition-colors">
            <X size={18} className="text-warm-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Title */}
            <input ref={titleRef} type="text"
              placeholder="¿Qué hay que hacer?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full text-lg font-semibold text-warm-900 placeholder-warm-300 outline-none bg-transparent"
              required />

            {/* Category grid */}
            <div>
              <p className="label mb-3">Habitación</p>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} type="button" onClick={() => set('category', cat.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-150 text-center
                                ${form.category === cat.id ? 'ring-2 scale-105' : 'hover:scale-102 opacity-70 hover:opacity-100'}`}
                    style={{
                      background: form.category === cat.id ? cat.gradient : cat.bg,
                      ringColor: cat.color,
                    }}>
                    <span className="text-xl leading-none">{cat.emoji}</span>
                    <span className="text-[11px] font-semibold leading-tight"
                      style={{ color: form.category === cat.id ? 'white' : cat.color }}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date + Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="label mb-2">Fecha inicio</p>
                <input type="date" value={form.startDate}
                  onChange={e => set('startDate', e.target.value)} className="input" />
              </div>
              <div>
                <p className="label mb-2">Duración</p>
                <div className="relative">
                  <input type="number" min="0" max="480" step="5"
                    value={form.estimatedDuration}
                    onChange={e => set('estimatedDuration', parseInt(e.target.value) || 0)}
                    className="input pr-10" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warm-400">min</span>
                </div>
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <p className="label mb-3">Repetición</p>
              <RecurrenceSelector value={form.recurrence} onChange={rec => set('recurrence', rec)} />
            </div>

            {/* Advanced toggle */}
            <button type="button" onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-2 text-xs text-warm-400 hover:text-warm-600 transition-colors">
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAdvanced ? 'Ocultar opciones' : 'Más opciones'}
            </button>

            {showAdvanced && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <p className="label mb-2">Descripción</p>
                  <textarea rows={2} placeholder="Detalles..." value={form.description}
                    onChange={e => set('description', e.target.value)} className="input resize-none" />
                </div>
                <div>
                  <p className="label mb-2">Notas</p>
                  <textarea rows={2} placeholder="Notas privadas..." value={form.notes}
                    onChange={e => set('notes', e.target.value)} className="input resize-none" />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-warm-100 px-5 py-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
            <button type="submit" className="btn-primary flex-1" disabled={!form.title.trim()}>
              {isEditing ? 'Guardar' : 'Añadir tarea'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
