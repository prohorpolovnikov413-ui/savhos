const ORIGINS = new Set([
  'https://prohorpolovnikov413-ui.github.io'
]);
const ONLINE_MS = 180000;
const PING_MIN_MS = 45000;
const SCORE_MIN_MS = 120000;
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
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'cache-control': 'no-store',
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

function cleanNick(raw) {
  if (typeof raw !== 'string') return { ok: false, error: 'nick' };
  let s = raw.replace(/<[^>]*>/g, '').replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
  if (s.length < 1 || s.length > 16) return { ok: false, error: 'nick' };
  const low = s.toLowerCase();
  for (const w of BAD) if (low.includes(w)) return { ok: false, error: 'nick' };
  return { ok: true, nick: s };
}

function validScore(n) {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1e18;
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
  if (validId(ref)) {
    const rec = await readJson(kv, 'p:' + ref, null);
    if (rec) return ref;
  }
  return null;
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
        const [onlineMap, meta] = await Promise.all([
          readJson(env.KV, 'online', {}),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        const now = Date.now();
        return json({ online: countOnline(onlineMap, now), total: meta.total || 0 }, 200, origin);
      }

      if (request.method === 'GET' && path === '/top') {
        const limit = Math.min(TOP_N, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10) || 50));
        const playerId = url.searchParams.get('playerId') || '';
        const [ladder, onlineMap, meta] = await Promise.all([
          readJson(env.KV, 'ladder', []),
          readJson(env.KV, 'online', {}),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        const now = Date.now();
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
        const [onlineMap, meta, rec] = await Promise.all([
          readJson(env.KV, 'online', {}),
          readJson(env.KV, 'meta', { total: 0 }),
          readJson(env.KV, 'p:' + id, null)
        ]);
        const online = pruneOnline(onlineMap, now);
        const last = online[id] || 0;
        const shouldWrite = now - last >= PING_MIN_MS || !rec;
        online[id] = now;
        const writes = [];
        if (shouldWrite) writes.push(env.KV.put('online', JSON.stringify(online)));
        if (!rec) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
          writes.push(env.KV.put('p:' + id, JSON.stringify({ first: now, lastPing: now, score: 0, nick: '', invited: 0, unclaimed: 0 })));
          writes.push(env.KV.put('meta', JSON.stringify(meta)));
        } else if (shouldWrite) {
          rec.lastPing = now;
          writes.push(env.KV.put('p:' + id, JSON.stringify(rec)));
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
        if (newbie) return json({ ok: false, error: 'exists', already: true, gift: 0 }, 200, origin);

        const newRec = { first: now, lastPing: now, score: 0, nick: '', referredBy: referrerId, invited: 0, unclaimed: 0 };
        const refRec = referrer || { first: now, lastPing: now, score: 0, nick: '', invited: 0, unclaimed: 0 };
        refRec.invited = (refRec.invited || 0) + 1;
        refRec.unclaimed = (refRec.unclaimed || 0) + 1;
        if (!Array.isArray(refRec.invitees)) refRec.invitees = [];
        if (refRec.invitees.length < 50) refRec.invitees.push(newId);
        meta.total = (meta.total || 0) + 1;
        meta.updated = now;
        await Promise.all([
          env.KV.put('p:' + newId, JSON.stringify(newRec)),
          env.KV.put('p:' + referrerId, JSON.stringify(refRec)),
          env.KV.put('meta', JSON.stringify(meta))
        ]);
        return json({
          ok: true,
          newcomer: true,
          gift: REF_GIFT,
          referredBy: referrerId
        }, 200, origin);
      }

      if (request.method === 'POST' && path === '/claim') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        const rec = await readJson(env.KV, 'p:' + body.playerId, null);
        if (!rec) return json({ ok: true, claimed: 0, chest: REF_CHEST, invitedCount: 0, bonusPct: 0 }, 200, origin);
        const n = Math.max(0, rec.unclaimed || 0);
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

      if (request.method === 'POST' && path === '/score') {
        const body = await request.json().catch(() => null);
        if (!body || !validId(body.playerId)) return json({ ok: false, error: 'playerId' }, 400, origin);
        if (!validScore(body.score)) return json({ ok: false, error: 'score' }, 400, origin);
        const nickRes = cleanNick(body.nick || '');
        if (!nickRes.ok) return json({ ok: false, error: 'nick' }, 400, origin);
        const id = body.playerId;
        const now = Date.now();
        let score = Math.floor(body.score);
        const [rec, ladder, onlineMap, meta] = await Promise.all([
          readJson(env.KV, 'p:' + id, null),
          readJson(env.KV, 'ladder', []),
          readJson(env.KV, 'online', {}),
          readJson(env.KV, 'meta', { total: 0 })
        ]);
        if (rec && rec.lastScoreAt && now - rec.lastScoreAt < SCORE_MIN_MS - 2500) {
          if (score <= (rec.score || 0) && nickRes.nick && nickRes.nick !== rec.nick) {
            rec.nick = nickRes.nick;
            const li = ladder.findIndex((e) => e.id === id);
            if (li >= 0) ladder[li].nick = rec.nick;
            await Promise.all([
              env.KV.put('p:' + id, JSON.stringify(rec)),
              env.KV.put('ladder', JSON.stringify(ladder))
            ]);
            return json({
              ok: true, nickOnly: true, score: rec.score || 0,
              list: publicList(ladder, TOP_N, id), me: findMe(ladder, id),
              online: countOnline(pruneOnline(onlineMap, now), now), total: meta.total || 0
            }, 200, origin);
          }
          return json({ ok: false, error: 'rate', retry: SCORE_MIN_MS - (now - rec.lastScoreAt) }, 429, origin);
        }
        const prev = rec && rec.score > 0 ? rec.score : 0;
        if (prev > 0) {
          const minutes = Math.max((rec.lastScoreAt ? now - rec.lastScoreAt : SCORE_MIN_MS) / 60000, SCORE_MIN_MS / 60000);
          const cap = prev + Math.max(5e4, prev * 0.8) * minutes + 2e6 * minutes;
          if (score > cap) score = Math.floor(cap);
          if (score < prev) score = prev;
        }
        const first = !rec;
        const next = Object.assign({}, rec || {}, {
          first: rec && rec.first ? rec.first : now,
          lastPing: now,
          lastScoreAt: now,
          nick: nickRes.nick,
          score
        });
        const i = ladder.findIndex((e) => e.id === id);
        const row = { id, nick: next.nick, score };
        if (i >= 0) ladder[i] = row; else ladder.push(row);
        sortLadder(ladder);
        if (ladder.length > 500) ladder.length = 500;
        const online = pruneOnline(onlineMap, now);
        online[id] = now;
        if (first) {
          meta.total = (meta.total || 0) + 1;
          meta.updated = now;
        }
        const writes = [
          env.KV.put('p:' + id, JSON.stringify(next)),
          env.KV.put('ladder', JSON.stringify(ladder)),
          env.KV.put('online', JSON.stringify(online))
        ];
        if (first) writes.push(env.KV.put('meta', JSON.stringify(meta)));
        if (body.refCode) writes.push(registerRefCode(env.KV, id, body.refCode));
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

      return json({ ok: false, error: 'not_found' }, 404, origin);
    } catch (err) {
      return json({ ok: false, error: 'server' }, 500, origin);
    }
  }
};
