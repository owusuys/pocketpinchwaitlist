const bands = [
  { range: "80–100", label: "Go for it", color: "var(--verdict-green)" },
  { range: "55–79", label: "Probably fine", color: "var(--verdict-amber)" },
  { range: "30–54", label: "Be careful", color: "var(--verdict-orange)" },
  { range: "0–29", label: "Not right now", color: "var(--verdict-red)" },
];

export default function ScoreScale() {
  return (
    <section className="px-5 py-16" aria-labelledby="scale-heading">
      <div className="mx-auto max-w-content">
        <h2 id="scale-heading" className="text-center text-3xl font-bold tracking-tight text-ink-text">
          One number. A clear verdict.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink-muted">
          Every score lands in one of four bands — color-coded, so you know at a glance.
        </p>

        {/* 4-segment color bar */}
        <div className="mt-10 overflow-hidden rounded-full" role="presentation">
          <div className="flex h-4">
            {bands
              .slice()
              .reverse()
              .map((b) => (
                <div key={b.label} className="flex-1" style={{ backgroundColor: b.color }} />
              ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {bands.map((b) => (
            <div key={b.label} className="rounded-xl border border-ink-hairline bg-ink-raised p-4">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: b.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-ink-text">{b.label}</span>
              </div>
              <p className="mt-1 text-xs text-ink-faint">{b.range}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
