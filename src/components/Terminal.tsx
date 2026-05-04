"use client";

import { useMemo, useState } from "react";

type Entry = { kind: "out" | "in"; text: string };

export function Terminal({
  bootLines,
  onCommand,
}: {
  bootLines: string[];
  onCommand: (cmd: string) => void;
}) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>(() => [
    ...bootLines.map((t) => ({ kind: "out" as const, text: t })),
  ]);

  const prompt = useMemo(() => "❯", []);

  function run(cmdRaw: string) {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    setEntries((e) => [...e, { kind: "in", text: `${prompt} ${cmd}` }]);

    if (cmd === "help") {
      setEntries((e) => [
        ...e,
        { kind: "out", text: "commands:" },
        { kind: "out", text: "  help" },
        { kind: "out", text: "  open publications" },
        { kind: "out", text: "  open research" },
        { kind: "out", text: "  open contact" },
      ]);
      return;
    }

    if (cmd.startsWith("open ")) {
      onCommand(cmd);
      setEntries((e) => [...e, { kind: "out", text: `opening: ${cmd.slice(5)}` }]);
      return;
    }

    setEntries((e) => [
      ...e,
      { kind: "out", text: `unknown command: ${cmd}` },
      { kind: "out", text: "type: help" },
    ]);
  }

  return (
    <div className="terminalRoot" aria-label="Terminal">
      <div className="terminalHeader">
        <span className="paneTitle">TERMINAL</span>
        <span className="paneMeta">bash · local</span>
      </div>
      <div className="terminalBody" role="log" aria-live="polite">
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

