"use client";

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";

type Status = "idle" | "submitting" | "success" | "duplicate" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; form?: string }>({});

  function validate() {
    const next: typeof errors = {};
    if (!firstName.trim()) next.firstName = "Please enter your first name.";
    else if (firstName.trim().length > 60) next.firstName = "That's a bit long — 60 characters max.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(email.trim())) next.email = "That doesn't look like a valid email.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    if (!validate()) return;

    setStatus("submitting");
    setErrors({});
    track("waitlist_submit_attempt");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          email: email.trim(),
          honeypot,
          source: new URLSearchParams(window.location.search).get("ref") || undefined,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        duplicate?: boolean;
        error?: string;
        field?: "firstName" | "email";
      };

      if (!res.ok || !data.ok) {
        if (res.status === 400 && data.field) {
          setErrors({ [data.field]: data.error });
          setStatus("idle");
          return;
        }
        throw new Error(data.error || "Request failed");
      }

      if (data.duplicate) {
        setStatus("duplicate");
        track("waitlist_submit_success", { duplicate: true });
      } else {
        setStatus("success");
        track("waitlist_submit_success", { duplicate: false });
      }
    } catch {
      setStatus("error");
      setErrors({ form: "Something went wrong. Please try again." });
      track("waitlist_submit_error");
    }
  }

  // Success / duplicate states replace the form entirely.
  if (status === "success" || status === "duplicate") {
    return (
      <div
        className="rounded-2xl border border-ink-hairline bg-ink-raised p-6 text-center sm:p-8"
        aria-live="polite"
      >
        <div
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--verdict-green) 18%, transparent)" }}
        >
          <span className="text-2xl" aria-hidden="true">
            {status === "duplicate" ? "👍" : "🎉"}
          </span>
        </div>
        {status === "duplicate" ? (
          <>
            <p className="text-lg font-semibold text-ink-text">You&apos;re already on the list 👍</p>
            <p className="mt-1 text-sm text-ink-muted">
              We&apos;ve got your spot, {firstName.trim() || "friend"} — we&apos;ll email you once
              PocketPinch is ready.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-ink-text">
              You&apos;re in, {firstName.trim() || "friend"}!
            </p>
            <p className="mt-1 text-sm text-ink-muted">Check your inbox for a confirmation email.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" aria-describedby="form-status">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.3fr]">
        <div>
          <label htmlFor="firstName" className="sr-only">
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            maxLength={60}
            onChange={(e) => setFirstName(e.target.value)}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="w-full rounded-xl border border-ink-hairline bg-ink-tile px-4 py-3 text-ink-text placeholder:text-ink-faint focus:border-verdict-green focus:outline-none"
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-1.5 text-sm text-verdict-red">
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full rounded-xl border border-ink-hairline bg-ink-tile px-4 py-3 text-ink-text placeholder:text-ink-faint focus:border-verdict-green focus:outline-none"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-verdict-red">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Honeypot — off-screen, hidden from AT and keyboard. Real users never see it. */}
      <div className="visually-hidden" aria-hidden="true">
        <label htmlFor="company">Company (leave this empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-verdict-green px-5 py-3.5 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Joining…" : "Join the waitlist"}
      </button>

      <p id="form-status" aria-live="polite" className="min-h-[1.25rem] text-center text-sm text-verdict-red">
        {errors.form}
      </p>
    </form>
  );
}
