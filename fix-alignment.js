// Fixes:
// 1. Remove orphaned <div class="insight"> wrappers that were left around <div class="chart-insights">
// 2. Remove incorrect extra closing </div> that was added by the previous transform's double-nesting
// 3. Fix indentation of stray <div class="chart-filters"> tags (cosmetic but clarifies structure)
// 4. Add card flex layout so chart canvases align in side-by-side rows
const fs = require('fs'), path = require('path');
let html = fs.readFileSync(path.join(__dirname,'ttd-dashboard.html'),'utf8');

/* ──────────────────────────────────────────
   Step 1: Remove orphaned .insight wrappers
   Pattern: <div class="insight">[optional whitespace/newline]<div class="chart-insights">
   Action:  Remove the .insight opening tag (the close was already consumed by the earlier replace)
   ────────────────────────────────────────── */
// Remove orphaned insight opener that sits directly before chart-insights
html = html.replace(/[ \t]*<div class="insight">\n(<div class="chart-insights">)/g, '\n      $1');

/* ──────────────────────────────────────────
   Step 2: Fix chart-filters indentation
   The filters() helper emitted <div class="chart-filters"> at column 0.
   Normalise it to 6-space indent (card content level).
   ────────────────────────────────────────── */
html = html.replace(/^<div class="chart-filters">/gm, '      <div class="chart-filters">');

/* ──────────────────────────────────────────
   Step 3: Fix stray un-indented chart-insights
   ────────────────────────────────────────── */
html = html.replace(/^<div class="chart-insights">/gm, '      <div class="chart-insights">');

/* ──────────────────────────────────────────
   Step 4: Add card flex-column layout CSS so chart canvases align
   in two-column rows regardless of filter bar height differences.
   ────────────────────────────────────────── */
html = html.replace(
  '    .chart-wrap { position:relative; }',
  `    .chart-wrap { position:relative; }
    /* card flex layout keeps chart canvas consistent within cards */
    .card { display:flex; flex-direction:column; }
    .card-hdr { flex-shrink:0; }
    .chart-filters { flex-shrink:0; }
    .chart-wrap { flex-shrink:0; }
    .chart-insights { flex-shrink:0; }`
);

/* ──────────────────────────────────────────
   Step 5: Remove any duplicate function buildAbsenteeRate / buildAbsenteeTrend / buildEOChange
   if the original definitions still exist (avoid JS overwrite confusion)
   ────────────────────────────────────────── */
// The NEW_JS block added aliases before /* INIT */ — keep only the alias versions,
// remove the original implementations to avoid duplicate-function confusion.
// We do this by removing the original function bodies if aliases already exist.
if (html.includes('function buildAbsenteeRate() { updateAbsentRate(); }')) {
  // Remove original buildAbsenteeRate impl (was replaced by updateAbsentRate)
  html = html.replace(
    /\/\* ── ABSENTEE RATE BAR ── \*\/\nfunction buildAbsenteeRate\(\) \{[\s\S]*?\n\}\n/,
    '/* buildAbsenteeRate → see updateAbsentRate() */\n'
  );
  // Remove original buildAbsenteeTrend
  html = html.replace(
    /\/\* ── ABSENTEE MONTHLY TREND ── \*\/\nfunction buildAbsenteeTrend\(\) \{[\s\S]*?\n\}\n/,
    '/* buildAbsenteeTrend → see updateAbsentTrend() */\n'
  );
}

/* ──────────────────────────────────────────
   Step 6: Also fix the .insight that wraps around the DOW heatmap insight text
   (this one is legitimate — it's the old-style insight for the DOW heatmap, keep as-is)
   but make sure the NEW chart-insights inside it don't get double-wrapped.
   DOW heatmap still has original .insight div — that's fine, leave it.
   ────────────────────────────────────────── */

/* ──────────────────────────────────────────
   Verify
   ────────────────────────────────────────── */
const opens  = (html.match(/<div/g)||[]).length;
const closes = (html.match(/<\/div>/g)||[]).length;
console.log('div opens:', opens, '| div closes:', closes, '| delta:', opens - closes);

const orphans = (html.match(/<div class="insight">\s*<div class="chart-insights">/g)||[]).length;
console.log('Orphaned .insight wrappers remaining:', orphans);

const filterBars = (html.match(/class="chart-filters"/g)||[]).length;
console.log('chart-filters bars:', filterBars);

const insightBlocks = (html.match(/class="chart-insights"/g)||[]).length;
console.log('chart-insights blocks:', insightBlocks);

fs.writeFileSync(path.join(__dirname,'ttd-dashboard.html'), html);
console.log('Written. Lines:', html.split('\n').length, '| Size:', Math.round(html.length/1024)+'KB');
