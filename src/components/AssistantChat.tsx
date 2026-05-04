"use client";

import type { AssistantPromptChip } from "@/content/siteData";
import type { ChatMsg } from "@/hooks/useChipChatStream";
import { useEffect, useRef } from "react";

export function AssistantChat({
  messages,
  isStreaming,
  prompts,
  onChipClick,
}: {
  messages: ChatMsg[];
  isStreaming: boolean;
  prompts: AssistantPromptChip[];
  onChipClick: (id: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  return (
    <div className="chatRoot">
      <div className="chatScroll" aria-label="Assistant chat messages" aria-live="polite" aria-relevant="additions text">
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          const streamingBubble = isStreaming && isLast && m.role === "assistant";
          return (
            <div key={i} className={`chatMsg ${m.role}`}>
              <div className={`chatBubble ${streamingBubble ? "streaming" : ""}`}>{m.content}</div>
            </div>
          );
        })}
        <div ref={bottomRef} aria-hidden="true" />
      </div>
      <div className="chatPrompts" aria-label="Suggested prompts">
        {prompts.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip"
            disabled={isStreaming}
            onClick={() => onChipClick(p.id)}
          >
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
