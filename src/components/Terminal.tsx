"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Entry = { kind: "out" | "in"; text: string };

export type OpenablePage = { id: string; path: string };

function resolveOpenTarget(arg: string, pages: OpenablePage[]): string | null {
  const a = arg.trim();
  if (!a) return null;
  const lower = a.toLowerCase();
  if (pages.some((p) => p.id === lower)) return lower;
  const byPath = pages.find((p) => p.path.toLowerCase() === lower);
  if (byPath) return byPath.id;
  const stem = lower.replace(/\.(md|json|tsx?)$/i, "");
  if (pages.some((p) => p.id === stem)) return stem;
  return null;
}

export function Terminal({
  bootLines,
  openablePages,
  onOpenPage,
}: {
  bootLines: string[];
  openablePages: OpenablePage[];
  onOpenPage: (id: string) => void;
}) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>(() => [
    ...bootLines.map((t) => ({ kind: "out" as const, text: t })),
  ]);
  const bodyRef = useRef<HTMLDivElement>(null);

  const prompt = useMemo(() => "❯", []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [entries]);

  function run(cmdRaw: string) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    setEntries((e) => [...e, { kind: "in", text: `${prompt} ${cmd}` }]);

    if (cmd === "help") {
      setEntries((e) => [
        ...e,
        { kind: "out", text: "commands:" },
        { kind: "out", text: "  help - show this list" },
        { kind: "out", text: "  ls - list pages you can open" },
        { kind: "out", text: "  open <page> - open a page in the editor" },
      ]);
      return;
    }

    if (cmd === "ls") {
      setEntries((e) => [
        ...e,
        { kind: "out", text: "pages (use: open <id>):" },
        ...openablePages.map((p) => ({
          kind: "out" as const,
          text: `  ${p.id.padEnd(14)} ${p.path}`,
        })),
      ]);
      return;
    }

    if (cmd.startsWith("open ")) {
      const arg = cmd.slice(5).trim();
      const id = resolveOpenTarget(arg, openablePages);
      if (!id) {
        setEntries((e) => [
          ...e,
          { kind: "out", text: `unknown page: ${arg}` },
          { kind: "out", text: "run ls for valid ids / paths" },
        ]);
        return;
      }
      onOpenPage(id);
      const path = openablePages.find((p) => p.id === id)?.path ?? id;
      setEntries((e) => [...e, { kind: "out", text: `opened ${path}` }]);
      return;
    }

    setEntries((e) => [
      ...e,
      { kind: "out", text: `unknown command: ${cmd}` },
      { kind: "out", text: "try: help" },
    ]);
  }

  return (
    <div className="terminalRoot" aria-label="Terminal">
      <div className="terminalHeader">
        <span className="paneTitle">TERMINAL</span>
        <span className="paneMeta">bash · local</span>
      </div>
      <div ref={bodyRef} className="terminalBody" role="log" aria-live="polite">
        {entries.map((e, i) => (
          <div key={i} className={`termLine ${e.kind}`}>
            {e.text || "\u00A0"}
          </div>
        ))}
      </div>
      <form
        className="terminalInputRow"
        onSubmit={(ev) => {
          ev.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span className="termPrompt" aria-hidden="true">
          {prompt}
        </span>
        <input
          className="termInput"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type a command…"
          aria-label="Terminal command"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </form>
    </div>
  );
}
