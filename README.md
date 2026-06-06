# Acquisition Pathway Triage Tool

A dependency-free static web app that helps Government CORs, APMs, PAPMs, DPMs, PMs, acquisition managers, and product owners prepare for acquisition strategy conversations.

The tool uses a Yes/No/Unsure checklist with weighted scoring to provide a plain-English recommendation to discuss one of these paths with the appropriate contracting professionals:

- Other Transaction
- Traditional FAR-based contract
- Commercial Solutions Opening
- Broad Agency Announcement
- Existing contract vehicle
- Commercial acquisition approach

## Important Disclaimer

This tool does not make official contracting determinations and does not provide legal or contracting advice. It is a planning and triage aid only. Final acquisition strategy decisions must be reviewed by the appropriate Contracting Officer, Agreements Officer, legal counsel, and acquisition leadership.

## Run Locally

Open `index.html` in a browser. No build step or package install is required.

## MVP Behavior

- Dark mode is the default, with a visible light-mode toggle.
- Each prompt uses Yes, No, or Unsure answers.
- The recommendation panel shows the top path, secondary paths to consider, weighted fit scores, next steps, and questions to ask Contracts.
- The one-page summary can be copied into email, Teams, a SharePoint intake form, or printed.
- There are no internet calls, no login, and no data leaves the browser.

## SharePoint Use

The MVP is built with plain HTML, CSS, and JavaScript so it can be hosted as static files, embedded in a SharePoint page where allowed, or recreated later as a Power Apps-style decision tree.

## Files

- `index.html` - app structure and content shell
- `styles.css` - responsive visual styling
- `app.js` - question flow, scoring, recommendation logic, copy, and print behavior
