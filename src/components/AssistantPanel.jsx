import { assistantSuggestions } from '../mock/rtiQueries';

export default function AssistantPanel({ onCopySuggestion }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1 text-sm font-semibold text-slate-900">Assistant</h3>
      <p className="mb-4 text-xs text-slate-500">
        Suggested responses based on similar past resolutions
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {assistantSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="mb-1 text-xs font-semibold text-brand-700">
              {suggestion.title}
            </p>
            <p className="mb-3 text-xs leading-relaxed text-slate-600">
              {suggestion.text}
            </p>
            <button
              type="button"
              onClick={() => onCopySuggestion(suggestion.text)}
              className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-100"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-slate-200 pt-4">
        {/* TODO: confirm if assistant should be interactive chat or just auto-suggestions */}
        <input
          type="text"
          disabled
          placeholder="Ask the assistant..."
          className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-400"
        />
      </div>
    </div>
  );
}
