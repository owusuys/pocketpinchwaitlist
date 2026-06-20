/**
 * PocketPinch Waitlist — Google Apps Script webhook.
 *
 * Sheet 1 "Signups" columns (row 1 is a header row):
 *   A: Timestamp | B: First Name | C: Email | D: Source
 *
 * Sheet 2 "Stats" is auto-maintained after each new signup:
 *   Shows total signups, page views (manual, from Cloudflare Web Analytics),
 *   and conversion rate.
 */

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty('WAITLIST_SECRET');

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
    lock.waitLock(10000);
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheets()[0];
      var last = sheet.getLastRow();

      if (last >= 2) {
        var emails = sheet.getRange(2, 3, last - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).trim().toLowerCase() === email) {
            return json({ ok: true, duplicate: true });
          }
        }
      }

      sheet.appendRow([timestamp, firstName, email, source]);
      updateStats(ss);
      return json({ ok: true, duplicate: false });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function updateStats(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var signupSheet = ss.getSheets()[0];
  var statsSheet = ss.getSheetByName('Stats');

  if (!statsSheet) {
    statsSheet = ss.insertSheet('Stats');
    statsSheet.getRange('A1:B1').setValues([['Metric', 'Value']]);
    statsSheet.getRange('A1:B1').setFontWeight('bold');
    statsSheet.getRange('A2:A6').setValues([
      ['Total Signups'],
      ['Page Views (update from Cloudflare dashboard)'],
      ['Conversion Rate'],
      [''],
      ['Last Updated'],
    ]);
    // Conversion rate formula references B2 (signups) and B3 (page views)
    statsSheet.getRange('B4').setFormula('=IF(B3>0, TEXT(B2/B3,"0.0%"), "—")');
  }

  var totalSignups = Math.max(0, signupSheet.getLastRow() - 1);
  statsSheet.getRange('B2').setValue(totalSignups);
  statsSheet.getRange('B6').setValue(new Date());
}

function doGet() {
  return json({ ok: true, service: 'pocketpinch-waitlist' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
