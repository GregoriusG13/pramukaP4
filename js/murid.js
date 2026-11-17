/* =========================================================
   HALAMAN MURID (HP)
   ========================================================= */

const app = document.getElementById("app");
const KUNCI_PID = () => `misiSampah:${SESI}:pid`;
/* Mode demo: tiap tab = satu murid (sessionStorage). Firebase: tersimpan di HP (localStorage). */
const simpanPID = DEMO_MODE ? sessionStorage : localStorage;
let GAME = null;
let PID = simpanPID.getItem(KUNCI_PID());
let kunciTampilan = null;
let presensiAktif = false;
const lokal = {
  umpan: null, sibuk: false, kombo: 0, qMulai: {},
  galat: "", formRegu: "", formNama: "",
  sedang: new Set(), misiTerkunci: new Set()
};

if (DEMO_MODE) document.body.insertAdjacentHTML("beforeend", '<div class="pita-demo">MODE DEMO</div>');

/* ---------- Suara (efek saja, tanpa musik) ---------- */
document.body.insertAdjacentHTML("beforeend", `<button id="tombolSuara" class="tombol-suara" type="button"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4z"/><path class="gelombang" d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/><path class="silang" d="M16 9l6 6M22 9l-6 6"/></svg><span>Suara</span></button>`);
const tombolSuara = document.getElementById("tombolSuara");
function perbaruiTombolSuara() {
  tombolSuara.classList.toggle("bisu", !Suara.nyala);
  tombolSuara.setAttribute("aria-label", Suara.nyala ? "Matikan efek suara" : "Nyalakan efek suara");
}
tombolSuara.addEventListener("click", () => { Suara.siap(); Suara.setNyala(!Suara.nyala); perbaruiTombolSuara(); if (Suara.nyala) Suara.efek("klik"); });
perbaruiTombolSuara();
document.addEventListener("pointerdown", () => Suara.siap(), { capture: true });
const jejakSuara = { status: null, babak: null, detik: null, finalHasil: {} };
function efekStatus(st, p) {
  if (!p) return;
  const b = st.babak || 0;
  if (jejakSuara.status !== null) {
    if (st.status === "main" && (jejakSuara.status !== "main" || jejakSuara.babak !== b)) Suara.efek("mulai");
    if (st.status === "selesai" && jejakSuara.status !== "selesai") Suara.efek("juara");
  }
  if (st.status === "main" && b !== 5 && !st.pausedAt) {
    const d = Math.ceil(sisaMs(st) / 1000);
    if (jejakSuara.detik !== null && d !== jejakSuara.detik) {
      if (d > 0 && d <= 5) Suara.efek("detik");
      if (d === 0 && jejakSuara.detik > 0) Suara.efek("habis");
    }
    jejakSuara.detik = d;
  } else jejakSuara.detik = null;
  // hasil soal final saat jawaban diungkap
  if (st.status === "main" && b === 5) {
    const fi = infoFinal(st);
    if (!fi.selesai && fi.fase === "bahas" && !jejakSuara.finalHasil[fi.idx]) {
      jejakSuara.finalHasil[fi.idx] = true;
      const a = p.ans && p.ans[5] && p.ans[5][fi.soal.id];
      Suara.efek(a && a.c ? "benar" : "salah");
    }
  }
  jejakSuara.status = st.status; jejakSuara.babak = b;
}

