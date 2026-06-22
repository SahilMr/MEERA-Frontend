import { useEffect, useRef, useState } from 'react';
import { fetchAtomicQueries } from '../services/rtiQueryApi';
import AssistantPanel from './AssistantPanel';
import TiptapEditor from './TiptapEditor';

function ReadOnlyField({ label, value }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}

export default function RtiQuerySplitView({ rtiQueryId, onClose, onSubmit }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isViewOnly = currentUser.role === 'admin' || currentUser.role === 'deptAdmin';

  const [atomicQueries, setAtomicQueries] = useState([]);
  const [atomicLoading, setAtomicLoading] = useState(true);
  const [atomicError, setAtomicError] = useState(null);
  const [officeNote, setOfficeNote] = useState('');
  const [officeNoteFile, setOfficeNoteFile] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState(null);
  const officeNoteInputRef = useRef(null);
  const attachDocsInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setAtomicLoading(true);
      setAtomicError(null);
      try {
        const atomicResponse = await fetchAtomicQueries(rtiQueryId);
        if (!cancelled) {
          const allAtomics = atomicResponse.data || [];
          if (currentUser.role === 'admin') {
            setAtomicQueries(allAtomics);
          } else if (currentUser.department) {
            const filteredAtomics = allAtomics.filter(
              (aq) => aq.department_name === currentUser.department
            );
            setAtomicQueries(filteredAtomics);
          } else {
            setAtomicQueries(allAtomics);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setAtomicError(err.message || 'Failed to load atomic queries');
        }
      } finally {
        if (!cancelled) {
          setAtomicLoading(false);
        }
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [rtiQueryId]);

  function handleCopySuggestion(text) {
    setOfficeNote(text);
  }

  function handleSubmit() {
    onSubmit();
  }

  if (isViewOnly) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6">
        <div className="flex w-full max-w-3xl flex-col rounded-2xl bg-white p-8 shadow-xl max-h-[85vh] overflow-y-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{rtiQueryId}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          {atomicLoading && (
            <p className="text-sm text-slate-500">Loading subqueries…</p>
          )}

          {atomicError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {atomicError}
            </div>
          )}

          {!atomicLoading && !atomicError && (
            <>
              {atomicQueries.length > 0 ? (
                <div className="mb-2">
                  <p className="mb-3 text-sm font-medium text-slate-700">Assigned Subqueries (Atomic Queries)</p>
                  <div className="space-y-4">
                    {atomicQueries.map((aq, idx) => (
                      <div key={aq.atomic_query_id || aq.id || idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <ReadOnlyField label="Subquery" value={aq.query_text || aq.query || aq.atomic_query} />
                        {aq.status && <ReadOnlyField label="Status" value={aq.status} />}
                        {aq.assigned_to && <ReadOnlyField label="Assigned To" value={aq.assigned_to} />}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                  No atomic queries found for this department.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-100">
      <div className="flex w-3/4 flex-col overflow-y-auto border-r border-slate-200 bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{rtiQueryId}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {atomicLoading && (
          <p className="text-sm text-slate-500">Loading subqueries…</p>
        )}

        {atomicError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {atomicError}
          </div>
        )}

        {!atomicLoading && !atomicError && (
          <>
            {atomicQueries.length > 0 ? (
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-slate-700">Assigned Subqueries (Atomic Queries)</p>
                <div className="space-y-4">
                  {atomicQueries.map((aq, idx) => (
                    <div key={aq.atomic_query_id || aq.id || idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <ReadOnlyField label="Subquery" value={aq.query_text || aq.query || aq.atomic_query} />
                      {aq.status && <ReadOnlyField label="Status" value={aq.status} />}
                      {aq.assigned_to && <ReadOnlyField label="Assigned To" value={aq.assigned_to} />}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                No atomic queries found for this department user.
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="office-note" className="mb-1.5 block text-sm font-medium text-slate-700">
                Office Note
              </label>
              <TiptapEditor
                value={officeNote}
                onChange={setOfficeNote}
                placeholder="Draft your office note here..."
              />
            </div>

            <div className="mb-6 flex gap-3">
              <div>
                <input
                  ref={officeNoteInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setOfficeNoteFile(e.target.files?.[0]?.name || null)}
                />
                <button
                  type="button"
                  onClick={() => officeNoteInputRef.current?.click()}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Upload Office Note
                </button>
                {officeNoteFile && (
                  <p className="mt-1 text-xs text-slate-500">{officeNoteFile}</p>
                )}
              </div>

              <div>
                <input
                  ref={attachDocsInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setAttachedDocs(e.target.files?.[0]?.name || null)}
                />
                <button
                  type="button"
                  onClick={() => attachDocsInputRef.current?.click()}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Attach Documents
                </button>
                {attachedDocs && (
                  <p className="mt-1 text-xs text-slate-500">{attachedDocs}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-fit rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
            >
              Submit
            </button>
          </>
        )}
      </div>

      <div className="w-1/4 overflow-y-auto bg-slate-50 p-6">
        <AssistantPanel
          rtiQueryId={rtiQueryId}
          userId="dept_user_1"
          onCopySuggestion={handleCopySuggestion}
        />
      </div>
    </div>
  );
}
