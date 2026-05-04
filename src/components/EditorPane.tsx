export type EditorFile = {
  id: string;
  path: string;
  language: "md" | "json" | "ts" | "txt";
  content: string;
};

function formatLineNo(n: number) {
  if (n < 10) return ` ${n}`;
  if (n < 100) return `${n}`;
  return `${n}`;
}

export function EditorPane({ file }: { file: EditorFile }) {
  const lines = file.content.split("\n");

  return (
    <div className="editorPane" data-language={file.language}>
      <div className="editorSurface" role="document" aria-label={file.path}>
        {lines.map((line, idx) => (
          <div key={idx} className="editorLine">
            <span className="editorGutter" aria-hidden="true">
              {formatLineNo(idx + 1)}
            </span>
            <span className="editorText">{line || "\u00A0"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

