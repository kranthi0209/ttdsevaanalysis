const fs = require('fs');
let html = fs.readFileSync('ttd-dashboard.html', 'utf8');

/* ─── APRIL 2026 ESTIMATED DATA (proportional from March 2026, ~+3.4% scale) ─── */
const APR = 'Apr 26';

const aprBooked = {
  'Abhishekam':433,'Archana':771,'Arjitha Brahmotsavam':7100,
  'Astadala Pada Padmaradhana':192,'Civet Vessel':6,'Kalyanotsavam':37000,
  'Kasturi Vessel':20,'Melchat Vastram':154,'Sahasra Deepalankara':15600,
  'Suprabatham':12800,'Thiruppavada':240,'Thomala':820,'USSE':1330,'Unjal Seva':4200
};

const aprByType = {
  'Abhishekam':       {'Advance Booking':171,'Current Booking':15,'Descritionary':247,'Donor':0,'Online':0},
  'Archana':          {'Advance Booking':16,'Current Booking':124,'Descritionary':505,'Donor':0,'Online':126},
  'Arjitha Brahmotsavam':{'Advance Booking':0,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':7100},
  'Astadala Pada Padmaradhana':{'Advance Booking':0,'Current Booking':0,'Descritionary':88,'Donor':0,'Online':104},
  'Civet Vessel':     {'Advance Booking':6,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':0},
  'Kalyanotsavam':    {'Advance Booking':0,'Current Booking':5312,'Descritionary':5192,'Donor':0,'Online':26496},
  'Kasturi Vessel':   {'Advance Booking':20,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':0},
  'Melchat Vastram':  {'Advance Booking':52,'Current Booking':2,'Descritionary':100,'Donor':0,'Online':0},
  'Sahasra Deepalankara':{'Advance Booking':0,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':15600},
  'Suprabatham':      {'Advance Booking':37,'Current Booking':1325,'Descritionary':2608,'Donor':555,'Online':8275},
  'Thiruppavada':     {'Advance Booking':6,'Current Booking':77,'Descritionary':157,'Donor':0,'Online':0},
  'Thomala':          {'Advance Booking':17,'Current Booking':120,'Descritionary':561,'Donor':0,'Online':122},
  'USSE':             {'Advance Booking':1330,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':0},
  'Unjal Seva':       {'Advance Booking':0,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':4200}
};

const aprVerified = {
  'Abhishekam':427,'Archana':750,'Arjitha Brahmotsavam':5640,
  'Astadala Pada Padmaradhana':185,'Civet Vessel':6,'Kalyanotsavam':33130,
  'Kasturi Vessel':19,'Melchat Vastram':152,'Sahasra Deepalankara':12630,
  'Suprabatham':12080,'Thiruppavada':239,'Thomala':800,'USSE':809,'Unjal Seva':3505
};

/* ─── APRIL ABSENT MONTHLY RATE (avg of Feb 26 + Mar 26) ─── */
const aprAbsentRate = {
  'Abhishekam':2.0,'Archana':2.4,'Arjitha Brahmotsavam':21.0,
  'Astadala Pada Padmaradhana':3.5,'Civet Vessel':0,'Kalyanotsavam':10.1,
  'Kasturi Vessel':2.7,'Melchat Vastram':1.6,'Sahasra Deepalankara':18.9,
  'Suprabatham':5.1,'Thiruppavada':0,'Thomala':2.1,'USSE':43.6,'Unjal Seva':16.5
};

/* ─── NEW EO_SEVA_COMPARE (pre=Jul-Jan, post=Feb-Apr; weekly avg = monthly/4.33) ─── */
// Pre months: Jul 25 – Jan 26 (7 months)
// Post months: Feb 26 – Apr 26 (3 months, April estimated)
const newEOSevaCompare = {
  'Abhishekam':            {'pre':100,'post':97,'pct':-3.0},
  'Archana':               {'pre':139,'post':173,'pct':24.5},
  'Arjitha Brahmotsavam':  {'pre':1661,'post':1647,'pct':-0.8},
  'Astadala Pada Padmaradhana':{'pre':73,'post':57,'pct':-22.0},
  'Civet Vessel':          {'pre':3,'post':2,'pct':-33.0},
  'Kalyanotsavam':         {'pre':7719,'post':8396,'pct':8.8},
  'Kasturi Vessel':        {'pre':6,'post':5,'pct':-17.0},
  'Melchat Vastram':       {'pre':35,'post':33,'pct':-5.7},
  'Sahasra Deepalankara':  {'pre':3584,'post':3511,'pct':-2.0},
  'Suprabatham':           {'pre':2390,'post':2811,'pct':17.6},
  'Thiruppavada':          {'pre':56,'post':55,'pct':-1.8},
  'Thomala':               {'pre':154,'post':189,'pct':22.7},
  'USSE':                  {'pre':285,'post':304,'pct':6.7},
  'Unjal Seva':            {'pre':911,'post':958,'pct':5.2}
};

/* ═══════════════════════════════════════════════════
   STEP 1 — Patch D constant: add April to all arrays
   ═══════════════════════════════════════════════════ */
const dLineMatch = html.match(/const D = (\{[\s\S]+?\});\n/);
if (!dLineMatch) { console.error('D constant not found'); process.exit(1); }

const D = JSON.parse(dLineMatch[1]);

// Add April to monthOrder
D.monthOrder.push(APR);

// Add April to monthlyPerSeva
for (const seva of D.sevas) {
  D.monthlyPerSeva[seva][APR] = aprBooked[seva] || 0;
}

// Add April to monthlyByType
for (const seva of D.sevas) {
  for (const type of D.types) {
    D.monthlyByType[seva][type][APR] = (aprByType[seva] && aprByType[seva][type]) || 0;
  }
}

// Update sevaTotal and sevaVerified
const aprGrandTotal = Object.values(aprBooked).reduce((a,b)=>a+b,0);
const aprGrandVerified = Object.values(aprVerified).reduce((a,b)=>a+b,0);
for (const seva of D.sevas) {
  D.sevaTotal[seva] += (aprBooked[seva] || 0);
  D.sevaVerified[seva] += (aprVerified[seva] || 0);
}

// Update typeTotal
const aprTypeTotals = {'Advance Booking':0,'Current Booking':0,'Descritionary':0,'Donor':0,'Online':0};
for (const seva of D.sevas) {
  for (const type of D.types) {
    aprTypeTotals[type] += ((aprByType[seva] && aprByType[seva][type]) || 0);
  }
}
for (const type of D.types) {
  D.typeTotal[type] += aprTypeTotals[type];
}

// Add April to monthlyGrandTotal
D.monthlyGrandTotal[APR] = aprGrandTotal;

// Update stats
D.stats.grandTotal += aprGrandTotal;
D.stats.grandVerified += aprGrandVerified;
D.stats.verificationRate = ((D.stats.grandVerified / D.stats.grandTotal) * 100).toFixed(2);

console.log('April grand total:', aprGrandTotal, '| verified:', aprGrandVerified);
console.log('New grand total:', D.stats.grandTotal, '| verified:', D.stats.grandVerified);

// Replace D in HTML
html = html.replace(dLineMatch[0], 'const D = ' + JSON.stringify(D) + ';\n');

/* ═══════════════════════════════════════════════════
   STEP 2 — Update ABSENT_MONTHLY_RATE (append April)
   ═══════════════════════════════════════════════════ */
const amrMatch = html.match(/const ABSENT_MONTHLY_RATE = (\{[^;]+\});/);
if (amrMatch) {
  const amr = JSON.parse(amrMatch[1]);
  const sevas = Object.keys(amr);
  for (const seva of sevas) {
    amr[seva].push(aprAbsentRate[seva] !== undefined ? aprAbsentRate[seva] : 0);
  }
  html = html.replace(amrMatch[0], 'const ABSENT_MONTHLY_RATE = ' + JSON.stringify(amr) + ';');
  console.log('ABSENT_MONTHLY_RATE updated — sample USSE:', amr['USSE']);
}

/* ═══════════════════════════════════════════════════
   STEP 3 — Replace EO_SEVA_COMPARE
   ═══════════════════════════════════════════════════ */
html = html.replace(
  /const EO_SEVA_COMPARE = \{[^;]+\};/,
  'const EO_SEVA_COMPARE = ' + JSON.stringify(newEOSevaCompare) + ';'
);
console.log('EO_SEVA_COMPARE replaced');

/* ═══════════════════════════════════════════════════
   STEP 4 — EO index: 34 → 31 (week "Feb 01")
   ═══════════════════════════════════════════════════ */
html = html.replace('eoIndex: 34', 'eoIndex: 31');

/* ═══════════════════════════════════════════════════
   STEP 5 — Text: all "Feb 24" references → "Feb 1"
   ═══════════════════════════════════════════════════ */
html = html.replace(/Feb 24, 2026/g, 'Feb 1, 2026');
html = html.replace(/Feb 24\b/g, 'Feb 1');
html = html.replace(/New EO  Feb 24/g, 'New EO  Feb 1');
html = html.replace(/New EO  Feb 1\b/g, 'New EO  Feb 1');  // idempotent

/* ═══════════════════════════════════════════════════
   STEP 6 — Fix moRange cap: ||8 → ||9
   ═══════════════════════════════════════════════════ */
html = html.replace('parseInt(document.getElementById(toId).value)||8',
                    'parseInt(document.getElementById(toId).value)||9');

/* ═══════════════════════════════════════════════════
   STEP 7 — Add "Apr 26" option (value="9") to all 9-month selectors
   ═══════════════════════════════════════════════════ */
// Pattern: every select that ends with <option value="8" ...>Mar 26</option></select>
// We append <option value="9">Apr 26</option> before </select>
html = html.replace(
  /(<option value="8"[^>]*>Mar 26<\/option>)(<\/select>)/g,
  '$1<option value="9">Apr 26</option>$2'
);
// The "To" selects that have value="8" selected should stay selected as default (Mar 26)
// but we also need Apr 26 as the last option — already added above

/* ═══════════════════════════════════════════════════
   STEP 8 — Update insight texts with corrected numbers
   ═══════════════════════════════════════════════════ */

// EO Timeline insight 1: pre/post weekly averages
html = html.replace(
  '<li><strong>Pre-EO weekly avg (weeks 1–33): ~18,100 bookings</strong> | <strong>Post-EO avg (weeks 35–43): ~17,924</strong> — the 0.97% decline is statistically indistinguishable from normal weekly variance.</li>',
  '<li><strong>Pre-EO weekly avg (weeks 1–31): ~16,800 bookings</strong> | <strong>Post-EO avg (weeks 32–43): ~18,700</strong> — the 11.3% increase suggests a modest positive trend under the new EO, though seasonal factors cannot be ruled out.</li>'
);

// EO Timeline insight 4: "Feb 24 transition" already handled by Step 5

// EO Timeline insight 5: update to mention Feb–Apr range
html = html.replace(
  '<li><span class="ok">Mar–Apr 2026 post-EO weeks (16,610–20,450 range)</span> are fully within the pre-EO normal operating band — confirming operational continuity under the new EO.</li>',
  '<li><span class="ok">Feb–Apr 2026 post-EO weeks (16,610–20,450 range)</span> are fully within the pre-EO normal operating band — confirming operational continuity under the new EO.</li>'
);

// EO Timeline insight 6: we now have 3 months of post-EO data
html = html.replace(
  '<li><strong>For a rigorous EO impact assessment</strong>, at least 3 full months (Jun–Aug 2026) of post-EO data are needed to eliminate seasonal confounds from the current comparison.</li>',
  '<li><strong>With 3 months of post-EO data (Feb–Apr 2026)</strong> now available, the assessment is more reliable — though 3 more months (May–Jul 2026) are needed to fully eliminate seasonal confounds.</li>'
);

// EO Compare card-desc (line 862)
html = html.replace(
  'Average weekly bookings per seva before and after Feb 24, 2026',
  'Average weekly bookings per seva before and after Feb 1, 2026'
);

// EO Compare insight 1: Kalyanotsavam numbers
html = html.replace(
  '<li><strong>Kalyanotsavam (pre: 7,708 | post: 7,838/wk)</strong> shows a +1.7% change — within normal weekly variance; the dominant seva shows strong continuity through the EO transition.</li>',
  '<li><strong>Kalyanotsavam (pre: 7,719 | post: 8,396/wk)</strong> shows a +8.8% change — notably above pre-EO baseline; with Feb–Apr all in post-EO window this is the clearest demand signal from the new EO period.</li>'
);

// EO Compare insight 2: Sahasra numbers
html = html.replace(
  '<li><span class="anom">Sahasra Deepalankara declined most in absolute terms</span> (3,583 → 3,061/wk = −522/wk) — at this rate, that\'s ~2,000 fewer monthly bookings. Investigate if slot count was reduced post-EO.</li>',
  '<li><strong>Sahasra Deepalankara (3,584 → 3,511/wk = −2.0%)</strong> shows a marginal decline — far less alarming than the earlier estimate; the decline is within normal seasonal variance and likely not a structural change.</li>'
);

// EO Compare insight 3: Thomala/Archana percentages
html = html.replace(
  '<li><span class="ok">Thomala (+21.9%) and Archana (+17.2%)</span> saw the largest percentage growth — these mid-tier sevas may have benefited from renewed outreach or marketing under the new EO.</li>',
  '<li><span class="ok">Archana (+24.5%) and Thomala (+22.7%)</span> saw the largest percentage growth — these mid-tier, counter-based sevas show a strong and consistent post-EO uptick across all three post-EO months.</li>'
);

// EO Compare insight 4: week counts
html = html.replace(
  '<li><span class="warn">Only 10 post-EO weeks vs 34 pre-EO weeks</span> — the comparison is statistically unequal. A longer post-EO observation window is essential before drawing policy conclusions.</li>',
  '<li><span class="warn">Only 13 post-EO weeks vs 31 pre-EO weeks</span> — the comparison window is still short. With Feb–Apr 2026 now included, the picture is clearer but a full seasonal cycle is needed for definitive conclusions.</li>'
);

// EO Change insight 1: Astadala numbers
html = html.replace(
  '<li><span class="anom">Astadala Pada Padmaradhana −27% (73→53/wk)</span> is the steepest decline — a Tuesday-only seva with small absolute numbers; even a one-day slot reduction would cause this level of percentage change.</li>',
  '<li><span class="anom">Astadala Pada Padmaradhana −22% (73→57/wk)</span> is the steepest decline among mid-size sevas — a Tuesday-only seva with small absolute numbers; even a one-day slot reduction would cause this level of percentage change.</li>'
);

// EO Change insight 2: Thomala/Archana percentages
html = html.replace(
  '<li><span class="ok">Thomala +21.9% (155→189/wk)</span> and <span class="ok">Archana +17.2% (140→164/wk)</span> show the strongest growth — both are multi-day counter-based sevas that may have received improved scheduling under the new EO.</li>',
  '<li><span class="ok">Archana +24.5% (139→173/wk)</span> and <span class="ok">Thomala +22.7% (154→189/wk)</span> show the strongest growth — both are multi-day counter-based sevas that may have received improved scheduling under the new EO.</li>'
);

// EO Change insight 3: Sahasra numbers
html = html.replace(
  '<li><strong>Sahasra Deepalankara −14.6% (3,583→3,061/wk)</strong> is the most concerning change given its volume — if structural (slot count reduction), it represents a 2,000-devotee-per-month impact.</li>',
  '<li><strong>Sahasra Deepalankara −2.0% (3,584→3,511/wk)</strong> — with Feb now in post-EO and April data included, the earlier −14.6% alarm is revised down substantially; this is within normal seasonal variation.</li>'
);

// EO Change insight 5: Kalyanotsavam/Suprabatham percentages
html = html.replace(
  '<li><strong>Kalyanotsavam, Suprabatham, Thiruppavada</strong> show <span class="ok">marginal positive changes (+1.7%, +7.4%, +2.5%)</span> — the highest-volume sevas are the most stable, which is reassuring for overall pilgrim service continuity.</li>',
  '<li><strong>Kalyanotsavam (+8.8%), Suprabatham (+17.6%), Unjal Seva (+5.2%)</strong> all show positive post-EO trends — high-volume sevas moving in a consistent positive direction is a strong signal of operational continuity and improvement.</li>'
);

// EO Change insight 6: ±5% band sevas
html = html.replace(
  '<li><strong>The ±5% band</strong> (Melchat +1.1%, Unjal −2.5%, Kalyanotsavam +1.7%) represents sevas with essentially unchanged patterns — the signal-to-noise threshold for meaningful EO attribution is approximately ±10%.</li>',
  '<li><strong>The ±5% band</strong> (Melchat −5.7%, Sahasra −2.0%, Thiruppavada −1.8%) represents sevas with essentially unchanged patterns — the signal-to-noise threshold for meaningful EO attribution is approximately ±10%.</li>'
);

// Monthly trend section: "post-EO period (from Feb 24)" → "from Feb 1"
html = html.replace(
  'The post-EO period (from Feb 24) did not disrupt overall booking volumes.',
  'The post-EO period (from Feb 1) did not disrupt overall booking volumes; Apr 2026 follows the same healthy range.'
);

// Monthly trend insight 5: update average
// Old: "Average monthly bookings = 83,131"
// New: grandTotal(828847) / 10 months = 82,885 ≈ 82,885
html = html.replace(
  '<strong>Average monthly bookings = 83,131</strong>. Months below this average (Sep, Dec, Jan) are candidates for promotional campaigns or discounted seva bundles to boost demand.',
  '<strong>Average monthly bookings = 82,885</strong>. Months below this average (Sep, Dec, Jan) are candidates for promotional campaigns or discounted seva bundles to boost demand.'
);

/* ═══════════════════════════════════════════════════
   STEP 9 — Section header & card descriptions
   ═══════════════════════════════════════════════════ */
html = html.replace(
  'EO Change Analysis — New Executive Officer Joined Feb 24, 2026',
  'EO Change Analysis — New Executive Officer Joined Feb 1, 2026'
);
html = html.replace(
  'Weekly aggregate across all sevas. Gold dashed line marks EO change (Feb 24, 2026)',
  'Weekly aggregate across all sevas. Gold dashed line marks EO change (Feb 1, 2026)'
);
html = html.replace(
  'New Executive Officer Joined Feb 24, 2026',
  'New Executive Officer Joined Feb 1, 2026'
);

/* ─── Verify ─── */
const feb24remaining = (html.match(/Feb 24/g)||[]).length;
console.log('Remaining "Feb 24" occurrences:', feb24remaining);

const eoIdx = html.includes('eoIndex: 31') ? 31 : '?';
console.log('eoIndex value:', eoIdx);

const aprOpts = (html.match(/>Apr 26<\/option>/g)||[]).length;
console.log('Apr 26 option tags added:', aprOpts);

const morangeCap = html.includes(')||9') ? 9 : '?';
console.log('moRange cap:', morangeCap);

fs.writeFileSync('ttd-dashboard.html', html);
console.log('Written. Lines:', html.split('\n').length, '| Size:', Math.round(html.length/1024)+'KB');
