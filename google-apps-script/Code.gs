/**
 * PocketPinch Waitlist — Google Apps Script webhook.
 *
 * Receives signups from the Next.js /api/waitlist route and appends them to the
 * bound Google Sheet. See the repo README for step-by-step deployment.
 *
 * Sheet columns (row 1 is a header row):
 *   A: Timestamp | B: First Name | C: Email | D: Source
 *
 * Setup checklist:
 *   1. Create the Sheet, add the header row above.
 *   2. Extensions → Apps Script, paste this file.
 *   3. Project Settings → Script Properties → add  WAITLIST_SECRET  (long random string).
 *   4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *   5. Copy the /exec URL into the site's GOOGLE_APPS_SCRIPT_URL env var.
 *   6. Use the SAME secret as WAITLIST_SHARED_SECRET in the site env.
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty('WAITLIST_SECRET');

    // Verify the shared secret. Rejects random people POSTing to the open URL.
    if (!expected || payload.secret !== expected) {
      return json({ ok: false, error: 'forbidden' });
    }

    var firstName = String(payload.firstName || '').trim();
    var email = String(payload.email || '').trim().toLowerCase();
    var timestamp = String(payload.timestamp || new Date().toISOString());
    var source = String(payload.source || 'web').trim() || 'web';

    if (!firstName || !email) {
      return json({ ok: false, error: 'missing fields' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000); // serialize appends so de-dupe is race-free
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var last = sheet.getLastRow();

      // De-dupe on column C (Email), case-insensitive. Skip header row.
      if (last >= 2) {
        var emails = sheet.getRange(2, 3, last - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).trim().toLowerCase() === email) {
            return json({ ok: true, duplicate: true });
          }
        }
      }

      sheet.appendRow([timestamp, firstName, email, source]);
      return json({ ok: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

// Simple GET so you can sanity-check the deployment URL in a browser.
function doGet() {
  return json({ ok: true, service: 'pocketpinch-waitlist' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
