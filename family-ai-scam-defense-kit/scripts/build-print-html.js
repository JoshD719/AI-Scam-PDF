const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = {};
vm.createContext(context);
vm.runInContext(`${fs.readFileSync(path.join(root, 'src', 'content.js'), 'utf8')}\nthis.kit = kit;`, context);
const { kit } = context;

const baseCss = fs.readFileSync(path.join(root, 'src', 'styles.css'), 'utf8');
const printCss = fs.readFileSync(path.join(root, 'src', 'print.css'), 'utf8');
const exportCss = `
.print-shell { background:#dfe7f2; padding:28px 0; }
.page { max-width:8.5in; min-height:10.55in; margin:0 auto 28px; background:#fff; position:relative; overflow:hidden; }
.cover:after { content:""; position:absolute; right:-80px; bottom:-80px; width:310px; height:310px; border:42px solid rgba(255,255,255,.12); border-radius:50%; }
.cover-kits { display:grid; grid-template-columns:repeat(2, minmax(0,1fr)); gap:12px; margin-top:28px; }
.cover-kits div { border:1px solid rgba(255,255,255,.28); background:rgba(255,255,255,.12); border-radius:18px; padding:14px; font-weight:850; }
.value-strip { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin:22px 0; }
.value-strip div, .number-card { border:1px solid var(--line); border-radius:18px; padding:16px; background:#f8fbff; break-inside:avoid; }
.value-strip strong, .number-card strong { display:block; color:var(--accent); font-size:24px; line-height:1; margin-bottom:6px; }
.rule-callout { border:2px solid #f6b08f; background:#fff7ed; border-radius:20px; padding:18px 20px; margin:18px 0; break-inside:avoid; }
.rule-callout strong { color:var(--navy); }
.tool-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin:18px 0; }
.tool-card { border:1px solid var(--line); border-top:6px solid var(--blue); border-radius:18px; padding:14px; background:white; break-inside:avoid; }
.tool-card h4 { margin-bottom:6px; }
.action-page { padding:58px 74px; border-bottom:1px solid var(--line); page-break-after:always; }
.action-page .worksheet { border-top:7px solid var(--accent); }
.signature-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-top:28px; break-inside:avoid; }
.signature-line { border-top:1.5px solid #667085; padding-top:8px; font-weight:800; }
.source-card { border:1px solid var(--line); border-left:7px solid var(--blue); border-radius:16px; padding:14px; margin:10px 0; background:#f8fbff; break-inside:avoid; }
.final-plan li { margin:10px 0; }
.print-note { font-size:12px; color:var(--muted); margin-top:10px; }
.printable .notes-box { border:2px dashed #98a2b3; }
.printable-banner { display:flex; gap:10px; flex-wrap:wrap; margin:0 0 16px; }
.printable-banner span { background:#eef4ff; color:var(--navy); border:1px solid #c7d7fe; border-radius:999px; padding:6px 10px; font-weight:850; font-size:12px; }
@media print {
  .print-shell { padding:0; background:white; }
  .page { max-width:none; min-height:10.1in; margin:0; box-shadow:none; }
  .cover, .chapter, .printable, .divider, .action-page { break-after:page; page-break-after:always; }
  .action-page { padding:.28in .18in; border-bottom:0; }
  .value-strip, .tool-row, .number-card, .signature-row, .rule-callout, .tool-card, .source-card, .printable-banner { break-inside:avoid; page-break-inside:avoid; }
}
@media (max-width:820px) {
  .print-shell { padding:0; }
  .page { margin:0; min-height:auto; }
  .value-strip, .tool-row, .cover-kits { grid-template-columns:1fr; }
}
`;

