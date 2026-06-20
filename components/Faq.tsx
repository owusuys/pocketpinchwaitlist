const faqs = [
  {
    q: "Is my bank data safe?",
    // ⚠️ owner to confirm final privacy wording before launch.
    a: "Your bank connection runs through Plaid, the same secure service used by major finance apps. We never sell your data.",
  },
  {
    q: "When does it launch?",
    a: "Soon — join the waitlist and we'll email you once, the moment it's ready.",
  },
  {
    q: "What does it cost?",
    // ⚠️ PLACEHOLDER — do not state pricing publicly until the owner confirms.
    a: "We'll share pricing closer to launch. Waitlist members will hear first.",
  },
  {
    q: "Which platforms?",
    a: "iOS first. Get on the list and we'll let you know when it's live.",
  },
];

export default function Faq() {
  return (
    <section className="px-5 py-16" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-2xl">
        <h2 id="faq-heading" className="text-center text-3xl font-bold tracking-tight text-ink-text">
          Questions
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-ink-hairline bg-ink-raised px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink-text">
                {f.q}
                <span
                  className="shrink-0 text-ink-faint transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
