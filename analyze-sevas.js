const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');

const dMatch = html.match(/const D = (\{[\s\S]+?\});\n/);
const D = JSON.parse(dMatch[1]);

const ABSENT = {
  'Abhishekam':    [0.7,1,0.9,0.6,2.1,0.5,0.2,2,1.9,2.0],
  'Archana':       [3.5,5.1,3.5,1.8,1.8,2.4,5,2.5,2.3,2.4],
  'Thomala':       [4.7,0.6,1.3,2.6,1.4,2.9,3.8,1.8,2.4,2.1],
  'Suprabatham':   [5.2,5.6,6.9,6,5,6.6,6.3,5,5.1,5.1],
  'Kalyanotsavam': [10.2,11.1,11.3,10.4,10.1,10.4,11.1,10.4,9.7,10.1],
  'Astadala Pada Padmaradhana':[5.2,3.9,2,4.4,4.2,3.2,4.1,4.3,2.7,3.5],
  'Thiruppavada':  [0.6,0,0.5,0,0,0.3,0,0,0,0]
};

const MO = D.monthOrder; // 10 months Jul25-Apr26
const daysPerMonth = [31,31,30,31,30,31,31,28,31,30]; // Jul–Apr

// Operating days fraction of month
const opFrac = {
  'Abhishekam': 1/7,
  'Archana': 3/7,
  'Thomala': 3/7,
  'Suprabatham': 1,
  'Kalyanotsavam': 1,
  'Astadala Pada Padmaradhana': 1/7,
  'Thiruppavada': 1/7
};
const opLabel = {
  'Abhishekam': 'Fridays only (4–5 days/mo)',
  'Archana': 'Tue–Thu only (13 days/mo avg)',
  'Thomala': 'Tue–Thu only (13 days/mo avg)',
  'Suprabatham': 'Daily (30–31 days/mo)',
  'Kalyanotsavam': 'Daily (30–31 days/mo)',
  'Astadala Pada Padmaradhana': 'Tuesdays only (4–5 days/mo)',
  'Thiruppavada': 'Thursdays only (4–5 days/mo)'
};

const sevas = ['Abhishekam','Archana','Thomala','Suprabatham','Kalyanotsavam','Astadala Pada Padmaradhana','Thiruppavada'];

console.log('\n' + '═'.repeat(72));
console.log('  TTD SPECIAL SEVAS — Per-Day & Discretionary Quota Analysis');
console.log('  Data: Jul 2025 – Apr 2026  (10 months)');
console.log('═'.repeat(72));

