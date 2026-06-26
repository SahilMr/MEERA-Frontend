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
import { fetchRtiQueryCount, fetchRtiQuery } from '../services/rtiQueryApi';
import StatusBadge from './StatusBadge';

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
  const [rtiQueries, setRtiQueries] = useState([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [queriesError, setQueriesError] = useState(null);

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

    async function loadQueries() {
      setQueriesLoading(true);
      setQueriesError(null);
      try {
        const response = await fetchRtiQuery({ limit: 100, offset: 0 });
        if (!cancelled) {
          setRtiQueries(response.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setQueriesError(err.message || 'Failed to load queries');
        }
      } finally {
        if (!cancelled) {
          setQueriesLoading(false);
        }
      }
    }

    loadCounts();
    if (isAdmin) {
      loadQueries();
    }

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  function getCardValue(label) {
    const countKey = COUNT_API_LABELS[label];
    if (countKey && countData) {
      return countData[countKey];
    }
    return '—';
  }

  function handleDownloadPdf(base64Data, filename) {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download PDF', e);
      alert('Failed to download PDF');
    }
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

      {isAdmin && (
        <div className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-medium text-slate-900">RTI Queries & Collated Office Notes</h2>
            <p className="text-xs text-slate-500">View and download completed collated office notes</p>
          </div>
          {queriesLoading ? (
            <p className="text-sm text-slate-500">Loading queries…</p>
          ) : queriesError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {queriesError}
            </div>
          ) : rtiQueries.length === 0 ? (
            <p className="text-sm text-slate-500">No queries found.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">RTI Query ID</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Query Text</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Collated Office Note (PDF)</th>
                  </tr>
                </thead>
                <tbody>
                  {rtiQueries.map((row) => (
                    <tr key={row.rti_query_id} className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/50">
                      <td className="px-5 py-4 font-medium text-slate-900">{row.rti_query_id}</td>
                      <td className="px-5 py-4 text-slate-800 max-w-md truncate">{row.query}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-5 py-4">
                        {row.collated_office_note ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(row.collated_office_note, `collated_office_note_${row.rti_query_id}.pdf`)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 shadow-sm transition hover:bg-brand-50"
                          >
                            <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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
