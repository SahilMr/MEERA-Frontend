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
import { rtiColumnConfig } from '../mock/rtiQueries';
import { fetchRtiQuery } from '../services/rtiQueryApi';
import StatusBadge from './StatusBadge';
import RtiQuerySplitView from './RtiQuerySplitView';

export default function RtiQueryList() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQueries() {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetchRtiQuery({ limit: 100, offset: 0 });
        if (!cancelled) {
          setQueries(response.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load RTI queries');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQueries();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleRowClick(query) {
    if (query.status === 'Pending') {
      setSelectedQueryId(query.rti_query_id);
    } else {
      // TODO: undefined — what should happen on click for non-pending rows?
    }
  }

  function handleSubmit() {
    setToast('Office note submitted successfully.');
    setSelectedQueryId(null);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Queries</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and respond to incoming requests
        </p>
      </div>

      {loadError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {rtiColumnConfig.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={rtiColumnConfig.length} className="px-5 py-8 text-center text-slate-500">
                  Loading queries…
                </td>
              </tr>
            ) : queries.length === 0 ? (
              <tr>
                <td colSpan={rtiColumnConfig.length} className="px-5 py-8 text-center text-slate-500">
                  No queries found.
                </td>
              </tr>
            ) : (
              queries.map((row) => (
                <tr
                  key={row.rti_query_id}
                  onClick={() => handleRowClick(row)}
                  className={`border-b border-slate-100 transition last:border-0 ${
                    row.status === 'Pending'
                      ? 'cursor-pointer hover:bg-brand-50/50'
                      : 'cursor-default'
                  }`}
                >
                  {rtiColumnConfig.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-slate-800">
                      {col.key === 'status' ? (
                        <StatusBadge status={row.status} />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedQueryId && (
        <RtiQuerySplitView
          rtiQueryId={selectedQueryId}
          onClose={() => setSelectedQueryId(null)}
          onSubmit={handleSubmit}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-lg bg-slate-800 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
