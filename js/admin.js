/* =========================================================
   PANEL PEMBINA
   ========================================================= */

const $ = (id) => document.getElementById(id);
let GAME = {};
const terbuka = new Set();   // regu yang sedang dibuka "Kelola"
let qrTeks = "";

/* ---------- Gerbang PIN ---------- */
if (sessionStorage.getItem("misiSampahAdmin") === "ok") mulai();
$("formPin").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("pin").value === ADMIN_PIN) { sessionStorage.setItem("misiSampahAdmin", "ok"); mulai(); }
  else $("pinGalat").classList.remove("tersembunyi");
});

function mulai() {
  $("gerbang").classList.add("tersembunyi");
  $("panel").classList.remove("tersembunyi");
  if (DEMO_MODE) { $("blokDemo").classList.remove("tersembunyi"); document.body.insertAdjacentHTML("beforeend", '<div class="pita-demo">MODE DEMO</div>'); }
  localStorage.setItem("misiSampahSesi", SESI);
  const dasar = location.href.split("?")[0].replace(/admin\.html$/, "");
  const linkMurid = `${dasar}index.html?s=${SESI}`;
  $("linkMurid").href = linkMurid;
  $("linkMurid").textContent = linkMurid;
  $("linkLayar").href = `${dasar}layar.html?s=${SESI}`;
  $("kodeSesi").textContent = SESI;
  $("inputSesi").value = SESI;
  buatQR(linkMurid);
  pasangTombol();
  siapkanSesi();
  Store.on(G(), (g) => { GAME = g || {}; renderSemua(); });
  setInterval(detak, 500);
  if (DEMO_MODE) setInterval(detakBot, 1200);
}

function buatQR(teks) {
  if (qrTeks === teks) return;
  qrTeks = teks;
  $("qr").innerHTML = "";
  if (window.QRCode) new QRCode($("qr"), { text: teks, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.M });
  else $("qr").innerHTML = '<span class="catatan" style="text-align:center">QR butuh internet. Bagikan link di samping.</span>';
}

async function siapkanSesi() {
  const st = await Store.get(G("state"));
  if (!st) {
    await Store.update(G(), {
      state: { status: "lobby", babak: 0, regLocked: false, freeze: false },
      config: { regu: REGU.map((r) => r.id), durasi: DURASI_BABAK, custom: {} }
    });
  }
}

/* ---------- Render ---------- */
function renderSemua() {
  const st = GAME.state || {};
  const players = Object.values(GAME.players || {}).filter((p) => p && p.nama);
  const online = players.filter((p) => p.online !== false).length;
  $("jumlahMurid").textContent = `${players.length} murid terdaftar (${online} online)`;
  $("infoSesi").textContent = `Sesi ${SESI} · ${Store.mode === "demo" ? "Mode Demo (satu browser)" : "Terhubung ke Firebase"}`;
  $("kunciDaftar").checked = !!st.regLocked;
  $("bekukan").checked = !!st.freeze;
  renderBabak();
  renderReguAktif();
  renderTabel();
}

function durasi(b) {
  if (b === 5) return Math.ceil(durasiFinalDetik() / 60);
  const d = (GAME.config && GAME.config.durasi) || DURASI_BABAK;
  return Number(d[b] || DURASI_BABAK[b]);
}