const MASKOT = (s) => `<svg class="maskot" width="${s || 72}" height="${s || 72}" viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="20" width="36" height="38" rx="6" fill="#3FA34D"/><rect x="10" y="12" width="44" height="9" rx="4" fill="#F2B632"/><rect x="26" y="6" width="12" height="7" rx="3" fill="#F2B632"/><circle cx="26" cy="36" r="3.5" fill="#1B2A1F"/><circle cx="38" cy="36" r="3.5" fill="#1B2A1F"/><path d="M25 45 q7 6 14 0" stroke="#1B2A1F" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
const HURUF = ["A", "B", "C", "D", "E"];

function toast(teks) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = teks;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

function saya() {
  const p = PID && GAME && GAME.players && GAME.players[PID];
  return p && p.nama && p.regu ? p : null;
}
function reguSaya(p) { return cariRegu(p.regu, GAME.config && GAME.config.custom); }

/* ---------- Data ---------- */
Store.on(G(), (g) => {
  GAME = g || {};
  if (PID && !saya() && GAME.__loaded !== false) {
    // dikeluarkan pembina atau sesi direset
    simpanPID.removeItem(KUNCI_PID());
    PID = null;
    presensiAktif = false;
  }
  if (PID && !presensiAktif) { presensiAktif = true; Store.presence(G(`players/${PID}/online`)); }
  render();
  proses();
});
setInterval(() => { render(); proses(); }, 250);

/* ---------- Kepala layar ---------- */
function kepala(p, kecil, besar, persen, coklat) {
  return `<header class="kepala ${coklat ? "coklat" : ""}">
    <div style="flex:1;min-width:0">
      <div class="kecil">${kecil}</div>
      <div class="besar">${besar}</div>
      ${persen != null ? `<div class="progres"><div style="width:${persen}%"></div></div>` : ""}
    </div>
    <div style="display:flex;gap:6px">
      <div class="kotak-angka waktu" data-waktu-babak><div class="k">WAKTU</div><div class="a">--:--</div></div>
      <div class="kotak-angka skor" data-skor><div class="k">SKOR</div><div class="a">${p.score || 0}</div></div>
    </div>
  </header>`;
}

/* ---------- Render utama ---------- */
function render() {
  if (!GAME) { tampil({ key: "muat", html: `<div class="isi tengah">${MASKOT()}<p>Memuat permainan…</p></div>` }); return; }
  const st = GAME.state || { status: "lobby" };
  const p = saya();
  let v;
  if (!p) v = viewDaftar(st);
  else if (st.status === "selesai") v = viewSelesai(p);
  else if (st.status === "antara") v = viewAntara(st, p);
  else if (st.status === "main") {
    if (st.pausedAt) { lokal.qMulai = {}; v = viewJeda(); }
    else if (st.babak === 5) v = viewFinal(st, p);
    else if (sisaMs(st) <= 0) v = viewHabis(st, p);
    else if (st.babak === 1) v = viewPilah(st, p);
    else if (st.babak === 2 || st.babak === 3) v = viewSoal(st, p, st.babak);
    else if (st.babak === 4) v = viewMisi(st, p);
    else v = viewLobby(p);
  } else v = viewLobby(p);
  tampil(v);
  perbaruiDinamis(st, p);
  efekStatus(st, p);
}
function tampil(v) {
  if (v.key !== kunciTampilan) {
    kunciTampilan = v.key;
    app.innerHTML = v.html;
    if (v.bind) v.bind();
  }
}
function perbaruiDinamis(st, p) {
  const ms = sisaMs(st);
  if (p) document.querySelectorAll("[data-skor] .a").forEach((el) => { const v = String(p.score || 0); if (el.textContent !== v) el.textContent = v; });
  document.querySelectorAll("[data-waktu-babak]").forEach((el) => {
    el.querySelector(".a").textContent = st.status === "main" ? fmtWaktu(ms) : "--:--";
    el.classList.toggle("genting", st.status === "main" && !st.pausedAt && ms > 0 && ms <= 60000);
  });
  document.querySelectorAll("[data-timer-soal]").forEach((el) => {
    const mulai = lokal.qMulai[el.dataset.timerSoal];
    const total = Number(el.dataset.total) * 1000;
    const sisa = mulai ? Math.max(0, total - (Store.now() - mulai)) : total;
    el.firstElementChild.style.width = (sisa / total) * 100 + "%";
  });
  document.querySelectorAll("[data-final-sisa]").forEach((el) => {
    const fi = infoFinal(st);
    el.textContent = fi.selesai ? "0" : Math.ceil(fi.sisa / 1000);
  });
  // Pratinjau anggota regu di layar daftar
  const prev = document.querySelector("[data-pratinjau]");
  if (prev) {
    const sel = document.getElementById("pilihRegu");
    const id = sel && sel.value;
    const ang = id ? anggotaRegu(GAME.players, id) : [];
    const html = ang.length
      ? `<p class="label">Sudah masuk di Regu ${escapeHtml(cariRegu(id, GAME.config && GAME.config.custom).nama)} (${ang.length})</p><div class="bulat-anggota">${ang.map((a) => `<span class="chip">${escapeHtml(a.nama)}</span>`).join("")}</div>`
      : `<p class="catatan">Belum ada anggota di regu ini. Kamu yang pertama!</p>`;
    if (prev.dataset.isi !== html) { prev.dataset.isi = html; prev.innerHTML = html; }
  }
}

/* ---------- Efek samping (tandai selesai, kunci misi, beri poin misi) ---------- */
function sekali(kunci, fn) {
  if (lokal.sedang.has(kunci)) return;
  lokal.sedang.add(kunci);
  Promise.resolve(fn()).finally(() => setTimeout(() => lokal.sedang.delete(kunci), 1500));
}
function proses() {
  const p = saya();
  if (!p || !GAME) return;
  const st = GAME.state || {};
  const ans = p.ans || {};
  const done = p.done || {};
  [[1, SOAL_PILAH], [2, SOAL_KUIS], [3, SOAL_SKENARIO]].forEach(([b, pool]) => {
    if (!done[b] && pool.every((q) => ans[b] && ans[b][q.id])) sekali("done" + b, () => Store.set(G(`players/${PID}/done/${b}`), true));
  });
  if (!done[5] && SOAL_FINAL.every((q) => ans[5] && ans[5][q.id])) sekali("done5", () => Store.set(G(`players/${PID}/done/5`), true));

  // Misi regu
  const misiRegu = (GAME.misi || {})[p.regu] || {};
  SOAL_MISI.forEach((s) => {
    const m = misiRegu[s.id];
    if (m && m.locked) {
      if (!(ans[4] && ans[4][s.id])) sekali("misi" + s.id, () => simpanJawaban(PID, 4, s.id, !!m.benar, m.benar ? POIN.misiBenar : 0, { pilih: m.pilihan }));
      if (!lokal.misiTerkunci.has(s.id)) {
        lokal.misiTerkunci.add(s.id);
        if (st.babak === 4 && st.status === "main") Suara.efek(m.benar ? "misi" : "salah");
        if (st.babak === 4 && st.status === "main") toast(m.benar ? `Misi "${s.judul}" berhasil! +${POIN.misiBenar}` : `Misi "${s.judul}" terkunci, jawabannya kurang tepat`);
      }
    }
  });
  if (!done[4] && SOAL_MISI.every((s) => ans[4] && ans[4][s.id])) sekali("done4", () => Store.set(G(`players/${PID}/done/4`), true));
  if (st.status === "main" && st.babak === 4 && !st.pausedAt) {
    const cur = SOAL_MISI.find((s) => !(misiRegu[s.id] && misiRegu[s.id].locked));
    if (cur) sekali("cek" + cur.id + JSON.stringify((misiRegu[cur.id] || {}).votes || {}), () => cekKunciMisi(GAME, p.regu, cur.id));
  }
}

/* =========================================================
   TAMPILAN
   ========================================================= */

function viewDaftar(st) {
  const config = GAME.config || {};
  const daftar = reguAktif(config);
  const tutup = !!st.regLocked;
  const kelompok = ["Putra", "Putri", "Lainnya"].map((j) => {
    const r = daftar.filter((x) => x.jenis === j);
    return r.length ? `<optgroup label="Regu ${j}">${r.map((x) => `<option value="${x.id}" ${lokal.formRegu === x.id ? "selected" : ""}>${escapeHtml(x.nama)}</option>`).join("")}</optgroup>` : "";
  }).join("");
  const key = "daftar|" + JSON.stringify(daftar.map((d) => d.id)) + tutup + lokal.galat + lokal.sibuk;
  const reguAwal = cariRegu(lokal.formRegu || (daftar[0] && daftar[0].id), config.custom);
  const html = `
    <section class="sampul">
      ${MASKOT(72)}
      <h1>Misi Sampah</h1>
      <p>Penilaian Pramuka · Kelas 7</p>
    </section>
    <form class="kartu kartu-daftar" id="formDaftar" novalidate>
      <h2 style="font-size:22px">Gabung ke regumu</h2>
      ${tutup ? `<p class="galat">Pendaftaran sudah ditutup oleh pembina. Minta pembina membukanya kalau kamu belum masuk.</p>` : ""}
      <div class="kolom">
        <label class="label" for="pilihRegu">Pilih regu</label>
        <div class="pilih-regu">
          <span id="lencanaPratinjau">${daftar.length ? lencana(reguAwal, 52) : ""}</span>
          <select id="pilihRegu" class="isian" ${tutup ? "disabled" : ""}>${kelompok}</select>
        </div>
      </div>
      <div class="kolom">
        <label class="label" for="namaMurid">Nama kamu</label>
        <input id="namaMurid" class="isian" type="text" maxlength="20" autocomplete="off" placeholder="Contoh: Bima" value="${escapeHtml(lokal.formNama)}" ${tutup ? "disabled" : ""}>
        <span class="catatan">Maksimal 20 huruf. Tidak boleh sama dengan teman satu regu.</span>
      </div>
      ${lokal.galat ? `<p class="galat" role="alert">${escapeHtml(lokal.galat)}</p>` : ""}
      <button class="tombol" type="submit" ${tutup || lokal.sibuk ? "disabled" : ""}>${lokal.sibuk ? "Mendaftar…" : "Gabung"}</button>
    </form>
    <section class="isi" data-pratinjau></section>`;
  return {
    key, html,
    bind() {
      const sel = document.getElementById("pilihRegu");
      const nama = document.getElementById("namaMurid");
      sel.addEventListener("change", () => {
        lokal.formRegu = sel.value;
        document.getElementById("lencanaPratinjau").innerHTML = lencana(cariRegu(sel.value, config.custom), 52);
      });
      nama.addEventListener("input", () => (lokal.formNama = nama.value));
      document.getElementById("formDaftar").addEventListener("submit", (e) => { e.preventDefault(); daftar_(sel.value, nama.value); });
    }
  };
}

async function daftar_(reguId, namaMentah) {
  const nama = String(namaMentah || "").replace(/\s+/g, " ").trim();
  lokal.formRegu = reguId; lokal.formNama = nama;
  if (!reguId) { lokal.galat = "Pilih regumu dulu."; return render(); }
  if (nama.length < 2) { lokal.galat = "Tulis namamu (minimal 2 huruf)."; return render(); }
  if (nama.length > 20) { lokal.galat = "Nama maksimal 20 huruf."; return render(); }
  const st = (await Store.get(G("state"))) || {};
  if (st.regLocked) { lokal.galat = "Pendaftaran sudah ditutup."; return render(); }
  const players = (await Store.get(G("players"))) || {};
  const kembar = Object.values(players).some((p) => p && p.regu === reguId && String(p.nama).toLowerCase() === nama.toLowerCase());
  if (kembar) { lokal.galat = `Nama "${nama}" sudah dipakai di regu ini. Tambahkan inisial, misal "${nama} R".`; return render(); }
  lokal.sibuk = true; lokal.galat = ""; render();
  const pid = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  await Store.set(G(`players/${pid}`), { nama, regu: reguId, joinedAt: Store.now(), score: 0, online: true });
  simpanPID.setItem(KUNCI_PID(), pid);
  PID = pid;
  lokal.sibuk = false;
  Suara.efek("gabung");
  render();
}

function viewLobby(p) {
  const regu = reguSaya(p);
  const ang = anggotaRegu(GAME.players, p.regu);
  const key = "lobby|" + ang.map((a) => a.pid + a.nama).join(",");
  return {
    key,
    html: `
    <section class="sampul" style="padding-bottom:40px">
      ${lencana(regu, 96)}
      <h1 style="font-size:30px">Regu ${escapeHtml(regu.nama)}</h1>
      <p>Halo, ${escapeHtml(p.nama)}! Kamu sudah terdaftar.</p>
    </section>
    <section class="isi">
      <div class="kartu" style="display:flex;flex-direction:column;gap:10px">
        <p class="label">Anggota regu (${ang.length})</p>
        <div class="bulat-anggota">${ang.map((a) => `<span class="chip ${a.pid === PID ? "saya" : ""}">${escapeHtml(a.nama)}</span>`).join("")}</div>
      </div>
      <div class="kartu tengah" style="display:flex;flex-direction:column;gap:8px">
        ${MASKOT(64)}
        <h2 style="font-size:22px">Tunggu aba-aba pembina</h2>
        <p class="catatan">Permainan dimulai bersamaan untuk semua regu. Jangan tutup halaman ini ya!</p>
      </div>
    </section>`
  };
}

function viewJeda() {
  return { key: "jeda", html: `<div class="lapisan">${MASKOT(88)}<h2>Permainan dijeda</h2><p>Dengarkan arahan kakak pembina.</p></div>` };
}

function viewHabis(st, p) {
  return {
    key: "habis|" + st.babak,
    html: `${kepala(p, `BABAK ${st.babak} DARI 5`, BABAK[st.babak].nama)}
    <section class="isi tengah">${MASKOT(88)}<h2 style="font-size:28px">Waktu habis!</h2><p>Jawabanmu sudah tersimpan. Lihat klasemen di layar depan.</p></section>`
  };
}

function viewAntara(st, p) {
  const regu = reguSaya(p);
  const daftar = hitungRegu(GAME);
  const r = daftar.find((x) => x.id === p.regu);
  const berikut = st.babak < 5 ? BABAK[st.babak + 1].nama : null;
  return {
    key: `antara|${st.babak}|${p.score}|${r && r.rank}`,
    html: `
    <section class="sampul" style="padding-bottom:40px">
      ${MASKOT(72)}
      <h1 style="font-size:28px">Babak ${st.babak} selesai!</h1>
      <p>${BABAK[st.babak].nama}</p>
    </section>
    <section class="isi">
      <div class="kartu tengah" style="display:flex;flex-direction:column;gap:6px">
        <p class="label">Skormu sejauh ini</p>
        <div class="angka-besar">${p.score || 0}</div>
      </div>
      <div class="kartu" style="display:flex;align-items:center;gap:14px">
        ${lencana(regu, 56)}
        <div><p class="label">Regu ${escapeHtml(regu.nama)}</p><p style="font-family:var(--judul);font-size:24px;font-weight:800">Peringkat ${r ? r.rank : "-"} dari ${daftar.length}</p></div>
      </div>
      ${berikut ? `<p class="catatan" style="text-align:center">Berikutnya: <strong>${berikut}</strong>. Tunggu aba-aba pembina.</p>` : ""}
    </section>`
  };
}

function viewSelesai(p) {
  const regu = reguSaya(p);
  const daftar = hitungRegu(GAME);
  const r = daftar.find((x) => x.id === p.regu);
  return {
    key: `selesai|${p.score}|${r && r.rank}`,
    html: `
    <section class="sampul" style="padding-bottom:40px">
      ${lencana(regu, 96)}
      <h1 style="font-size:30px">Misi selesai!</h1>
      <p>Terima kasih sudah bermain, ${escapeHtml(p.nama)}.</p>
    </section>
    <section class="isi">
      <div class="kartu tengah" style="display:flex;flex-direction:column;gap:6px">
        <p class="label">Skor akhirmu</p><div class="angka-besar">${p.score || 0}</div>
      </div>
      <div class="kartu tengah" style="display:flex;flex-direction:column;gap:6px">
        <p class="label">Regu ${escapeHtml(regu.nama)}</p>
        <div class="angka-besar" style="font-size:40px">Peringkat ${r ? r.rank : "-"}</div>
        <p class="catatan">dari ${daftar.length} regu</p>
      </div>
      <p class="catatan" style="text-align:center">Ingat: pilah sampahmu mulai hari ini!</p>
    </section>`
  };
}

/* ---------- BABAK 1: PILAH ---------- */
function viewPilah(st, p) {
  const urut = acak(SOAL_PILAH, PID + "|1");
  const ans = (p.ans && p.ans[1]) || {};
  const sudah = Object.keys(ans).length;
  const persen = Math.round((sudah / urut.length) * 100);
  let item = lokal.umpan && lokal.umpan.babak === 1 ? SOAL_PILAH.find((x) => x.id === lokal.umpan.id) : urut.find((x) => !ans[x.id]);
  const head = kepala(p, `BABAK 1 DARI 5 · ${Math.min(sudah + 1, urut.length)}/${urut.length}`, "Pilah Sampah", persen);
  if (!item) {
    return { key: "pilah|selesai", html: `${head}<section class="isi tengah">${MASKOT(88)}<h2 style="font-size:26px">Kamu sudah memilah semua sampah!</h2><p>Tunggu teman-temanmu dan aba-aba pembina.</p></section>` };
  }
  const u = lokal.umpan && lokal.umpan.babak === 1 ? lokal.umpan : null;
  const key = `pilah|${item.id}|${u ? "u" : ""}|${lokal.kombo}`;
  const ikonTong = {
    organik: `<path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z"/><path d="M5 19l7-7"/>`,
    anorganik: `<path d="M7 4l-3 5h5"/><path d="M4 9a8 8 0 0 0 13 6"/><path d="M17 20l3-5h-5"/><path d="M20 15A8 8 0 0 0 7 9"/>`,
    b3: `<path d="M12 3l9 16H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>`,
    residu: `<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>`
  };
  return {
    key,
    html: `${head}
    <section class="isi">
      <div class="kartu benda">
        ${lokal.kombo >= 2 ? `<span class="pita-kombo">Kombo x${lokal.kombo}</span>` : ""}
        <div class="ikon" aria-hidden="true">${item.ikon}</div>
        <h2>${escapeHtml(item.nama)}</h2>
        <p class="catatan">Masuk ke tong yang mana?</p>
      </div>
      <div class="grid-tong">
        ${Object.entries(TONG).map(([k, t]) => `<button type="button" class="tong ${k}" data-tong="${k}" style="background:${t.warna};color:${t.teks}" ${u ? "disabled" : ""}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ikonTong[k]}</svg>${t.nama}</button>`).join("")}
      </div>
      ${u ? `<div class="umpan ${u.benar ? "ya" : "tidak"}"><div><div class="j">${u.judul}</div><div class="k">${escapeHtml(u.info)}</div></div></div>` : ""}
    </section>`,
    bind() {
      document.querySelectorAll("[data-tong]").forEach((b) => b.addEventListener("click", () => jawabPilah(item, b.dataset.tong)));
    }
  };
}
async function jawabPilah(item, tong) {
  if (lokal.sibuk) return;
  lokal.sibuk = true;
  const p = saya();
  const benar = item.tong === tong;
  const poin = benar ? POIN.pilahBenar + Math.min(POIN.komboMaks, POIN.komboPer * lokal.kombo) : 0;
  lokal.kombo = benar ? lokal.kombo + 1 : 0;
  if (!benar) Suara.efek("salah");
  else if (lokal.kombo % 5 === 0) Suara.efek("kombo", lokal.kombo);
  else Suara.efek("benar");
  lokal.umpan = {
    babak: 1, id: item.id, benar,
    judul: benar ? `Benar! +${poin}` : "Kurang tepat",
    info: benar ? item.info : `${item.nama} masuk tong ${TONG[item.tong].nama}. ${item.info}`
  };
  render();
  await simpanJawaban(PID, 1, item.id, benar, poin, { pilih: tong });
  if (benar && lokal.kombo > 0 && lokal.kombo % 5 === 0) kabar(`${p.nama} (${reguSaya(p).nama}) kombo x${lokal.kombo} di Pilah Sampah!`, "kombo");
  setTimeout(() => { lokal.umpan = null; lokal.sibuk = false; render(); }, benar ? 800 : 1800);
}

