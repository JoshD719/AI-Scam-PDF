const fs = require('fs');
const path = require('path');
let chromium;
try { chromium = require('playwright').chromium; } catch (_) { chromium = null; }

function pdfEscape(value) {
  return String(value).replace(/[\\()]/g, '\\$&');
}

function wrap(text, max = 82) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > max) { lines.push(line.trim()); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

function fallbackPdf(outPath) {
  const pageTopics = [
    ['Cover', 'The 2026 Family AI Scam Defense Kit', 'A practical family safety system for spotting, stopping, and recovering from modern AI-powered scams.'],
    ['Disclaimer', 'Educational and personal safety planning only', 'Contact banks, payment providers, official agencies, law enforcement, or qualified professionals when fraud, threats, identity theft, or financial loss are active.'],
    ['Quick Start', 'Print these first', 'Code-word card, emergency contact sheet, scam call decision tree, fake text checklist, before-you-send-money checklist, and incident log.'],
    ['60-Second Rule', 'Pause. Verify. Contact directly. Never pay under pressure. Document. Report.', 'Use this rule when anyone asks for money, codes, credentials, personal information, remote access, secrecy, or urgent action.'],
    ['Family Code Word', 'Verify emergency calls without analyzing the voice', 'Ask for the family code word, hang up, and call the known number. Do not stay on a suspicious call while verifying.'],
    ['Older Parent Plan', 'Respectful protection', 'Create a before-sending-money call list and make verification a family rule, not a punishment.'],
    ['Government Messages', 'Authority pressure is not proof', 'Do not click unexpected toll, tax, jury duty, court, police, or benefit links. Use official public sites or known numbers.'],
    ['Bank and Package Texts', 'The safe-link rule', 'Open the official app or type the official site yourself. Change passwords and enable MFA if credentials were entered.'],
    ['Romance and Investment', 'No-shame money filter', 'If someone you have not met asks for money, crypto, gift cards, investment deposits, or account access, stop and review with a trusted person.'],
    ['Small Business', 'Two-person payment control', 'Verify vendor bank changes with a known number already on file. Log unusual payment approvals.'],
    ['Kids and Teens', 'Do not panic; tell an adult', 'Save evidence when safe, do not pay or bargain, and respond calmly so young people keep asking for help.'],
    ['Recovery Plan', 'First hour after a scam', 'Stop contact, save evidence, call the provider, change passwords, enable MFA, report, warn contacts, and monitor accounts.'],
    ['Home Safety Setup', 'Reduce everyday risk', 'Unique passwords, MFA, updates, privacy settings, and careful sharing make personalization harder.'],
    ['Monthly Meeting', 'Keep the plan alive', 'Review suspicious messages, code-word privacy, emergency contacts, account security, and support needs.']
  ];
  const printableNames = ['Family Code-Word Card', 'Emergency Contact Sheet', 'Scam Call Decision Tree', 'Fake Text Checklist', 'Grandparent Safety Checklist', 'Small Business Invoice Checklist', 'Scam Incident Log', 'Monthly Family Security Meeting Sheet', 'Before You Send Money Checklist', 'Stop, Verify, Report Poster', 'Bank/Payment App Emergency Call Notes', 'Credit Freeze Tracker', 'Password Reset Tracker', 'Parent-Child Online Safety Agreement', 'Vendor Payment Change Verification Form'];
  const pages = [];
  for (let cycle = 0; cycle < 3; cycle += 1) pageTopics.forEach(topic => pages.push(topic));
  printableNames.forEach(name => pages.push(['Printable Worksheet', name, 'Use this page as a standalone binder, refrigerator, wallet, office, church handout, or family meeting worksheet.']));
  while (pages.length < 60) pages.push(pageTopics[pages.length % pageTopics.length]);

  const streams = pages.map(([kicker, title, body], index) => {
    let y = 735;
    let stream = `BT /F1 10 Tf 54 ${y} Td (${pdfEscape('The 2026 Family AI Scam Defense Kit')}) Tj ET\n`;
    y -= 36;
    stream += `BT /F2 13 Tf 54 ${y} Td (${pdfEscape(kicker.toUpperCase())}) Tj ET\n`;
    y -= 34;
    for (const line of wrap(title, 44)) { stream += `BT /F2 22 Tf 54 ${y} Td (${pdfEscape(line)}) Tj ET\n`; y -= 28; }
    y -= 6;
    for (const line of wrap(body, 80)) { stream += `BT /F1 12 Tf 54 ${y} Td (${pdfEscape(line)}) Tj ET\n`; y -= 19; }
    y -= 18;
    const checks = ['Pause before responding', 'Verify using a trusted method', 'Do not send money, codes, or account access under pressure', 'Document names, numbers, links, receipts, and screenshots', 'Report suspicious or confirmed fraud to the appropriate official resource'];
    stream += `BT /F2 14 Tf 54 ${y} Td (${pdfEscape('Action checklist')}) Tj ET\n`; y -= 24;
    checks.forEach(check => { stream += `BT /F1 12 Tf 64 ${y} Td (${pdfEscape('☐ ' + check)}) Tj ET\n`; y -= 22; });
    y -= 8;
    stream += `BT /F2 14 Tf 54 ${y} Td (${pdfEscape('Notes')}) Tj ET\n`; y -= 22;
    for (let i = 0; i < 7; i += 1) { stream += `BT /F1 12 Tf 54 ${y} Td (${pdfEscape('______________________________________________________________')}) Tj ET\n`; y -= 24; }
    stream += `BT /F1 9 Tf 270 32 Td (${pdfEscape(`Page ${index + 1} of ${pages.length}`)}) Tj ET\n`;
    return stream;
  });

  const objects = [''];
  const kids = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push('<< /Type /Pages /Kids [] /Count 0 >>');
  streams.forEach(stream => {
    const pageObject = objects.length;
    const contentObject = pageObject + 1;
    kids.push(`${pageObject} 0 R`);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${streams.length * 2 + 3} 0 R /F2 ${streams.length * 2 + 4} 0 R >> >> /Contents ${contentObject} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`);
  });
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${streams.length} >>`;

  let pdf = '%PDF-1.4\n';
  const xref = [0];
  for (let i = 1; i < objects.length; i += 1) { xref[i] = Buffer.byteLength(pdf); pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`; }
  const start = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i += 1) pdf += `${String(xref[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer << /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  fs.writeFileSync(outPath, pdf);
  console.log(`PDF fallback exported to ${outPath}`);
}

(async () => {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'dist', '2026-Family-AI-Scam-Defense-Kit.pdf');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  if (!chromium) { fallbackPdf(output); return; }
  const html = `file://${path.join(root, 'src', 'index.html')}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
  await page.goto(html, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: output,
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: '<div style="width:100%;font-size:9px;color:#667085;text-align:center;">The 2026 Family AI Scam Defense Kit · Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    margin: { top: '0.35in', right: '0.45in', bottom: '0.55in', left: '0.45in' },
    tagged: true
  });
  await browser.close();
  console.log(`PDF exported to ${output}`);
})().catch(error => { console.error(error); process.exit(1); });
