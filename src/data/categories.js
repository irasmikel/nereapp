export const CATEGORIES = [
  { id: 'kitchen',     name: 'Cocina',        emoji: '🍳', color: '#D4694F', bg: '#FDF0ED', gradient: 'linear-gradient(135deg,#F4A261,#D4694F)' },
  { id: 'bathroom',    name: 'Baño',          emoji: '🚿', color: '#2E86AB', bg: '#E8F4F8', gradient: 'linear-gradient(135deg,#60B4D4,#2E86AB)' },
  { id: 'living',      name: 'Salón',         emoji: '🛋️', color: '#4A7C59', bg: '#EBF4EE', gradient: 'linear-gradient(135deg,#7FB08F,#4A7C59)' },
  { id: 'bedroom',     name: 'Dormitorio',    emoji: '🛏️', color: '#7C6FAE', bg: '#F0EDF8', gradient: 'linear-gradient(135deg,#9B8EC4,#7C6FAE)' },
  { id: 'laundry',     name: 'Lavandería',    emoji: '🧺', color: '#3A75B5', bg: '#E8F0FA', gradient: 'linear-gradient(135deg,#60A5FA,#3A75B5)' },
  { id: 'maintenance', name: 'Mantenimiento', emoji: '🔧', color: '#5A6B7D', bg: '#EDF1F4', gradient: 'linear-gradient(135deg,#94A3B8,#5A6B7D)' },
  { id: 'shopping',    name: 'Compras',       emoji: '🛒', color: '#C47820', bg: '#FBF3E6', gradient: 'linear-gradient(135deg,#F4A261,#C47820)' },
  { id: 'garden',      name: 'Jardín',        emoji: '🌿', color: '#3A7D44', bg: '#E8F4EB', gradient: 'linear-gradient(135deg,#65A84A,#3A7D44)' },
  { id: 'general',     name: 'General',       emoji: '📋', color: '#6B6860', bg: '#F2F0EC', gradient: 'linear-gradient(135deg,#948E82,#6B6860)' },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const RECURRENCE_TYPES = [
  { id: 'none',    name: 'Sin repetición',  icon: '✕' },
  { id: 'daily',   name: 'Diaria',          icon: '☀️' },
  { id: 'weekly',  name: 'Semanal',         icon: '📅' },
  { id: 'monthly', name: 'Mensual',         icon: '🗓️' },
  { id: 'yearly',  name: 'Anual',           icon: '📆' },
  { id: 'custom',  name: 'Personalizado',   icon: '⚙️' },
];

export const DAYS_OF_WEEK = [
  { id: 1, short: 'L', long: 'Lunes' },
  { id: 2, short: 'M', long: 'Martes' },
  { id: 3, short: 'X', long: 'Miércoles' },
  { id: 4, short: 'J', long: 'Jueves' },
  { id: 5, short: 'V', long: 'Viernes' },
  { id: 6, short: 'S', long: 'Sábado' },
  { id: 0, short: 'D', long: 'Domingo' },
];

export const MOTIVATIONAL_MESSAGES = [
  '¡Un hogar ordenado, una mente libre! ✨',
  'Cada pequeño paso cuenta 🌟',
  'La constancia crea hábitos duraderos 💪',
  '¡Tu hogar te lo agradece! 🏡',
  'Paso a paso, sin agobio 🍃',
  'Lo que haces hoy facilita el mañana 🌿',
];
