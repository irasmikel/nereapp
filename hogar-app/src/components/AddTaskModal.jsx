import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import RecurrenceSelector from './RecurrenceSelector';
import { CATEGORIES, PRIORITIES } from '../data/categories';
import { getTodayString } from '../utils/dateUtils';
import { createEmptyTask } from '../utils/taskUtils';

export default function AddTaskModal({ initialData, onSave, onClose }) {
  const isEditing = !!(initialData?.id);
  const [form, setForm] = useState(() => ({ ...createEmptyTask(), ...initialData }));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 100);
  }, []);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const { id, createdAt, updatedAt, ...taskData } = form;
    onSave(taskData);
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdrop}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-warm-900/30 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-large
                   max-h-[92dvh] max-h-[92vh] flex flex-col overflow-hidden"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-warm-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-warm-100">
          <h2 className="text-base font-semibold text-warm-900">
            {isEditing ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-warm-100 transition-colors">
            <X size={18} className="text-warm-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Title */}
            <div>
              <input
                ref={titleRef}
                type="text"
                placeholder="¿Qué hay que hacer?"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="w-full text-lg font-medium text-warm-900 placeholder-warm-300 outline-none bg-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <p className="label mb-2">Habitación</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set('category', cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                                transition-all duration-150
                                ${form.category === cat.id
                                  ? 'ring-2 ring-offset-1'
                                  : 'opacity-70 hover:opacity-100'}`}
                    style={{
                      backgroundColor: cat.bg,
                      color: cat.color,
                      ringColor: form.category === cat.id ? cat.color : 'transparent',
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <p className="label mb-2">Prioridad</p>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => set('priority', p.id)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150
                                ${form.priority === p.id
                                  ? 'ring-2 ring-offset-1'
                                  : 'opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: p.bg, color: p.color }}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="label mb-2">Fecha inicio</p>
                <input
                  type="date"
                  value={form.startDate}
                  min={getTodayString()}
                  onChange={e => set('startDate', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <p className="label mb-2">Duración estimada</p>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="480"
                    step="5"
                    value={form.estimatedDuration}
                    onChange={e => set('estimatedDuration', parseInt(e.target.value) || 0)}
                    className="input pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warm-400">min</span>
                </div>
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <p className="label mb-2">Repetición</p>
              <RecurrenceSelector
                value={form.recurrence}
                onChange={rec => set('recurrence', rec)}
              />
            </div>

            {/* Advanced toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="flex items-center gap-2 text-xs text-warm-500 hover:text-warm-700 transition-colors"
            >
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showAdvanced ? 'Ocultar opciones' : 'Más opciones'}
            </button>

            {showAdvanced && (
              <div className="space-y-4 animate-fade-in">
                {/* Description */}
                <div>
                  <p className="label mb-2">Descripción</p>
                  <textarea
                    rows={2}
                    placeholder="Detalles adicionales..."
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className="input resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <p className="label mb-2">Notas</p>
                  <textarea
                    rows={2}
                    placeholder="Notas privadas..."
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    className="input resize-none"
                  />
                </div>

                {/* Reminder */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warm-800">Recordatorio</p>
                    <p className="text-xs text-warm-400">Recibir notificación</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.reminder}
                      onChange={e => set('reminder', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-warm-200 peer-checked:bg-sage-500 rounded-full
                                    peer-focus:ring-2 peer-focus:ring-sage-200
                                    after:content-[''] after:absolute after:top-0.5 after:left-0.5
                                    after:bg-white after:rounded-full after:h-5 after:w-5
                                    after:transition-all peer-checked:after:translate-x-4" />
                  </label>
                </div>

                {form.reminder && (
                  <div>
                    <p className="label mb-2">Hora del recordatorio</p>
                    <input
                      type="time"
                      value={form.reminderTime}
                      onChange={e => set('reminderTime', e.target.value)}
                      className="input"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-warm-100 px-5 py-4 flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={!form.title.trim()}>
              {isEditing ? 'Guardar cambios' : 'Añadir tarea'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
