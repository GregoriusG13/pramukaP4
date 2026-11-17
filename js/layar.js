/* =========================================================
   LAYAR PROYEKTOR
   ========================================================= */

const $ = (id) => document.getElementById(id);
let GAME = {};
let beku = null;                 // salinan klasemen saat dibekukan
const barisEl = new Map();       // id regu -> elemen baris
const rankLama = new Map();
const skorLama = new Map();
const gerak = new Map();         // id regu -> {d, sampai}
let pemimpinLama = null;
const kabarLokal = [];
let kabarPemimpin = 0;
let qrDibuat = false;

if (DEMO_MODE) document.body.insertAdjacentHTML("beforeend", '<div class="pita-demo">MODE DEMO</div>');

Store.on(G(), (g) => { GAME = g || {}; render(); });

/* ---------- Suara ---------- */
const tombolSuara = $("tombolSuara");
function perbaruiTombolSuara() {
  tombolSuara.classList.toggle("besar", !Suara.aktif);
  tombolSuara.classList.toggle("bisu", Suara.aktif && !Suara.nyala);
  tombolSuara.setAttribute("aria-label", !Suara.aktif ? "Nyalakan musik" : Suara.nyala ? "Matikan suara" : "Nyalakan suara");
}
tombolSuara.addEventListener("click", () => {
  if (!Suara.aktif) { Suara.siap(); if (!Suara.nyala) Suara.setNyala(true); jejak.musik = null; }
  else Suara.setNyala(!Suara.nyala);
  perbaruiTombolSuara();
});
perbaruiTombolSuara();

const jejak = { awal: true, status: null, babak: null, jeda: false, beku: false, detik: null, murid: 0, feedT: 0, finalKey: null, finalDetik: null, musik: null, bunyiT: 0 };
function efekLayar(st) {
  const b = st.babak || 0;
  const murid = Object.values(GAME.players || {}).filter((p) => p && p.nama).length;
  const feed = Object.values(GAME.feed || {}).filter(Boolean);
  const feedT = feed.reduce((m, k) => Math.max(m, k.t || 0), 0);
  // musik latar
  let jenis = null;
  if (st.status === "main") jenis = st.pausedAt ? null : b === 5 ? "final" : "main";
  else jenis = "santai";
  if (Suara.aktif && jenis !== jejak.musik) { jejak.musik = jenis; Suara.musik(jenis); }

  if (jejak.awal) { Object.assign(jejak, { awal: false, status: st.status, babak: b, jeda: !!st.pausedAt, beku: !!st.freeze, murid, feedT }); return; }

  const kini = Date.now();
  const boleh = () => kini - jejak.bunyiT > 1200 && (jejak.bunyiT = kini);
  if (st.status === "main" && (jejak.status !== "main" || jejak.babak !== b)) Suara.efek("mulai");
  if (jejak.status === "main" && st.status === "antara" && jejak.detik !== 0) Suara.efek("habis");
  if (st.status === "selesai" && jejak.status !== "selesai") Suara.efek("juara");
  if (st.freeze && !jejak.beku) Suara.efek("dramatis");
  if (st.status === "lobby" && murid > jejak.murid) Suara.efek("gabung");

  // hitung mundur 10 detik terakhir
  if (st.status === "main" && b !== 5 && !st.pausedAt) {
    const d = Math.ceil(sisaMs(st) / 1000);
    if (d !== jejak.detik) {
      if (d > 0 && d <= 10) Suara.efek("detikAkhir");
      else if (d === 0 && jejak.detik > 0) Suara.efek("habis");
      jejak.detik = d;
    }
  } else jejak.detik = null;

  // babak final
  if (st.status === "main" && b === 5 && !st.pausedAt) {
    const fi = infoFinal(st);
    const k = fi.selesai ? "selesai" : fi.idx + fi.fase;
    if (k !== jejak.finalKey) {
      if (!fi.selesai && fi.fase === "jawab" && jejak.finalKey) Suara.efek("kirim");
      if (!fi.selesai && fi.fase === "bahas") Suara.efek("ungkap");
      jejak.finalKey = k;
    }
    const d = fi.selesai ? 0 : Math.ceil(fi.sisa / 1000);
    if (!fi.selesai && fi.fase === "jawab" && d !== jejak.finalDetik && d <= 5 && d > 0) Suara.efek("detik");
    jejak.finalDetik = d;
  }

  // kabar baru
  if (feedT > jejak.feedT) {
    const baru = feed.filter((k) => k.t > jejak.feedT);
    if (baru.some((k) => k.tipe === "regu")) { if (boleh()) Suara.efek("misi"); }
    else if (baru.some((k) => k.tipe === "kilat" || k.tipe === "kombo")) { if (boleh()) Suara.efek("klik"); }
  }
  Object.assign(jejak, { status: st.status, babak: b, jeda: !!st.pausedAt, beku: !!st.freeze, murid, feedT });
}
setInterval(render, 250);

