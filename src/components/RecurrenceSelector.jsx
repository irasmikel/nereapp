import { useState } from 'react';
import { RECURRENCE_TYPES, DAYS_OF_WEEK } from '../data/categories';
import { getRecurrenceLabel } from '../utils/taskUtils';

export default function RecurrenceSelector({ value, onChange }) {
  const rec = value || { type: 'none' };

  const setType = (type) => {
    const defaults = {
      none:    { type: 'none' },
      daily:   { type: 'daily', interval: 1 },
      weekly:  { type: 'weekly', daysOfWeek: [1] },
      monthly: { type: 'monthly', daysOfMonth: [1] },
      yearly:  { type: 'yearly' },
      custom:  { type: 'custom', interval: 2, intervalUnit: 'days' },
    };
    onChange(defaults[type] || { type });
  };

  const toggleDow = (dow) => {
    const current = rec.daysOfWeek || [];
    const next = current.includes(dow) ? current.filter(d => d !== dow) : [...current, dow];
    if (next.length === 0) return;
    onChange({ ...rec, daysOfWeek: next });
  };

  const toggleDom = (dom) => {
    const current = rec.daysOfMonth || [];
    const next = current.includes(dom) ? current.filter(d => d !== dom) : [...current, dom];
    if (next.length === 0) return;
    onChange({ ...rec, daysOfMonth: next });
  };

  return (
    <div className="space-y-3">
      {/* Type selector */}
      <div className="flex flex-wrap gap-2">
        {RECURRENCE_TYPES.map(({ id, name, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setType(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                        transition-all duration-150
                        ${rec.type === id
                          ? 'bg-warm-900 text-white'
                          : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}
          >
            <span>{icon}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Weekly: day picker */}
      {rec.type === 'weekly' && (
        <div>
          <p className="text-xs text-warm-500 mb-2">Días de la semana</p>
          <div className="flex gap-1.5">
            {DAYS_OF_WEEK.map(({ id, short }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleDow(id)}
                className={`w-9 h-9 rounded-full text-xs font-semibold transition-all duration-150
                            ${(rec.daysOfWeek || []).includes(id)
                              ? 'bg-warm-900 text-white'
                              : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}
              >
                {short}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly: day of month picker */}
      {rec.type === 'monthly' && (
        <div>
          <p className="text-xs text-warm-500 mb-2">Día del mes</p>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => toggleDom(d)}
                className={`h-8 rounded-lg text-xs font-medium transition-all duration-150
                            ${(rec.daysOfMonth || []).includes(d)
                              ? 'bg-warm-900 text-white'
                              : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Daily: interval */}
      {rec.type === 'daily' && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-warm-500">Cada</span>
          <input
            type="number"
            min="1"
            max="365"
            value={rec.interval || 1}
            onChange={e => onChange({ ...rec, interval: Math.max(1, parseInt(e.target.value) || 1) })}
            className="input w-20 text-center"
          />
          <span className="text-xs text-warm-500">días</span>
        </div>
      )}

      {/* Custom */}
      {rec.type === 'custom' && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-warm-500">Cada</span>
          <input
            type="number"
            min="1"
            max="365"
            value={rec.interval || 1}
            onChange={e => onChange({ ...rec, interval: Math.max(1, parseInt(e.target.value) || 1) })}
            className="input w-20 text-center"
          />
          <select
            value={rec.intervalUnit || 'days'}
            onChange={e => onChange({ ...rec, intervalUnit: e.target.value })}
            className="input flex-1"
          >
            <option value="days">días</option>
            <option value="weeks">semanas</option>
            <option value="months">meses</option>
          </select>
        </div>
      )}

      {/* Preview label */}
      {rec.type !== 'none' && (
        <p className="text-xs text-sage-600 bg-sage-50 px-3 py-2 rounded-xl">
          📅 {getRecurrenceLabel(rec)}
        </p>
      )}
    </div>
  );
}
