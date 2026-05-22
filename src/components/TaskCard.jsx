import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Edit2, ChevronRight, Clock, RotateCcw } from 'lucide-react';
import { CategoryBadge, PriorityDot, DurationBadge } from './CategoryBadge';
import { getCategoryById } from '../data/categories';
import { formatShortDate, getTodayString } from '../utils/dateUtils';
import { getRecurrenceLabel } from '../utils/taskUtils';

export default function TaskCard({
  task,
  date = null,
  onComplete,
  onEdit,
  onDelete,
  showDate = false,
  compact = false,
}) {
  const [swiping, setSwiping] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const touchStart = useRef(null);
  const cardRef = useRef(null);

  const dateStr = date || getTodayString();
  const isCompleted = (task.completedDates || []).includes(dateStr);
  const cat = getCategoryById(task.category);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const diff = e.touches[0].clientX - touchStart.current;
    // Only allow swipe left to reveal actions
    if (diff < 0) setSwipeX(Math.max(diff, -80));
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (swipeX < -40) {
      setSwipeX(-72);
      setShowActions(true);
    } else {
      setSwipeX(0);
      setShowActions(false);
    }
    touchStart.current = null;
  };

  const resetSwipe = () => {
    setSwipeX(0);
    setShowActions(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl" onClick={showActions ? resetSwipe : undefined}>
      {/* Action buttons (revealed on swipe) */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-1 px-2 bg-warm-100 rounded-2xl">
        <button
          onClick={(e) => { e.stopPropagation(); resetSwipe(); onEdit?.(task); }}
          className="w-9 h-9 bg-warm-200 hover:bg-warm-300 rounded-xl flex items-center justify-center
                     transition-colors duration-150"
        >
          <Edit2 size={15} className="text-warm-600" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetSwipe(); onDelete?.(task.id); }}
          className="w-9 h-9 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center
                     transition-colors duration-150"
        >
          <Trash2 size={15} className="text-red-500" />
        </button>
      </div>

      {/* Card */}
      <motion.div
        ref={cardRef}
        className={`relative bg-white border border-warm-200/50 rounded-2xl
                    ${compact ? 'px-4 py-3' : 'px-4 py-4'}
                    ${isCompleted ? 'opacity-60' : ''}
                    transition-opacity duration-300`}
        style={{ x: swiping ? swipeX : undefined }}
        animate={{ x: swipeX }}
        transition={swiping ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left color accent */}
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
          style={{ backgroundColor: cat.color + '60' }}
        />

        <div className="flex items-start gap-3 pl-2">
          {/* Checkbox */}
          <button
            onClick={(e) => { e.stopPropagation(); onComplete?.(task.id, dateStr); }}
            className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200 mt-0.5
                        ${isCompleted
                          ? 'bg-sage-500 border-sage-500'
                          : 'border-warm-300 hover:border-sage-400 hover:bg-sage-50'}`}
          >
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className={`text-sm font-medium leading-snug
                            ${isCompleted ? 'line-through text-warm-400' : 'text-warm-900'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <PriorityDot priorityId={task.priority} />
              </div>
            </div>

            {task.description && !compact && (
              <p className="text-xs text-warm-500 mt-0.5 line-clamp-1">{task.description}</p>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <CategoryBadge categoryId={task.category} size="xs" />
              {task.estimatedDuration > 0 && (
                <DurationBadge minutes={task.estimatedDuration} />
              )}
              {showDate && task.startDate && (
                <span className="text-[10px] text-warm-400 font-medium flex items-center gap-0.5">
                  <Clock size={10} />
                  {formatShortDate(task.startDate)}
                </span>
              )}
              {task.recurrence?.type !== 'none' && task.recurrence?.type && (
                <span className="text-[10px] text-warm-400 flex items-center gap-0.5">
                  <RotateCcw size={10} />
                  {getRecurrenceLabel(task.recurrence)}
                </span>
              )}
            </div>
          </div>

          {/* Arrow for non-swipe interaction */}
          <button
            className="shrink-0 text-warm-300 hover:text-warm-500 transition-colors mt-1 -mr-1 md:flex hidden"
            onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
