const app = document.getElementById('app');

function checkbox(text) {
  return `<label class="check"><input type="checkbox"><span>${text}</span></label>`;
}

function lines(count = 4) {
  return Array.from({ length: count }, () => '<div class="write-line"></div>').join('');
}

function panel(title, items, tone = '') {
  return `<article class="panel ${tone}"><h4>${title}</h4>${items.map(checkbox).join('')}</article>`;
}

function worksheet(title, prompts) {
  return `<div class="worksheet"><div class="worksheet-head"><h3>${title}</h3><button type="button" class="print-page">Print this page</button></div>${prompts.map(prompt => `<label class="field"><span>${prompt}</span>${lines(1)}</label>`).join('')}</div>`;
}

function sectionTemplate(section, index) {
  const isSixty = section.id === 'sixty-second-rule';
  const isVoice = section.id === 'voice-clone-plan';
  const isBusiness = section.id === 'small-business';
  return `<section id="${section.id}" class="chapter">
    <div class="section-label">Section ${index + 1}</div>
    <h2>${section.title}</h2>
    <p class="promise">${section.promise}</p>
    <div class="split intro-split">
      <div><h3>What is the threat?</h3><p>${section.threat}</p></div>
      <div class="why-box"><h3>Why it works</h3><p>${section.why}</p></div>
    </div>
    <div class="grid two checklist-grid">
      ${panel('Red flags to notice', section.redFlags, 'warn')}
      ${panel('What to do instead', section.doList, 'safe')}
    </div>
    ${panel('What not to do', section.dontList, 'danger')}
    ${isSixty ? decisionTree() : ''}
    ${isVoice ? voiceCards() : ''}
    ${isBusiness ? businessLog() : ''}
    <div class="scenario"><strong>Scenario:</strong> ${section.scenario}</div>
    ${worksheet(`${section.title} worksheet`, section.worksheet)}
  </section>`;
}

function decisionTree() {
  return `<div class="decision-tree keep-together">
    <h3>Scam Call / Text Decision Tree</h3>
    <div class="node start">Surprise call, text, email, DM, QR code, invoice, or support message</div>
    <div class="tree-grid">
      <div class="node">Asks for money, crypto, gift cards, wire transfer, bank info, login code, personal info, or remote access?</div>
      <div class="node yes">Yes → Stop. Do not pay, click, approve, or reply.</div>
      <div class="node">Creates urgency, fear, romance, profit, authority pressure, or secrecy?</div>
      <div class="node yes">Yes → Leave the conversation and verify directly.</div>
      <div class="node">Contact method chosen by them?</div>
      <div class="node yes">Yes → Use a known number, official app, saved bookmark, or public agency website instead.</div>
    </div>
    <div class="poster-line">Pause → Verify → Contact Directly → Never Pay Under Pressure → Document → Report</div>
  </div>`;
}

function voiceCards() {
  return `<div class="script-card keep-together"><h3>Phone scripts to practice</h3>
    <p>“I need to verify this. What is the family code word?”</p>
    <p>“I’m going to hang up and call you directly.”</p>
    <p>“I do not send money during emergency calls without verification.”</p>
    <p>“I will contact another family member first.”</p>
    <div class="wallet-row"><div class="wallet-card">Family code word:<br><span>________________</span><br>Backup verifier:<br><span>________________</span></div><div class="wallet-card">If pressured:<br><strong>Hang up. Call directly. Tell family.</strong></div></div>
  </div>`;
}

function businessLog() {
  return `<div class="business-log keep-together"><h3>Payment Approval Log</h3><table><thead><tr><th>Date</th><th>Vendor / Payee</th><th>Risk trigger</th><th>Verifier 1</th><th>Verifier 2</th><th>Result</th></tr></thead><tbody>${Array.from({ length: 6 }, () => '<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}</tbody></table></div>`;
}

function printableTemplate(item, index) {
  return `<section class="printable" id="printable-${index + 1}">
    <div class="printable-top"><span>Bonus Printable ${index + 1}</span><button type="button" class="print-page">Print this page</button></div>
    <h2>${item.title}</h2>
    <div class="grid two">
      <div class="panel safe"><h4>Checklist</h4>${item.checks.map(checkbox).join('')}</div>
      <div class="panel"><h4>Write it down</h4>${item.prompts.map(prompt => `<label class="field"><span>${prompt}</span>${lines(1)}</label>`).join('')}</div>
    </div>
    <div class="notes-box"><strong>Notes / next action</strong>${lines(6)}</div>
  </section>`;
}

