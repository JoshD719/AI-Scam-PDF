# Quality Review V2

## What Changed from V1
- Created a separate premium V2 HTML file instead of continuing to polish the old template-based print export.
- Rebuilt the product as a fixed 28-page workbook with a specific job for each page.
- Removed repeated section templates, repeated generic worksheets, repeated “use this now” cards, and generic scenarios.
- Reframed the product as a family protection system, not an ebook.
- Reduced the target from a padded long guide to a tighter premium workbook.

## Why V2 Is Better
- The cover is designed as a premium emergency-preparedness product page.
- The workbook uses varied page types: cover, quick-start, dashboard, table, formula, decision tree, script, printable checklist, forms, logs, poster, resource page, final checklist, and back cover.
- Each page has a specific practical job.
- Worksheets are tailored to their task instead of repeated from one template.
- The print styles are embedded directly in the V2 HTML and do not require npm, Playwright, external fonts, or external CSS.

## How to Export V2
1. Open `family-ai-scam-defense-kit/dist/2026-Family-AI-Scam-Defense-Kit-PREMIUM-V2.html` in Chrome.
2. Press `Ctrl + P`.
3. Set Destination to `Save as PDF`.
4. Set Paper size to `Letter`.
5. Set Scale to `100%`.
6. Turn Background graphics `ON`.
7. Try Margins: `Default` first, then try `None` if the layout looks cleaner.
8. Save as `2026-Family-AI-Scam-Defense-Kit.pdf`.
9. Place the exported PDF in `/buyer-ready`.
10. Upload only the exported PDF to the selling platform.

## Manual Fact-Checking Still Needed
- Update access dates in `family-ai-scam-defense-kit/research/sources.md`.
- Verify FTC, FBI IC3, CISA, CFPB, IRS, USPS, SSA, Medicare, credit bureau, and state attorney general URLs before adding exact links beyond known root domains.
- Add no statistics unless verified by official sources.
- Verify any credit-freeze instructions against current Equifax, Experian, and TransUnion pages.
- Verify any state-specific reporting or consumer-protection pages before adding them.

## What to Inspect After Exporting the PDF
- Cover feels premium and not generic.
- Every page fits cleanly on Letter paper.
- Background graphics appear.
- Text is readable, not tiny.
- Tables and forms do not split awkwardly.
- Decision tree is readable.
- Printable checklists are usable with pen.
- Source/resource page is honest about verification.
- Disclaimer appears.
- No page contains scam-enabling instructions.
- Buyer receives only the final exported PDF.

## Do Not Sell
- Do not sell the fallback PDF.
- Do not sell the old V1 HTML export as the main customer product.
- Do not upload code files, npm instructions, Playwright setup, GitHub repo links, or HTML source as the buyer product.
