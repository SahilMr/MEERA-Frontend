import { useRef, useState } from 'react';
import AssistantPanel from './AssistantPanel';

function ReadOnlyField({ label, value }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-800">{value}</p>
    </div>
  );
}

export default function RtiQuerySplitView({ query, onClose, onSubmit }) {
  const [officeNote, setOfficeNote] = useState('');
  const [officeNoteFile, setOfficeNoteFile] = useState(null);
  const [attachedDocs, setAttachedDocs] = useState(null);
  const officeNoteInputRef = useRef(null);
  const attachDocsInputRef = useRef(null);

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
            <h2 className="text-xl font-semibold text-slate-900">{query.id}</h2>
            <p className="mt-1 text-sm text-slate-500">{query.sarthiInward}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <ReadOnlyField label="Query Raised By" value={query.raisedBy} />
          <ReadOnlyField label="Query" value={query.query} />
          <ReadOnlyField label="Enclosures" value={query.enclosures} />
          <ReadOnlyField label="Date" value={query.date} />
        </div>

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
      </div>

      <div className="w-1/4 overflow-y-auto bg-slate-50 p-6">
        <AssistantPanel onCopySuggestion={handleCopySuggestion} />
      </div>
    </div>
  );
}
