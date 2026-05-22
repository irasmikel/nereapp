import { getCategoryById, getPriorityById } from '../data/categories';

export function CategoryBadge({ categoryId, size = 'sm' }) {
  const cat = getCategoryById(categoryId);
  const sizeClass = size === 'xs'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{ backgroundColor: cat.bg, color: cat.color }}
    >
      <span>{cat.emoji}</span>
      <span>{cat.name}</span>
    </span>
  );
}

export function PriorityDot({ priorityId }) {
  const colors = { low: '#94A3B8', medium: '#F4A261', high: '#E07B6A' };
  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{ backgroundColor: colors[priorityId] || colors.medium }}
      title={priorityId}
    />
  );
}

export function DurationBadge({ minutes }) {
  if (!minutes) return null;
  const label = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`;
  return (
    <span className="text-[10px] text-warm-400 font-medium bg-warm-100 px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}
