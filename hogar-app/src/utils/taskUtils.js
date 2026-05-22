import { getTodayString, getDateString, addDays, addMonths, diffDays } from './dateUtils';

export function generateTaskId() {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Core function: Is a task due on a given date?
 */
export function isTaskDueOnDate(task, dateStr) {
  const taskStart = task.startDate;
  if (!taskStart) return false;

  // Task hasn't started yet
  if (dateStr < taskStart) return false;

  const rec = task.recurrence || { type: 'none' };

  switch (rec.type) {
    case 'none':
      return dateStr === taskStart;

    case 'daily': {
      const interval = rec.interval || 1;
      const daysDiff = diffDays(taskStart, dateStr);
      return daysDiff >= 0 && daysDiff % interval === 0;
    }

    case 'weekly': {
      const daysOfWeek = rec.daysOfWeek || [];
      const d = new Date(dateStr + 'T00:00:00');
      const dow = d.getDay(); // 0=Sun, 1=Mon, ...
      return daysOfWeek.includes(dow);
    }

    case 'monthly': {
      const d = new Date(dateStr + 'T00:00:00');
      const dom = d.getDate();
      if (rec.daysOfMonth && rec.daysOfMonth.length > 0) {
        return rec.daysOfMonth.includes(dom);
      }
      // Fallback: same day of month as startDate
      const start = new Date(taskStart + 'T00:00:00');
      return dom === start.getDate();
    }

    case 'yearly': {
      const d = new Date(dateStr + 'T00:00:00');
      const start = new Date(taskStart + 'T00:00:00');
      return d.getMonth() === start.getMonth() && d.getDate() === start.getDate();
    }

    case 'custom': {
      const interval = rec.interval || 1;
      const unit = rec.intervalUnit || 'days';
      const daysDiff = diffDays(taskStart, dateStr);
      if (daysDiff < 0) return false;

      if (unit === 'days') return daysDiff % interval === 0;
      if (unit === 'weeks') return daysDiff % (interval * 7) === 0;
      if (unit === 'months') {
        // Check if dateStr is exactly N months from startDate
        let cursor = new Date(taskStart + 'T00:00:00');
        const target = new Date(dateStr + 'T00:00:00');
        while (cursor <= target) {
          if (getDateString(cursor) === dateStr) return true;
          cursor = addMonths(cursor, interval);
        }
        return false;
      }
      return false;
    }

    default:
      return false;
  }
}

/**
 * Is a task completed on a specific date?
 */
export function isTaskCompletedOnDate(task, dateStr) {
  return (task.completedDates || []).includes(dateStr);
}

/**
 * Is a task overdue? (due on a past date and not completed that day)
 */
export function isTaskOverdue(task, dateStr = null) {
  const today = getTodayString();
  const checkDate = dateStr || today;

  if (task.startDate > today) return false;

  // Check past dates where task was due but not completed
  const rec = task.recurrence || { type: 'none' };

  if (rec.type === 'none') {
    return task.startDate < today && !isTaskCompletedOnDate(task, task.startDate);
  }

  // For recurring tasks, check yesterday as simplification
  const yesterday = getDateString(addDays(new Date(), -1));
  if (isTaskDueOnDate(task, yesterday) && !isTaskCompletedOnDate(task, yesterday)) return true;

  return false;
}

/**
 * Get all dates in a range where a task is due
 */
export function getTaskDueDatesInRange(task, startStr, endStr) {
  const dates = [];
  let cursor = new Date(startStr + 'T00:00:00');
  const end = new Date(endStr + 'T00:00:00');

  while (cursor <= end) {
    const dateStr = getDateString(cursor);
    if (isTaskDueOnDate(task, dateStr)) {
      dates.push(dateStr);
    }
    cursor = addDays(cursor, 1);
  }

  return dates;
}

/**
 * Get next due date for a task after today
 */
export function getNextDueDate(task) {
  const today = new Date();
  for (let i = 1; i <= 365; i++) {
    const dateStr = getDateString(addDays(today, i));
    if (isTaskDueOnDate(task, dateStr)) return dateStr;
  }
  return null;
}

/**
 * Get recurrence description in human readable Spanish
 */
export function getRecurrenceLabel(recurrence) {
  if (!recurrence || recurrence.type === 'none') return 'Sin repetición';

  const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const DAYS_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  switch (recurrence.type) {
    case 'daily':
      return recurrence.interval === 1 ? 'Todos los días' : `Cada ${recurrence.interval} días`;

    case 'weekly': {
      const days = (recurrence.daysOfWeek || []).sort();
      if (!days.length) return 'Semanal';
      if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Días laborables';
      if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Fines de semana';
      if (days.length === 7) return 'Todos los días';
      return days.map(d => DAYS[d]).join(', ');
    }

    case 'monthly': {
      const dom = recurrence.daysOfMonth || [];
      if (!dom.length) return 'Mensual';
      return `Cada mes, día${dom.length > 1 ? 's' : ''} ${dom.join(', ')}`;
    }

    case 'yearly':
      return 'Una vez al año';

    case 'custom': {
      const { interval = 1, intervalUnit = 'days' } = recurrence;
      const units = { days: interval === 1 ? 'día' : 'días', weeks: interval === 1 ? 'semana' : 'semanas', months: interval === 1 ? 'mes' : 'meses' };
      return `Cada ${interval} ${units[intervalUnit] || intervalUnit}`;
    }

    default:
      return 'Repetición personalizada';
  }
}

/**
 * Get streak: consecutive days where today tasks were completed
 */
export function calculateStreak(tasks, dateRange) {
  let streak = 0;
  const today = getTodayString();

  for (let i = 0; i < dateRange; i++) {
    const dateStr = getDateString(addDays(new Date(), -i));
    const dueTasks = tasks.filter(t => isTaskDueOnDate(t, dateStr));
    if (dueTasks.length === 0) { streak++; continue; } // days with no tasks don't break streak
    const completedAll = dueTasks.every(t => isTaskCompletedOnDate(t, dateStr));
    if (completedAll) { streak++; }
    else if (dateStr !== today) break; // today is allowed to be incomplete
  }

  return Math.max(0, streak - 1); // subtract today if it's incomplete
}

/**
 * Get completion rate for a date range
 */
export function getCompletionStats(tasks, days = 7) {
  const stats = [];
  for (let i = days - 1; i >= 0; i--) {
    const dateStr = getDateString(addDays(new Date(), -i));
    const due = tasks.filter(t => isTaskDueOnDate(t, dateStr));
    const completed = due.filter(t => isTaskCompletedOnDate(t, dateStr));
    stats.push({
      date: dateStr,
      due: due.length,
      completed: completed.length,
      rate: due.length > 0 ? Math.round((completed.length / due.length) * 100) : null,
    });
  }
  return stats;
}

export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function createEmptyTask() {
  const today = getTodayString();
  return {
    id: '',
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
    startDate: today,
    recurrence: { type: 'none' },
    reminder: false,
    reminderTime: '08:00',
    notes: '',
    estimatedDuration: 15,
    completedDates: [],
  };
}