function renderBabak() {
  const st = GAME.state || {};
  const aktif = st.babak || 0;
  const html = [1, 2, 3, 4, 5].map((b) => {
    let cls = "", status = "Belum";
    if (b < aktif || (b === aktif && (st.status === "antara" || st.status === "selesai"))) { cls = "lewat"; status = "Selesai"; }
    if (b === aktif && st.status === "main") { cls = "aktif"; status = st.pausedAt ? "Dijeda " + fmtWaktu(sisaMs(st)) : "Berjalan " + fmtWaktu(sisaMs(st)); }
    const isian = b === 5
      ? `<span class="catatan">${SOAL_FINAL.length} soal · ${durasi(5)} mnt</span>`
      : `<input type="number" min="1" max="60" value="${durasi(b)}" data-durasi="${b}" aria-label="Durasi babak ${b} (menit)" ${b <= aktif && st.status !== "lobby" ? "disabled" : ""}><span class="catatan">mnt</span>`;
    return `<div class="babak ${cls}"><span class="no">${b}</span><span class="nm">${BABAK[b].nama}</span>${isian}<span class="st" data-st-babak="${b}">${status}</span></div>`;
  }).join("");
  const kunci = html + JSON.stringify(st);
  if ($("daftarBabak").dataset.k !== kunci) {
    $("daftarBabak").dataset.k = kunci;
    $("daftarBabak").innerHTML = html;
    $("daftarBabak").querySelectorAll("[data-durasi]").forEach((inp) => inp.addEventListener("change", () => {
      const v = Math.max(1, Math.min(60, Number(inp.value) || DURASI_BABAK[inp.dataset.durasi]));
      Store.set(G(`config/durasi/${inp.dataset.durasi}`), v);
    }));
  }

  // tombol kontrol
  let tombol = [];
  if (!st.status || st.status === "lobby") tombol.push(["Mulai Babak 1", "hijau", () => mulaiBabak(1)]);
  if (st.status === "main") {
    tombol.push(st.pausedAt ? ["Lanjutkan", "hijau", lanjut] : ["Jeda", "", jeda]);
    if (st.babak !== 5) tombol.push(["+1 menit", "garis", tambahMenit]);
    tombol.push(["Akhiri babak ini", "merah", () => konfirmasi("Akhiri babak sekarang?") && akhiriBabak()]);
  }
  if (st.status === "antara") {
    if (st.babak < 5) tombol.push([`Mulai Babak ${st.babak + 1}`, "hijau", () => mulaiBabak(st.babak + 1)]);
    else tombol.push(["Tutup permainan & umumkan juara", "hijau", tutupPermainan]);
  }
  if (st.status === "selesai") tombol.push(["Permainan selesai. Ekspor nilai →", "garis", ekspor]);
  else if (st.status && st.status !== "lobby") tombol.push(["Akhiri permainan", "merah", () => konfirmasi("Akhiri seluruh permainan sekarang?") && tutupPermainan()]);
  const kt = JSON.stringify(tombol.map((t) => t[0]));
  if ($("kontrolBabak").dataset.k !== kt) {
    $("kontrolBabak").dataset.k = kt;
    $("kontrolBabak").innerHTML = "";
    tombol.forEach(([teks, gaya, fn]) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = `tombol kecil ${gaya}`; b.textContent = teks;
      b.addEventListener("click", fn);
      $("kontrolBabak").appendChild(b);
    });
  }
}

function renderReguAktif() {
  const config = GAME.config || {};
  const aktif = new Set(config.regu || REGU.map((r) => r.id));
  const custom = config.custom || {};
  const semua = REGU.map((r) => ({ id: r.id, nama: r.nama, jenis: r.jenis, custom: false }))
    .concat(Object.entries(custom).map(([id, c]) => ({ id, nama: c.nama, jenis: c.jenis, custom: true })));
  const html = ["Putra", "Putri"].map((j) => semua.filter((r) => r.jenis === j).map((r) =>
    `<label>${lencana(cariRegu(r.id, custom), 24)}<input type="checkbox" data-regu="${r.id}" ${aktif.has(r.id) ? "checked" : ""}>${escapeHtml(r.nama)}${r.custom ? `<button type="button" class="hapus" data-hapus="${r.id}" aria-label="Hapus regu ${escapeHtml(r.nama)}">×</button>` : ""}</label>`
  ).join("")).join("");
  if ($("daftarReguAktif").dataset.k === html) return;
  $("daftarReguAktif").dataset.k = html;
  $("daftarReguAktif").innerHTML = html;
  $("daftarReguAktif").querySelectorAll("[data-regu]").forEach((c) => c.addEventListener("change", () => {
    const ids = [...$("daftarReguAktif").querySelectorAll("[data-regu]")].filter((x) => x.checked).map((x) => x.dataset.regu);
    Store.set(G("config/regu"), ids);
  }));
  $("daftarReguAktif").querySelectorAll("[data-hapus]").forEach((b) => b.addEventListener("click", (e) => {
    e.preventDefault();
    const id = b.dataset.hapus;
    if (anggotaRegu(GAME.players, id).length) return alert("Regu ini masih punya anggota. Pindahkan dulu anggotanya.");
    Store.remove(G(`config/custom/${id}`));
    Store.set(G("config/regu"), ((GAME.config && GAME.config.regu) || []).filter((x) => x !== id));
  }));
}

