const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const source = fs.readFileSync(path.join(__dirname, '../src/components/dashboard/CalorieTracker.tsx'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

test('calorie widget displays context updates without triggering a refresh while rendering', () => {
  let refreshCalls = 0;
  const health = {
    user: { goalCalories: 2000 },
    foodEntries: [],
    dailyStats: { caloriesConsumed: 500 },
    fetchDailyStats: () => { refreshCalls += 1; },
  };
  // Isolate the widget from routing, translation, and chart layout.
  const childrenOnly = ({ children }) => children ?? null;
  const dependencies = {
    '@/contexts/HealthContext': { useHealth: () => health },
    '@/contexts/I18nContext': { useI18n: () => ({ t: (key) => key }) },
    'react-router-dom': { useNavigate: () => () => {} },
    '@/components/ui/button': { Button: childrenOnly },
    'lucide-react': { Plus: () => null },
    recharts: {
      ResponsiveContainer: childrenOnly, PieChart: childrenOnly, Pie: childrenOnly,
      Cell: () => null, Tooltip: () => null,
    },
  };
  const exportsObject = {};
  new Function('require', 'exports', compiled)(
    (name) => dependencies[name] ?? require(name), exportsObject,
  );
  const render = () => renderToStaticMarkup(React.createElement(exportsObject.default));

  const initial = render();
  assert.match(initial, /500 kcal/);
  assert.match(initial, /2000 kcal/);

  health.dailyStats = { caloriesConsumed: 650 };
  assert.match(render(), /650 kcal/);
  assert.equal(refreshCalls, 0, 'Rendering must not restart the loading cycle and unmount the dashboard');
});
