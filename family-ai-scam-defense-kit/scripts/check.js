const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const required = [
  'src/index.html', 'src/styles.css', 'src/script.js', 'src/content.js', 'src/print.css',
  'scripts/generate-pdf.js', 'scripts/preview.js', 'README.md',
  'research/sources.md', 'research/sources-needed.md', 'research/fact-check-notes.md',
  'seller-assets/product-description.md', 'seller-assets/short-sales-posts.md', 'seller-assets/launch-plan.md', 'seller-assets/customer-readme.md',
  'QUALITY-REVIEW.md', 'dist/2026-Family-AI-Scam-Defense-Kit-PRINT.html', 'dist/2026-Family-AI-Scam-Defense-Kit-PREMIUM-V2.html'
];
let ok = true;
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) { console.error(`Missing ${file}`); ok = false; }
}
const content = fs.readFileSync(path.join(root, 'src', 'content.js'), 'utf8');
const script = fs.readFileSync(path.join(root, 'src', 'script.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8');
const printCss = fs.readFileSync(path.join(root, 'src', 'print.css'), 'utf8');
const combined = `${content}\n${script}\n${styles}\n${printCss}`;
[
  'This guide is for educational and personal safety planning purposes only',
  'The 60-Second Scam Response Rule',
  'Family Voice-Clone Protection Plan',
  'Small Business Scam Defense',
  'Official Resources and Disclaimer',
  'FTC ReportFraud',
  'FBI Internet Crime Complaint Center',
  'CFPB resources for older adults',
  '@media (max-width: 820px)',
  '@page'
].forEach(marker => {
  if (!combined.includes(marker)) { console.error(`Missing content marker: ${marker}`); ok = false; }
});
const printableCount = (content.match(/title:/g) || []).length - (content.match(/id:/g) || []).length;
if (printableCount < 15) { console.error('Expected at least 15 printable definitions'); ok = false; }

const printHtml = fs.readFileSync(path.join(root, 'dist', '2026-Family-AI-Scam-Defense-Kit-PRINT.html'), 'utf8');
['@media print', '@page', 'print-color-adjust', 'Bonus Printable', 'Final Action Plan', 'Official Resources and Source Notes'].forEach(marker => {
  if (!printHtml.includes(marker)) { console.error(`Missing print HTML marker: ${marker}`); ok = false; }
});


const v2Html = fs.readFileSync(path.join(root, 'dist', '2026-Family-AI-Scam-Defense-Kit-PREMIUM-V2.html'), 'utf8');
['Premium V2', '@media print', '@page', 'The Modern Scam Pattern', 'STOP', 'Official Resources and Source Notes'].forEach(marker => {
  if (!v2Html.includes(marker)) { console.error(`Missing V2 marker: ${marker}`); ok = false; }
});
const v2PageCount = (v2Html.match(/class="page/g) || []).length;
if (v2PageCount < 28 || v2PageCount > 45) { console.error(`Unexpected V2 page count: ${v2PageCount}`); ok = false; }

console.log(ok ? 'Project check passed' : 'Project check failed');
process.exit(ok ? 0 : 1);
