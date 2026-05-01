const fs = require('fs');
let html = fs.readFileSync('./index.html', 'utf8');

/* ══════════════════════════════════════════════════════════
   1.  CSS — summary table + dual-handle range slider
══════════════════════════════════════════════════════════ */
const CSS = `
    /* ──────────────── SUMMARY TABLE ──────────────── */
    .summary-wrap { margin-bottom: 52px; }
    .summary-controls {
      display: flex; align-items: center; flex-wrap: wrap; gap: 18px;
      padding: 16px 20px 20px;
      background: #fff; border: 1px solid rgba(120,80,10,0.18);
      border-radius: 12px 12px 0 0; border-bottom: none;
      box-shadow: 0 2px 12px rgba(100,65,10,0.08);
    }
    .sc-label {
      font-family: 'Cinzel', serif; font-size: 10px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.16em; color: #5c2800;
      white-space: nowrap;
    }
    .sc-range-badge {
      font-family: 'Cinzel', serif; font-size: 13px; font-weight: 800;
      color: #3d1200; background: rgba(184,120,0,0.1);
      border: 1px solid rgba(120,70,0,0.3); border-radius: 8px;
      padding: 4px 14px; white-space: nowrap;
    }
    .dual-slider-wrap {
      flex: 1; min-width: 260px; position: relative;
      height: 44px; display: flex; align-items: center;
    }
    .ds-track {
      position: absolute; left: 0; right: 0; height: 6px;
      background: rgba(120,80,10,0.14); border-radius: 3px;
    }
    .ds-fill {
      position: absolute; height: 6px; border-radius: 3px;
      background: linear-gradient(90deg, #b87800, #cc3300);
      pointer-events: none; transition: left .05s, width .05s;
    }
    .dual-slider-wrap input[type=range] {
      position: absolute; width: 100%;
      -webkit-appearance: none; appearance: none;
      height: 6px; background: transparent;
      pointer-events: none; outline: none;
      margin: 0; padding: 0;
    }
    .dual-slider-wrap input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(145deg, #faecc0, #c8962a);
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(100,60,0,0.35);
      cursor: pointer; pointer-events: all;
      transition: transform .15s, box-shadow .15s;
    }
    .dual-slider-wrap input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.18);
      box-shadow: 0 3px 12px rgba(100,60,0,0.5);
    }
    .dual-slider-wrap input[type=range]::-moz-range-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(145deg, #faecc0, #c8962a);
      border: 3px solid #fff;
      box-shadow: 0 2px 8px rgba(100,60,0,0.35);
      cursor: pointer; pointer-events: all;
    }
    .ds-month-labels {
      position: absolute; bottom: -18px; left: 0; right: 0;
      display: flex; justify-content: space-between;
    }
    .ds-month-labels span {
      font-size: 8px; color: #7a4010; font-family: 'Cinzel', serif;
      font-weight: 600; letter-spacing: 0.04em;
    }
    .summary-tbl-wrap {
      overflow-x: auto;
      border: 1px solid rgba(120,80,10,0.18);
      border-radius: 0 0 12px 12px;
      box-shadow: 0 4px 20px rgba(100,65,10,0.1), 0 1px 4px rgba(100,65,10,0.06);
    }
    .summary-tbl {
      width: 100%; border-collapse: collapse; font-size: 11px;
      min-width: 900px; background: #fff;
    }
    .summary-tbl th {
      padding: 8px 10px; font-family: 'Cinzel', serif; font-size: 8.5px;
      letter-spacing: 0.12em; text-transform: uppercase; font-weight: 800;
      text-align: center; white-space: nowrap; border: 1px solid rgba(120,80,10,0.13);
    }
    .summary-tbl th.seva-hdr {
      background: rgba(200,150,42,0.12); color: #3d1200;
      vertical-align: bottom; min-width: 160px; text-align: left;
      padding-left: 14px; font-size: 9px;
    }
    .summary-tbl th.grp-all    { background: rgba(90,60,10,0.09);  color: #3d1200; }
    .summary-tbl th.grp-online { background: rgba(67,56,202,0.1);  color: #1e1680; }
    .summary-tbl th.grp-disc   { background: rgba(180,83,9,0.1);   color: #7c2d00; }
    .summary-tbl th.grp-curr   { background: rgba(4,120,87,0.1);   color: #064e3b; }
    .summary-tbl th.grp-adv    { background: rgba(190,24,93,0.1);  color: #9d1f5e; }
    .summary-tbl th.sub-all    { background: rgba(90,60,10,0.05);  color: #5c2800; font-size:8px; }
    .summary-tbl th.sub-online { background: rgba(67,56,202,0.05); color: #1e1680; font-size:8px; }
    .summary-tbl th.sub-disc   { background: rgba(180,83,9,0.05);  color: #7c2d00; font-size:8px; }
    .summary-tbl th.sub-curr   { background: rgba(4,120,87,0.05);  color: #064e3b; font-size:8px; }
    .summary-tbl th.sub-adv    { background: rgba(190,24,93,0.05); color: #9d1f5e; font-size:8px; }
    .summary-tbl td {
      padding: 7px 10px; border: 1px solid rgba(120,80,10,0.1);
      color: #1e0e00; text-align: right; font-family: 'Cinzel', serif;
      font-size: 11px; font-weight: 700; white-space: nowrap;
    }
    .summary-tbl td.seva-cell {
      text-align: left; font-size: 11px; font-weight: 800;
      font-family: 'Cinzel', serif; padding-left: 14px;
      background: rgba(200,150,42,0.04); letter-spacing: 0.03em;
    }
    .summary-tbl td.nil { color: #ccc; text-align: center; font-weight: 400; font-family: serif; }
    .summary-tbl tr:hover td { background: rgba(200,150,42,0.06); }
    .summary-tbl tr:hover td.seva-cell { background: rgba(200,150,42,0.1); }
    .abs-lo  { color: #005a22 !important; }
    .abs-mid { color: #8c4e00 !important; }
    .abs-hi  { color: #a00000 !important; }
    .summary-tbl .grp-div { border-left: 2px solid rgba(120,80,10,0.25) !important; }
`;

