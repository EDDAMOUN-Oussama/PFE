const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../src/lib/health.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exportsObject = {};
new Function('exports', compiled)(exportsObject);
const { dailyTotals, localDate } = exportsObject;
test('daily totals coerce database numbers and exclude other dates', () => {
  const value = dailyTotals([{date:'2026-09-24',calories:'500'},{date:'2026-09-23',calories:800}], [{date:'2026-09-24',caloriesBurned:'100',duration:'30'}], [], 80.5, '2026-09-24');
  assert.deepEqual(value, {caloriesConsumed:500,caloriesBurned:100,netCalories:400,exerciseMinutes:30,currentWeight:80.5});
});
test('latest weight is retained on a day without a measurement', () => {
  assert.equal(dailyTotals([],[],[{id:'1',date:'2026-09-22',weight:80},{id:'2',date:'2026-09-23',weight:79.5}],0,'2026-09-24').currentWeight,79.5);
});
test('latest measurement on the same date wins and future entries are ignored', () => {
  assert.equal(dailyTotals([],[],[{id:'3',date:'2026-09-25',weight:50},{id:'1',date:'2026-09-24',weight:80},{id:'2',date:'2026-09-24',weight:79.25}],0,'2026-09-24').currentWeight,79.25);
});
test('date-only payloads use the local calendar date', () => {
  assert.equal(localDate(new Date(2026,8,24,0,5)), '2026-09-24');
});