function renderTabel() {
  const daftar = hitungRegu(GAME);
  const config = GAME.config || {};
  $("ringkasRegu").textContent = `${daftar.length} regu bermain`;
  const pilihanRegu = reguAktif(config).concat(
    daftar.map((d) => d.regu).filter((r) => !(config.regu || REGU.map((x) => x.id)).includes(r.id))
  );
  const html = daftar.length ? daftar.map((r) => {
    const baris = `<tr>
      <td class="angka">${r.rank}</td>
      <td><span class="nama-regu">${lencana(r.regu, 32)}${escapeHtml(r.regu.nama)}</span></td>
      <td class="anggota">${r.anggota.map((a) => `<span class="titik ${a.online === false ? "mati" : ""}"></span>${escapeHtml(a.nama)}`).join(", ")}</td>
      <td class="angka">${r.rata}</td><td class="angka">${r.bonus}</td><td class="angka">${r.manual}</td>
      <td class="angka" style="font-size:18px">${r.total}</td>
      <td><div class="baris-tombol" style="flex-wrap:nowrap"><button type="button" class="kotak-kecil" data-manual="${r.id}" data-n="-10" aria-label="Kurangi 10 poin regu ${escapeHtml(r.regu.nama)}">−</button><button type="button" class="kotak-kecil plus" data-manual="${r.id}" data-n="10" aria-label="Tambah 10 poin regu ${escapeHtml(r.regu.nama)}">+</button></div></td>
      <td><button type="button" class="tombol garis kecil" data-kelola="${r.id}">${terbuka.has(r.id) ? "Tutup" : "Kelola"}</button></td>
    </tr>`;
    if (!terbuka.has(r.id)) return baris;
    const anggota = r.anggota.map((a) => `<div class="item">
      <span class="titik ${a.online === false ? "mati" : ""}"></span><span class="nm">${escapeHtml(a.nama)}</span><span class="catatan">skor ${a.score || 0}</span>
      <button type="button" class="tombol garis kecil" data-ubah="${a.pid}">Ubah nama</button>
      <select data-pindah="${a.pid}" aria-label="Pindahkan ${escapeHtml(a.nama)} ke regu lain"><option value="">Pindah ke…</option>${pilihanRegu.filter((x) => x.id !== r.id).map((x) => `<option value="${x.id}">${escapeHtml(x.nama)}</option>`).join("")}</select>
      <button type="button" class="tombol merah kecil" data-keluar="${a.pid}">Keluarkan</button>
    </div>`).join("");
    return baris + `<tr class="baris-kelola"><td></td><td colspan="8"><div class="anggota-kelola">${anggota}</div></td></tr>`;
  }).join("") : `<tr><td colspan="9" class="catatan" style="padding:20px;text-align:center">Belum ada murid yang mendaftar. Minta murid scan QR di samping.</td></tr>`;
  if ($("tabelRegu").dataset.k === html) return;
  $("tabelRegu").dataset.k = html;
  $("tabelRegu").innerHTML = html;
  const t = $("tabelRegu");
  t.querySelectorAll("[data-manual]").forEach((b) => b.addEventListener("click", () => {
    const n = Number(b.dataset.n);
    Store.inc(G(`manual/${b.dataset.manual}`), n);
    const regu = cariRegu(b.dataset.manual, config.custom);
    kabar(`Pembina ${n > 0 ? "menambah" : "mengurangi"} ${Math.abs(n)} poin untuk Regu ${regu.nama}`, "pembina");
  }));
  t.querySelectorAll("[data-kelola]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.kelola;
    terbuka.has(id) ? terbuka.delete(id) : terbuka.add(id);
    renderTabel();
  }));
  t.querySelectorAll("[data-ubah]").forEach((b) => b.addEventListener("click", () => {
    const p = GAME.players[b.dataset.ubah];
    const baru = prompt("Nama baru:", p.nama);
    if (baru && baru.trim()) Store.set(G(`players/${b.dataset.ubah}/nama`), baru.replace(/\s+/g, " ").trim().slice(0, 20));
  }));
  t.querySelectorAll("[data-pindah]").forEach((s) => s.addEventListener("change", () => {
    if (!s.value) return;
    const p = GAME.players[s.dataset.pindah];
    const tujuan = cariRegu(s.value, config.custom).nama;
    if (konfirmasi(`Pindahkan ${p.nama} ke Regu ${tujuan}?`)) Store.set(G(`players/${s.dataset.pindah}/regu`), s.value);
    else s.value = "";
  }));
  t.querySelectorAll("[data-keluar]").forEach((b) => b.addEventListener("click", () => {
    const p = GAME.players[b.dataset.keluar];
    if (konfirmasi(`Keluarkan ${p.nama} dari permainan? Skornya ikut terhapus.`)) Store.remove(G(`players/${b.dataset.keluar}`));
  }));
}

