"use client";

import type { AssistantPromptChip } from "@/content/siteData";
import { useCallback, useEffect, useRef, useState } from "react";

export type ChatMsg = { role: "assistant" | "user"; content: string };

const CHARS_PER_TICK = 2;
const TICK_MS = 22;
const START_DELAY_MS = 120;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useChipChatStream({
  initialMessages,
  prompts,
  onOpenFile,
}: {
  initialMessages: ChatMsg[];
  prompts: AssistantPromptChip[];
  onOpenFile: (fileId: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>(() => [...initialMessages]);
  const [isStreaming, setIsStreaming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);
  const fullRef = useRef("");

  const clearTimer = useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const onChipClick = useCallback(
    (promptId: string) => {
      const p = prompts.find((x) => x.id === promptId);
      if (!p) return;

      onOpenFile(p.openFileId);
      clearTimer();
      setIsStreaming(false);

      const full = p.assistantReply;
      fullRef.current = full;
      indexRef.current = 0;

      if (prefersReducedMotion() || !full.length) {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: p.userPrompt },
          { role: "assistant", content: full },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "user", content: p.userPrompt }]);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsStreaming(true);

      const tick = () => {
        indexRef.current = Math.min(full.length, indexRef.current + CHARS_PER_TICK);
        const slice = full.slice(0, indexRef.current);

        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: slice };
          return next;
        });

        if (indexRef.current < full.length) {
          timerRef.current = setTimeout(tick, TICK_MS);
        } else {
          timerRef.current = null;
          setIsStreaming(false);
        }
      };

      timerRef.current = setTimeout(tick, START_DELAY_MS);
    },
    [prompts, onOpenFile, clearTimer],
  );

  return { messages, isStreaming, onChipClick };
}
