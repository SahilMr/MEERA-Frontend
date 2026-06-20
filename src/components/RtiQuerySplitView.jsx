import { useEffect, useRef, useState } from 'react';
import { fetchRtiQueryDetail } from '../services/rtiQueryApi';
import AssistantPanel from './AssistantPanel';

function ReadOnlyField({ label, value }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}

export default function RtiQuerySplitView({ rtiQueryId, onClose, onSubmit }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [officeNote, setOfficeNote] = useState('');
  const [officeNoteFile, setOfficeNoteFile] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState(null);
  const officeNoteInputRef = useRef(null);
  const attachDocsInputRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetchRtiQueryDetail(rtiQueryId);
        if (!cancelled) {
          setDetail(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load query details');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDetail();
    return () => {
      cancelled = true;
    };
  }, [rtiQueryId]);

  function handleCopySuggestion(text) {
    setOfficeNote(text);
  }

  function handleSubmit() {
    // TODO: confirm whether submit auto-resolves the query or needs a review step
    onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-100">
      <div className="flex w-3/4 flex-col overflow-y-auto border-r border-slate-200 bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{rtiQueryId}</h2>
            {detail?.inward_id && (
              <p className="mt-1 text-sm text-slate-500">{detail.inward_id}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">Loading query details…</p>
        )}

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {loadError}
          </div>
        )}

        {detail && (
          <>
            <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <ReadOnlyField label="Query" value={detail.query_text} />
              <ReadOnlyField label="Status" value={detail.status} />
              {detail.assigned_to && (
                <ReadOnlyField label="Assigned To" value={detail.assigned_to} />
              )}
              {detail.assigned_at && (
                <ReadOnlyField label="Assigned At" value={detail.assigned_at} />
              )}
              {detail.supporting_documents?.length > 0 && (
                <div className="mb-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Supporting Documents
                  </p>
                  <ul className="list-inside list-disc text-sm text-slate-800">
                    {detail.supporting_documents.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {detail.office_notes?.length > 0 && (
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-slate-700">Office Notes</p>
                <div className="space-y-3">
                  {detail.office_notes.map((note) => (
                    <div
                      key={note.office_note_id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <p className="text-sm text-slate-800">{note.office_note}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {note.created_by} · {note.created_at}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="office-note" className="mb-1.5 block text-sm font-medium text-slate-700">
                Office Note
              </label>
              <textarea
                id="office-note"
                value={officeNote}
                onChange={(e) => setOfficeNote(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition placeholder:text-slate-400"
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
