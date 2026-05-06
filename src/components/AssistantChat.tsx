"use client";

import type { AssistantPromptChip } from "@/content/siteData";
import type { ChatMsg } from "@/hooks/useChipChatStream";
import { useEffect, useId, useMemo, useRef, useState } from "react";

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
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const selectOptions = useMemo(() => {
    return [{ id: "", label: "Ask a question…" }, ...prompts.map((p) => ({ id: p.id, label: p.label }))];
  }, [prompts]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  useEffect(() => {
    if (isStreaming) setMenuOpen(false);
  }, [isStreaming]);

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
      <div className="chatMenu" aria-label="Quick question menu">
        <button
          type="button"
          className="chatMenuBtn"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          disabled={isStreaming || prompts.length === 0}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="chatMenuBtnText">{isStreaming ? "Responding…" : "Ask a question…"}</span>
          <span className="chatMenuBtnCaret" aria-hidden="true">
            ▾
          </span>
        </button>

        {menuOpen ? (
          <div className="chatMenuPopover" role="listbox" id={menuId} aria-label="Dialogue options">
            {selectOptions.slice(1).map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="option"
                aria-selected="false"
                className="chatMenuOption"
                onClick={() => {
                  setMenuOpen(false);
                  onChipClick(opt.id);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
