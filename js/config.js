/* =========================================================
   KONFIGURASI MISI SAMPAH
   Ubah file ini untuk menyambungkan ke Firebase-mu.
   Kalau apiKey dibiarkan kosong, aplikasi jalan di MODE DEMO
   (tanpa internet, hanya di satu browser/laptop untuk uji coba).
   ========================================================= */

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

/* PIN untuk membuka panel pembina (admin.html). Ganti sesukamu. */
const ADMIN_PIN = "pramuka";

/* Kode sesi bawaan. Bisa diganti dari panel pembina. */
const DEFAULT_SESI = "PRAMUKA7";

/* Durasi tiap babak dalam menit (bisa diubah juga dari panel pembina). */
const DURASI_BABAK = { 1: 10, 2: 10, 3: 10, 4: 15, 5: 3 };

/* Bobot nilai per kompetensi (total harus 100). */
const BOBOT_NILAI = { K1: 20, K2: 25, K3: 25, K4: 30 };

/* Rentang predikat nilai. */
const PREDIKAT = [
  { min: 86, label: "Sangat Baik" },
  { min: 71, label: "Baik" },
  { min: 56, label: "Cukup" },
  { min: 0,  label: "Perlu Bimbingan" }
];

const DEMO_MODE = !FIREBASE_CONFIG.apiKey;