html = html.replace('  </style>', CSS + '\n  </style>');

/* ══════════════════════════════════════════════════════════
   2.  HTML — section added before </div><!-- /page-body -->
══════════════════════════════════════════════════════════ */
const HTML_SECTION = `
  <!-- ════════════════ SEVA SUMMARY TABLE ════════════════ -->
  <div class="section-hdr">Seva Performance Summary — By Booking Type</div>
  <div class="summary-wrap">

    <!-- Dual-handle date range slider -->
    <div class="summary-controls">
      <span class="sc-label">Date Range</span>
      <span class="sc-range-badge" id="scBadge">Jul 25 &rarr; Apr 26</span>
      <div class="dual-slider-wrap" id="dualSlider">
        <div class="ds-track"></div>
        <div class="ds-fill" id="dsFill"></div>
        <input type="range" id="dsFrom" min="0" max="9" value="0" step="1"
               oninput="onDsInput()" style="z-index:5">
        <input type="range" id="dsTo"   min="0" max="9" value="9" step="1"
               oninput="onDsInput()" style="z-index:4">
        <div class="ds-month-labels" id="dsMonthLabels"></div>
      </div>
    </div>

    <!-- Summary table (dynamically built) -->
    <div class="summary-tbl-wrap">
      <table class="summary-tbl" id="summaryTbl"></table>
    </div>

  </div>
`;

html = html.replace(
  '\n</div><!-- /page-body -->',
  HTML_SECTION + '\n</div><!-- /page-body -->'
);

