export default function EmptyState({ emoji = '✨', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="text-5xl mb-4">{emoji}</div>
      <h3 className="text-base font-semibold text-warm-700 mb-1">{title}</h3>
      {subtitle && <p className="text-sm text-warm-400 max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