function tampilkan(id) {
  ["vLobi", "vKlasemen", "vFinal", "vPodium"].forEach((v) => $(v).classList.toggle("tersembunyi", v !== id));
}
function setTeks(el, teks) { if (el.textContent !== String(teks)) el.textContent = teks; }
function setHtml(el, html) { if (el.dataset.k !== html) { el.dataset.k = html; el.innerHTML = html; } }

function render() {
  const st = GAME.state || { status: "lobby" };
  const b = st.babak || 0;
  efekLayar(st);
  $("lapisJeda").classList.toggle("tersembunyi", !(st.status === "main" && st.pausedAt));

  // waktu
  const tampakWaktu = st.status === "main" && b !== 5;
  $("kotakWaktu").classList.toggle("tersembunyi", !tampakWaktu);
  if (tampakWaktu) {
    const ms = sisaMs(st);
    setTeks($("waktu"), fmtWaktu(ms));
    $("kotakWaktu").classList.toggle("genting", ms <= 60000);
    $("kotakWaktu").classList.toggle("sangat", ms <= 10000 && ms > 0 && !st.pausedAt);
  }

  if (st.status === "selesai") {
    setTeks($("judul"), "Misi Sampah");
    setTeks($("subjudul"), "Klasemen akhir");
    tampilkan("vPodium");
    renderPodium();
  } else if (st.status === "main" && b === 5) {
    setTeks($("judul"), "Babak Final");
    setTeks($("subjudul"), "Poin ganda · jawab di HP masing-masing");
    tampilkan("vFinal");
    renderFinal(st);
  } else if (st.status === "main" || st.status === "antara") {
    setTeks($("judul"), "Klasemen Misi Sampah");
    setTeks($("subjudul"), st.status === "main" ? `Babak ${b} dari 5 · ${BABAK[b].nama}` : `Babak ${b} selesai`);
    tampilkan("vKlasemen");
    renderKlasemen(st);
  } else {
    setTeks($("judul"), "Misi Sampah");
    setTeks($("subjudul"), "Penilaian Pramuka Kelas 7 · Ayo bergabung!");
    tampilkan("vLobi");
    renderLobi();
  }
}

/* ---------- Lobi ---------- */
function renderLobi() {
  if (!qrDibuat) {
    qrDibuat = true;
    const link = new URL(`index.html?s=${SESI}`, location.href).href;
    $("linkMurid").textContent = link;
    if (window.QRCode) new QRCode($("qr"), { text: link, width: 512, height: 512, correctLevel: QRCode.CorrectLevel.M });
    else $("qr").innerHTML = `<span style="color:#1B2A1F;font-weight:800;text-align:center">Kode sesi: ${SESI}</span>`;
  }
  const data = hitungRegu(GAME).slice().sort((a, b) => a.regu.nama.localeCompare(b.regu.nama));
  const murid = data.reduce((a, r) => a + r.jumlah, 0);
  setTeks($("jumlahLobi"), data.length ? `${data.length} regu · ${murid} murid sudah bergabung` : "Menunggu regu pertama bergabung…");
  setHtml($("gridLobi"), data.map((r) => `<div class="kartu-lobi">${lencana(r.regu, 64)}<span class="n">${escapeHtml(r.regu.nama)}</span><span class="j">${r.jumlah} anggota</span></div>`).join(""));
}