/* ══════════════════════════════════════════════════════════
   3.  JS — injected before </script>
══════════════════════════════════════════════════════════ */
const JS = `
/* ══════════════════════ SEVA SUMMARY TABLE ══════════════════════ */
(function() {

var SUM_MO = ['Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26','Apr 26'];

var COLS = [
  { key: null,              label: 'All Bookings',    sub: 'all',    cls: 'grp-all'    },
  { key: 'Online',          label: 'Online',          sub: 'online', cls: 'grp-online' },
  { key: 'Descritionary',   label: 'Discretionary',   sub: 'disc',   cls: 'grp-disc'   },
  { key: 'Current Booking', label: 'Current Booking', sub: 'curr',   cls: 'grp-curr'   },
  { key: 'Advance Booking', label: 'Advance Booking', sub: 'adv',    cls: 'grp-adv'    }
];

function computeRange(seva, typeKey, months) {
  var total = 0, days = 0, absent = 0, peak = 0;
  for (var i = 0; i < months.length; i++) {
    var m = months[i];
    var ms;
    if (typeKey === null) {
      ms = DS[seva] && DS[seva].monthly && DS[seva].monthly[m];
    } else {
      ms = DS[seva] && DS[seva].byType && DS[seva].byType[typeKey] &&
           DS[seva].byType[typeKey].monthly && DS[seva].byType[typeKey].monthly[m];
    }
    if (!ms) continue;
    total  += ms.total || 0;
    days   += ms.days  || 0;
    absent += ms.absent|| 0;
    if ((ms.max || 0) > peak) peak = ms.max;
  }
  if (!days || !total) return null;
  return {
    avg:       Math.round(total / days),
    peak:      peak,
    absentPct: (absent / total * 100)
  };
}

function absClass(p) {
  return p < 5 ? 'abs-lo' : p < 12 ? 'abs-mid' : 'abs-hi';
}

function buildSummaryTable(fromIdx, toIdx) {
  var months = SUM_MO.slice(fromIdx, toIdx + 1);
  var sevas  = Object.keys(DS).sort(function(a, b) {
    return (D.sevaTotal[b] || 0) - (D.sevaTotal[a] || 0);
  });

  /* ── header ── */
  var h = '<thead>';
  h += '<tr>';
  h += '<th class="seva-hdr" rowspan="2">Type of Seva</th>';
  for (var ci = 0; ci < COLS.length; ci++) {
    var c = COLS[ci];
    var divCls = ci > 0 ? ' grp-div' : '';
    h += '<th colspan="3" class="' + c.cls + divCls + '">' + c.label + '</th>';
  }
  h += '</tr><tr>';
  for (var ci = 0; ci < COLS.length; ci++) {
    var c = COLS[ci];
    var divCls = ci > 0 ? ' grp-div' : '';
    h += '<th class="sub-' + c.sub + divCls + '">Avg<br>Per Day</th>';
    h += '<th class="sub-' + c.sub + '">Peak<br>Per Day</th>';
    h += '<th class="sub-' + c.sub + '">Absent<br>Rate</th>';
  }
  h += '</tr></thead>';

  /* ── body ── */
  h += '<tbody>';
  for (var si = 0; si < sevas.length; si++) {
    var seva  = sevas[si];
    var color = SEVA_COLORS[seva] || '#333';
    h += '<tr>';
    h += '<td class="seva-cell" style="color:' + color + '">' + seva + '</td>';
    for (var ci = 0; ci < COLS.length; ci++) {
      var c   = COLS[ci];
      var r   = computeRange(seva, c.key, months);
      var div = ci > 0 ? ' grp-div' : '';
      if (!r) {
        h += '<td class="nil' + div + '">—</td><td class="nil">—</td><td class="nil">—</td>';
      } else {
        var ap = r.absentPct.toFixed(1) + '%';
        h += '<td class="' + div + '">' + r.avg  + '</td>';
        h += '<td>' + r.peak + '</td>';
        h += '<td class="' + absClass(r.absentPct) + '">' + ap + '</td>';
      }
    }
    h += '</tr>';
  }
  h += '</tbody>';

  document.getElementById('summaryTbl').innerHTML = h;
}

function updateDsFill() {
  var fromEl = document.getElementById('dsFrom');
  var toEl   = document.getElementById('dsTo');
  var fill   = document.getElementById('dsFill');
  var badge  = document.getElementById('scBadge');
  var from = parseInt(fromEl.value);
  var to   = parseInt(toEl.value);

  var pct  = 100 / (SUM_MO.length - 1);
  var left  = from * pct;
  var right = to   * pct;
  fill.style.left  = left + '%';
  fill.style.width = Math.max(0, right - left) + '%';
  badge.innerHTML  = SUM_MO[from] + ' &rarr; ' + SUM_MO[to];
}

window.onDsInput = function() {
  var fromEl = document.getElementById('dsFrom');
  var toEl   = document.getElementById('dsTo');
  var from = parseInt(fromEl.value);
  var to   = parseInt(toEl.value);

  /* prevent handles from crossing */
  if (from > to) { fromEl.value = to; from = to; }
  if (to < from) { toEl.value   = from; to = from; }

  updateDsFill();
  buildSummaryTable(from, to);
};

function initSummaryTable() {
  /* render month labels under slider */
  var wrap    = document.getElementById('dualSlider');
  var labDiv  = document.getElementById('dsMonthLabels');
  var pct     = 100 / (SUM_MO.length - 1);
  var labHtml = '';
  for (var i = 0; i < SUM_MO.length; i++) {
    labHtml += '<span style="position:absolute;left:' + (i * pct).toFixed(1) + '%;transform:translateX(-50%)">' + SUM_MO[i] + '</span>';
  }
  labDiv.innerHTML = labHtml;

  updateDsFill();
  buildSummaryTable(0, 9);
}

/* run after existing runAll() */
var _origRunAll = typeof runAll === 'function' ? runAll : null;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSummaryTable);
} else {
  initSummaryTable();
}

})();
`;

/* inject JS just before the last </script> */
const closeTag = '</script>';
const lastClose = html.lastIndexOf(closeTag);
html = html.slice(0, lastClose) + JS + '\n' + closeTag + html.slice(lastClose + closeTag.length);

fs.writeFileSync('./index.html', html, 'utf8');
console.log('Done. Size:', html.length);

const checks = [
  ['dual slider CSS',   'dual-slider-wrap'],
  ['ds-fill',           'ds-fill'],
  ['summary table',     'summaryTbl'],
  ['computeRange fn',   'computeRange'],
  ['onDsInput fn',      'onDsInput'],
  ['COLS array',        'var COLS'],
];
checks.forEach(([n,v]) => console.log(v.padEnd(25), html.includes(v) ? '✓' : '✗  '+n));