/* ---------- BABAK 2 & 3: KUIS / SKENARIO ---------- */
function viewSoal(st, p, b) {
  const pool = b === 2 ? SOAL_KUIS : SOAL_SKENARIO;
  const urut = acak(pool, PID + "|" + b);
  const ans = (p.ans && p.ans[b]) || {};
  const sudah = Object.keys(ans).length;
  const u = lokal.umpan && lokal.umpan.babak === b ? lokal.umpan : null;
  const q = u ? pool.find((x) => x.id === u.id) : urut.find((x) => !ans[x.id]);
  const head = kepala(p, `BABAK ${b} DARI 5 · SOAL ${Math.min(sudah + 1, urut.length)}/${urut.length}`, BABAK[b].nama, Math.round((sudah / urut.length) * 100));
  if (!q) return { key: `soal${b}|selesai`, html: `${head}<section class="isi tengah">${MASKOT(88)}<h2 style="font-size:26px">Semua soal sudah kamu jawab!</h2><p>Tunggu teman-temanmu dan aba-aba pembina.</p></section>` };
  if (!lokal.qMulai[q.id]) lokal.qMulai[q.id] = Store.now();
  // waktu per soal habis
  if (!u && !lokal.sibuk && Store.now() - lokal.qMulai[q.id] >= POIN.waktuSoal * 1000) setTimeout(() => jawabSoal(b, q, -1), 0);
  const urutPil = urutanPilihan(q.pilihan.length, PID + "|" + q.id);
  const key = `soal${b}|${q.id}|${u ? "u" : ""}`;
  return {
    key,
    html: `${head}
    <section class="isi">
      <div class="timer-soal" data-timer-soal="${q.id}" data-total="${POIN.waktuSoal}"><div style="width:100%"></div></div>
      <div class="kartu"><p class="soal">${escapeHtml(q.tanya)}</p></div>
      <div class="daftar-pilihan">
        ${urutPil.map((orig, i) => {
          let cls = "";
          if (u) { if (orig === 0) cls = "benar"; else if (orig === u.pilih) cls = "salah"; }
          return `<button type="button" class="pilihan ${cls}" data-orig="${orig}" ${u ? "disabled" : ""}><span class="huruf">${HURUF[i]}</span>${escapeHtml(q.pilihan[orig])}</button>`;
        }).join("")}
      </div>
      ${u ? `<div class="umpan ${u.benar ? "ya" : "tidak"}">${u.benar ? MASKOT(44) : ""}<div><div class="j">${u.judul}</div><div class="k">${escapeHtml(q.info)}</div></div></div>` : ""}
    </section>`,
    bind() {
      document.querySelectorAll("[data-orig]").forEach((btn) => btn.addEventListener("click", () => jawabSoal(b, q, Number(btn.dataset.orig))));
    }
  };
}
async function jawabSoal(b, q, orig) {
  if (lokal.sibuk) return;
  lokal.sibuk = true;
  const p = saya();
  const lama = Store.now() - (lokal.qMulai[q.id] || Store.now());
  const benar = orig === 0;
  const cepat = Math.max(0, 1 - lama / (POIN.waktuSoal * 1000));
  const poin = benar ? POIN.soalBenar + Math.round(POIN.bonusCepatMaks * cepat) : 0;
  Suara.efek(benar ? "benar" : "salah");
  lokal.umpan = { babak: b, id: q.id, benar, pilih: orig, judul: benar ? `Benar! +${poin}` : orig === -1 ? "Waktu soal habis" : "Kurang tepat" };
  render();
  await simpanJawaban(PID, b, q.id, benar, poin, { pilih: orig, lama });
  if (benar && lama < 3000) kabar(`${p.nama} (${reguSaya(p).nama}) menjawab kilat! +${poin}`, "kilat");
  setTimeout(() => { lokal.umpan = null; lokal.sibuk = false; render(); }, benar ? 1400 : 2400);
}

