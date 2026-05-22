import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { formatShortDate, getTodayString } from '../utils/dateUtils';
import { getRecurrenceLabel } from '../utils/taskUtils';

export default function TaskCard({ task, date = null, onComplete, onEdit, onDelete, showDate = false }) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const touchStart = useRef(null);

  const dateStr = date || getTodayString();
  const isCompleted = (task.completedDates || []).includes(dateStr);
  const cat = getCategoryById(task.category);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; setSwiping(true); };
  const handleTouchMove  = (e) => { if (!touchStart.current) return; const d = e.touches[0].clientX - touchStart.current; if (d < 0) setSwipeX(Math.max(d, -80)); };
  const handleTouchEnd   = () => { setSwiping(false); if (swipeX < -40) { setSwipeX(-76); setShowActions(true); } else { setSwipeX(0); setShowActions(false); } touchStart.current = null; };
  const resetSwipe = () => { setSwipeX(0); setShowActions(false); };

  const rl = getRecurrenceLabel(task.recurrence);

  return (
    <div className="relative overflow-hidden rounded-2xl" onClick={showActions ? resetSwipe : undefined}>
      {/* Swipe action buttons */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1.5 px-2 rounded-2xl" style={{ background: cat.bg }}>
        <button onClick={(e) => { e.stopPropagation(); resetSwipe(); onEdit?.(task); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: cat.color + '22' }}>
          <Edit2 size={14} style={{ color: cat.color }} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); resetSwipe(); onDelete?.(task.id); }}
          className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>

      {/* Card */}
      <motion.div
        className="relative bg-white rounded-2xl overflow-hidden"
        style={{ borderLeft: `4px solid ${cat.color}` }}
        animate={{ x: swipeX }}
        transition={swiping ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`px-4 py-3.5 flex items-start gap-3 transition-opacity duration-300 ${isCompleted ? 'opacity-50' : ''}`}>
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onComplete?.(task.id, dateStr); }}
            className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5"
            style={{ borderColor: isCompleted ? cat.color : '#D8D2C6', background: isCompleted ? cat.color : 'transparent' }}
          >
            <AnimatePresence>
              {isCompleted && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-snug mb-2 ${isCompleted ? 'line-through text-warm-400' : 'text-warm-900'}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: cat.bg, color: cat.color }}>
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </span>
              {task.estimatedDuration > 0 && (
                <span className="text-[11px] text-warm-400 font-medium bg-warm-100 px-2 py-0.5 rounded-full">
                  ⏱ {task.estimatedDuration}m
                </span>
              )}
              {showDate && task.startDate && (
                <span className="text-[11px] text-warm-400">{formatShortDate(task._dueDate || task.startDate)}</span>
              )}
              {rl && rl !== 'Sin repetición' && (
                <span className="text-[11px] text-warm-300 flex items-center gap-0.5">
                  <RotateCcw size={9} /> {rl}
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-xs text-warm-400 mt-1.5 line-clamp-1">{task.description}</p>
            )}
          </div>

          {/* Desktop edit */}
          <button className="shrink-0 hidden md:flex text-warm-200 hover:text-warm-400 transition-colors mt-0.5"
            onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}>
            <Edit2 size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
