export function getTodayString() {
  return getDateString(new Date());
}

export function getDateString(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addWeeks(date, weeks) {
  return addDays(date, weeks * 7);
}

export function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function isSameDay(a, b) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth() === db.getMonth() &&
         da.getDate() === db.getDate();
}

export function isToday(dateStr) {
  return dateStr === getTodayString();
}

export function isPast(dateStr) {
  return dateStr < getTodayString();
}

export function isFuture(dateStr) {
  return dateStr > getTodayString();
}

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const defaults = { day: 'numeric', month: 'long' };
  return d.toLocaleDateString('es-ES', { ...defaults, ...options });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  if (isSameDay(d, today)) return 'Hoy';
  if (isSameDay(d, tomorrow)) return 'Mañana';
  if (isSameDay(d, yesterday)) return 'Ayer';

  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay(); // 0 = Sunday
}

export function getDayOfMonth(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDate();
}

export function getWeekDates(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  const day = d.getDay();
  const monday = addDays(d, day === 0 ? -6 : 1 - day);
  return Array.from({ length: 7 }, (_, i) => getDateString(addDays(monday, i)));
}

export function getMonthDates(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];

  // Fill leading days from prev month
  const startDow = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = startDow; i > 0; i--) {
    dates.push({ dateStr: getDateString(addDays(firstDay, -i)), currentMonth: false });
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    dates.push({ dateStr: getDateString(new Date(year, month, d)), currentMonth: true });
  }

  // Fill trailing days
  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    dates.push({ dateStr: getDateString(addDays(lastDay, i)), currentMonth: false });
  }

  return dates;
}

export function getMonthName(month, year) {
  return new Date(year, month, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function diffDays(dateA, dateB) {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
