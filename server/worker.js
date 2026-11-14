const ORIGINS = new Set([
  'https://prohorpolovnikov413-ui.github.io'
]);
const ONLINE_MS = 180000;
const SCORE_MIN_MS = 5 * 60 * 1000;
const NICK_MIN_MS = 60000;
const SYNC_MIN_MS = 5 * 60 * 1000;
const FLUSH_MS = 10 * 60 * 1000;
const CACHE_ONLINE = 'https://zavhoz-board.internal/online-v1';
const CACHE_LADDER = 'https://zavhoz-board.internal/ladder-v1';
const CACHE_FLUSH = 'https://zavhoz-board.internal/flush-v1';
const memStore = new Map();
const TOP_N = 50;
const REF_PCT = 5;
const REF_CAP = 50;
const REF_CHEST = 2000;
const REF_GIFT = 500;
const BAD = [
  'хуй','хуя','хуе','хуё','пизд','бляд','блят','ебан','ёбан','ебат','ёбат',
  'сука','суки','сучк','мудил','мудак','жопа','залуп','гандон','гондон',
  'пидор','пидар','педик','чмо','падла','тварь','дерьм','срать','срал'
];

function cors(origin) {
  const allow = origin && (ORIGINS.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  const headers = {
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type, cache-control',
    'access-control-max-age': '86400',
    'cache-control': 'no-store, no-cache, must-revalidate',
    'cdn-cache-control': 'no-store',
    pragma: 'no-cache',
    expires: '0',
    vary: 'Origin'
  };
  if (allow) headers['access-control-allow-origin'] = origin;
  return headers;
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...cors(origin) }
  });
}

function validId(id) {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(id);
}

function validRef(r) {
  return typeof r === 'string' && /^[a-zA-Z0-9_-]{6,64}$/.test(r);
}

function stripBlankish(s) {
  return s.replace(/[\u0000-\u001F\u007F\u00A0\u200B-\u200F\u202A-\u202E\u2060\u2800\u3164\uFEFF\uFFA0]/g, '');
}

function cleanNick(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'nick' };
  let s = stripBlankish(raw).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  if (s.length < 2 || s.length > 16) return { ok: false, error: 'nick' };
  if (!/^[0-9A-Za-zА-Яа-яЁёІіЇїЄєҐґ _-]+$/.test(s)) return { ok: false, error: 'nick' };
  if (!s.replace(/[\s_-]+/g, '').length) return { ok: false, error: 'nick' };
  const low = s.toLowerCase();
  for (const w of BAD) if (low.includes(w)) return { ok: false, error: 'nick' };
  return { ok: true, nick: s };
}

function validScore(n) {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1e18;
}


async function cacheRead(url) {
  try {
    if (typeof caches !== 'undefined' && caches.default) {
      const r = await caches.default.match(new Request(url));
      if (r) return await r.json();
    }
  } catch (e) {}
  return memStore.has(url) ? memStore.get(url) : null;
}

async function cacheWrite(url, obj) {
  memStore.set(url, obj);
  try {
    if (typeof caches !== 'undefined' && caches.default) {
      await caches.default.put(
        new Request(url),
        new Response(JSON.stringify(obj), {
          headers: { 'content-type': 'application/json', 'cache-control': 'max-age=86400' }
        })
      );
    }
  } catch (e) {}
}

async function getFlushMeta() {
  const m = await cacheRead(CACHE_FLUSH);
  return m && typeof m === 'object' ? m : {};
}

async function markFlushed(key, now) {
  const m = await getFlushMeta();
  m[key] = now;
  await cacheWrite(CACHE_FLUSH, m);
}

async function maybeFlush(kv, key, value, now) {
  const m = await getFlushMeta();
  if (m[key] && now - m[key] < FLUSH_MS) return false;
  await kv.put(key, JSON.stringify(value));
  m[key] = now;
  await cacheWrite(CACHE_FLUSH, m);
  return true;
}

async function getOnline(kv, now) {
  let map = await cacheRead(CACHE_ONLINE);
  if (!map || typeof map !== 'object' || Array.isArray(map)) {
    map = await readJson(kv, 'online', {});
  }
  return pruneOnline(map, now);
}

async function touchOnline(kv, id, now) {
  const map = await getOnline(kv, now);
  map[id] = now;
  await cacheWrite(CACHE_ONLINE, map);
  await maybeFlush(kv, 'online', map, now);
  return map;
}