/* ---------- Klasemen ---------- */
function renderKlasemen(st) {
  let data = hitungRegu(GAME);
  if (st.freeze) { if (!beku) beku = data; data = beku; } else beku = null;

  // spanduk
  let spanduk = "";
  if (st.freeze) spanduk = "Klasemen dibekukan… siapa juaranya?";
  else if (st.status === "antara") spanduk = st.babak >= 5 ? "Final selesai! Tunggu pengumuman juara dari pembina" : `Babak ${st.babak} selesai! Bersiap untuk ${BABAK[st.babak + 1].nama}`;
  $("spanduk").classList.toggle("tersembunyi", !spanduk);
  setTeks($("spanduk"), spanduk);

  // perubahan peringkat
  const kini = Store.now();
  data.forEach((r) => {
    const lama = rankLama.get(r.id);
    if (lama && lama !== r.rank) gerak.set(r.id, { d: lama - r.rank, sampai: kini + 8000 });
    rankLama.set(r.id, r.rank);
  });
  if (data[0] && pemimpinLama && pemimpinLama !== data[0].id && kini - kabarPemimpin > 20000) {
    kabarPemimpin = kini;
    if (!st.freeze) Suara.efek("naik");
    kabarLokal.unshift({ teks: `Regu ${data[0].regu.nama} merebut posisi 1!`, tipe: "regu", t: kini });
  }
  if (data[0]) pemimpinLama = data[0].id;

  // papan top 10
  const papan = $("papan");
  const top = data.slice(0, 10);
  const maks = Math.max(1, ...data.map((r) => r.total));
  const ada = new Set();
  top.forEach((r, i) => {
    ada.add(r.id);
    let el = barisEl.get(r.id);
    if (!el) {
      el = document.createElement("div");
      el.className = "baris";
      el.innerHTML = `<span class="rk"></span>${lencana(r.regu, 48)}<span class="nm"><b>${escapeHtml(r.regu.nama)}</b><span></span></span><span class="bar"><div style="width:0"></div></span><span class="sk"></span><span class="gr"></span>`;
      el.style.top = "100%";
      papan.appendChild(el);
      barisEl.set(r.id, el);
      el.getBoundingClientRect();
    }
    el.style.top = `${i * 10}%`;
    el.classList.toggle("juara", i === 0);
    setTeks(el.querySelector(".rk"), r.rank);
    setTeks(el.querySelector(".nm span"), `${r.jumlah} anggota · MVP ${r.mvp}`);
    el.querySelector(".bar div").style.width = `${Math.max(2, Math.round((r.total / maks) * 100))}%`;
    setTeks(el.querySelector(".sk"), r.total);
    const g = gerak.get(r.id);
    const gr = el.querySelector(".gr");
    if (g && g.sampai > kini) { setTeks(gr, (g.d > 0 ? "▲ " : "▼ ") + Math.abs(g.d)); gr.className = "gr " + (g.d > 0 ? "naik" : "turun"); }
    else { setTeks(gr, ""); gr.className = "gr"; }
    const sl = skorLama.get(r.id);
    if (sl !== undefined && r.total > sl) { el.classList.add("kilau"); setTimeout(() => el.classList.remove("kilau"), 900); }
    skorLama.set(r.id, r.total);
  });
  barisEl.forEach((el, id) => { if (!ada.has(id)) { el.remove(); barisEl.delete(id); } });

  // pita berjalan (peringkat 11 dst.)
  const sisa = data.slice(10);
  $("pita").classList.toggle("tersembunyi", !sisa.length);
  const isi = $("pitaIsi");
  if (isi.childElementCount !== sisa.length * 2) {
    isi.innerHTML = "";
    for (let k = 0; k < sisa.length * 2; k++) {
      const s = document.createElement("span");
      s.className = "it";
      s.innerHTML = `<span class="t"></span> <span class="s"></span>`;
      isi.appendChild(s);
    }
    isi.style.setProperty("--durasi", Math.max(20, sisa.length * 3) + "s");
  }
  [...isi.children].forEach((s, k) => {
    const r = sisa[k % sisa.length];
    if (!r) return;
    setTeks(s.querySelector(".t"), `${r.rank}. ${r.regu.nama}`);
    setTeks(s.querySelector(".s"), r.total);
    const g = gerak.get(r.id);
    s.classList.toggle("kilau", !!(g && g.sampai > kini && g.d > 0));
  });

  // kabar
  const warna = { kilat: "#8FE3A3", kombo: "#8FE3A3", regu: "#F2B632", pembina: "#FFFFFF", babak: "#9FD3F5", info: "#BFE3C7" };
  const semua = Object.values(GAME.feed || {}).concat(kabarLokal).filter(Boolean).sort((a, b) => b.t - a.t).slice(0, 7);
  setHtml($("kabar"), semua.length
    ? semua.map((k) => `<div class="item-kabar" style="--warna:${warna[k.tipe] || "#BFE3C7"}"><span>${escapeHtml(k.teks)}</span></div>`).join("")
    : `<p style="color:#BFE3C7">Belum ada aksi. Ayo mulai!</p>`);
  if (kabarLokal.length > 20) kabarLokal.length = 20;
}

