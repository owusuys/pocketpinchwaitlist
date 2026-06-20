import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  confirmationSubject,
  confirmationHtml,
  confirmationText,
} from "@/emails/confirmation";

// Run on the Node.js runtime (Resend SDK + outbound fetch).
export const runtime = "edge";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Lightweight per-IP rate limit ────────────────────────────────────────────
// Best-effort only: serverless instances are ephemeral, so this throttles bursts
// hitting the same warm instance. Not Fort Knox — just enough to slow abuse.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  let body: {
    firstName?: string;
    email?: string;
    honeypot?: string;
    source?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // 1) Honeypot — a filled hidden field means a bot. Pretend success, write nothing.
  if (body.honeypot && body.honeypot.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 2) Validate.
  const firstName = (body.firstName || "").trim();
  const email = (body.email || "").trim().toLowerCase();

  if (!firstName || firstName.length > 60) {
    return NextResponse.json(
      { ok: false, field: "firstName", error: "Please enter your first name (60 chars max)." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, field: "email", error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // 3) Rate limit.
  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  const timestamp = new Date().toISOString();
  const source = (body.source || "").trim() || "web";

  // 4) Persist to Google Sheet via the Apps Script webhook.
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.WAITLIST_SHARED_SECRET;

  if (!scriptUrl || !secret) {
    // Misconfiguration — log clearly so local dev / deploy is obvious, fail safe.
    console.error(
      "[waitlist] Missing GOOGLE_APPS_SCRIPT_URL or WAITLIST_SHARED_SECRET. Cannot save signup."
    );
    return NextResponse.json(
      { ok: false, error: "Signups aren't configured yet. Please try again later." },
      { status: 503 }
    );
  }

  let duplicate = false;
  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, email, timestamp, source, secret }),
      // Apps Script redirects to script.googleusercontent.com — follow it.
      redirect: "follow",
    });

    if (!res.ok) {
      console.error(`[waitlist] Apps Script returned ${res.status}`);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      duplicate?: boolean;
      error?: string;
    };

    if (!data.ok) {
      console.error("[waitlist] Apps Script rejected:", data.error);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 }
      );
    }

    duplicate = !!data.duplicate;
  } catch (err) {
    console.error("[waitlist] Failed to reach Apps Script:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  // 5) Confirmation email — best-effort. Only on NEW signups. Never fail the
  //    signup if email fails; the row is already saved, which is what matters.
  if (!duplicate) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (apiKey && from) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from,
          to: email,
          subject: confirmationSubject,
          html: confirmationHtml(firstName),
          text: confirmationText(firstName),
        });
      } catch (err) {
        console.error("[waitlist] Confirmation email failed (signup still saved):", err);
      }
    } else {
      console.warn("[waitlist] RESEND_API_KEY / RESEND_FROM_EMAIL unset — skipping email.");
    }
  }

  return NextResponse.json({ ok: true, duplicate });
}
