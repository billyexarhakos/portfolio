export function StatusBar() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");

  return (
    <div className="statusBar" role="contentinfo" aria-label="Status bar">
      <div className="statusLeft">
        <span className="statusItem">
          <span className="statusDot ok" aria-hidden="true" />
          main
        </span>
        <span className="statusItem">✓ lint</span>
        <span className="statusItem">⎇ clean</span>
      </div>
      <div className="statusRight">
        <span className="statusItem">Ln 12, Col 3</span>
        <span className="statusItem">UTF-8</span>
        <span className="statusItem">{hh}:{mm}</span>
      </div>
    </div>
  );
}