/* ---------- Final ---------- */
function renderFinal(st) {
  const fi = infoFinal(st);
  const players = Object.values(GAME.players || {}).filter((p) => p && p.nama);
  if (fi.selesai) {
    setTeks($("finalNo"), "Final selesai");
    setTeks($("finalHitung"), "");
    setTeks($("finalTanya"), "Semua soal final sudah dijawab!");
    setHtml($("finalPilihan"), "");
    setTeks($("finalInfo"), "Pembina akan menampilkan klasemen akhir.");
  } else {
    const q = fi.soal;
    const urut = urutanPilihan(q.pilihan.length, "final|" + q.id);
    const jawab = players.map((p) => p.ans && p.ans[5] && p.ans[5][q.id]).filter(Boolean);
    setTeks($("finalNo"), `Soal ${fi.idx + 1} dari ${SOAL_FINAL.length}`);
    setTeks($("finalHitung"), fi.fase === "jawab" ? Math.ceil(fi.sisa / 1000) : "");
    setTeks($("finalTanya"), q.tanya);
    const html = urut.map((orig, k) => {
      let cls = "", pc = "";
      if (fi.fase === "bahas") {
        cls = orig === 0 ? "benar" : "redup";
        const n = jawab.filter((a) => a.pilih === orig).length;
        pc = jawab.length ? `<span class="pc">${Math.round((n / jawab.length) * 100)}%</span>` : "";
      }
      return `<div class="opsi ${cls}"><span class="hf">${"ABCD"[k]}</span><span>${escapeHtml(q.pilihan[orig])}</span>${pc}</div>`;
    }).join("");
    setHtml($("finalPilihan"), html);
    if (fi.fase === "jawab") setTeks($("finalInfo"), `${jawab.length} dari ${players.length} murid sudah menjawab`);
    else {
      const benar = jawab.filter((a) => a.c).length;
      setTeks($("finalInfo"), `${q.info} · ${jawab.length ? Math.round((benar / jawab.length) * 100) : 0}% menjawab benar`);
    }
  }
  const top = (st.freeze && beku) ? beku : hitungRegu(GAME);
  setHtml($("miniPapan"), top.slice(0, 5).map((r) => `<div class="mini"><b>${r.rank}</b>${lencana(r.regu, 40)}<span>${escapeHtml(r.regu.nama)}</span><span class="s">${r.total}</span></div>`).join(""));
}

/* ---------- Podium ---------- */
function renderPodium() {
  const data = hitungRegu(GAME);
  const urut = [data[1], data[0], data[2]];
  const kelas = ["j2", "j1", "j3"];
  const nomor = [2, 1, 3];
  setHtml($("podium"), urut.map((r, i) => r ? `<div class="tiang ${kelas[i]}">${lencana(r.regu, 120)}<span class="n">Regu ${escapeHtml(r.regu.nama)}</span><span class="s">${r.total} poin</span><div class="blok">${nomor[i]}</div></div>` : "").join(""));
  setHtml($("sisaPodium"), data.slice(3).map((r) => `<span>${r.rank}. ${escapeHtml(r.regu.nama)} (${r.total})</span>`).join(""));
}
