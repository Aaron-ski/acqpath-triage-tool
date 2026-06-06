# Acquisition Pathway Triage Tool

A dependency-free static web app that helps Government CORs, APMs, PAPMs, DPMs, PMs, acquisition managers, and product owners prepare for acquisition strategy conversations.

The tool uses a Yes/No/Unsure wizard with weighted scoring to provide a plain-English recommendation to discuss one of these paths with the appropriate contracting professionals:

- Traditional FAR-based contract
- Existing contract vehicle / IDIQ / BPA / GWAC
- Commercial item / FAR Part 12 style approach
- CSO / BAA / innovation solicitation
- Other Transaction discussion
- Contracting Officer / Agreements Officer review

## Important Disclaimer

This tool does not make official contracting determinations and does not provide legal or contracting advice. It is a planning and triage aid only. Final acquisition strategy decisions must be reviewed by the appropriate Contracting Officer, Agreements Officer, legal counsel, and acquisition leadership.

Do not include classified information, source selection information, vendor proprietary information, procurement-sensitive information, CUI, NNPI, PII, or controlled acquisition data in the MVP.

## Run Locally

Open `index.html` in a browser. No build step or package install is required.

## MVP Behavior

- Dark mode is the default, with a visible light-mode toggle.
- The app shows one question at a time with progress such as `Question 3 of 10`.
- Each prompt uses Yes, No, or Unsure answers.
- Users can go back, change answers, and start over.
- The recommendation panel shows the top path, secondary paths to consider, weighted fit scores, next steps, and questions to ask Contracts.
- The one-page summary can be copied into email, Teams, a SharePoint intake form, or printed.
- There are no internet calls, no login, and no data leaves the browser.

## SharePoint Use

The MVP is built with plain HTML, CSS, and JavaScript so it can be hosted as static files, embedded in a SharePoint page where allowed, or recreated later as a Power Apps-style decision tree.

Later versions could recreate the workflow in SharePoint, Power Apps, or Dataverse with controlled intake, routing, and reporting.

## Possible Future Enhancements

- SharePoint landing page.
- Microsoft List for intake submissions.
- Power Automate notification to an acquisition support team.
- Power BI dashboard for common acquisition needs and demand signals.
- Power Apps role-based intake form.
- Dataverse or SharePoint List backend.
- Retrieval-augmented knowledge assistant using approved acquisition sources.
- Source-cited answers with guardrails against official legal or contracting determinations.
- Approved policy and guide knowledge base integration.

## Recommended Governance Reviewers

- Contracting Officer
- Agreements Officer
- Acquisition Policy Lead
- Legal Counsel
- Information System Security Manager
- SharePoint / M365 Site Owner

## Files

- `index.html` - app structure and content shell
- `styles.css` - responsive visual styling
- `app.js` - question flow, scoring, recommendation logic, copy, and print behavior
