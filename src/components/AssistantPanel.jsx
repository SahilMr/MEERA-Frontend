import { assistantSuggestions } from '../mock/rtiQueries';

export default function AssistantPanel({ onCopySuggestion }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-sm font-medium text-[#1a1a1a]">Assistant</h3>
      <p className="mb-4 text-xs text-[#6b6b6b]">
        Suggested responses based on similar past resolutions
      </p>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {assistantSuggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="rounded-lg border border-neutral-200 bg-white p-4"
          >
            <p className="mb-1 text-xs font-medium text-[#1a1a1a]">
              {suggestion.title}
            </p>
            <p className="mb-3 text-xs leading-relaxed text-[#6b6b6b]">
              {suggestion.text}
            </p>
            <button
              type="button"
              onClick={() => onCopySuggestion(suggestion.text)}
              className="rounded-md border border-neutral-200 px-3 py-1 text-xs font-medium text-[#1a1a1a] transition hover:bg-neutral-50"
            >
              Copy
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-4">
        {/* TODO: confirm if assistant should be interactive chat or just auto-suggestions */}
        <input
          type="text"
          disabled
          placeholder="Ask the assistant..."
          className="w-full cursor-not-allowed rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-400"
        />
      </div>
    </div>
  );
}
