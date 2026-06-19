const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'Not In Scope': 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'}`}
    >
      {status}
    </span>
  );
}
