export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between px-5 pt-8 pb-4 md:px-8 md:pt-10">
      <div>
        <h1 className="text-2xl font-semibold text-warm-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-warm-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