async function getLadder(kv) {
  let ladder = await cacheRead(CACHE_LADDER);
  if (!Array.isArray(ladder)) ladder = await readJson(kv, 'ladder', []);
  return ladder;
}

async function setLadder(kv, ladder, now, forceFlush) {
  await cacheWrite(CACHE_LADDER, ladder);
  if (forceFlush) {
    await kv.put('ladder', JSON.stringify(ladder));
    await markFlushed('ladder', now);
    return;
  }
  await maybeFlush(kv, 'ladder', ladder, now);
}

function isQuotaErr(err) {
  const s = String((err && (err.message || err)) || '');
  return /KV put\(\) limit|exceeded for the day|write.*limit/i.test(s);
}

function saveFingerprint(save) {
  if (!save || typeof save !== 'object') return '';
  const o = Object.assign({}, save);
  delete o.t;
  delete o.syncAt;
  if (o.st && typeof o.st === 'object') {
    o.st = Object.assign({}, o.st);
    delete o.st.play;
  }
  try { return JSON.stringify(o); } catch (e) { return ''; }
}

async function readJson(kv, key, fallback) {
  const v = await kv.get(key, { type: 'json' });
  return v == null ? fallback : v;
}

function pruneOnline(map, now) {
  const out = {};
  for (const [id, ts] of Object.entries(map || {})) {
    if (typeof ts === 'number' && now - ts <= ONLINE_MS) out[id] = ts;
  }
  return out;
}

function countOnline(map, now) {
  let n = 0;
  for (const ts of Object.values(map || {})) if (typeof ts === 'number' && now - ts <= ONLINE_MS) n++;
  return n;
}

function sortLadder(ladder) {
  ladder.sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id));
  return ladder;
}

function publicList(ladder, limit, meId) {
  return ladder.slice(0, limit).map((e, i) => ({
    rank: i + 1,
    nick: e.nick || 'Гость',
    score: e.score || 0,
    me: e.id === meId
  }));
}

function findMe(ladder, id) {
  if (!id) return null;
  const i = ladder.findIndex((e) => e.id === id);
  if (i < 0) return null;
  const e = ladder[i];
  return { rank: i + 1, nick: e.nick || 'Гость', score: e.score || 0, of: ladder.length };
}

function bonusPct(invited) {
  return Math.min(REF_CAP, Math.max(0, (invited || 0) * REF_PCT));
}

function mePayload(rec) {
  const invited = (rec && rec.invited) || 0;
  return {
    ok: true,
    invitedCount: invited,
    unclaimed: (rec && rec.unclaimed) || 0,
    bonusPct: bonusPct(invited),
    chest: REF_CHEST,
    gift: REF_GIFT,
    cap: REF_CAP,
    pct: REF_PCT
  };
}

async function resolveRef(kv, ref) {
  if (!validRef(ref)) return null;
  const mapped = await kv.get('r:' + ref);
  if (mapped && validId(mapped)) return mapped;
  // A short invite code must never be treated as a playerId (that would attach the referrer's record).
  // Only accept a raw id if it looks like a full playerId, not a 12-char ref.
  const compact = String(ref).replace(/-/g, '');
  if (validId(ref) && compact.length >= 20) {
    const rec = await readJson(kv, 'p:' + ref, null);
    if (rec) return ref;
  }
  return null;
}


function validSecret(s) {
  return typeof s === 'string' && /^[A-Za-z0-9_-]{24,80}$/.test(s);
}

