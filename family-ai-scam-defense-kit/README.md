# The 2026 Family AI Scam Defense Kit

A professional HTML-to-PDF digital product for families, older adults, small businesses, churches, and community groups. It includes a polished cover, clickable table of contents, calm scam-prevention guidance, scripts, checklists, worksheets, decision trees, and printable safety pages.

## Recommended Export Method: Chrome Save as PDF

The npm registry may be blocked in some environments, and Playwright is optional. The current recommended commercial method is browser export from the standalone premium V2 print-ready HTML file.

1. Open:
   `dist/2026-Family-AI-Scam-Defense-Kit-PREMIUM-V2.html`

2. In Chrome, press:
   `Ctrl + P`

3. Use these settings:
   Destination: Save as PDF
   Paper size: Letter
   Scale: 100%
   Background graphics: ON
   Margins: Default first, then try None if the layout looks better

4. Save as:
   `2026-Family-AI-Scam-Defense-Kit.pdf`

5. Move the exported PDF into:
   `/buyer-ready`

6. Upload only the final PDF to the selling platform.

Buyers do not need any technical setup. They should receive only the exported PDF, not the project files, npm scripts, Playwright setup, GitHub repository, or HTML source.

## Requirements for Optional Developer Workflow
- Node.js 18+
- npm
- Playwright, if you want automated PDF export instead of Chrome manual export

## Install Optional Dependencies
```bash
npm install
npx playwright install chromium
```

If npm registry access is blocked, skip this and use the recommended Chrome export method above.

## Preview the Source App
```bash
npm run preview
```
Open `http://localhost:4173`. Checkboxes work in the browser and table-of-contents links jump to sections.

## Export PDF with Optional Playwright
```bash
npm run pdf
```
If Playwright is installed, this exports a styled PDF to `dist/2026-Family-AI-Scam-Defense-Kit.pdf`. If Playwright is unavailable, the script creates a plain fallback PDF for technical testing only. **Do not sell the fallback PDF.**

## Build the Standalone Print HTML
```bash
node scripts/build-print-html.js
```
This writes:

`dist/2026-Family-AI-Scam-Defense-Kit-PRINT.html`

Use the V2 file for Chrome Save as PDF export when preparing the commercial buyer PDF.

## Build
```bash
npm run build
```
This runs the optional PDF export script.

## Check
```bash
npm run check
```
This verifies required project files and content markers.

## Edit Content
- Main content data: `src/content.js`
- HTML shell: `src/index.html`
- Browser styling: `src/styles.css`
- Print/PDF styling: `src/print.css`
- Standalone print HTML generator: `scripts/build-print-html.js`
- Optional Playwright PDF export settings: `scripts/generate-pdf.js`

## Verify Sources Before Sale
Review `research/sources.md`, then update the date accessed fields. Review `research/fact-check-notes.md` and `research/sources-needed.md` before publishing. Avoid adding statistics unless they are sourced to official pages.

## Prepare the Product for Sale
1. Build or confirm the premium V2 print HTML exists: `dist/2026-Family-AI-Scam-Defense-Kit-PREMIUM-V2.html`.
2. Open that file in Chrome.
3. Export with Chrome Save as PDF using Letter, 100% scale, and Background graphics ON.
4. Open the PDF and inspect page breaks, links, cover, worksheets, and resource pages.
5. Place the final exported PDF in `/buyer-ready`.
6. Upload only the final PDF to the selling platform.

## Troubleshooting
- If npm install fails, use Chrome Save as PDF from the standalone print HTML file.
- If background colors do not appear, enable Background graphics in Chrome print settings.
- If margins look too large, try Chrome Margins: None and compare the output.
- If page breaks look tight, edit `src/print.css`, run `node scripts/build-print-html.js`, and export again.