function esc(value) {
  return String(value).replace(/[&<>]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[char]));
}
function checkbox(text) {
  return `<label class="check"><input type="checkbox"><span>${esc(text)}</span></label>`;
}
function lines(count = 1) {
  return Array.from({ length: count }, () => '<div class="write-line"></div>').join('');
}
function panel(title, items, tone = '') {
  return `<article class="panel ${tone}"><h4>${esc(title)}</h4>${items.map(checkbox).join('')}</article>`;
}
function field(prompt, lineCount = 1) {
  return `<label class="field"><span>${esc(prompt)}</span>${lines(lineCount)}</label>`;
}
function toolsFor(section) {
  if (section.id === 'sixty-second-rule') {
    return `<div class="decision-tree keep-together"><h3>Scam Call / Text Decision Tree</h3><div class="node start">Surprise call, text, email, DM, QR code, invoice, or support message</div><div class="tree-grid"><div class="node">Asks for money, crypto, gift cards, wire transfer, bank info, login code, personal info, or remote access?</div><div class="node yes">Yes → Stop. Do not pay, click, approve, or reply.</div><div class="node">Creates urgency, fear, romance, profit, authority pressure, or secrecy?</div><div class="node yes">Yes → Leave the conversation and verify directly.</div><div class="node">Contact method chosen by them?</div><div class="node yes">Yes → Use a known number, official app, saved bookmark, or public agency website.</div></div><div class="poster-line">Pause → Verify → Contact Directly → Never Pay Under Pressure → Document → Report</div></div>`;
  }
  if (section.id === 'voice-clone-plan') {
    return `<div class="script-card keep-together"><h3>Phone scripts to practice</h3><p>“I need to verify this. What is the family code word?”</p><p>“I’m going to hang up and call you directly.”</p><p>“I do not send money during emergency calls without verification.”</p><div class="wallet-row"><div class="wallet-card">Family code word:<br><span>________________</span><br>Backup verifier:<br><span>________________</span></div><div class="wallet-card">If pressured:<br><strong>Hang up. Call directly. Tell family.</strong></div></div></div>`;
  }
  if (section.id === 'small-business') {
    return `<div class="business-log keep-together"><h3>Payment Approval Log</h3><table><thead><tr><th>Date</th><th>Vendor / Payee</th><th>Risk trigger</th><th>Verifier 1</th><th>Verifier 2</th><th>Result</th></tr></thead><tbody>${Array.from({ length: 6 }, () => '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}</tbody></table></div>`;
  }
  return '';
}
function sectionPage(section, index) {
  return `<section id="${section.id}" class="chapter page"><div class="section-label">Section ${index + 1}</div><h2>${esc(section.title)}</h2><p class="promise">${esc(section.promise)}</p><div class="rule-callout"><strong>Use-this-now rule:</strong> When this situation appears, do not decide inside the message or call. Pause, verify through a trusted route, and involve one real person if money, access, secrecy, or pressure appears.</div><div class="split intro-split"><div><h3>What is the threat?</h3><p>${esc(section.threat)}</p></div><div class="why-box"><h3>Why it works</h3><p>${esc(section.why)}</p></div></div><div class="tool-row"><div class="tool-card"><h4>Use at home</h4><p>Turn this page into a family rule before the next suspicious contact.</p></div><div class="tool-card"><h4>Use with parents</h4><p>Frame verification as teamwork, not control or criticism.</p></div><div class="tool-card"><h4>Use at work</h4><p>Slow down payments, account changes, and urgent exceptions.</p></div></div><div class="grid two checklist-grid">${panel('Red flags to notice', section.redFlags, 'warn')}${panel('What to do instead', section.doList, 'safe')}</div>${panel('What not to do', section.dontList, 'danger')}<div class="scenario"><strong>Scenario:</strong> ${esc(section.scenario)}</div>${toolsFor(section)}</section><section id="${section.id}-worksheet" class="action-page page"><div class="section-label">Action page</div><h2>${esc(section.title)} Worksheet</h2><p class="promise">Fill this out during a family meeting, parent check-in, church safety session, or business review.</p><div class="worksheet"><h3>Write the rule before the emergency happens</h3>${section.worksheet.map(item => field(item)).join('')}${field('Who gets a copy of this page:')}${field('Next review date:')}</div><div class="grid two"><div class="panel safe"><h4>Practice out loud</h4>${['I verify urgent requests first.', 'I will call back using a known number.', 'I do not send money under pressure.', 'I will save evidence and ask for help.'].map(checkbox).join('')}</div><div class="panel warn"><h4>Keep this page where it will be used</h4>${['Family binder', 'Refrigerator', 'Parent folder', 'Business payment desk', 'Church/community packet'].map(checkbox).join('')}</div></div><div class="signature-row"><div class="signature-line">Reviewed by</div><div class="signature-line">Date</div></div></section>`;
}
function printablePage(item, index) {
  return `<section id="printable-${index + 1}" class="printable page"><div class="printable-top"><span>Bonus Printable ${index + 1}</span></div><h2>${esc(item.title)}</h2><div class="printable-banner"><span>Standalone tool</span><span>Binder-ready</span><span>Fridge / wallet / office friendly</span></div><p class="promise">Use this page when a real decision needs to be slowed down, verified, written down, or discussed with someone trusted.</p><div class="grid two"><div class="panel safe"><h4>Checklist</h4>${item.checks.map(checkbox).join('')}</div><div class="panel"><h4>Write it down</h4>${item.prompts.map(prompt => field(prompt)).join('')}</div></div><div class="notes-box"><strong>Notes / next action</strong>${lines(7)}</div><div class="signature-row"><div class="signature-line">Completed by</div><div class="signature-line">Date</div></div></section>`;
}

