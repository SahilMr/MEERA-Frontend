// OPEN QUESTIONS FOR V2 (resolve before building Admin/Dept Admin views):
// 1. What does Admin see/do on this screen — same data, all departments, or different UI entirely?
// 2. What does Department Admin see/do here — own department's full list, reassignment, approval step?
// 3. Click behavior for Resolved / Not In Scope rows — currently undefined.
// 4. Confirm split-screen ratio is really 75:25.
// 5. Office Note Editor: plain text or rich text?
// 6. Difference between "Upload Office Note" and "Attach Documents" — purpose, file types, required vs optional.
// 7. Does Submit auto-resolve the query, or is there a review/approval step?
// 8. Is the assistant panel interactive chat, or passive auto-suggestions only?
// 9. Department onboarding/mapping screen — who manages it (Admin vs Dept Admin), and what gets mapped (users, RTI categories, both)?

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deptAdminContext } from '../mock/departmentMaster';
import { kpiConfig } from '../mock/kpiConfig';
import { fetchRtiQueryCount } from '../services/rtiQueryApi';

const COUNT_API_LABELS = {
  'Total RTI Queries': 'total_count',
  'Total Resolved': 'resolved_count',
  'Total Pending': 'pending_count',
  'Total RTI Not In Scope': 'not_in_scope_count',
  'Total Active Sessions': 'active_sessions_count',
};

export default function Dashboard({ currentRole }) {
  const cards = kpiConfig[currentRole] || kpiConfig.user;
  const [countData, setCountData] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const isAdmin = currentRole === 'admin';
  const isDeptAdmin = currentRole === 'deptAdmin';
  const gridClass =
    cards.length > 3
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      : 'grid grid-cols-1 gap-6 sm:grid-cols-3';

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      setLoadError(null);
      try {
        const response = await fetchRtiQueryCount();
        if (!cancelled) {
          setCountData(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load dashboard counts');
        }
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, []);

  function getCardValue(label) {
    const countKey = COUNT_API_LABELS[label];
    if (countKey && countData) {
      return countData[countKey];
    }
    return '—';
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-[#1a1a1a]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#6b6b6b]">
          {isAdmin
            ? 'Organization-wide overview of RTI query activity'
            : isDeptAdmin
              ? `Overview of RTI query activity for ${deptAdminContext.department}`
              : 'Overview of RTI query activity'}
        </p>
        {isDeptAdmin && (
          <div className="mt-4 inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-[#1a1a1a]">
            <span className="text-[#6b6b6b]">Department:</span>
            <span className="ml-2 font-medium">{deptAdminContext.department}</span>
          </div>
        )}
      </div>

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className={gridClass}>
        {cards.map((label) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {countData || !COUNT_API_LABELS[label] ? getCardValue(label) : '…'}
            </p>
          </div>
        ))}
      </div>

      {currentRole === 'user' && (
        <div className="mt-10">
          <Link
            to="/rti-queries"
            className="inline-flex items-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            View Queries →
          </Link>
        </div>
      )}
    </div>
  );
}