for (const seva of sevas) {
  const frac = opFrac[seva];
  const total = D.sevaTotal[seva];
  const verified = D.sevaVerified[seva];
  const absentTotal = total - verified;
  const overallAbsentPct = ((absentTotal/total)*100).toFixed(1);
  const absentArr = ABSENT[seva];
  const avgAbsent = (absentArr.reduce((a,b)=>a+b,0)/absentArr.length).toFixed(1);
  const minAbsent = Math.min(...absentArr).toFixed(1);
  const maxAbsent = Math.max(...absentArr).toFixed(1);

  // Monthly totals and per-day
  const monthly = MO.map(m => D.monthlyPerSeva[seva][m]||0);
  const opDays  = daysPerMonth.map(d => Math.round(d * frac));
  const perDay  = monthly.map((v,i) => opDays[i] > 0 ? (v/opDays[i]) : 0);

  const maxPD = Math.max(...perDay);
  const minPD = Math.min(...perDay);
  const avgPD = total / opDays.reduce((a,b)=>a+b,0);

  const maxMon = MO[perDay.indexOf(maxPD)];
  const minMon = MO[perDay.indexOf(minPD)];

  // Booking type totals
  const bt = D.monthlyByType[seva];
  const typeTot = {};
  for (const t of D.types) typeTot[t] = MO.reduce((a,m)=>a+(bt[t][m]||0),0);

  const disc   = typeTot['Descritionary'];
  const online = typeTot['Online'];
  const curr   = typeTot['Current Booking'];
  const adv    = typeTot['Advance Booking'];
  const donor  = typeTot['Donor'];

  // Per operating day discretionary
  const totalOpDays = opDays.reduce((a,b)=>a+b,0);
  const discPerDay  = (disc / totalOpDays).toFixed(1);
  const onlinePerDay= (online/ totalOpDays).toFixed(1);
  const currPerDay  = (curr  / totalOpDays).toFixed(1);
  const totalPerDay = (total / totalOpDays).toFixed(1);

  // Absentee absolute numbers
  const absentFromDisc = Math.round(disc * parseFloat(avgAbsent) / 100);
  const netDiscUsed     = disc - absentFromDisc;

  console.log('\n' + '─'.repeat(72));
  console.log(`  ${seva.toUpperCase()}`);
  console.log(`  Schedule: ${opLabel[seva]}`);
  console.log('─'.repeat(72));

  console.log(`  VOLUMES (10 months total: ${total.toLocaleString()} booked)`);
  console.log(`    Per operating day → Avg: ${avgPD.toFixed(0)}  |  Max: ${maxPD.toFixed(0)} (${maxMon})  |  Low: ${minPD.toFixed(0)} (${minMon})`);
  console.log(`    Monthly range     → Max: ${Math.max(...monthly).toLocaleString()} (${maxMon})  |  Low: ${Math.min(...monthly).toLocaleString()} (${minMon})`);

  console.log(`\n  ABSENTEEISM`);
  console.log(`    Overall: ${overallAbsentPct}% (${absentTotal.toLocaleString()} no-shows of ${total.toLocaleString()} booked)`);
  console.log(`    Monthly avg: ${avgAbsent}%  |  Best month: ${minAbsent}%  |  Worst month: ${maxAbsent}%`);

  console.log(`\n  BOOKING TYPE BREAKDOWN (per operating day)`);
  console.log(`    Discretionary: ${disc.toLocaleString()} total  →  ${discPerDay}/day`);
  if (online > 0)  console.log(`    Online:        ${online.toLocaleString()} total  →  ${onlinePerDay}/day`);
  if (curr   > 0)  console.log(`    Counter (Curr):${curr.toLocaleString()} total  →  ${currPerDay}/day`);
  if (adv    > 0)  console.log(`    Advance Bkg:   ${adv.toLocaleString()} total  →  ${(adv/totalOpDays).toFixed(1)}/day`);
  console.log(`    ──────────────────────────────────────────`);
  console.log(`    TOTAL:         ${total.toLocaleString()} total  →  ${totalPerDay}/day`);

  console.log(`\n  LIBERAL MARGIN / SLACK ASSESSMENT`);
  console.log(`    Discretionary slots: avg ${discPerDay}/day → ~${absentFromDisc} expected no-shows/10mo (${avgAbsent}% of disc)`);
  console.log(`    Net discretionary actually served: ~${netDiscUsed.toLocaleString()} of ${disc.toLocaleString()} (${(netDiscUsed/disc*100).toFixed(1)}% show up)`);

  console.log('\n  MONTH-BY-MONTH PER-DAY:');
  MO.forEach((m,i) => {
    const bar = '▇'.repeat(Math.round(perDay[i]/maxPD*20));
    process.stdout.write(`    ${m}: ${perDay[i].toFixed(0).padStart(4)} /day  ${bar}\n`);
  });
}

console.log('\n' + '═'.repeat(72));
console.log('  ONLINE QUOTA ASSESSMENT');
console.log('═'.repeat(72));
// sevas with significant online component
const onlineSevas = ['Kalyanotsavam','Suprabatham','Archana','Thomala'];
for (const seva of onlineSevas) {
  const bt = D.monthlyByType[seva];
  const onlineTotal = MO.reduce((a,m)=>a+(bt['Online'][m]||0),0);
  const totalBooked = D.sevaTotal[seva];
  const frac = opFrac[seva];
  const totalOpDays = daysPerMonth.reduce((a,d,i)=>a+Math.round(d*frac),0);
  const onlinePerDay = (onlineTotal/totalOpDays).toFixed(1);
  const onlinePct = ((onlineTotal/totalBooked)*100).toFixed(1);
  const absentArr = ABSENT[seva];
  const avgAbsent = parseFloat((absentArr.reduce((a,b)=>a+b,0)/absentArr.length).toFixed(1));
  const onlineWasted = Math.round(onlineTotal * avgAbsent/100);
  console.log(`\n  ${seva}:`);
  console.log(`    Online: ${onlineTotal.toLocaleString()} (${onlinePct}% of total) → ${onlinePerDay}/day`);
  console.log(`    Est. online no-shows: ~${onlineWasted.toLocaleString()} (${avgAbsent}% × online total)`);
  console.log(`    Effective online utilisation: ${(100-avgAbsent).toFixed(1)}% of quota actually served`);
}
console.log('');
