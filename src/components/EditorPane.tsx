import type { ReactNode } from "react";

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

type Publication = {
  title?: string;
  venue?: string;
  year?: number;
  authors?: string[];
  links?: Record<string, string>;
};

/**
 * Inline **bold** / __bold__, *italic* / _italic_ (one line).
 * Bold is matched first; nested markup inside bold/italic is supported.
 */
function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode {
  const re =
    /\*\*(.+?)\*\*|__(.+?)__|(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)|(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let si = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const subKey = `${keyPrefix}-i${si++}`;
    if (m[1] !== undefined) {
      parts.push(
        <strong key={subKey} className="richStrong">
          {renderInlineMarkdown(m[1], subKey)}
        </strong>,
      );
    } else if (m[2] !== undefined) {
      parts.push(
        <strong key={subKey} className="richStrong">
          {renderInlineMarkdown(m[2], subKey)}
        </strong>,
      );
    } else if (m[3] !== undefined) {
      parts.push(
        <em key={subKey} className="richEm">
          {renderInlineMarkdown(m[3], subKey)}
        </em>,
      );
    } else if (m[4] !== undefined) {
      parts.push(
        <em key={subKey} className="richEm">
          {renderInlineMarkdown(m[4], subKey)}
        </em>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  if (parts.length === 0) return text;
  if (parts.length === 1) return parts[0];
  return parts;
}

function renderMarkdownLike(content: string) {
  const lines = content.split("\n");
  return (
    <div className="richDoc">
      {lines.map((line, idx) => {
        if (line.startsWith("# ")) {
          return (
            <h1 key={idx} className="richH1">
              {renderInlineMarkdown(line.replace(/^# /, ""), `h1-${idx}`)}
            </h1>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={idx} className="richH2">
              {renderInlineMarkdown(line.replace(/^## /, ""), `h2-${idx}`)}
            </h2>
          );
        }
        if (line.startsWith("- ")) {
          return (
            <div key={idx} className="richBullet">
              <span className="richBulletDot" aria-hidden="true" />
              <span>{renderInlineMarkdown(line.replace(/^- /, ""), `li-${idx}`)}</span>
            </div>
          );
        }
        const tagMatch = line.match(/`([^`]+)`/g);
        if (tagMatch && line.trim().startsWith("`")) {
          return (
            <div key={idx} className="richTags">
              {tagMatch.map((tag, tIdx) => (
                <span key={tIdx} className="richTag">
                  {tag.replace(/`/g, "")}
                </span>
              ))}
            </div>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="richSpacer" aria-hidden="true" />;
        }
        return (
          <p key={idx} className="richP">
            {renderInlineMarkdown(line, `p-${idx}`)}
          </p>
        );
      })}
    </div>
  );
}

function renderPublicationJson(content: string) {
  try {
    const parsed = JSON.parse(content) as { selected?: Publication[] };
    const pubs = parsed.selected ?? [];
    return (
      <div className="richDoc richDoc--publications">
        <h1 className="richH1">Selected Publications</h1>
        {pubs.length === 0 ? (
          <p className="richP">No entries yet.</p>
        ) : (
          <div className="pubGrid">
            {pubs.map((pub, idx) => (
              <article key={`${pub.title ?? "paper"}-${idx}`} className="pubCard">
                <div className="pubHead">
                  <span className="pubIndex">P{(idx + 1).toString().padStart(2, "0")}</span>
                  <span className="pubYear">{pub.year ?? "TBD"}</span>
                </div>
                <h3 className="pubTitle">{pub.title ?? "Untitled publication"}</h3>
                <p className="pubVenue">{pub.venue ?? "Venue pending"}</p>
                {pub.authors && pub.authors.length > 0 ? (
                  <p className="pubAuthors">{pub.authors.join(" · ")}</p>
                ) : null}
                <div className="pubLinks">
                  {Object.entries(pub.links ?? {}).map(([key, value]) => (
                    value ? (
                      <a
                        key={key}
                        className="pubLink active"
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${key} link`}
                      >
                        {key}
                      </a>
                    ) : (
                      <span key={key} className="pubLink muted">
                        {key}
                      </span>
                    )
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  } catch {
    return null;
  }
}

function contactHref(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^mailto:/i.test(v)) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;
  return null;
}

function renderContactTs(content: string) {
  const pairs = Array.from(content.matchAll(/^\s*([a-zA-Z0-9_]+):\s*"([^"]*)"/gm)).map((m) => ({
    key: m[1],
    value: m[2],
  }));

  if (pairs.length === 0) return null;

  return (
    <div className="richDoc">
      <h1 className="richH1">Contact</h1>
      <div className="contactGrid">
        {pairs.map((item) => {
          const href = contactHref(item.value);
          return (
            <div key={item.key} className="contactCard">
              <span className="contactKey">{item.key}</span>
              {href ? (
                <a
                  className="contactValue contactLink"
                  href={href}
                  {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noreferrer" })}
                >
                  {item.value}
                </a>
              ) : (
                <span className="contactValue">{item.value}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EditorPane({ file }: { file: EditorFile }) {
  const lines = file.content.split("\n");
  const isMarkdown = file.language === "md";
  const isPublications = file.path === "publications.json";
  const isContact = file.path === "contact.ts";

  const richContent =
    (isPublications && renderPublicationJson(file.content)) ||
    (isContact && renderContactTs(file.content)) ||
    (isMarkdown && renderMarkdownLike(file.content));

  return (
    <div className="editorPane" data-language={file.language}>
      <div className="editorSurface" role="document" aria-label={file.path}>
        {richContent ? (
          <>
            {richContent}
          </>
        ) : (
          lines.map((line, idx) => (
            <div key={idx} className="editorLine">
              <span className="editorGutter" aria-hidden="true">
                {formatLineNo(idx + 1)}
              </span>
              <span className="editorText">{line || "\u00A0"}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

