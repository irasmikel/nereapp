import { getCategoryById } from '../data/categories';

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
      <span className="leading-none">{cat.emoji}</span>
      <span>{cat.name}</span>
    </span>
  );
}

export function DurationBadge({ minutes }) {
  if (!minutes) return null;
  const label = minutes < 60
    ? `${minutes} min`
    : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ''}`;
  return (
    <span className="text-[10px] text-warm-400 font-medium bg-warm-100 px-2 py-0.5 rounded-full">
      ⏱ {label}
    </span>
  );
}
