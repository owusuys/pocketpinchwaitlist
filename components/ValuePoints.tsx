const points = [
  {
    title: "Not a budgeting app",
    body: "One answer, when it matters — not another dashboard to maintain.",
  },
  {
    title: "Knows your bills before they hit",
    body: "Upcoming recurring debits are baked into every score.",
  },
  {
    title: "Ask any way",
    body: "Text, barcode, or photo. Whatever's fastest at the moment.",
  },
  {
    title: "Built for the checkout line",
    body: "A quick gut-check backed by your real finances, in seconds.",
  },
];

export default function ValuePoints() {
  return (
    <section className="px-5 py-16">
      <div className="mx-auto grid max-w-content gap-5 sm:grid-cols-2">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-ink-hairline bg-ink-raised p-6"
          >
            <h3 className="text-lg font-semibold text-ink-text">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
