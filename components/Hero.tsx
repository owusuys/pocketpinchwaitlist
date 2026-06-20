import ScoreDial from "./ScoreDial";
import WaitlistForm from "./WaitlistForm";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:pt-20">
      {/* subtle radial glow behind the dial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--verdict-green), transparent)" }}
      />

      <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="reveal min-w-0 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink-hairline bg-ink-raised px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-verdict-green" aria-hidden="true" />
            iOS · Coming soon
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-ink-text sm:text-5xl lg:text-6xl">
            Know before
            <br />
            you buy.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-muted lg:mx-0">
            PocketPinch checks your real bank balance and upcoming bills, then gives you a 0–100
            score on whether you can actually afford that purchase — right now, in the moment.
          </p>

          <div className="mx-auto mt-8 max-w-xl lg:mx-0">
            <WaitlistForm />
            <div className="mt-3 space-y-1 text-center text-xs text-ink-faint lg:text-left">
              <p>No spam. We&apos;ll email you once when it&apos;s ready.</p>
              <p>Bank data stays private — we never sell it.</p>
            </div>
          </div>
        </div>

        <div className="reveal flex min-w-0 justify-center lg:justify-end" style={{ animationDelay: "0.1s" }}>
          <div className="w-full max-w-sm rounded-3xl border border-ink-hairline bg-ink-raised p-8 shadow-2xl">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-ink-faint">
              Affordability score
            </p>
            <ScoreDial />
            <p className="mt-4 text-center text-sm text-ink-muted">
              &ldquo;AirPods Pro&rdquo; · $249
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
