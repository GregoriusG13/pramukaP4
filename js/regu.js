/* =========================================================
   DAFTAR REGU + LENCANA
   Untuk menambah regu baru: tambahkan dari panel pembina
   (lencananya otomatis huruf depan), atau tambahkan di sini
   lengkap dengan gambar SVG-nya.
   ========================================================= */

const W = "#FFFFFF";
const REGU = [
  // ---------- PUTRA ----------
  { id: "ular", nama: "Ular", jenis: "Putra", warna: "#3E7B3A", svg: `
    <path d="M20 48 C13 40 24 36 32 36 C41 36 49 31 46 23 C44 17 36 16 31 20" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/><circle cx="28" cy="20" r="5" fill="${W}"/><circle cx="27" cy="18.5" r="1.2" fill="#3E7B3A"/><path d="M23 21 L18 19 M23 21 L18 23" stroke="${W}" stroke-width="1.6" stroke-linecap="round"/>` },
  { id: "jaguar", nama: "Jaguar", jenis: "Putra", warna: "#9A5B12", svg: `
    <path d="M20 27 L22 16 L29 22 Z M44 27 L42 16 L35 22 Z" fill="${W}"/><circle cx="32" cy="34" r="14" fill="${W}"/>
    <g fill="none" stroke="#9A5B12" stroke-width="1.6"><circle cx="32" cy="25" r="2.4"/><circle cx="22.5" cy="32" r="2.2"/><circle cx="41.5" cy="32" r="2.2"/><circle cx="25" cy="42" r="2"/><circle cx="39" cy="42" r="2"/></g>
    <circle cx="28" cy="33" r="1.8" fill="#1B2A1F"/><circle cx="36" cy="33" r="1.8" fill="#1B2A1F"/><path d="M30 38 H34 L32 40.5 Z" fill="#1B2A1F"/>` },
  { id: "kakiseribu", nama: "Kaki Seribu", jenis: "Putra", warna: "#7A4A2A", svg: `
    <g stroke="${W}" stroke-width="1.6" stroke-linecap="round"><path d="M14 44 L12 49 M20 38 L17 43 M27 34 L26 40 M34 33 L34 39 M41 34 L43 40 M47 38 L50 43"/><path d="M50 32 L54 26 M50 32 L56 30"/></g>
    <g fill="${W}"><circle cx="15" cy="41" r="4.5"/><circle cx="21" cy="35.5" r="4.5"/><circle cx="27.5" cy="31.5" r="4.5"/><circle cx="34.5" cy="30.5" r="4.5"/><circle cx="41" cy="31.5" r="4.5"/><circle cx="47.5" cy="34" r="5"/></g><circle cx="49" cy="33" r="1.2" fill="#7A4A2A"/>` },
  { id: "badak", nama: "Badak", jenis: "Putra", warna: "#5B6470", svg: `
    <g fill="${W}"><ellipse cx="27" cy="36" rx="14" ry="9"/><path d="M36 29 L50 33 L49 42 L37 43 Z"/><path d="M46 33 L52 22 L50.5 34 Z"/><path d="M39 30 L40 24 L43 30 Z"/><rect x="16" y="40" width="5" height="10" rx="2"/><rect x="24" y="41" width="5" height="9" rx="2"/><rect x="31" y="41" width="5" height="9" rx="2"/></g><circle cx="43" cy="35" r="1.3" fill="#5B6470"/>` },
  { id: "rajawali", nama: "Rajawali", jenis: "Putra", warna: "#2C6FA6", svg: `
    <path d="M32 24 C26 21 16 17 10 21 C16 23 20 27 22 31 C18 31 14 33 12 36 C18 36 22 36 25 38 L28 48 L32 44 L36 48 L39 38 C42 36 46 36 52 36 C50 33 46 31 42 31 C44 27 48 23 54 21 C48 17 38 21 32 24 Z" fill="${W}"/><circle cx="32" cy="21" r="4.5" fill="${W}"/><path d="M32 22 L35 24 L32 25 Z" fill="#F2B632"/>` },
  { id: "macan", nama: "Macan", jenis: "Putra", warna: "#8C6A1C", svg: `
    <circle cx="21" cy="21" r="5" fill="${W}"/><circle cx="43" cy="21" r="5" fill="${W}"/><circle cx="32" cy="34" r="14" fill="${W}"/>
    <g fill="#8C6A1C"><circle cx="32" cy="24" r="1.6"/><circle cx="27" cy="26" r="1.4"/><circle cx="37" cy="26" r="1.4"/><circle cx="22" cy="36" r="1.4"/><circle cx="42" cy="36" r="1.4"/></g>
    <circle cx="28" cy="33" r="1.8" fill="#1B2A1F"/><circle cx="36" cy="33" r="1.8" fill="#1B2A1F"/><path d="M30 38 H34 L32 40.5 Z" fill="#1B2A1F"/>
    <path d="M26 41 L17 40 M26 43 L18 45 M38 41 L47 40 M38 43 L46 45" stroke="#1B2A1F" stroke-width="1" stroke-linecap="round"/>` },
  { id: "kalajengking", nama: "Kalajengking", jenis: "Putra", warna: "#8B3A2E", svg: `
    <path d="M32 32 C32 20 40 13 46 17 C50 20 47 25 43 23" fill="none" stroke="${W}" stroke-width="4" stroke-linecap="round"/><path d="M43 23 L40 20 L39 25 Z" fill="${W}"/>
    <ellipse cx="32" cy="40" rx="6.5" ry="9" fill="${W}"/>
    <g stroke="${W}" stroke-width="2" stroke-linecap="round" fill="none"><path d="M27 46 L20 51 M37 46 L44 51"/><path d="M26 38 L19 36 M26 42 L19 43 M38 38 L45 36 M38 42 L45 43"/></g>
    <g fill="${W}"><path d="M20 51 L15 50 L17 54 Z"/><path d="M44 51 L49 50 L47 54 Z"/></g>` },
  { id: "harimau", nama: "Harimau", jenis: "Putra", warna: "#B4560F", svg: `
    <circle cx="21" cy="21" r="5" fill="${W}"/><circle cx="43" cy="21" r="5" fill="${W}"/><circle cx="32" cy="34" r="14" fill="${W}"/>
    <g stroke="#1B2A1F" stroke-width="2" stroke-linecap="round"><path d="M32 21 V26 M28 22 V25 M36 22 V25"/><path d="M19 32 H24 M19 36 H23 M45 32 H40 M45 36 H41"/></g>
    <circle cx="28" cy="32" r="1.8" fill="#1B2A1F"/><circle cx="36" cy="32" r="1.8" fill="#1B2A1F"/><path d="M30 38 H34 L32 40.5 Z" fill="#1B2A1F"/>` },
  { id: "gajah", nama: "Gajah", jenis: "Putra", warna: "#56677A", svg: `
    <circle cx="19" cy="29" r="9.5" fill="${W}" stroke="#56677A" stroke-width="2"/><circle cx="45" cy="29" r="9.5" fill="${W}" stroke="#56677A" stroke-width="2"/><circle cx="32" cy="29" r="10.5" fill="${W}" stroke="#56677A" stroke-width="2"/>
    <path d="M32 36 C32 44 34 49 38 50" fill="none" stroke="${W}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="28" cy="28" r="1.6" fill="#1B2A1F"/><circle cx="36" cy="28" r="1.6" fill="#1B2A1F"/>` },
  { id: "serigala", nama: "Serigala", jenis: "Putra", warna: "#3F4A5A", svg: `
    <path d="M18 15 L26 27 H38 L46 15 L48 32 L32 50 L16 32 Z" fill="${W}"/><path d="M21 21 L24 26 M43 21 L40 26" stroke="#3F4A5A" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M25 33 L29 32 M39 33 L35 32" stroke="#1B2A1F" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="44" r="2.4" fill="#1B2A1F"/>` },
  { id: "singa", nama: "Singa", jenis: "Putra", warna: "#9C4F14", svg: `
    <g fill="#F2B632"><circle cx="32" cy="16" r="6"/><circle cx="43" cy="20" r="6"/><circle cx="48" cy="31" r="6"/><circle cx="44" cy="43" r="6"/><circle cx="32" cy="48" r="6"/><circle cx="20" cy="43" r="6"/><circle cx="16" cy="31" r="6"/><circle cx="21" cy="20" r="6"/><circle cx="32" cy="32" r="15"/></g>
    <circle cx="32" cy="33" r="11" fill="${W}"/>
    <circle cx="28" cy="31" r="1.7" fill="#1B2A1F"/><circle cx="36" cy="31" r="1.7" fill="#1B2A1F"/><path d="M30 36 H34 L32 38.5 Z" fill="#1B2A1F"/><path d="M29 40 Q32 42 35 40" fill="none" stroke="#1B2A1F" stroke-width="1.4" stroke-linecap="round"/>` },
  { id: "elang", nama: "Elang", jenis: "Putra", warna: "#1F4E79", svg: `
    <path d="M17 48 C17 31 23 17 35 17 C43 17 49 21 49 27 L42 30 C43 33 42 36 39 37 C35 38 33 42 32 48 Z" fill="${W}"/>
    <path d="M43 23 C50 23 54 28 51 35 C49 31 46 30 42 30 Z" fill="#F2B632"/><circle cx="37" cy="24" r="2" fill="#1B2A1F"/>
    <path d="M24 38 Q27 41 30 39 M22 44 Q25 46 28 44" fill="none" stroke="#1F4E79" stroke-width="1.4" stroke-linecap="round"/>` },

  // ---------- PUTRI ----------
  { id: "anggrek", nama: "Anggrek", jenis: "Putri", warna: "#6E3F96", svg: `
    <g fill="${W}"><ellipse cx="32" cy="19" rx="5" ry="10"/><ellipse cx="32" cy="19" rx="5" ry="10" transform="rotate(115 32 32)"/><ellipse cx="32" cy="19" rx="5" ry="10" transform="rotate(-115 32 32)"/><ellipse cx="32" cy="21" rx="5.5" ry="9" transform="rotate(60 32 32)"/><ellipse cx="32" cy="21" rx="5.5" ry="9" transform="rotate(-60 32 32)"/></g>
    <path d="M25 34 Q32 50 39 34 Q32 38 25 34 Z" fill="#F2B632"/><circle cx="32" cy="31" r="3" fill="#E8D4F5"/>` },
  { id: "asoka", nama: "Asoka", jenis: "Putri", warna: "#B7382A", svg: `
    <path d="M32 40 V54 M32 48 L24 44" stroke="#BFE3C7" stroke-width="2.4" stroke-linecap="round"/>
    <g fill="${W}"><circle cx="32" cy="18" r="5"/><circle cx="23" cy="23" r="5"/><circle cx="41" cy="23" r="5"/><circle cx="19" cy="32" r="5"/><circle cx="45" cy="32" r="5"/><circle cx="27" cy="31" r="5"/><circle cx="37" cy="31" r="5"/><circle cx="32" cy="25" r="5"/><circle cx="32" cy="38" r="5"/><circle cx="24" cy="39" r="4.5"/><circle cx="40" cy="39" r="4.5"/></g>
    <g fill="#B7382A"><circle cx="32" cy="18" r="1.2"/><circle cx="23" cy="23" r="1.2"/><circle cx="41" cy="23" r="1.2"/><circle cx="19" cy="32" r="1.2"/><circle cx="45" cy="32" r="1.2"/><circle cx="27" cy="31" r="1.2"/><circle cx="37" cy="31" r="1.2"/><circle cx="32" cy="25" r="1.2"/><circle cx="32" cy="38" r="1.2"/><circle cx="24" cy="39" r="1.2"/><circle cx="40" cy="39" r="1.2"/></g>` },
  { id: "bungasepatu", nama: "Bunga Sepatu", jenis: "Putri", warna: "#C2304F", svg: `
    <g fill="${W}"><circle cx="32" cy="21" r="9"/><circle cx="42.5" cy="28.5" r="9"/><circle cx="38.5" cy="41" r="9"/><circle cx="25.5" cy="41" r="9"/><circle cx="21.5" cy="28.5" r="9"/></g>
    <circle cx="32" cy="32" r="5" fill="#8E1F38"/><path d="M32 32 L44 18" stroke="#F2B632" stroke-width="2.2" stroke-linecap="round"/><circle cx="44.5" cy="17.5" r="2.6" fill="#F2B632"/>` },
  { id: "mawar", nama: "Mawar", jenis: "Putri", warna: "#9E1F33", svg: `
    <g fill="#BFE3C7"><ellipse cx="22" cy="45" rx="7" ry="3.5" transform="rotate(-30 22 45)"/><ellipse cx="42" cy="45" rx="7" ry="3.5" transform="rotate(30 42 45)"/></g>
    <circle cx="32" cy="30" r="14" fill="${W}"/>
    <path d="M32 30 m0 -2 a3 3 0 1 1 -3 3 a6 6 0 1 1 6 6 a9 9 0 1 1 -10 -10 a11 11 0 0 1 14 -3" fill="none" stroke="#9E1F33" stroke-width="2.2" stroke-linecap="round"/>` },
  { id: "tulip", nama: "Tulip", jenis: "Putri", warna: "#C24A22", svg: `
    <path d="M32 40 V54" stroke="#BFE3C7" stroke-width="3" stroke-linecap="round"/><path d="M32 52 C26 50 22 44 22 40 C27 42 31 46 32 52 Z" fill="#BFE3C7"/>
    <path d="M21 16 L27 23 L32 14 L37 23 L43 16 V29 C43 37 38 41 32 41 C26 41 21 37 21 29 Z" fill="${W}"/>` },
  { id: "matahari", nama: "Matahari", jenis: "Putri", warna: "#2F6B4F", svg: `
    <g fill="#F2B632">${[0,30,60,90,120,150,180,210,240,270,300,330].map(a => `<ellipse cx="32" cy="16" rx="4" ry="8" transform="rotate(${a} 32 32)"/>`).join("")}</g>
    <circle cx="32" cy="32" r="9" fill="#6B4E2E"/><g fill="#3E2B17"><circle cx="29" cy="29" r="1.2"/><circle cx="35" cy="29" r="1.2"/><circle cx="32" cy="33" r="1.2"/><circle cx="28" cy="35" r="1.2"/><circle cx="36" cy="35" r="1.2"/></g>` },
  { id: "cempaka", nama: "Cempaka", jenis: "Putri", warna: "#94601F", svg: `
    <g fill="#FFF3D6">${[0,60,120,180,240,300].map(a => `<ellipse cx="32" cy="19" rx="3.2" ry="11" transform="rotate(${a} 32 32)"/>`).join("")}</g>
    <g fill="${W}">${[30,90,150,210,270,330].map(a => `<ellipse cx="32" cy="22" rx="2.6" ry="8" transform="rotate(${a} 32 32)"/>`).join("")}</g>
    <circle cx="32" cy="32" r="3.5" fill="#F2B632"/>` },
  { id: "lili", nama: "Lili", jenis: "Putri", warna: "#A8336B", svg: `
    <g fill="${W}">${[0,60,120,180,240,300].map(a => `<path d="M32 32 Q26 21 32 10 Q38 21 32 32 Z" transform="rotate(${a} 32 32)"/>`).join("")}</g>
    <g stroke="#F2B632" stroke-width="1.4" stroke-linecap="round"><path d="M32 32 L28 25 M32 32 L36 25 M32 32 L32 24"/></g><g fill="#F2B632"><circle cx="28" cy="24.5" r="1.4"/><circle cx="36" cy="24.5" r="1.4"/><circle cx="32" cy="23.5" r="1.4"/></g>` },
  { id: "sakura", nama: "Sakura", jenis: "Putri", warna: "#B0456E", svg: `
    <g fill="#FFE3EC">${[0,72,144,216,288].map(a => `<path d="M32 32 C23 26 23 14 29.5 12 L32 15.5 L34.5 12 C41 14 41 26 32 32 Z" transform="rotate(${a} 32 32)"/>`).join("")}</g>
    <circle cx="32" cy="32" r="3.5" fill="#B0456E"/><circle cx="32" cy="32" r="1.6" fill="#F2B632"/>` },
  { id: "lavender", nama: "Lavender", jenis: "Putri", warna: "#5E4688", svg: `
    <path d="M32 54 V14" stroke="#BFE3C7" stroke-width="2.4" stroke-linecap="round"/><path d="M32 50 C26 48 23 44 23 40 C28 42 31 45 32 50 Z" fill="#BFE3C7"/>
    <g fill="#E8DCF7"><ellipse cx="32" cy="13" rx="2.6" ry="3.6"/><ellipse cx="29" cy="18" rx="2.8" ry="4" transform="rotate(-20 29 18)"/><ellipse cx="35" cy="18" rx="2.8" ry="4" transform="rotate(20 35 18)"/><ellipse cx="28.5" cy="24" rx="3" ry="4.2" transform="rotate(-20 28.5 24)"/><ellipse cx="35.5" cy="24" rx="3" ry="4.2" transform="rotate(20 35.5 24)"/><ellipse cx="28" cy="30" rx="3" ry="4.2" transform="rotate(-20 28 30)"/><ellipse cx="36" cy="30" rx="3" ry="4.2" transform="rotate(20 36 30)"/><ellipse cx="28.5" cy="36" rx="2.8" ry="4" transform="rotate(-20 28.5 36)"/><ellipse cx="35.5" cy="36" rx="2.8" ry="4" transform="rotate(20 35.5 36)"/></g>` },
  { id: "raflesia", nama: "Raflesia", jenis: "Putri", warna: "#4E3B2A", svg: `
    <g fill="#D9512C"><circle cx="32" cy="19" r="10"/><circle cx="44.4" cy="28" r="10"/><circle cx="39.6" cy="42.5" r="10"/><circle cx="24.4" cy="42.5" r="10"/><circle cx="19.6" cy="28" r="10"/></g>
    <g fill="#FFE6D6"><circle cx="30" cy="15" r="1.6"/><circle cx="35" cy="17" r="1.3"/><circle cx="47" cy="25" r="1.6"/><circle cx="45" cy="31" r="1.2"/><circle cx="42" cy="46" r="1.6"/><circle cx="37" cy="47" r="1.2"/><circle cx="22" cy="46" r="1.6"/><circle cx="27" cy="47" r="1.2"/><circle cx="17" cy="25" r="1.6"/><circle cx="19" cy="31" r="1.2"/></g>
    <circle cx="32" cy="31" r="8" fill="#3A1F14" stroke="#F2C5A8" stroke-width="2"/>` },
  { id: "lotus", nama: "Lotus", jenis: "Putri", warna: "#23767A", svg: `
    <g fill="#FFE3EC" stroke="#23767A" stroke-width="1.5"><path d="M32 44 Q20 36 14 26 Q26 26 32 44 Z"/><path d="M32 44 Q44 36 50 26 Q38 26 32 44 Z"/></g>
    <g fill="${W}" stroke="#23767A" stroke-width="1.5"><path d="M32 44 Q22 32 24 18 Q32 26 32 44 Z"/><path d="M32 44 Q42 32 40 18 Q32 26 32 44 Z"/><path d="M32 44 Q25 30 32 13 Q39 30 32 44 Z"/></g>
    <path d="M16 49 Q20 46 24 49 T32 49 T40 49 T48 49" fill="none" stroke="#BFE3E5" stroke-width="2" stroke-linecap="round"/>` }
];

