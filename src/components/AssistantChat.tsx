"use client";

type PromptId = string;
type ChatMsg = { role: "assistant" | "user"; content: string };
type Prompt = { id: PromptId; label: string };

export function AssistantChat({
  messages,
  prompts,
  onPrompt,
}: {
  messages: ChatMsg[];
  prompts: Prompt[];
  onPrompt: (id: PromptId) => void;
}) {
  return (
    <div className="chatRoot">
      <div className="chatScroll" aria-label="Assistant chat messages">
        {messages.map((m, i) => (
          <div key={i} className={`chatMsg ${m.role}`}>
            <div className="chatBubble">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="chatPrompts" aria-label="Suggested prompts">
        {prompts.map((p) => (
          <button key={p.id} type="button" className="chip" onClick={() => onPrompt(p.id)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="chatComposer" aria-label="Chat input (visual)">
        <div className="composerFake">
          <span className="composerHint">Ask about papers, projects, or teaching…</span>
          <span className="composerKey">↵</span>
        </div>
      </div>
    </div>
  );
}