/* ---------- BABAK 4: MISI REGU ---------- */
function viewMisi(st, p) {
  const ang = anggotaRegu(GAME.players, p.regu);
  const i = Math.max(0, ang.findIndex((a) => a.pid === PID));
  const data = (GAME.misi || {})[p.regu] || {};
  const selesai = SOAL_MISI.filter((s) => data[s.id] && data[s.id].locked).length;
  const cur = SOAL_MISI.find((s) => !(data[s.id] && data[s.id].locked));
  const kecil = `BABAK 4 DARI 5 · MISI ${Math.min(selesai + 1, SOAL_MISI.length)}/${SOAL_MISI.length}`;
  if (!cur) {
    const ringkas = SOAL_MISI.map((s) => `<div class="kartu" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px"><strong>${escapeHtml(s.judul)}</strong><span style="font-weight:800;color:${data[s.id].benar ? "var(--hutan)" : "var(--merah)"}">${data[s.id].benar ? "Berhasil" : "Kurang tepat"}</span></div>`).join("");
    return { key: "misi|selesai|" + SOAL_MISI.map((s) => data[s.id].benar).join(), html: `${kepala(p, kecil, "Misi Regu", 100, true)}<section class="isi"><div class="tengah" style="display:flex;flex-direction:column;gap:6px">${MASKOT(72)}<h2 style="font-size:24px">Semua misi regumu selesai!</h2></div>${ringkas}</section>` };
  }
  const petunjuk = petunjukUntuk(i, ang.length);
  const urutPil = urutanPilihan(cur.pilihan.length, p.regu + "|" + cur.id);
  const votes = (data[cur.id] && data[cur.id].votes) || {};
  const pilihanku = votes[PID];
  const aktif = ang.filter((a) => a.online !== false);
  const sudahPilih = aktif.filter((a) => votes[a.pid] !== undefined && votes[a.pid] !== null).length;
  const semua = sudahPilih === aktif.length && aktif.length > 0;
  const hitung = {};
  Object.values(votes).forEach((v) => (hitung[v] = (hitung[v] || 0) + 1));
  const key = `misi|${cur.id}|${JSON.stringify(votes)}|${ang.map((a) => a.pid + (a.online !== false)).join(",")}`;
  return {
    key,
    html: `${kepala(p, kecil, `Misi: ${escapeHtml(cur.judul)}`, Math.round((selesai / SOAL_MISI.length) * 100), true)}
    <section class="isi">
      ${petunjuk.map((j) => `<div class="petunjuk"><span class="k">PETUNJUK RAHASIAMU (${j + 1} dari 5)</span><p class="t">${escapeHtml(cur.petunjuk[j])}</p></div>`).join("")}
      <p class="catatan">Teman seregumu memegang petunjuk lain. Ceritakan petunjukmu, lalu sepakati satu jawaban!</p>
      <div class="kartu" style="display:flex;flex-direction:column;gap:10px">
        <p style="font-weight:800">${escapeHtml(cur.tanya)}</p>
        <div class="daftar-pilihan">
          ${urutPil.map((orig, k) => `<button type="button" class="pilihan ${pilihanku === orig ? "dipilih" : ""}" data-orig="${orig}"><span class="huruf">${HURUF[k]}</span><span>${escapeHtml(cur.pilihan[orig])}</span>${hitung[orig] ? `<span class="suara">${hitung[orig]} suara</span>` : ""}</button>`).join("")}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <p class="label">Sudah memilih: ${sudahPilih}/${aktif.length} anggota</p>
        <div class="bulat-anggota">${ang.map((a) => `<span class="bulat ${votes[a.pid] !== undefined && votes[a.pid] !== null ? "ok" : ""} ${a.online === false ? "offline" : ""}" title="${escapeHtml(a.nama)}">${escapeHtml(a.nama.slice(0, 6))}</span>`).join("")}</div>
        <p class="catatan">${semua ? "<strong style=\"color:var(--merah)\">Belum sepakat!</strong> Diskusikan lagi sampai semua memilih jawaban yang sama." : "Jawaban terkunci otomatis kalau semua anggota memilih jawaban yang sama."}</p>
      </div>
    </section>`,
    bind() {
      document.querySelectorAll("[data-orig]").forEach((btn) => btn.addEventListener("click", async () => {
        Suara.efek("klik");
        await Store.set(G(`misi/${p.regu}/${cur.id}/votes/${PID}`), Number(btn.dataset.orig));
        const g = await Store.get(G());
        cekKunciMisi(g || {}, p.regu, cur.id);
      }));
    }
  };
}

