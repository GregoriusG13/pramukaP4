/* =========================================================
   LOGIKA BERSAMA: sesi, timer, poin, skor regu, nilai
   ========================================================= */

const qs = new URLSearchParams(location.search);
let SESI = (qs.get("s") || localStorage.getItem("misiSampahSesi") || DEFAULT_SESI).toUpperCase().replace(/[^A-Z0-9]/g, "");
const G = (sub) => `games/${SESI}${sub ? "/" + sub : ""}`;

/* ---------- Poin game (BUKAN nilai) ---------- */
const POIN = {
  pilahBenar: 40,
  komboPer: 10,          // tambahan per kombo
  komboMaks: 50,
  soalBenar: 100,        // kuis & skenario
  bonusCepatMaks: 50,    // menurun sesuai waktu jawab
  waktuSoal: 20,         // detik per soal kuis/skenario
  misiBenar: 200,
  finalBenar: 200,
  finalCepatMaks: 100,
  bonusKompak: 50
};

/* ---------- Acak dengan benih (supaya urutan tetap saat refresh) ---------- */
function hashStr(s) {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return h >>> 0;
}
function rng(seed) {
  let a = hashStr(String(seed));
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function acak(arr, seed) {
  const r = rng(seed), a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/* Urutan pilihan jawaban teracak; mengembalikan indeks asli (0 = benar) */
function urutanPilihan(n, seed) { return acak([...Array(n).keys()], seed); }

/* ---------- Timer ---------- */
function sisaMs(st) {
  if (!st || !st.startAt || !st.duration) return 0;
  const acuan = st.pausedAt || Store.now();
  return Math.max(0, st.duration * 1000 - (acuan - st.startAt));
}
function fmtWaktu(ms) {
  const s = Math.ceil(ms / 1000);
  return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
}
/* Babak final: soal ke-berapa yang sedang aktif */
function infoFinal(st) {
  const per = (FINAL_JAWAB + FINAL_BAHAS) * 1000;
  const acuan = st.pausedAt || Store.now();
  const lewat = Math.max(0, acuan - st.startAt);
  const idx = Math.floor(lewat / per);
  if (idx >= SOAL_FINAL.length) return { idx, selesai: true };
  const dalam = lewat % per;
  const fase = dalam < FINAL_JAWAB * 1000 ? "jawab" : "bahas";
  const sisa = fase === "jawab" ? FINAL_JAWAB * 1000 - dalam : per - dalam;
  return { idx, fase, sisa, selesai: false, soal: SOAL_FINAL[idx] };
}
function durasiFinalDetik() { return SOAL_FINAL.length * (FINAL_JAWAB + FINAL_BAHAS); }

/* ---------- Status babak ---------- */
function babakBerjalan(st) { return st && st.status === "main" && !st.pausedAt && sisaMs(st) > 0; }

/* ---------- Daftar regu aktif di dropdown ---------- */
function reguAktif(config) {
  const ids = (config && config.regu) || REGU.map((r) => r.id);
  return ids.map((id) => cariRegu(id, config && config.custom));
}

/* ---------- Anggota regu ---------- */
function anggotaRegu(players, reguId) {
  return Object.entries(players || {})
    .filter(([, p]) => p && p.nama && p.regu === reguId)
    .map(([pid, p]) => ({ pid, ...p }))
    .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0) || a.pid.localeCompare(b.pid));
}

/* Petunjuk misi untuk anggota ke-i dari n anggota */
function petunjukUntuk(i, n) {
  const total = 5;
  if (n >= total) return [i % total];
  const out = [];
  for (let j = 0; j < total; j++) if (j % n === i) out.push(j);
  return out;
}

/* ---------- Skor regu (untuk leaderboard) ---------- */
function hitungRegu(game) {
  const players = (game && game.players) || {};
  const config = (game && game.config) || {};
  const misi = (game && game.misi) || {};
  const manual = (game && game.manual) || {};
  const ids = new Set(Object.values(players).filter((p) => p && p.regu && p.nama).map((p) => p.regu));
  const hasil = [];
  ids.forEach((id) => {
    const ang = anggotaRegu(players, id);
    if (!ang.length) return;
    const regu = cariRegu(id, config.custom);
    const rata = ang.reduce((a, p) => a + (p.score || 0), 0) / ang.length;
    let bonus = 0;
    [1, 2, 3, 5].forEach((b) => { if (ang.every((p) => p.done && p.done[b])) bonus += POIN.bonusKompak; });
    const m = misi[id] || {};
    if (SOAL_MISI.every((s) => m[s.id] && m[s.id].locked)) bonus += POIN.bonusKompak;
    const man = Number(manual[id]) || 0;
    const mvp = ang.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0];
    hasil.push({
      id, regu, anggota: ang, jumlah: ang.length,
      rata: Math.round(rata), bonus, manual: man,
      total: Math.round(rata) + bonus + man,
      mvp: mvp && (mvp.score || 0) > 0 ? mvp.nama : "–"
    });
  });
  hasil.sort((a, b) => b.total - a.total || a.regu.nama.localeCompare(b.regu.nama));
  hasil.forEach((r, i) => (r.rank = i + 1));
  return hasil;
}