const WARNA_CADANGAN = ["#2E7D45", "#2C6FA6", "#A23B72", "#B4560F", "#6E3F96", "#23767A", "#8B3A2E", "#56677A"];

/* Cari data regu dari id. Regu tambahan (custom) dari panel pembina
   disimpan sebagai {id, nama, jenis} dan diberi lencana huruf depan. */
function cariRegu(id, custom) {
  const r = REGU.find((x) => x.id === id);
  if (r) return r;
  const c = (custom || {})[id];
  if (c) {
    const i = Math.abs([...id].reduce((a, ch) => a + ch.charCodeAt(0), 0)) % WARNA_CADANGAN.length;
    return { id, nama: c.nama, jenis: c.jenis || "Lainnya", warna: WARNA_CADANGAN[i], svg: null };
  }
  return { id, nama: id, jenis: "Lainnya", warna: "#56677A", svg: null };
}

/* HTML lencana bulat. */
function lencana(regu, size) {
  size = size || 48;
  const inner = regu.svg
    ? regu.svg
    : `<text x="32" y="42" text-anchor="middle" font-family="Baloo 2, sans-serif" font-size="28" font-weight="800" fill="#FFFFFF">${escapeHtml(regu.nama.charAt(0).toUpperCase())}</text>`;
  return `<svg class="lencana" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="Lencana Regu ${escapeHtml(regu.nama)}"><circle cx="32" cy="32" r="31" fill="${regu.warna}"/><circle cx="32" cy="32" r="27.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="1.2"/>${inner}</svg>`;
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
