import { useEffect, useState, useRef } from 'react';
import { fetchAssistantSession, fetchAssistantSuggestion, sendUserQuery } from '../services/rtiQueryApi';

export default function AssistantPanel({ rtiQueryId, userId, onCopySuggestion }) {
  const [suggestion, setSuggestion] = useState(null);
  const [suggestionSources, setSuggestionSources] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat list
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  useEffect(() => {
    let cancelled = false;

    async function loadSessionAndSuggestions() {
      if (!rtiQueryId || !userId) return;
      setLoading(true);
      setLoadError(null);
      setSuggestion(null);
      setSuggestionSources([]);
      setChatHistory([]);

      try {
        // 1. Fetch Session History
        const sessionRes = await fetchAssistantSession({
          rti_query_id: rtiQueryId,
          user_id: userId,
        });

        if (cancelled) return;

        let activeSuggestion = sessionRes.data?.asst_suggestion || null;
        let activeChat = sessionRes.data?.chat || [];

        // Normalize chat formats if necessary
        setChatHistory(activeChat);

        // 2. If no existing suggestion, trigger suggestion API
        if (!activeSuggestion) {
          try {
            const suggestionRes = await fetchAssistantSuggestion({
              rti_query_id: rtiQueryId,
              user_id: userId,
            });

            if (!cancelled) {
              const suggestionData = suggestionRes.data?.[0];
              if (suggestionData) {
                setSuggestion(suggestionData.asst_suggestion);
                setSuggestionSources(suggestionData.source || []);
              }
            }
          } catch (sugErr) {
            console.error('Failed to load suggestion fallback:', sugErr);
            // Non-blocking error for main panel loading
          }
        } else {
          setSuggestion(activeSuggestion);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load assistant panel data');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSessionAndSuggestions();

    return () => {
      cancelled = true;
    };
  }, [rtiQueryId, userId]);

  async function handleSendQuery(e) {
    e.preventDefault();
    if (!inputText.trim() || sending || !rtiQueryId || !userId) return;

    const userMessageText = inputText.trim();
    setInputText('');
    setSending(true);

    // Optimistically add user query to chat history
    const tempUserMsgId = `temp-user-${Date.now()}`;
    setChatHistory((prev) => [
      ...prev,
      {
        user_query_id: tempUserMsgId,
        user_query: userMessageText,
        asst_response: '...',
        source: null,
        isTemp: true,
      },
    ]);

    try {
      const response = await sendUserQuery({
        user_query: userMessageText,
        user_id: userId,
        rti_query_id: rtiQueryId,
      });

      const responseData = response.data?.[0];
      if (responseData) {
        // Replace temp msg / update chat history with final result
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.user_query_id === tempUserMsgId
              ? {
                  user_query_id: responseData.query_id,
                  user_query: userMessageText,
                  asst_response: responseData.asst_response,
                  source: responseData.source,
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error('Failed to send assistant query:', err);
      // Remove temp or show error
      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.user_query_id === tempUserMsgId
            ? {
                ...msg,
                asst_response: 'Failed to get response from assistant. Please try again.',
                isError: true,
              }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  }

  function getSourcesList(sources) {
    if (!sources) return null;
    const list = Array.isArray(sources) ? sources : [sources];
    if (list.length === 0) return null;

    return (
      <div className="mt-2 border-t border-slate-100 pt-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sources</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {list.map((src, i) => (
            <span
              key={i}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600"
            >
              {src}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1 text-sm font-semibold text-slate-900">Assistant</h3>
      <p className="mb-4 text-xs text-slate-500">
        AI-assisted response suggestions and interactive querying
      </p>

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {loadError}
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs text-slate-400">Loading assistant session...</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Suggestion Card */}
          {suggestion && (
            <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50/30 p-4 shadow-sm">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700">
                Suggested Response
              </p>
              <p className="text-xs leading-relaxed text-slate-700">
                {suggestion}
              </p>
              {getSourcesList(suggestionSources)}
              <button
                type="button"
                onClick={() => onCopySuggestion(suggestion)}
                className="mt-3 rounded-lg border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50"
              >
                Copy Suggestion
              </button>
            </div>
          )}

          {/* Interactive Chat History */}
          <div className="flex-1 overflow-y-auto space-y-4 border-t border-slate-100 py-4 pr-1">
            {chatHistory.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                No conversation history. Ask a query below.
              </p>
            ) : (
              chatHistory.map((chat) => (
                <div key={chat.user_query_id} className="space-y-2">
                  {/* User Query bubble */}
                  <div className="max-w-[85%] ml-auto rounded-2xl rounded-tr-none bg-brand-600 px-4 py-2.5 text-xs text-white shadow-sm">
                    <p className="leading-relaxed">{chat.user_query}</p>
                  </div>

                  {/* Assistant Response bubble */}
                  <div className={`max-w-[85%] mr-auto rounded-2xl rounded-tl-none bg-white border border-slate-200 px-4 py-2.5 text-xs shadow-sm ${
                    chat.isError ? 'text-red-600 border-red-200 bg-red-50/20' : 'text-slate-800'
                  }`}>
                    {chat.asst_response === '...' ? (
                      <div className="flex items-center gap-1 py-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.2s]"></span>
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:0.4s]"></span>
                      </div>
                    ) : (
                      <>
                        <p className="leading-relaxed whitespace-pre-wrap">{chat.asst_response}</p>
                        {getSourcesList(chat.source)}
                        {!chat.isError && !chat.isTemp && (
                          <button
                            type="button"
                            onClick={() => onCopySuggestion(chat.asst_response)}
                            className="mt-2 text-[10px] font-medium text-brand-600 transition hover:text-brand-700"
                          >
                            Copy Response
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Input Form */}
          <form onSubmit={handleSendQuery} className="mt-4 flex gap-2 border-t border-slate-200 pt-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={sending}
              placeholder="Ask the assistant..."
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs transition focus:border-brand-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