/* ---------- Nilai 0–100 (tanpa bonus apa pun) ---------- */
function totalSoal() {
  const t = { K1: SOAL_PILAH.length, K2: SOAL_KUIS.length, K3: SOAL_SKENARIO.length, K4: SOAL_MISI.length };
  SOAL_FINAL.forEach((f) => (t[f.kompetensi] += 1));
  return t;
}
function hitungNilai(game) {
  const players = (game && game.players) || {};
  const misi = (game && game.misi) || {};
  const config = (game && game.config) || {};
  const tot = totalSoal();
  return Object.entries(players).filter(([, p]) => p && p.nama && p.regu).map(([pid, p]) => {
    const ans = p.ans || {};
    const benar = { K1: 0, K2: 0, K3: 0, K4: 0 };
    const hitung = (b) => Object.values(ans[b] || {}).filter((a) => a && a.c).length;
    benar.K1 = hitung(1);
    benar.K2 = hitung(2);
    benar.K3 = hitung(3);
    Object.entries(ans[5] || {}).forEach(([fid, a]) => {
      const f = SOAL_FINAL.find((x) => x.id === fid);
      if (f && a && a.c) benar[f.kompetensi] += 1;
    });
    const m = misi[p.regu] || {};
    benar.K4 = SOAL_MISI.filter((s) => m[s.id] && m[s.id].locked && m[s.id].benar).length;
    const persen = {};
    Object.keys(tot).forEach((k) => (persen[k] = tot[k] ? Math.round((benar[k] / tot[k]) * 100) : 0));
    const nilai = Math.round(
      (persen.K1 * BOBOT_NILAI.K1 + persen.K2 * BOBOT_NILAI.K2 + persen.K3 * BOBOT_NILAI.K3 + persen.K4 * BOBOT_NILAI.K4) / 100
    );
    const predikat = PREDIKAT.find((x) => nilai >= x.min).label;
    return { pid, nama: p.nama, regu: cariRegu(p.regu, config.custom).nama, benar, tot, persen, nilai, predikat, skorGame: p.score || 0 };
  }).sort((a, b) => a.regu.localeCompare(b.regu) || a.nama.localeCompare(b.nama));
}

/* ---------- Menyimpan jawaban ---------- */
async function simpanJawaban(pid, babak, qid, benar, poin, extra) {
  const upd = {};
  upd[`ans/${babak}/${qid}`] = Object.assign({ c: benar ? 1 : 0, p: poin, t: Store.now() }, extra || {});
  await Store.update(G(`players/${pid}`), upd);
  if (poin) await Store.inc(G(`players/${pid}/score`), poin);
}
function kabar(teks, tipe) {
  return Store.push(G("feed"), { teks, tipe: tipe || "info", t: Store.now() });
}

/* Kunci misi kalau semua anggota online sudah sepakat */
async function cekKunciMisi(game, reguId, misiId) {
  const ang = anggotaRegu(game.players, reguId).filter((p) => p.online !== false);
  if (!ang.length) return;
  const votes = (((game.misi || {})[reguId] || {})[misiId] || {}).votes || {};
  const pilihan = ang.map((p) => votes[p.pid]);
  if (pilihan.some((v) => v === undefined || v === null)) return;
  if (!pilihan.every((v) => v === pilihan[0])) return;
  await kunciMisi(reguId, misiId, pilihan[0]);
}
async function kunciMisi(reguId, misiId, pilihan) {
  const res = await Store.transaction(G(`misi/${reguId}/${misiId}`), (cur) => {
    cur = cur || {};
    if (cur.locked) return undefined;
    cur.locked = true;
    cur.pilihan = pilihan;
    cur.benar = pilihan === 0;
    return cur;
  });
  if (res.committed && res.value && res.value.benar) {
    const game = await Store.get(G());
    const regu = cariRegu(reguId, game && game.config && game.config.custom);
    const misi = SOAL_MISI.find((m) => m.id === misiId);
    kabar(`Regu ${regu.nama} menuntaskan misi "${misi.judul}"!`, "regu");
  }
}
/* Saat waktu babak 4 habis: misi yang belum terkunci diputuskan suara terbanyak */
async function putuskanMisiTersisa(game) {
  const players = game.players || {};
  const ids = new Set(Object.values(players).filter((p) => p && p.regu && p.nama).map((p) => p.regu));
  for (const reguId of ids) {
    for (const s of SOAL_MISI) {
      const m = ((game.misi || {})[reguId] || {})[s.id] || {};
      if (m.locked) continue;
      const hitung = {};
      Object.values(m.votes || {}).forEach((v) => (hitung[v] = (hitung[v] || 0) + 1));
      const urut = Object.entries(hitung).sort((a, b) => b[1] - a[1]);
      const pil = urut.length ? Number(urut[0][0]) : -1;
      await kunciMisi(reguId, s.id, pil);
    }
  }
}
