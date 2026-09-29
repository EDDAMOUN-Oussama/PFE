const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const compile = (name) => ts.transpileModule(fs.readFileSync(path.join(__dirname, name), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const compiled = compile('../src/lib/api.ts');
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
function client(respond) {
  const calls = [], events = [], exportsObject = {};
  const fetch = async (url, options) => {
    calls.push({ url, ...options });
    return respond(url, options, calls.length);
  };
  new Function('exports', 'fetch', 'window', compiled)(exportsObject, fetch, { dispatchEvent: e => events.push(e.type) });
  return { ...exportsObject, calls, events };
}
test('API uses the same-origin proxy, credentials and one shared CSRF request', async () => {
  const c = client(url => url.endsWith('session.php') ? json({ csrfToken: 'token' }) : json({ success: true }));
  await Promise.all([c.api('addFoodEntry.php', {}), c.api('addGoal.php', {})]);
  assert.equal(c.calls.filter(call => call.url.endsWith('session.php')).length, 1);
  for (const call of c.calls) { assert.match(call.url, /^\/api\//); assert.equal(call.credentials, 'include'); }
  for (const call of c.calls.filter(call => call.method === 'POST')) assert.equal(call.headers.get('X-CSRF-Token'), 'token');
});
test('an explicit stale CSRF rejection renews the token and retries once', async () => {
  let writes = 0, sessions = 0;
  const c = client(url => url.endsWith('session.php') ? json({ csrfToken: `token${++sessions}` }) :
    (++writes === 1 ? json({ code: 'csrf_expired' }, 403) : json({ success: true })));
  await c.api('addGoal.php', {});
  assert.equal(sessions, 2); assert.equal(writes, 2);
  assert.equal(c.calls.at(-1).headers.get('X-CSRF-Token'), 'token2');
});
test('permission failures and server errors never replay a mutation', async () => {
  for (const status of [403, 500]) {
    const c = client(url => url.endsWith('session.php') ? json({ csrfToken: 'token' }) : json({ message: 'denied' }, status));
    await assert.rejects(c.api('addGoal.php', {}), /denied/);
    assert.equal(c.calls.length, 2);
  }
});
test('authentication loss clears the cached token and notifies the health context', async () => {
  const c = client(url => url.endsWith('session.php') ? json({ csrfToken: 'token' }) : json({}, 401));
  await c.apiFetch('addGoal.php', { method: 'POST' });
  await c.apiFetch('addGoal.php', { method: 'POST' });
  assert.equal(c.calls.filter(call => call.url.endsWith('session.php')).length, 2);
  assert.deepEqual(c.events, ['healthytrack:unauthorized', 'healthytrack:unauthorized']);
});
test('PDF responses retain their unread response body', async () => {
  const c = client(() => new Response('%PDF-test', { headers: { 'Content-Type': 'application/pdf' } }));
  assert.equal(await (await c.apiFetch('exportUserReport.php?user_id=1')).text(), '%PDF-test');
});
const vercel = compile('../vercel.ts');
function configuration(url) {
  const result = {};
  new Function('exports', 'process', vercel)(result, { env: { VITE_API_URL: url } });
  return result.config;
}
test('Vercel routes the API before SPA fallback using the configured Render origin', () => {
  const config = configuration('https://healthytrack-test.onrender.com');
  assert.equal(config.outputDirectory, 'dist');
  assert.deepEqual(config.rewrites, [
    { source: '/api/:path*', destination: 'https://healthytrack-test.onrender.com/:path*' },
    { source: '/(.*)', destination: '/index.html' },
  ]);
});
test('Vercel rejects missing, insecure or credential-bearing backend URLs', () => {
  for (const url of ['', 'http://localhost', 'https://user:password@example.test', 'https://example.test/private', 'https://example.test?x=1']) {
    assert.throws(() => configuration(url));
  }
});