function toc() {
  return `<section id="toc" class="chapter toc-page">
    <h2>Table of Contents</h2>
    <p class="promise">Use the quick-start path if you only have 15 minutes. Use the full path for a family binder, church handout packet, or small-business safety review.</p>
    <div class="quick-start">
      <div><strong>Start here:</strong> 60-second rule → code word → emergency contacts → before-you-send-money checklist.</div>
      <div><strong>Print first:</strong> Code-word card, emergency contact sheet, fake text checklist, incident log.</div>
    </div>
    <ol class="toc-list">${kit.sections.map((section, i) => `<li><a href="#${section.id}"><span>Section ${i + 1}</span>${section.title}<em>${section.promise}</em></a></li>`).join('')}<li><a href="#printables"><span>Bonus</span>15 Printable Worksheets<em>Binder-ready pages for home, parents, kids, and business use.</em></a></li></ol>
  </section>`;
}

app.innerHTML = `
  <section id="cover" class="cover">
    <div class="cover-grid">
      <div>
        <div class="edition">2026 Edition</div>
        <h1>The 2026 Family AI Scam Defense Kit</h1>
        <h2>A practical playbook to protect your money, parents, kids, business, and identity from voice clones, fake texts, deepfakes, and digital fraud.</h2>
        <p>A practical family safety system for spotting, stopping, and recovering from modern AI-powered scams.</p>
      </div>
      <div class="cover-card"><strong>Inside:</strong><span>Code-word cards</span><span>Call scripts</span><span>Fake text rules</span><span>Recovery plan</span><span>15 printables</span></div>
    </div>
  </section>
  <section class="chapter how-to">
    <h2>How to Use This Kit</h2>
    <p class="promise">This is not a textbook. It is a family operating system for suspicious calls, texts, payments, and account alerts.</p>
    <div class="grid four steps">
      <div><strong>1</strong><span>Teach the 60-second rule.</span></div>
      <div><strong>2</strong><span>Choose a code word.</span></div>
      <div><strong>3</strong><span>Print the cards and worksheets.</span></div>
      <div><strong>4</strong><span>Review monthly.</span></div>
    </div>
    <div class="disclaimer"><strong>Important disclaimer:</strong> ${kit.disclaimer}</div>
  </section>
  ${toc()}
  <section class="chapter keep-together">
    <h2>Old Scam vs. AI-Era Scam</h2>
    <table><thead><tr><th>Old pattern</th><th>AI-era pattern</th><th>Family response</th></tr></thead><tbody><tr><td>Generic typo-filled message</td><td>Clean message with familiar names, logos, or timing</td><td>Verify outside the message</td></tr><tr><td>Unknown caller</td><td>Voice that sounds familiar or urgent</td><td>Ask for code word, hang up, call back directly</td></tr><tr><td>Obvious fake support page</td><td>Convincing support chat or app-like page</td><td>Open the official app or type the site yourself</td></tr><tr><td>Simple fake invoice</td><td>Thread hijack or payment-change request</td><td>Two-person approval and known-number callback</td></tr></tbody></table>
  </section>
  ${kit.sections.map(sectionTemplate).join('')}
  <section id="printables" class="divider"><h2>Bonus Printable Section</h2><p>Binder-ready worksheets for the refrigerator, wallet, family meeting, church table, or small-business office.</p></section>
  ${kit.printables.map(printableTemplate).join('')}
  <section class="chapter resources">
    <h2>Official Resources and Disclaimer</h2>
    <div class="disclaimer">${kit.disclaimer}</div>
    <ul class="resource-list"><li><a href="https://reportfraud.ftc.gov/">FTC ReportFraud.ftc.gov</a></li><li><a href="https://www.ic3.gov/">FBI Internet Crime Complaint Center (IC3)</a></li><li><a href="https://www.cisa.gov/secure-our-world">CISA Secure Our World</a></li><li><a href="https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/">CFPB resources for older adults</a></li></ul>
  </section>`;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

document.querySelectorAll('.print-page').forEach(button => button.addEventListener('click', () => window.print()));
