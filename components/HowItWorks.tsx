const steps = [
  {
    n: "1",
    title: "Ask",
    body: "Type it, scan the barcode, or snap a photo — however you spot the thing you want.",
  },
  {
    n: "2",
    title: "We check",
    body: "Your real balance, upcoming bills, and spending patterns — pulled from your bank.",
  },
  {
    n: "3",
    title: "Get your score",
    body: "0–100, with a clear verdict and the reasoning behind it. No spreadsheets.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-5 py-16" aria-labelledby="how-heading">
      <div className="mx-auto max-w-content">
        <h2 id="how-heading" className="text-center text-3xl font-bold tracking-tight text-ink-text">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-ink-hairline bg-ink-raised p-6"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-verdict-green"
                style={{ backgroundColor: "color-mix(in srgb, var(--verdict-green) 14%, transparent)" }}
              >
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-text">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