const toc = kit.sections.map((section, index) => `<li><a href="#${section.id}"><span>Section ${index + 1}</span>${esc(section.title)}<em>${esc(section.promise)}</em></a></li>`).join('') + '<li><a href="#printables"><span>Bonus</span>15 Printable Worksheets<em>Binder-ready tools for home, family, and business use.</em></a></li><li><a href="#sources"><span>Resources</span>Official Sources and Reporting Links<em>FTC, FBI IC3, CISA, CFPB, and related source notes.</em></a></li><li><a href="#final-plan"><span>Finish</span>Final Action Plan<em>What to do before putting the kit away.</em></a></li>';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The 2026 Family AI Scam Defense Kit — Print Edition</title><style>${baseCss}\n${printCss}\n${exportCss}</style></head><body><nav id="topNav"><a href="#cover">Cover</a><a href="#toc">Contents</a><a href="#printables">Printables</a><a href="#sources">Sources</a><button onclick="window.print()">Print / Save PDF</button></nav><main class="print-shell"><section id="cover" class="cover page"><div class="cover-grid"><div><div class="edition">2026 Edition</div><h1>The 2026 Family AI Scam Defense Kit</h1><h2>A practical playbook to protect your money, parents, kids, business, and identity from voice clones, fake texts, deepfakes, and digital fraud.</h2><p>A practical family safety system for spotting, stopping, and recovering from modern AI-powered scams.</p><div class="cover-kits"><div>Family code-word system</div><div>60-second response rule</div><div>Emergency recovery plan</div><div>15 printable worksheets</div></div></div><div class="cover-card"><strong>Built for real life</strong><span>Parents and grandparents</span><span>Kids and teens</span><span>Small businesses</span><span>Churches and groups</span><span>Monthly family review</span></div></div></section><section class="chapter page"><h2>How to Use This Kit</h2><p class="promise">This is not a textbook. It is a practical safety system for moments when a call, text, invoice, or account alert creates pressure.</p><div class="grid four steps"><div><strong>1</strong><span>Teach the 60-second rule.</span></div><div><strong>2</strong><span>Choose a family code word.</span></div><div><strong>3</strong><span>Print the action pages.</span></div><div><strong>4</strong><span>Review the plan monthly.</span></div></div><div class="value-strip"><div><strong>Fast</strong>Start with the rule, code word, and emergency contacts.</div><div><strong>Practical</strong>Use scripts, checklists, logs, and printable cards.</div><div><strong>Reusable</strong>Review monthly and update after family or account changes.</div></div><div class="quick-start"><div><strong>Start here if you only have 15 minutes:</strong> Read Section 2, choose the code word in Section 3, and print the emergency contact sheet.</div><div><strong>Use this with groups:</strong> Print the bonus section as a handout packet for a church, family meeting, parent group, or business safety review.</div></div></section><section id="disclaimer" class="chapter page"><h2>Important Disclaimer</h2><div class="disclaimer"><strong>Read before using this kit:</strong> ${esc(kit.disclaimer)}</div><p class="promise">This kit helps you slow down, verify, document, report, and recover. It does not replace professional help in an active emergency.</p></section><section id="toc" class="chapter toc-page page"><h2>Table of Contents</h2><p class="promise">Click a section in the browser preview, or use this as a printed map for the PDF.</p><ol class="toc-list">${toc}</ol></section><section class="chapter page"><h2>Old Scam vs. AI-Era Scam</h2><table><thead><tr><th>Old pattern</th><th>AI-era pattern</th><th>Family response</th></tr></thead><tbody><tr><td>Generic typo-filled message</td><td>Clean message with familiar names, logos, or timing</td><td>Verify outside the message</td></tr><tr><td>Unknown caller</td><td>Voice that sounds familiar or urgent</td><td>Ask for code word, hang up, call back directly</td></tr><tr><td>Obvious fake support page</td><td>Convincing support chat or app-like page</td><td>Open the official app or type the site yourself</td></tr><tr><td>Simple fake invoice</td><td>Thread hijack or payment-change request</td><td>Two-person approval and known-number callback</td></tr></tbody></table><div class="rule-callout"><strong>Main point:</strong> the danger is not only technology. The danger is panic, urgency, trust, confusion, and isolation.</div></section>${kit.sections.map(sectionPage).join('')}<section id="printables" class="divider page"><h2>Bonus Printable Section</h2><p>Standalone cards, logs, checklists, and worksheets for the refrigerator, wallet, family binder, church table, or small-business office.</p></section>${kit.printables.map(printablePage).join('')}<section id="sources" class="chapter resources page"><h2>Official Resources and Source Notes</h2><div class="disclaimer">${esc(kit.disclaimer)}</div><div class="source-card"><strong>FTC ReportFraud.ftc.gov</strong><br><a href="https://reportfraud.ftc.gov/">https://reportfraud.ftc.gov/</a><br>Use for general fraud reporting guidance.</div><div class="source-card"><strong>FBI Internet Crime Complaint Center (IC3)</strong><br><a href="https://www.ic3.gov/">https://www.ic3.gov/</a><br>Use for internet-enabled crime reporting where appropriate.</div><div class="source-card"><strong>CISA Secure Our World</strong><br><a href="https://www.cisa.gov/secure-our-world">https://www.cisa.gov/secure-our-world</a><br>Use for password, MFA, update, and phishing-resistant habit guidance.</div><div class="source-card"><strong>CFPB Resources for Older Adults</strong><br><a href="https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/">https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/</a><br>Use for older-adult financial protection resources.</div><p class="print-note">Before selling, update research source access dates and verify any agency-specific links you add.</p></section><section id="final-plan" class="chapter page final-plan"><h2>Final Action Plan</h2><p class="promise">Before you put this kit away, complete these five steps.</p><ol><li>Choose and privately share the family code word.</li><li>Print the emergency contact sheet and place one copy near the phone.</li><li>Choose the trusted person everyone calls before sending urgent money.</li><li>Review bank, email, and payment-app security settings.</li><li>Schedule the first monthly family security meeting.</li></ol><div class="value-strip"><div class="number-card"><strong>1</strong>Pause before responding.</div><div class="number-card"><strong>2</strong>Verify directly.</div><div class="number-card"><strong>3</strong>Report and recover.</div></div><div class="signature-row"><div class="signature-line">Family / group lead</div><div class="signature-line">Date completed</div></div></section></main><script>document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}}));</script></body></html>`;

fs.writeFileSync(path.join(root, 'dist', '2026-Family-AI-Scam-Defense-Kit-PRINT.html'), html);
console.log('Wrote dist/2026-Family-AI-Scam-Defense-Kit-PRINT.html');