function konfirmasi(teks) { return window.confirm(teks); }

/* ---------- Kontrol babak ---------- */
async function mulaiBabak(b) {
  const det = b === 5 ? durasiFinalDetik() : durasi(b) * 60;
  await Store.update(G("state"), { status: "main", babak: b, startAt: Store.now(), duration: det, pausedAt: null, regLocked: true });
  kabar(`Babak ${b}: ${BABAK[b].nama} dimulai!`, "babak");
}
async function jeda() { await Store.set(G("state/pausedAt"), Store.now()); }
async function lanjut() {
  const st = GAME.state;
  if (!st.pausedAt) return;
  await Store.update(G("state"), { startAt: st.startAt + (Store.now() - st.pausedAt), pausedAt: null });
}
async function tambahMenit() { await Store.set(G("state/duration"), (GAME.state.duration || 0) + 60); }
let mengakhiri = false;
async function akhiriBabak() {
  if (mengakhiri) return;
  mengakhiri = true;
  try {
    const st = GAME.state;
    if (st.babak === 4) await putuskanMisiTersisa(await Store.get(G()) || {});
    await Store.update(G("state"), { status: "antara", pausedAt: null });
    kabar(`Babak ${st.babak} selesai!`, "babak");
  } finally { mengakhiri = false; }
}
async function tutupPermainan() {
  const st = GAME.state || {};
  if (st.status === "main" && st.babak === 4) await putuskanMisiTersisa(await Store.get(G()) || {});
  await Store.update(G("state"), { status: "selesai", pausedAt: null });
}

/* Babak otomatis berakhir saat waktu habis */
function detak() {
  const st = GAME.state;
  if (st && st.status === "main" && !st.pausedAt && sisaMs(st) <= 0) akhiriBabak();
  if (st && st.status === "main") {
    const el = document.querySelector(`[data-st-babak="${st.babak}"]`);
    if (el) el.textContent = (st.pausedAt ? "Dijeda " : "Berjalan ") + fmtWaktu(sisaMs(st));
  }
}

/* ---------- Tombol lain ---------- */
function pasangTombol() {
  $("kunciDaftar").addEventListener("change", (e) => Store.set(G("state/regLocked"), e.target.checked));
  $("bekukan").addEventListener("change", (e) => Store.set(G("state/freeze"), e.target.checked));
  $("btnEkspor").addEventListener("click", ekspor);
  $("btnGantiSesi").addEventListener("click", () => {
    const k = $("inputSesi").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!k) return;
    localStorage.setItem("misiSampahSesi", k);
    location.href = location.href.split("?")[0] + "?s=" + k;
  });
  $("btnReset").addEventListener("click", async () => {
    if (!konfirmasi(`Hapus SEMUA data sesi ${SESI}? Murid harus mendaftar ulang. Pastikan nilai sudah diekspor.`)) return;
    await Store.remove(G());
    await siapkanSesi();
  });
  $("btnTambahRegu").addEventListener("click", () => {
    const nama = $("reguBaru").value.replace(/\s+/g, " ").trim().slice(0, 20);
    if (!nama) return;
    const id = "x" + nama.toLowerCase().replace(/[^a-z0-9]/g, "") ;
    if (REGU.some((r) => r.nama.toLowerCase() === nama.toLowerCase())) return alert("Regu itu sudah ada di daftar.");
    const ids = (GAME.config && GAME.config.regu) || REGU.map((r) => r.id);
    Store.update(G("config"), { [`custom/${id}`]: { nama, jenis: $("jenisBaru").value }, regu: ids.includes(id) ? ids : ids.concat(id) });
    $("reguBaru").value = "";
  });
  $("btnBot").addEventListener("click", tambahBot);
  $("btnHapusBot").addEventListener("click", async () => {
    const upd = {};
    Object.keys(GAME.players || {}).filter((k) => k.startsWith("bot")).forEach((k) => (upd[`players/${k}`] = null));
    await Store.update(G(), upd);
  });
}

