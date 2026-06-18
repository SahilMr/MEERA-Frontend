const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-800',
  Resolved: 'bg-green-100 text-green-800',
  'Not In Scope': 'bg-neutral-100 text-neutral-600',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] || 'bg-neutral-100 text-neutral-600'}`}
    >
      {status}
    </span>
  );
}
