# PocketPinch Waitlist

A fast, dark, mobile-first landing page that captures **first name + email** for the
**PocketPinch** iOS app waitlist — writes each signup to a **Google Sheet** and sends a
confirmation email via **Resend**. Built with Next.js (App Router), TypeScript, and Tailwind.
Deploys to **Vercel free tier**.

> **Tagline:** Know before you buy. · **By:** Entafo Studios

---

## 1. Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

The site renders and the form gives friendly errors even with **no** env vars set —
you only need them to actually save signups and send email.

Production build check:

```bash
npm run build
```

---

## 2. Google Sheet + Apps Script setup (no coding required)

This is how signups get saved. Takes about 5 minutes.

### Step 1 — Create the Sheet
1. Go to [sheets.new](https://sheets.new) to create a new Google Sheet. Name it e.g. *PocketPinch Waitlist*.
2. In **row 1**, type these four headers, one per column:

   | A | B | C | D |
   |---|---|---|---|
   | Timestamp | First Name | Email | Source |

### Step 2 — Add the script
1. In the Sheet, click **Extensions → Apps Script**.
2. Delete whatever code is there, then **paste the entire contents** of
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs) from this repo.
3. Click the **Save** (disk) icon.

### Step 3 — Set the shared secret
1. In the Apps Script editor, click the **gear icon (Project Settings)** in the left sidebar.
2. Scroll to **Script Properties → Add script property**.
3. Property name: `WAITLIST_SECRET`  ·  Value: a long random string (e.g. from a password manager).
4. Click **Save script properties**. **Keep this value** — you'll reuse it in Step 5.

### Step 4 — Deploy as a Web App
1. Top-right, click **Deploy → New deployment**.
2. Click the gear next to "Select type" → choose **Web app**.
3. Set:
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
4. Click **Deploy**. Approve the permissions prompt (it's your own script).
5. Copy the **Web app URL** — it ends in `/exec`. This is your `GOOGLE_APPS_SCRIPT_URL`.

> Sanity check: paste the `/exec` URL into a browser. You should see `{"ok":true,"service":"pocketpinch-waitlist"}`.

### Step 5 — Connect it to the site
Set two env vars (locally in `.env.local`, and in Vercel — see §4):

```
GOOGLE_APPS_SCRIPT_URL=<the /exec URL from Step 4>
WAITLIST_SHARED_SECRET=<the same secret from Step 3>
```

> **Updating the script later?** Edit `Code.gs`, then **Deploy → Manage deployments → Edit (pencil)
> → Version: New version → Deploy.** Re-deploying as a *new deployment* changes the URL; editing the
> existing one keeps it.

---

## 3. Resend (confirmation email) setup

Signups are saved even if email isn't configured — email is best-effort.

1. Create a free account at [resend.com](https://resend.com) and grab an **API key**.
2. **For quick testing:** use Resend's built-in sender — set `RESEND_FROM_EMAIL="PocketPinch <onboarding@resend.dev>"`.
   This sends only to the email you signed up to Resend with (Resend's test limitation).
3. **For production:** in Resend, **add and verify your sending domain** (add the DNS records they
   provide), then use an address on it, e.g. `RESEND_FROM_EMAIL="PocketPinch <hello@pocketpinch.app>"`.

```
RESEND_API_KEY=<your key>
RESEND_FROM_EMAIL=PocketPinch <onboarding@resend.dev>
```

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. At [vercel.com/new](https://vercel.com/new), import the repo. Framework auto-detects as **Next.js** —
   no build settings to change.
3. Before (or right after) the first deploy, add these **Environment Variables** in
   **Project → Settings → Environment Variables**:

   | Variable | Value |
   |---|---|
   | `GOOGLE_APPS_SCRIPT_URL` | The `/exec` URL from §2 |
   | `WAITLIST_SHARED_SECRET` | Same secret as the Apps Script property |
   | `RESEND_API_KEY` | Your Resend API key |
   | `RESEND_FROM_EMAIL` | e.g. `PocketPinch <hello@pocketpinch.app>` |
   | `NEXT_PUBLIC_SITE_URL` | Your live URL, e.g. `https://pocketpinch.app` |

4. **Redeploy** after adding env vars so they take effect.
5. (Optional) Add your custom domain in **Project → Settings → Domains**.

Vercel Analytics is already wired in (`@vercel/analytics`); enable **Analytics** in the Vercel
dashboard to start collecting `page_view` plus the custom `waitlist_submit_*` events.

---

## 5. Exporting your signups

Everyone who joins is a row in your Google Sheet.

- **Just open the Sheet** to see the live list.
- To export: **File → Download → Comma-separated values (.csv)** — import that into any email tool later.

---

## 6. Things to confirm before launch

Search the codebase for `PLACEHOLDER` and `⚠️` to find every spot. Key ones:

- **Domain** → `NEXT_PUBLIC_SITE_URL`.
- **From-email** → verify a domain in Resend or keep the test sender.
- **Legal entity** in `components/Footer.tsx` ("Entafo Studios").
- **Privacy / Terms** links in `components/Footer.tsx` (currently `#` stubs).
- **Pricing** — the FAQ in `components/Faq.tsx` deliberately does *not* state a price.
- **Privacy claim wording** about Plaid/bank data in `components/Faq.tsx` — keep it accurate.

---

## Project structure

```
app/
  layout.tsx            # fonts (Inter), metadata, Vercel Analytics
  page.tsx              # composes the landing sections
  globals.css           # Tailwind + brand CSS variables
  api/waitlist/route.ts # server handler: validate, honeypot, rate-limit, Sheet POST, Resend
  opengraph-image.tsx   # generated 1200×630 social card
  icon.svg, robots.ts, sitemap.ts
components/              # Hero, ScoreDial, WaitlistForm, HowItWorks, ScoreScale, ValuePoints, Faq, Footer
emails/confirmation.ts  # HTML + plaintext confirmation email
google-apps-script/Code.gs  # the Sheet webhook (paste into Apps Script)
```
