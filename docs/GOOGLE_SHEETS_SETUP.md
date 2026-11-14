# Devatrix Internship: Google Sheets Background Sync Setup

This setup enables seamless background synchronization of every internship application submitted on `devatrix.com/internships` directly into your private Google Sheet without needing any paid services or external forms.

---

## 3-Step Setup Guide (Takes ~2 Minutes)

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.new) and create a new blank spreadsheet.
2. Name it **"Devatrix Internship Applications 2026"**.
3. In row 1, set the following header columns:
   - **A1**: `Candidate ID`
   - **B1**: `Full Name`
   - **C1**: `Email`
   - **D1**: `WhatsApp`
   - **E1**: `University`
   - **F1**: `Track`
   - **G1**: `Duration`
   - **H1**: `GitHub URL`
   - **I1**: `LinkedIn URL`
   - **J1**: `Portfolio URL`
   - **K1**: `Statement`
   - **L1**: `Status`
   - **M1**: `Applied Date`

---

### Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions > Apps Script**.
2. Replace all existing code in the editor with this script:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.candidateId || "",
      data.fullName || "",
      data.email || "",
      data.whatsapp || "",
      data.university || "",
      data.track || "",
      data.duration || "",
      data.githubUrl || "",
      data.linkedinUrl || "",
      data.portfolioUrl || "",
      data.statement || "",
      data.status || "Under Review",
      data.createdAt || new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click the **Save** icon (disk icon).
4. Click **Deploy > New deployment**.
5. Select type: **Web app**.
6. Set:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` (required so the Next.js backend can post records to it)
7. Click **Deploy** and authorize permissions when prompted.
8. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

### Step 3: Add to Devatrix Environment
1. In your project `.env.local` file (or production environment variables), add:
```env
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```
2. Restart the server. Now every on-site submission will automatically and instantly appear in your Google Sheet, while also being securely saved in the local database file (`data/internship-applications.json`)!
