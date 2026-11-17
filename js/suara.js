/* =========================================================
   SUARA: musik latar & efek suara
   Semua bunyi disintesis langsung di browser (Web Audio API),
   jadi tidak perlu file dan bebas hak cipta.
   Ingin memakai lagu sendiri? Taruh file MP3 bebas royalti di:
     audio/musik-santai.mp3 (lobi & jeda antarbabak)
     audio/musik-main.mp3   (saat babak berjalan)
     audio/musik-final.mp3  (babak final)
   Kalau file ada, file itu yang diputar. Kalau tidak, pakai musik sintesis.
   ========================================================= */

const Suara = (() => {
  const KUNCI = "misiSampahSuara";
  let ctx = null, master, sfx, musikBus;
  let nyala = localStorage.getItem(KUNCI) !== "mati";
  const NADA = {};
  const nama = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  for (let o = 1; o <= 7; o++) nama.forEach((n, i) => (NADA[n + o] = 440 * Math.pow(2, (o * 12 + i - 57) / 12)));

  function siap() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain(); master.connect(ctx.destination);
      sfx = ctx.createGain(); sfx.gain.value = 0.9; sfx.connect(master);
      musikBus = ctx.createGain(); musikBus.gain.value = 0.22; musikBus.connect(master);
    }
    if (ctx.state === "suspended") ctx.resume();
    master.gain.value = nyala ? 1 : 0;
    return ctx;
  }
  const aktif = () => ctx && ctx.state === "running" && nyala;

  /* Satu nada dengan amplop sederhana */
  function nada(f, t, dur, o) {
    o = o || {};
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = o.tipe || "square";
    osc.frequency.setValueAtTime(typeof f === "string" ? NADA[f] : f, t);
    if (o.ke) osc.frequency.exponentialRampToValueAtTime(typeof o.ke === "string" ? NADA[o.ke] : o.ke, t + dur);
    const v = o.vol == null ? 0.18 : o.vol;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(o.tujuan || sfx);
    osc.start(t); osc.stop(t + dur + 0.02);
  }
  let bufDesis = null;
  function desis(t, dur, o) {
    o = o || {};
    if (!bufDesis) {
      bufDesis = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = bufDesis.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = ctx.createBufferSource(), g = ctx.createGain(), fl = ctx.createBiquadFilter();
    src.buffer = bufDesis;
    fl.type = o.filter || "highpass"; fl.frequency.value = o.frek || 6000;
    g.gain.setValueAtTime(o.vol || 0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(o.tujuan || sfx);
    src.start(t); src.stop(t + dur + 0.02);
  }
  function urutan(daftar, jeda, o) {
    const t = ctx.currentTime + 0.01;
    daftar.forEach((n, i) => n && nada(n, t + i * jeda, (o && o.dur) || jeda * 1.6, o));
  }

  /* ---------------- EFEK SUARA ---------------- */
  const efek = {
    benar() { urutan(["C5", "E5", "G5", "C6"], 0.06, { tipe: "square", vol: 0.12, dur: 0.14 }); },
    salah() { const t = ctx.currentTime; nada(220, t, 0.16, { tipe: "sawtooth", vol: 0.1, ke: 150 }); nada(165, t + 0.16, 0.22, { tipe: "sawtooth", vol: 0.1, ke: 110 }); },
    kombo(n) { const dasar = ["C5", "D5", "E5", "G5", "A5", "C6"]; urutan(dasar.slice(0, Math.min(6, 3 + Math.floor((n || 5) / 5))).concat(["E6"]), 0.05, { vol: 0.12, dur: 0.12 }); },
    klik() { nada("A5", ctx.currentTime, 0.05, { tipe: "square", vol: 0.08 }); },
    kirim() { const t = ctx.currentTime; nada("E5", t, 0.08, { tipe: "triangle", vol: 0.2 }); nada("B5", t + 0.07, 0.12, { tipe: "triangle", vol: 0.2 }); },
    gabung() { const t = ctx.currentTime; nada(400, t, 0.12, { tipe: "sine", vol: 0.25, ke: 900 }); },
    detik() { nada("C6", ctx.currentTime, 0.06, { tipe: "square", vol: 0.1 }); },
    detikAkhir() { nada("G6", ctx.currentTime, 0.09, { tipe: "square", vol: 0.14 }); },
    mulai() {
      const t = ctx.currentTime + 0.02;
      [["G4", 0], ["C5", 0.12], ["E5", 0.24], ["G5", 0.36]].forEach(([n, d]) => nada(n, t + d, 0.14, { vol: 0.16 }));
      ["C5", "E5", "G5", "C6"].forEach((n) => nada(n, t + 0.5, 0.7, { tipe: "square", vol: 0.08 }));
      desis(t + 0.5, 0.4, { vol: 0.05 });
    },
    habis() {
      const t = ctx.currentTime;
      nada(1800, t, 0.25, { tipe: "sine", vol: 0.2, ke: 1700 });
      nada(1800, t + 0.32, 0.55, { tipe: "sine", vol: 0.2, ke: 1500 });
    },
    misi() { urutan(["G4", "C5", "E5", "G5", null, "E5", "G5"], 0.09, { vol: 0.14, dur: 0.16 }); },
    naik() { const t = ctx.currentTime; nada(300, t, 0.35, { tipe: "triangle", vol: 0.2, ke: 1200 }); desis(t, 0.35, { vol: 0.04, frek: 3000 }); },
    dramatis() {
      const t = ctx.currentTime;
      for (let i = 0; i < 24; i++) desis(t + i * 0.06, 0.08, { filter: "lowpass", frek: 400 + i * 30, vol: 0.12 + i * 0.006 });
      nada("C3", t + 1.45, 0.6, { tipe: "sawtooth", vol: 0.12 });
    },
    ungkap() { urutan(["C5", "G5", "C6"], 0.08, { tipe: "triangle", vol: 0.22, dur: 0.3 }); },
    juara() {
      const t = ctx.currentTime + 0.05;
      const lagu = [["C5", 0, 0.15], ["C5", 0.15, 0.15], ["C5", 0.3, 0.15], ["C5", 0.45, 0.45], ["G#4", 0.9, 0.45], ["A#4", 1.35, 0.45], ["C5", 1.8, 0.3], ["A#4", 2.1, 0.15], ["C5", 2.25, 1.0]];
      lagu.forEach(([n, d, l]) => { nada(n, t + d, l, { vol: 0.16 }); nada(NADA[n] / 2, t + d, l, { tipe: "triangle", vol: 0.14 }); });
      ["C5", "E5", "G5"].forEach((n) => nada(n, t + 2.25, 1.2, { tipe: "square", vol: 0.06 }));
    }
  };

  /* ---------------- MUSIK LATAR ---------------- */
  const LAGU = {
    santai: {
      tempo: 96, gelombang: "triangle", volMelodi: 0.16, drum: false,
      melodi: ["C5", null, null, "E5", null, null, "G5", null, "B4", null, null, "D5", null, null, "G5", null,
               "A4", null, null, "C5", null, null, "E5", null, "F4", null, null, "A4", null, "C5", null, null],
      akor: ["C3", "G2", "A2", "F2"]
    },
    main: {
      tempo: 120, gelombang: "square", volMelodi: 0.09, drum: true,
      melodi: ["E5", null, "G5", null, "C6", null, "G5", "E5", "D5", null, "G5", null, "B5", null, "G5", "D5",
               "C5", null, "E5", null, "A5", null, "E5", "C5", "F5", null, "A5", null, "C6", "A5", "G5", null],
      akor: ["C3", "G2", "A2", "F2"]
    },
    final: {
      tempo: 138, gelombang: "square", volMelodi: 0.08, drum: true,
      melodi: ["A4", "C5", "E5", "A5", "E5", "C5", "A4", null, "G4", "B4", "D5", "G5", "D5", "B4", "G4", null,
               "F4", "A4", "C5", "F5", "C5", "A4", "F4", null, "E4", "G#4", "B4", "E5", "B4", "G#4", "E5", null],
      akor: ["A2", "G2", "F2", "E2"]
    }
  };
  let laguKini = null, langkah = 0, waktuBerikut = 0, penjadwal = null, putaran = 0;
  let fileAudio = null;
  const fileCek = {};

  function jadwalkan() {
    const L = LAGU[laguKini];
    const per = 60 / L.tempo / 2; // per langkah (1/8)
    while (waktuBerikut < ctx.currentTime + 0.12) {
      const s = langkah % 32, bar = Math.floor(s / 8);
      let n = L.melodi[s];
      if (n && putaran % 2 === 1 && s >= 28) n = L.melodi[(s + 4) % 32] || n; // variasi kecil
      if (n) nada(n, waktuBerikut, per * 1.5, { tipe: L.gelombang, vol: L.volMelodi, tujuan: musikBus });
      if (s % 2 === 0) {
        const akar = NADA[L.akor[bar]] * (s % 4 === 2 ? 2 : 1);
        nada(akar, waktuBerikut, per * 1.8, { tipe: "triangle", vol: 0.22, tujuan: musikBus });
      }
      if (L.drum) {
        if (s % 4 === 0) nada(150, waktuBerikut, 0.12, { tipe: "sine", vol: 0.35, ke: 45, tujuan: musikBus });
        if (s % 2 === 1) desis(waktuBerikut, 0.04, { vol: 0.05, tujuan: musikBus });
        if (s % 8 === 4) desis(waktuBerikut, 0.12, { filter: "bandpass", frek: 1800, vol: 0.12, tujuan: musikBus });
      }
      waktuBerikut += per;
      langkah++;
      if (langkah % 32 === 0) putaran++;
    }
  }
  function hentikanMusik() {
    if (penjadwal) { clearInterval(penjadwal); penjadwal = null; }
    if (fileAudio) { fileAudio.pause(); fileAudio = null; }
    laguKini = null;
  }
  function putarSintesis(jenis) {
    laguKini = jenis; langkah = 0; putaran = 0; waktuBerikut = ctx.currentTime + 0.1;
    penjadwal = setInterval(jadwalkan, 25);
  }
  function musik(jenis) {
    if (!ctx) return;
    if (!jenis) { hentikanMusik(); return; }
    if (laguKini === jenis) return;
    hentikanMusik();
    laguKini = jenis;
    // coba file MP3 milik sendiri dulu
    if (fileCek[jenis] === false) { putarSintesis(jenis); return; }
    const a = new Audio(`audio/musik-${jenis}.mp3`);
    a.loop = true; a.volume = 0.5;
    let selesai = false;
    a.addEventListener("canplay", () => {
      if (selesai || laguKini !== jenis) return; selesai = true;
      fileCek[jenis] = true; fileAudio = a; if (nyala) a.play().catch(() => {});
    }, { once: true });
    a.addEventListener("error", () => {
      if (selesai) return; selesai = true; fileCek[jenis] = false;
      if (laguKini === jenis) { laguKini = null; putarSintesis(jenis); }
    }, { once: true });
    a.load();
  }

  return {
    siap,
    get nyala() { return nyala; },
    setNyala(v) {
      nyala = v;
      localStorage.setItem(KUNCI, v ? "nyala" : "mati");
      if (master) master.gain.value = v ? 1 : 0;
      if (fileAudio) v ? fileAudio.play().catch(() => {}) : fileAudio.pause();
    },
    efek(namaEfek, arg) { if (aktif() && efek[namaEfek]) efek[namaEfek](arg); },
    musik(jenis) { if (ctx) musik(jenis); },
    get aktif() { return !!(ctx && ctx.state === "running"); }
  };
})();
