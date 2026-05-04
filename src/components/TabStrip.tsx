export type Tab = {
  id: string;
  path: string;
};

export function TabStrip({
  tabs,
  activeId,
  onSelect,
}: {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="tabStrip" role="tablist" aria-label="Editor tabs">
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            className={`tab ${active ? "active" : ""}`}
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(t.id)}
          >
            <span className="tabDot" aria-hidden="true" />
            <span className="tabLabel">{t.path}</span>
          </button>
        );
      })}
      <div className="tabFiller" aria-hidden="true" />
    </div>
  );
}