/* ---------- Ekspor Excel ---------- */
function ekspor() {
  if (!window.XLSX) return alert("Pustaka Excel belum termuat. Pastikan laptop terhubung ke internet, lalu muat ulang halaman.");
  const nilai = hitungNilai(GAME);
  const tot = totalSoal();
  const regu = hitungRegu(GAME);
  const barisNilai = nilai.map((n, i) => ({
    "No": i + 1,
    "Nama": n.nama,
    "Regu": n.regu,
    [`K1 Mengenal (benar/${tot.K1})`]: n.benar.K1,
    "K1 %": n.persen.K1,
    [`K2 Memahami (benar/${tot.K2})`]: n.benar.K2,
    "K2 %": n.persen.K2,
    [`K3 Menerapkan (benar/${tot.K3})`]: n.benar.K3,
    "K3 %": n.persen.K3,
    [`K4 Menganalisis/regu (benar/${tot.K4})`]: n.benar.K4,
    "K4 %": n.persen.K4,
    "Nilai Akhir": n.nilai,
    "Predikat": n.predikat,
    "Skor Game": n.skorGame,
    "Catatan Pembina": ""
  }));
  const barisRegu = regu.map((r) => ({
    "Peringkat": r.rank, "Regu": r.regu.nama, "Jenis": r.regu.jenis, "Jumlah Anggota": r.jumlah,
    "Anggota": r.anggota.map((a) => a.nama).join(", "),
    "Rata-rata Skor": r.rata, "Bonus Kompak": r.bonus, "Poin Manual": r.manual, "Total Skor": r.total, "MVP": r.mvp
  }));
  const ket = [
    { "Keterangan": "Sesi", "Isi": SESI },
    { "Keterangan": "Tanggal ekspor", "Isi": new Date().toLocaleString("id-ID") },
    { "Keterangan": "Rumus nilai", "Isi": `Nilai = ${BOBOT_NILAI.K1}% K1 + ${BOBOT_NILAI.K2}% K2 + ${BOBOT_NILAI.K3}% K3 + ${BOBOT_NILAI.K4}% K4` },
    { "Keterangan": "K1", "Isi": `${KOMPETENSI.K1}: Babak Pilah Sampah + soal final` },
    { "Keterangan": "K2", "Isi": `${KOMPETENSI.K2}: Babak Kuis 3R + soal final` },
    { "Keterangan": "K3", "Isi": `${KOMPETENSI.K3}: Babak Apa yang Kamu Lakukan + soal final` },
    { "Keterangan": "K4", "Isi": `${KOMPETENSI.K4}: jumlah misi yang dijawab benar oleh regu` },
    { "Keterangan": "Catatan", "Isi": "Nilai dihitung dari jawaban benar saja, tanpa bonus kecepatan, kombo, bonus kompak, atau poin manual. Soal yang tidak dijawab dihitung salah." },
    { "Keterangan": "Predikat", "Isi": PREDIKAT.map((p) => `${p.label} ≥ ${p.min}`).join("; ") }
  ];
  const wb = XLSX.utils.book_new();
  const s1 = XLSX.utils.json_to_sheet(barisNilai.length ? barisNilai : [{ "Info": "Belum ada data murid" }]);
  s1["!cols"] = [{ wch: 4 }, { wch: 22 }, { wch: 14 }, { wch: 12 }, { wch: 6 }, { wch: 12 }, { wch: 6 }, { wch: 12 }, { wch: 6 }, { wch: 14 }, { wch: 6 }, { wch: 10 }, { wch: 16 }, { wch: 10 }, { wch: 24 }];
  const s2 = XLSX.utils.json_to_sheet(barisRegu.length ? barisRegu : [{ "Info": "Belum ada regu" }]);
  s2["!cols"] = [{ wch: 9 }, { wch: 14 }, { wch: 7 }, { wch: 8 }, { wch: 50 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 14 }];
  const s3 = XLSX.utils.json_to_sheet(ket);
  s3["!cols"] = [{ wch: 16 }, { wch: 100 }];
  XLSX.utils.book_append_sheet(wb, s1, "Nilai");
  XLSX.utils.book_append_sheet(wb, s2, "Rekap Regu");
  XLSX.utils.book_append_sheet(wb, s3, "Keterangan");
  const tgl = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `Nilai-Misi-Sampah-${SESI}-${tgl}.xlsx`);
}