/* ---------- BABAK 5: FINAL ---------- */
function viewFinal(st, p) {
  const fi = infoFinal(st);
  const head = kepala(p, "BABAK 5 · POIN GANDA", "Final", null);
  if (fi.selesai) return { key: "final|selesai", html: `${head}<section class="isi tengah">${MASKOT(88)}<h2 style="font-size:26px">Final selesai!</h2><p>Lihat klasemen akhir di layar depan.</p></section>` };
  const q = fi.soal;
  const urutPil = urutanPilihan(q.pilihan.length, "final|" + q.id);
  const a = p.ans && p.ans[5] && p.ans[5][q.id];
  const key = `final|${fi.idx}|${fi.fase}|${a ? a.pilih : "-"}`;
  const nomor = `<p class="label">Soal ${fi.idx + 1} dari ${SOAL_FINAL.length} · <span data-final-sisa>${Math.ceil(fi.sisa / 1000)}</span> detik</p>`;
  if (fi.fase === "jawab" && !a) {
    return {
      key,
      html: `${head}<section class="isi">${nomor}
        <div class="kartu"><p class="soal">${escapeHtml(q.tanya)}</p></div>
        <div class="daftar-pilihan">${urutPil.map((orig, k) => `<button type="button" class="pilihan" data-orig="${orig}"><span class="huruf">${HURUF[k]}</span>${escapeHtml(q.pilihan[orig])}</button>`).join("")}</div>
      </section>`,
      bind() {
        document.querySelectorAll("[data-orig]").forEach((btn) => btn.addEventListener("click", async () => {
          if (lokal.sibuk) return;
          lokal.sibuk = true;
          const info = infoFinal(GAME.state);
          if (info.selesai || info.idx !== fi.idx || info.fase !== "jawab") { lokal.sibuk = false; return; }
          const orig = Number(btn.dataset.orig);
          const benar = orig === 0;
          Suara.efek("kirim");
          const poin = benar ? POIN.finalBenar + Math.round(POIN.finalCepatMaks * (info.sisa / (FINAL_JAWAB * 1000))) : 0;
          await simpanJawaban(PID, 5, q.id, benar, poin, { pilih: orig });
          if (benar && FINAL_JAWAB * 1000 - info.sisa < 3000) kabar(`${p.nama} (${reguSaya(p).nama}) kilat di babak final! +${poin}`, "kilat");
          lokal.sibuk = false;
        }));
      }
    };
  }
  if (fi.fase === "jawab") {
    return { key, html: `${head}<section class="isi tengah">${nomor}${MASKOT(80)}<h2 style="font-size:24px">Jawaban terkirim!</h2><p>Lihat layar depan. Jawaban benar muncul sebentar lagi.</p></section>` };
  }
  const benar = a && a.c;
  return {
    key,
    html: `${head}<section class="isi">${nomor}
      <div class="kartu"><p class="soal">${escapeHtml(q.tanya)}</p></div>
      <div class="daftar-pilihan">${urutPil.map((orig, k) => {
        const cls = orig === 0 ? "benar" : a && a.pilih === orig ? "salah" : "";
        return `<div class="pilihan ${cls}"><span class="huruf">${HURUF[k]}</span>${escapeHtml(q.pilihan[orig])}</div>`;
      }).join("")}</div>
      <div class="umpan ${benar ? "ya" : "tidak"}"><div><div class="j">${!a ? "Tidak menjawab" : benar ? `Benar! +${a.p}` : "Kurang tepat"}</div><div class="k">${escapeHtml(q.info)}</div></div></div>
    </section>`
  };
}
