import { useRef, useState } from 'react';
import AssistantPanel from './AssistantPanel';

function ReadOnlyField({ label, value }) {
  return (
    <div className="mb-4">
      <p className="mb-1 text-xs font-medium text-[#6b6b6b]">{label}</p>
      <p className="text-sm text-[#1a1a1a]">{value}</p>
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
    <div className="fixed inset-0 z-50 flex bg-[#fafaf9]">
      <div className="flex w-3/4 flex-col overflow-y-auto border-r border-neutral-200 p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light text-[#1a1a1a]">{query.id}</h2>
            <p className="mt-1 text-sm text-[#6b6b6b]">{query.sarthiInward}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-[#6b6b6b] transition hover:bg-neutral-50"
          >
            Close
          </button>
        </div>

        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-6">
          <ReadOnlyField label="Query Raised By" value={query.raisedBy} />
          <ReadOnlyField label="RTI Query" value={query.query} />
          <ReadOnlyField label="Enclosures" value={query.enclosures} />
          <ReadOnlyField label="Date" value={query.date} />
        </div>

        <div className="mb-4">
          <label htmlFor="office-note" className="mb-1.5 block text-sm font-medium text-[#1a1a1a]">
            Office Note
          </label>
          <textarea
            id="office-note"
            value={officeNote}
            onChange={(e) => setOfficeNote(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-neutral-200 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
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
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-neutral-50"
            >
              Upload Office Note
            </button>
            {officeNoteFile && (
              <p className="mt-1 text-xs text-[#6b6b6b]">{officeNoteFile}</p>
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
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-[#1a1a1a] transition hover:bg-neutral-50"
            >
              Attach Documents
            </button>
            {attachedDocs && (
              <p className="mt-1 text-xs text-[#6b6b6b]">{attachedDocs}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-fit rounded-md bg-[#1a1a1a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Submit
        </button>
      </div>

      <div className="w-1/4 overflow-y-auto p-6">
        <AssistantPanel onCopySuggestion={handleCopySuggestion} />
      </div>
    </div>
  );
}
