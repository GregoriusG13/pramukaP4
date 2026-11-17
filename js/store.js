/* =========================================================
   STORE: lapisan penyimpanan data.
   - Mode Firebase : Realtime Database (sinkron antar HP)
   - Mode Demo     : localStorage + BroadcastChannel
                     (sinkron antar tab di SATU browser saja)
   Semua halaman memakai API yang sama, jadi kode game
   tidak perlu tahu sedang memakai mode yang mana.
   ========================================================= */

const Store = (() => {
  const clone = (v) => (v === undefined ? null : JSON.parse(JSON.stringify(v)));
  const parts = (p) => String(p).split("/").filter(Boolean);

  /* ---------------- MODE DEMO ---------------- */
  function makeDemo() {
    const KEY = "misiSampahDemoDB";
    let db = load();
    const listeners = new Set();
    let bc = null;
    try { bc = new BroadcastChannel("misiSampahDemo"); } catch (e) {}

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
    }
    function save() {
      try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
      if (bc) bc.postMessage("change");
      notify();
    }
    function getAt(path) {
      let cur = db;
      for (const k of parts(path)) {
        if (cur == null || typeof cur !== "object") return null;
        cur = cur[k];
      }
      return cur === undefined ? null : cur;
    }
    function setAt(path, val) {
      const ks = parts(path);
      if (!ks.length) { db = val || {}; return; }
      let cur = db;
      for (let i = 0; i < ks.length - 1; i++) {
        if (cur[ks[i]] == null || typeof cur[ks[i]] !== "object") cur[ks[i]] = {};
        cur = cur[ks[i]];
      }
      const last = ks[ks.length - 1];
      if (val === null || val === undefined) delete cur[last];
      else cur[last] = clone(val);
    }
    function notify() {
      listeners.forEach((l) => {
        const v = getAt(l.path);
        const s = JSON.stringify(v);
        if (s !== l.last) { l.last = s; l.cb(clone(v)); }
      });
    }
    const refresh = () => { db = load(); notify(); };
    if (bc) bc.onmessage = refresh;
    window.addEventListener("storage", (e) => { if (e.key === KEY) refresh(); });

    let pushCounter = 0;
    return {
      mode: "demo",
      ready: Promise.resolve(),
      on(path, cb) {
        const l = { path, cb, last: undefined };
        listeners.add(l);
        db = load();
        const v = getAt(path);
        l.last = JSON.stringify(v);
        setTimeout(() => cb(clone(v)), 0);
        return () => listeners.delete(l);
      },
      async get(path) { db = load(); return clone(getAt(path)); },
      async set(path, val) { db = load(); setAt(path, val); save(); },
      async update(path, obj) {
        db = load();
        Object.keys(obj).forEach((k) => setAt(path + "/" + k, obj[k]));
        save();
      },
      async remove(path) { db = load(); setAt(path, null); save(); },
      async push(path, val) {
        db = load();
        const key = Date.now().toString(36) + (pushCounter++).toString(36).padStart(3, "0") + Math.random().toString(36).slice(2, 5);
        setAt(path + "/" + key, val);
        save();
        return key;
      },
      async inc(path, n) {
        db = load();
        setAt(path, (Number(getAt(path)) || 0) + n);
        save();
      },
      async transaction(path, fn) {
        db = load();
        const cur = clone(getAt(path));
        const next = fn(cur);
        if (next === undefined) return { committed: false, value: cur };
        setAt(path, next);
        save();
        return { committed: true, value: clone(next) };
      },
      now() { return Date.now(); },
      presence(path) { this.set(path, true); },
      async wipeAll() { localStorage.removeItem(KEY); db = {}; save(); }
    };
  }

  /* ---------------- MODE FIREBASE ---------------- */
  function makeFirebase() {
    firebase.initializeApp(FIREBASE_CONFIG);
    const fdb = firebase.database();
    let offset = 0;
    fdb.ref(".info/serverTimeOffset").on("value", (s) => { offset = s.val() || 0; });
    const ref = (p) => fdb.ref(p);
    return {
      mode: "firebase",
      ready: Promise.resolve(),
      on(path, cb) {
        const r = ref(path);
        const h = (s) => cb(s.val());
        r.on("value", h);
        return () => r.off("value", h);
      },
      async get(path) { return (await ref(path).get()).val(); },
      set(path, val) { return ref(path).set(val); },
      update(path, obj) { return ref(path).update(obj); },
      remove(path) { return ref(path).remove(); },
      async push(path, val) { const r = ref(path).push(); await r.set(val); return r.key; },
      inc(path, n) { return ref(path).set(firebase.database.ServerValue.increment(n)); },
      async transaction(path, fn) {
        const res = await ref(path).transaction((cur) => fn(cur));
        return { committed: res.committed, value: res.snapshot.val() };
      },
      now() { return Date.now() + offset; },
      presence(path) {
        const r = ref(path);
        fdb.ref(".info/connected").on("value", (s) => {
          if (s.val() === true) { r.onDisconnect().set(false); r.set(true); }
        });
      },
      async wipeAll() {}
    };
  }

  return DEMO_MODE ? makeDemo() : makeFirebase();
})();
