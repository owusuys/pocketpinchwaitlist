export default function Footer() {
  return (
    <footer className="border-t border-ink-hairline px-5 py-10">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
        <div>
          <span className="text-lg font-bold tracking-tight text-ink-text">PocketPinch</span>
          <p className="mt-1 text-xs text-ink-faint">
            {/* ⚠️ confirm legal entity name */}© 2026 Entafo Studios. Know before you buy.
          </p>
        </div>
        <nav className="flex items-center gap-6 text-sm text-ink-muted" aria-label="Footer">
          {/* ⚠️ PLACEHOLDER links — stub to # until pages exist */}
          <a href="#" className="hover:text-ink-text">
            Privacy
          </a>
          <a href="#" className="hover:text-ink-text">
            Terms
          </a>
          {/* ⚠️ PLACEHOLDER contact email */}
          <a href="mailto:hello@pocketpinch.app" className="hover:text-ink-text">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