/* ---------- Murid simulasi (khusus Mode Demo) ---------- */
const NAMA_BOT = ["Bima", "Rani", "Dimas", "Grace", "Kevin", "Tiara", "Samuel", "Vania", "Rio", "Clara", "Yosua", "Nadia", "Andre", "Sekar", "Rafael", "Olivia", "Jonathan", "Putri", "Daniel", "Febi", "Gilbert", "Maria", "Hendra", "Cindy"];
async function tambahBot() {
  const upd = {};
  const ids = (GAME.config && GAME.config.regu) || REGU.map((r) => r.id);
  let n = 0;
  ids.forEach((id, i) => {
    for (let k = 0; k < 3; k++) {
      const pid = `bot${Date.now().toString(36)}${n++}`;
      upd[`players/${pid}`] = { nama: NAMA_BOT[(i * 3 + k) % NAMA_BOT.length] + (k ? " " + "ABC"[k] : ""), regu: id, joinedAt: Store.now() + n, score: 0, online: true, bot: true };
    }
  });
  await Store.update(G(), upd);
}
let botSibuk = false;
async function detakBot() {
  const st = GAME.state;
  if (botSibuk || !st || st.status !== "main" || st.pausedAt) return;
  const bots = Object.entries(GAME.players || {}).filter(([k, p]) => k.startsWith("bot") && p && p.nama);
  if (!bots.length) return;
  botSibuk = true;
  try {
    const upd = {};
    const ambil = bots.filter(() => Math.random() < 0.35);
    const fi = st.babak === 5 ? infoFinal(st) : null;
    for (const [pid, p] of ambil) {
      const ans = p.ans || {};
      const b = st.babak;
      const kemampuan = 0.55 + (hashStr(pid) % 40) / 100;
      const benar = Math.random() < kemampuan;
      if (b >= 1 && b <= 3 && sisaMs(st) > 0) {
        const pool = b === 1 ? SOAL_PILAH : b === 2 ? SOAL_KUIS : SOAL_SKENARIO;
        const q = acak(pool, pid + "|" + b).find((x) => !(ans[b] && ans[b][x.id]));
        if (!q) { upd[`players/${pid}/done/${b}`] = true; continue; }
        const poin = benar ? (b === 1 ? POIN.pilahBenar : POIN.soalBenar + Math.round(Math.random() * POIN.bonusCepatMaks)) : 0;
        upd[`players/${pid}/ans/${b}/${q.id}`] = { c: benar ? 1 : 0, p: poin, t: Store.now() };
        upd[`players/${pid}/score`] = (p.score || 0) + poin;
      } else if (b === 4) {
        const data = (GAME.misi || {})[p.regu] || {};
        SOAL_MISI.forEach((s) => {
          const m = data[s.id];
          if (m && m.locked && !(ans[4] && ans[4][s.id])) {
            const poin = m.benar ? POIN.misiBenar : 0;
            upd[`players/${pid}/ans/4/${s.id}`] = { c: m.benar ? 1 : 0, p: poin, t: Store.now() };
            upd[`players/${pid}/score`] = (p.score || 0) + poin;
          }
        });
        const cur = SOAL_MISI.find((s) => !(data[s.id] && data[s.id].locked));
        if (cur) upd[`misi/${p.regu}/${cur.id}/votes/${pid}`] = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * cur.pilihan.length);
      } else if (b === 5 && fi && !fi.selesai && fi.fase === "jawab" && !(ans[5] && ans[5][fi.soal.id])) {
        const poin = benar ? POIN.finalBenar + Math.round(POIN.finalCepatMaks * fi.sisa / (FINAL_JAWAB * 1000)) : 0;
        upd[`players/${pid}/ans/5/${fi.soal.id}`] = { c: benar ? 1 : 0, p: poin, t: Store.now(), pilih: benar ? 0 : 1 };
        upd[`players/${pid}/score`] = (p.score || 0) + poin;
      }
    }
    if (Object.keys(upd).length) await Store.update(G(), upd);
    if (st.babak === 4) {
      const g = await Store.get(G());
      const reguIds = new Set(bots.map(([, p]) => p.regu));
      for (const id of reguIds) {
        const data = ((g && g.misi) || {})[id] || {};
        const cur = SOAL_MISI.find((s) => !(data[s.id] && data[s.id].locked));
        if (cur) await cekKunciMisi(g, id, cur.id);
      }
    }
  } finally { botSibuk = false; }
}