async function shaHex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randToken(n) {
  const a = new Uint8Array(n || 24);
  crypto.getRandomValues(a);
  let bin = '';
  for (const b of a) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function sanitizeSave(save) {
  if (!save || typeof save !== 'object' || Array.isArray(save)) return null;
  let raw;
  try { raw = JSON.stringify(save); } catch (e) { return null; }
  if (raw.length > 180000) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

function saveTotal(save) {
  const n = save && typeof save.total === 'number' ? save.total : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function incomingWins(cur, incAt, incSave) {
  if (!cur) return true;
  const ta = incAt || 0;
  const tb = cur.syncAt || 0;
  if (Math.abs(ta - tb) < 2000) return saveTotal(incSave) > saveTotal(cur.save);
  return ta > tb;
}

async function registerRefCode(kv, id, code) {
  if (!validRef(code) || !validId(id)) return;
  const existing = await kv.get('r:' + code);
  if (!existing) await kv.put('r:' + code, id);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    try {
      if (request.method === 'GET' && path === '/stats') {
        const now = Date.now();
        const [onlineMap, meta] = await Promise.all([
          getOnline(env.KV, now),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        return json({ online: countOnline(onlineMap, now), total: meta.total || 0 }, 200, origin);
      }

      if (request.method === 'GET' && path === '/top') {
        const limit = Math.min(TOP_N, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10) || 50));
        const playerId = url.searchParams.get('playerId') || '';
        const now = Date.now();
        const [ladder, onlineMap, meta] = await Promise.all([
          getLadder(env.KV),
          getOnline(env.KV, now),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        return json({
          list: publicList(ladder, limit, validId(playerId) ? playerId : ''),
          me: validId(playerId) ? findMe(ladder, playerId) : null,
          online: countOnline(onlineMap, now),
          total: meta.total || 0
        }, 200, origin);
      }

      if (request.method === 'GET' && path === '/me') {
        const playerId = url.searchParams.get('playerId') || '';
        if (!validId(playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        const rec = await readJson(env.KV, 'p:' + playerId, null);
        return json(mePayload(rec), 200, origin);
      }

      if (request.method === 'POST' && path === '/ping') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        const id = body.playerId;
        const now = Date.now();
        const [meta, rec] = await Promise.all([
          readJson(env.KV, 'meta', { total: 0 }),
          readJson(env.KV, 'p:' + id, null)
        ]);
        const online = await touchOnline(env.KV, id, now);
        const writes = [];
        if (!rec) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
          writes.push(env.KV.put('p:' + id, JSON.stringify({ first: now, lastPing: now, score: 0, nick: '', invited: 0, unclaimed: 0 })));
          writes.push(env.KV.put('meta', JSON.stringify(meta)));
        }
        if (body.refCode) writes.push(registerRefCode(env.KV, id, body.refCode));
        if (writes.length) await Promise.all(writes);
        return json({ ok: true, online: countOnline(online, now), total: meta.total || 0 }, 200, origin);
      }

      if (request.method === 'POST' && path === '/ref') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.newPlayerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        if (!validRef(body.ref)) return json({ ok: false, error: 'ref' }, 400, origin);
        const newId = body.newPlayerId;
        const referrerId = await resolveRef(env.KV, body.ref);
        if (!referrerId) return json({ ok: false, error: 'ref' }, 400, origin);
        if (referrerId === newId) return json({ ok: false, error: 'self' }, 400, origin);

        const now = Date.now();
        const [newbie, referrer, meta] = await Promise.all([
          readJson(env.KV, 'p:' + newId, null),
          readJson(env.KV, 'p:' + referrerId, null),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        if (newbie) {
          const age = now - (newbie.first || now);
          const unused = !newbie.referredBy && !(newbie.score > 0) && !newbie.nick && age < 120000;
          if (!unused) return json({ ok: false, error: 'exists', already: true, gift: 0 }, 200, origin);
        }

        const newRec = Object.assign({}, newbie || {}, {
          first: (newbie && newbie.first) || now,
          lastPing: now,
          score: (newbie && newbie.score) || 0,
          nick: (newbie && newbie.nick) || '',
          referredBy: referrerId,
          invited: (newbie && newbie.invited) || 0,
          unclaimed: 0
        });
        const refRec = referrer || { first: now, lastPing: now, score: 0, nick: '', invited: 0, unclaimed: 0 };
        refRec.invited = (refRec.invited || 0) + 1;
        refRec.unclaimed = (refRec.unclaimed || 0) + 1;
        if (!Array.isArray(refRec.invitees)) refRec.invitees = [];
        if (refRec.invitees.length < 50) refRec.invitees.push(newId);
        const writes = [
          env.KV.put('p:' + newId, JSON.stringify(newRec)),
          env.KV.put('p:' + referrerId, JSON.stringify(refRec))
        ];
        if (!newbie) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
          writes.push(env.KV.put('meta', JSON.stringify(meta)));
        }
        await Promise.all(writes);
        return json({
          ok: true,
          newcomer: true,
          gift: REF_GIFT
        }, 200, origin);
      }

      if (request.method === 'POST' && path === '/claim') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        const rec = await readJson(env.KV, 'p:' + body.playerId, null);
        if (!rec) return json({ ok: true, claimed: 0, chest: REF_CHEST, invitedCount: 0, bonusPct: 0 }, 200, origin);
        const n = Math.max(0, rec.unclaimed || 0);
        if (!n) {
          return json({
            ok: true, claimed: 0, chest: REF_CHEST,
            invitedCount: rec.invited || 0, bonusPct: bonusPct(rec.invited)
          }, 200, origin);
        }
        rec.unclaimed = 0;
        rec.claimed = (rec.claimed || 0) + n;
        await env.KV.put('p:' + body.playerId, JSON.stringify(rec));
        return json({
          ok: true,
          claimed: n,
          chest: REF_CHEST,
          invitedCount: rec.invited || 0,
          bonusPct: bonusPct(rec.invited)
        }, 200, origin);
      }

      if (request.method === 'POST' && path === '/nick') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        const nickRes = cleanNick(body.nick || '');
        if (!nickRes.ok) return json({ ok: false, error: 'nick' }, 400, origin);
        const id = body.playerId;
        const now = Date.now();
        const [rec, ladder, onlineMap, meta] = await Promise.all([
          readJson(env.KV, 'p:' + id, null),
          getLadder(env.KV),
          getOnline(env.KV, now),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        if (rec && rec.nick === nickRes.nick) {
          return json({
            ok: true, nick: rec.nick, unchanged: true,
            list: publicList(ladder, TOP_N, id), me: findMe(ladder, id),
            online: countOnline(onlineMap, now), total: (meta && meta.total) || 0
          }, 200, origin);
        }
        if (rec && rec.lastNickAt && now - rec.lastNickAt < NICK_MIN_MS) {
          return json({ ok: false, error: 'rate', retry: NICK_MIN_MS - (now - rec.lastNickAt) }, 429, origin);
        }
        const first = !rec;
        const next = Object.assign({}, rec || {}, {
          first: rec && rec.first ? rec.first : now,
          lastPing: now,
          lastNickAt: now,
          nick: nickRes.nick,
          score: rec && rec.score ? rec.score : 0,
          invited: rec && rec.invited ? rec.invited : 0,
          unclaimed: rec && rec.unclaimed ? rec.unclaimed : 0
        });
        const i = ladder.findIndex((e) => e.id === id);
        const row = { id, nick: next.nick, score: next.score || 0 };
        if (i >= 0) ladder[i] = row; else ladder.push(row);
        sortLadder(ladder);
        if (ladder.length > 500) ladder.length = 500;
        const writes = [env.KV.put('p:' + id, JSON.stringify(next))];
        if (first) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
          writes.push(env.KV.put('meta', JSON.stringify(meta)));
        }
        writes.push(setLadder(env.KV, ladder, now, true));
        await Promise.all(writes);
        return json({
          ok: true,
          nick: next.nick,
          list: publicList(ladder, TOP_N, id),
          me: findMe(ladder, id),
          online: countOnline(onlineMap, now),
          total: meta.total || 0
        }, 200, origin);
      }

      if (request.method === 'POST' && path === '/score') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        if (!validScore(body.score)) return json({ ok: false, error: 'score' }, 400, origin);
        const id = body.playerId;
        const now = Date.now();
        let score = Math.floor(body.score);
        const [rec, ladder, meta] = await Promise.all([
          readJson(env.KV, 'p:' + id, null),
          getLadder(env.KV),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        const online = await touchOnline(env.KV, id, now);
        let nickRes = cleanNick(body.nick || '');
        if (!nickRes.ok) {
          if (rec && rec.nick && String(body.nick || '') === rec.nick) nickRes = { ok: true, nick: rec.nick };
          else return json({ ok: false, error: 'nick' }, 400, origin);
        }
        const nickChanging = !!(nickRes.nick && rec && rec.nick && nickRes.nick !== rec.nick);
        const nickRateBlocked = nickChanging && rec.lastNickAt && now - rec.lastNickAt < NICK_MIN_MS;
        const effectiveNick = nickRateBlocked || !nickRes.ok ? ((rec && rec.nick) || nickRes.nick) : nickRes.nick;
        const prev = rec && rec.score > 0 ? rec.score : 0;
        if (prev > 0) {
          const minutes = Math.max((rec.lastScoreAt ? now - rec.lastScoreAt : SCORE_MIN_MS) / 60000, SCORE_MIN_MS / 60000);
          const cap = prev + Math.max(5e4, prev * 0.8) * minutes + 2e6 * minutes;
          if (score > cap) score = Math.floor(cap);
          if (score < prev) score = prev;
        }
        const improved = score > prev;
        const significant = improved && (score - prev >= Math.max(100, prev * 0.01) || !rec || !rec.lastScoreAt);
        const tooSoon = !!(rec && rec.lastScoreAt && now - rec.lastScoreAt < SCORE_MIN_MS - 2500);
        if (tooSoon || !improved) {
          if (nickChanging && !nickRateBlocked && !tooSoon) {
            rec.nick = nickRes.nick;
            rec.lastNickAt = now;
            const li = ladder.findIndex((e) => e.id === id);
            if (li >= 0) ladder[li].nick = rec.nick;
            await env.KV.put('p:' + id, JSON.stringify(rec));
            await setLadder(env.KV, ladder, now, false);
            return json({
              ok: true, nickOnly: true, score: rec.score || 0,
              list: publicList(ladder, TOP_N, id), me: findMe(ladder, id),
              online: countOnline(online, now), total: meta.total || 0
            }, 200, origin);
          }
          return json({
            ok: true, unchanged: !improved, rate: tooSoon,
            score: prev,
            list: publicList(ladder, TOP_N, id), me: findMe(ladder, id),
            online: countOnline(online, now), total: (meta && meta.total) || 0
          }, 200, origin);
        }
        if (!significant && rec && rec.lastScoreAt && now - rec.lastScoreAt < SCORE_MIN_MS) {
          return json({
            ok: true, unchanged: true, score: prev,
            list: publicList(ladder, TOP_N, id), me: findMe(ladder, id),
            online: countOnline(online, now), total: (meta && meta.total) || 0
          }, 200, origin);
        }
        const first = !rec;
        const next = Object.assign({}, rec || {}, {
          first: rec && rec.first ? rec.first : now,
          lastPing: now,
          lastScoreAt: now,
          nick: effectiveNick,
          score
        });
        if (nickChanging && !nickRateBlocked) next.lastNickAt = now;
        const i = ladder.findIndex((e) => e.id === id);
        const row = { id, nick: next.nick, score };
        if (i >= 0) ladder[i] = row; else ladder.push(row);
        sortLadder(ladder);
        if (ladder.length > 500) ladder.length = 500;
        if (first) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
        }
        const writes = [env.KV.put('p:' + id, JSON.stringify(next))];
        if (first) writes.push(env.KV.put('meta', JSON.stringify(meta)));
        if (body.refCode) writes.push(registerRefCode(env.KV, id, body.refCode));
        writes.push(setLadder(env.KV, ladder, now, false));
        await Promise.all(writes);
        return json({
          ok: true,
          score,
          list: publicList(ladder, TOP_N, id),
          me: findMe(ladder, id),
          online: countOnline(online, now),
          total: meta.total || 0
        }, 200, origin);
      }


      if (request.method === 'POST' && path === '/sync/issue') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        if (!validSecret(body.syncKey)) return json({ ok: false, error: 'key' }, 400, origin);
        const id = body.playerId;
        const now = Date.now();
        let rec = await readJson(env.KV, 'p:' + id, null);
        if (!rec) {
          rec = { first: now, lastPing: now, score: 0, nick: '', invited: 0, unclaimed: 0 };
          const meta = await readJson(env.KV, 'meta', { total: 0 });
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
          // meta write happens below with the rest
          rec._newMeta = meta;
        }
        const keyHash = await shaHex(body.syncKey);
        if (rec.syncKeyHash && rec.syncKeyHash !== keyHash) return json({ ok: false, error: 'key' }, 403, origin);
        if (rec.lastSyncIssueAt && now - rec.lastSyncIssueAt < 5000) {
          return json({ ok: false, error: 'rate', retry: 5000 - (now - rec.lastSyncIssueAt) }, 429, origin);
        }
        const token = randToken(24);
        const tokenHash = await shaHex(token);
        const writes = [];
        if (rec.syncTokenHash) writes.push(env.KV.delete('s:' + rec.syncTokenHash));
        rec.syncKeyHash = keyHash;
        rec.syncTokenHash = tokenHash;
        rec.lastSyncIssueAt = now;
        rec.lastPing = now;
        const meta = rec._newMeta;
        delete rec._newMeta;
        writes.push(env.KV.put('s:' + tokenHash, id));
        writes.push(env.KV.put('p:' + id, JSON.stringify(rec)));
        if (meta) writes.push(env.KV.put('meta', JSON.stringify(meta)));
        const snapSave = sanitizeSave(body.save);
        if (snapSave) {
          snapSave.pid = id;
          const incAt = (typeof body.syncAt === 'number' && Number.isFinite(body.syncAt)) ? body.syncAt : now;
          writes.push(env.KV.put('sv:' + id, JSON.stringify({ save: snapSave, syncAt: incAt, updated: now })));
        }
        await Promise.all(writes);
        return json({ ok: true, token }, 200, origin);
      }

      if (request.method === 'GET' && path === '/sync/info') {
        const token = url.searchParams.get('token') || '';
        if (!validSecret(token)) return json({ ok: false, error: 'token' }, 400, origin);
        const tokenHash = await shaHex(token);
        const id = await env.KV.get('s:' + tokenHash);
        if (!id || !validId(id)) return json({ ok: false, error: 'token' }, 404, origin);
        const rec = await readJson(env.KV, 'p:' + id, null);
        const snap = await readJson(env.KV, 'sv:' + id, null);
        const nick = (snap && snap.save && snap.save.nick) || (rec && rec.nick) || 'Завхоз';
        const total = (snap && saveTotal(snap.save)) || (rec && rec.score) || 0;
        return json({ ok: true, nick, total }, 200, origin);
      }

      if (request.method === 'POST' && path === '/sync/pull') {
        const body = await request.json().catch(() => null);
        if (!body) return json({ ok: false, error: 'body' }, 400, origin);
        let id = '';
        if (validSecret(body.token)) {
          const tokenHash = await shaHex(body.token);
          id = await env.KV.get('s:' + tokenHash);
          if (!id || !validId(id)) return json({ ok: false, error: 'token' }, 404, origin);
        } else if (validId(body.playerId) && validSecret(body.syncKey)) {
          id = body.playerId;
          const rec = await readJson(env.KV, 'p:' + id, null);
          if (!rec || !rec.syncKeyHash) return json({ ok: false, error: 'key' }, 403, origin);
          const keyHash = await shaHex(body.syncKey);
          if (rec.syncKeyHash !== keyHash) return json({ ok: false, error: 'key' }, 403, origin);
        } else {
          return json({ ok: false, error: 'auth' }, 400, origin);
        }
        const rec = await readJson(env.KV, 'p:' + id, null);
        const snap = await readJson(env.KV, 'sv:' + id, null);
        if (!snap || !snap.save) return json({ ok: false, error: 'empty' }, 404, origin);
        const nick = (snap.save && snap.save.nick) || (rec && rec.nick) || 'Завхоз';
        return json({ ok: true, playerId: id, save: snap.save, syncAt: snap.syncAt || 0, nick }, 200, origin);
      }

      if (request.method === 'POST' && path === '/sync/push') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        if (!validSecret(body.syncKey)) return json({ ok: false, error: 'key' }, 400, origin);
        const save = sanitizeSave(body.save);
        if (!save) return json({ ok: false, error: 'save' }, 400, origin);
        const id = body.playerId;
        const rec = await readJson(env.KV, 'p:' + id, null);
        if (!rec || !rec.syncKeyHash) return json({ ok: false, error: 'key' }, 403, origin);
        const keyHash = await shaHex(body.syncKey);
        if (rec.syncKeyHash !== keyHash) return json({ ok: false, error: 'key' }, 403, origin);
        const now = Date.now();
        const incAt = (typeof body.syncAt === 'number' && Number.isFinite(body.syncAt)) ? body.syncAt : now;
        const cur = await readJson(env.KV, 'sv:' + id, null);
        const fp = saveFingerprint(save);
        if (cur && (cur.fp === fp || saveFingerprint(cur.save) === fp)) {
          return json({ ok: true, unchanged: true, syncAt: cur.syncAt || 0 }, 200, origin);
        }
        const lastAt = (cur && cur.updated) || rec.lastSyncPushAt || 0;
        if (!body.force && lastAt && now - lastAt < SYNC_MIN_MS) {
          return json({ ok: true, rate: true, syncAt: (cur && cur.syncAt) || 0 }, 200, origin);
        }
        if (cur && !incomingWins(cur, incAt, save)) {
          return json({ ok: true, older: true, syncAt: cur.syncAt || 0, save: cur.save, playerId: id }, 200, origin);
        }
        save.pid = id;
        const snap = { save, syncAt: incAt, updated: now, fp };
        await env.KV.put('sv:' + id, JSON.stringify(snap));
        return json({ ok: true, syncAt: incAt }, 200, origin);
      }

      return json({ ok: false, error: 'not_found' }, 404, origin);
    } catch (err) {
      if (isQuotaErr(err)) return json({ ok: false, error: 'quota', retry: 60 * 60 * 1000 }, 503, origin);
      return json({ ok: false, error: 'server' }, 500, origin);
    }
  }
};
