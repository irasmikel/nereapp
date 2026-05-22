export const CATEGORIES = [
  {
    id: 'kitchen',
    name: 'Cocina',
    emoji: '🍳',
    color: '#E07B6A',
    bg: '#FDF2F0',
    border: '#F5C4BC',
    tailwind: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', dot: 'bg-red-400' },
  },
  {
    id: 'bathroom',
    name: 'Baño',
    emoji: '🚿',
    color: '#4A9EBF',
    bg: '#EEF6FA',
    border: '#B5D9EB',
    tailwind: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', dot: 'bg-blue-400' },
  },
  {
    id: 'living',
    name: 'Salón',
    emoji: '🛋️',
    color: '#7FB08F',
    bg: '#EEF5F0',
    border: '#B5D4BF',
    tailwind: { bg: 'bg-sage-50', text: 'text-sage-700', border: 'border-sage-100', dot: 'bg-sage-500' },
  },
  {
    id: 'bedroom',
    name: 'Dormitorio',
    emoji: '🛏️',
    color: '#9B8EC4',
    bg: '#F3F0FF',
    border: '#D0C5EC',
    tailwind: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', dot: 'bg-purple-400' },
  },
  {
    id: 'laundry',
    name: 'Lavandería',
    emoji: '🧺',
    color: '#60A5FA',
    bg: '#EEF3FF',
    border: '#BFCFFB',
    tailwind: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', dot: 'bg-indigo-400' },
  },
  {
    id: 'maintenance',
    name: 'Mantenimiento',
    emoji: '🔧',
    color: '#94A3B8',
    bg: '#F1F5F9',
    border: '#CBD5E1',
    tailwind: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  },
  {
    id: 'shopping',
    name: 'Compras',
    emoji: '🛒',
    color: '#F4A261',
    bg: '#FEF6EE',
    border: '#F5D4B3',
    tailwind: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-400' },
  },
  {
    id: 'garden',
    name: 'Jardín',
    emoji: '🌿',
    color: '#65A84A',
    bg: '#F0F7ED',
    border: '#BAD9AF',
    tailwind: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', dot: 'bg-green-500' },
  },
  {
    id: 'general',
    name: 'General',
    emoji: '📋',
    color: '#8B8982',
    bg: '#F5F3EF',
    border: '#D4CFC5',
    tailwind: { bg: 'bg-warm-100', text: 'text-warm-600', border: 'border-warm-200', dot: 'bg-warm-400' },
  },
];

export const getCategoryById = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const PRIORITIES = [
  { id: 'low',    name: 'Baja',   color: '#94A3B8', bg: '#F1F5F9', emoji: '🟢' },
  { id: 'medium', name: 'Media',  color: '#F4A261', bg: '#FEF6EE', emoji: '🟡' },
  { id: 'high',   name: 'Alta',   color: '#E07B6A', bg: '#FDF2F0', emoji: '🔴' },
];

export const getPriorityById = (id) =>
  PRIORITIES.find((p) => p.id === id) || PRIORITIES[0];

export const RECURRENCE_TYPES = [
  { id: 'none',    name: 'Sin repetición',      icon: '✕' },
  { id: 'daily',   name: 'Diaria',              icon: '☀️' },
  { id: 'weekly',  name: 'Semanal',             icon: '📅' },
  { id: 'monthly', name: 'Mensual',             icon: '🗓️' },
  { id: 'yearly',  name: 'Anual',               icon: '📆' },
  { id: 'custom',  name: 'Personalizado',       icon: '⚙️' },
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
  'Cada pequeño paso cuenta. ¡Vas genial! 🌟',
  'La constancia crea hábitos duraderos 💪',
  '¡Tu hogar te lo agradece! 🏡',
  'Paso a paso, sin agobio 🍃',
  '¡Hoy es un buen día para empezar! ☀️',
  'Lo que haces hoy facilita el mañana 🌿',
  '¡Casi lo tienes! Sigue así 🎯',
];
