# Misi Sampah: Game Penilaian Pramuka Kelas 7

Game web untuk penilaian Pramuka tentang pengelolaan sampah. Murid bermain per regu di HP masing-masing, sementara pembina mengendalikan permainan dari laptop dan klasemen tampil di proyektor.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Halaman **murid** (dibuka dari scan QR di HP) |
| `admin.html` | **Panel pembina** (laptop guru, butuh PIN) |
| `layar.html` | **Layar proyektor**: lobi + QR, klasemen Top 10, running text, babak final, podium |
| `js/config.js` | **Pengaturan**: Firebase, PIN, durasi babak, bobot nilai, predikat |
| `js/soal.js` | **Bank soal** semua babak (silakan diedit) |
| `js/regu.js` | Daftar 24 regu + gambar lencana |
| `js/game.js` | Aturan poin, skor regu, dan rumus nilai |
| `js/murid.js`, `js/admin.js`, `js/layar.js` | Logika tiap halaman |
| `lib/` | Pustaka QR code dan Excel (sudah disertakan, tidak perlu internet) |

---

## 1. Coba dulu di Mode Demo (tanpa setup apa pun)

Selama `apiKey` di `js/config.js` masih kosong, aplikasi berjalan di **Mode Demo**. Semua data tersimpan di browser laptopmu saja.

1. Buka `admin.html` di Chrome. PIN bawaan: **`pramuka`**
2. Klik **Buka layar proyektor** (tab baru).
3. Buka `index.html` di tab lain. Satu tab = satu murid, jadi bisa buka beberapa tab.
4. Di panel pembina, klik **Tambah 72 murid simulasi** supaya klasemen ramai dan bisa melihat running text.
5. Klik **Mulai Babak 1** dan coba mainkan.

> Mode Demo hanya untuk uji coba di satu laptop. HP murid **tidak** bisa terhubung di mode ini.

---

## 2. Setup Firebase (supaya HP murid bisa terhubung)

Butuh sekitar 10 menit, gratis.

1. Buka https://console.firebase.google.com, lalu klik **Create a project**. Beri nama, misalnya `misi-sampah`. Google Analytics tidak perlu.
2. Di menu kiri: **Build → Realtime Database → Create Database**.
   - Lokasi: pilih **Singapore (asia-southeast1)** supaya cepat.
   - Mode: pilih **Start in test mode**.
3. Buka tab **Rules**, ganti isinya dengan aturan berikut, lalu klik **Publish**:
   ```json
   {
     "rules": {
       "games": {
         "$sesi": { ".read": true, ".write": true }
       }
     }
   }
   ```
4. Kembali ke halaman utama proyek, klik ikon **`</>`** (Web app), beri nama, lalu klik **Register app**.
5. Firebase menampilkan `firebaseConfig`. Salin nilainya ke `js/config.js`:
   ```js
   const FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "misi-sampah.firebaseapp.com",
     databaseURL: "https://misi-sampah-default-rtdb.asia-southeast1.firebasedatabase.app",
     projectId: "misi-sampah",
     ...
   };
   ```
   Pastikan **`databaseURL` ikut terisi**. Kalau tidak muncul di config, salin dari halaman Realtime Database (alamat di bagian atas).
6. **Ganti `ADMIN_PIN`** di `js/config.js` supaya murid tidak bisa masuk ke panel pembina.

### Online-kan foldernya
HP murid perlu membuka alamat internet, jadi folder ini harus di-hosting. Pilihan paling mudah:

**GitHub Pages**
1. Buat repository baru, misalnya `misi-sampah`, lalu upload semua isi folder ini.
2. Buka **Settings → Pages → Branch: main → Save**.
3. Tunggu 1–2 menit. Alamatnya akan seperti `https://gregoriusg13.github.io/misi-sampah/`

Panel pembina: `.../admin.html` · Layar: `.../layar.html` · Murid: cukup scan QR.

---

## 3. Alur saat hari-H

1. Buka `admin.html` di laptop, lalu **Buka layar proyektor** dan tampilkan di proyektor.
2. Murid scan QR di layar, **pilih regu dari dropdown**, lalu ketik nama.
3. Kalau ada yang salah masuk regu atau namanya aneh-aneh, perbaiki lewat **Kelola** di tabel regu.
4. Klik **Mulai Babak 1**. Pendaftaran otomatis terkunci (bisa dibuka lagi lewat sakelar).
5. Babak berakhir otomatis saat waktunya habis. Klik **Mulai Babak berikutnya** setelah memberi arahan.
6. Menjelang akhir, nyalakan **Bekukan klasemen di layar** supaya juaranya jadi kejutan.
7. Setelah final, klik **Tutup permainan & umumkan juara**. Layar menampilkan podium.
8. Klik **Ekspor nilai (Excel)**.

| Babak | Nama | Durasi | Kompetensi |
|---|---|---|---|
| 1 | Pilah Sampah (20 sampah) | 10 mnt | K1 Mengenal |
| 2 | Kuis 3R (10 soal) | 10 mnt | K2 Memahami |
| 3 | Apa yang Kamu Lakukan? (10 soal) | 10 mnt | K3 Menerapkan |
| 4 | Misi Regu (4 misi) | 15 mnt | K4 Menganalisis |
| 5 | Final Poin Ganda (6 soal, tampil di proyektor) | 3 mnt | Campuran |

Durasi babak 1–4 bisa diubah di panel pembina sebelum babak dimulai.

---

## 4. Cara penilaian

**Poin game ≠ nilai.** Poin game (yang tampil di leaderboard) mengandung bonus cepat, kombo, poin ganda, bonus kompak, dan poin manual pembina. **Nilai 0–100 hanya dihitung dari jawaban benar.**

```
Nilai = 20% × K1 + 25% × K2 + 25% × K3 + 30% × K4
```

- **K1**: benar di Pilah Sampah + 2 soal final (dari 22)
- **K2**: benar di Kuis 3R + 2 soal final (dari 12)
- **K3**: benar di Apa yang Kamu Lakukan + 2 soal final (dari 12)
- **K4**: jumlah misi yang dijawab benar oleh **regu** (dari 4)

Soal yang tidak dijawab dihitung salah. Bobot dan predikat bisa diubah di `js/config.js`.

File Excel berisi 3 sheet: **Nilai** (per murid, plus kolom catatan pembina), **Rekap Regu**, dan **Keterangan** (rumus).

---

## 5. Mengubah soal

Buka `js/soal.js`:
- **Jawaban benar selalu ditulis di urutan pertama.** Urutan pilihan diacak otomatis di HP murid.
- Semua murid mendapat soal yang sama dengan urutan acak.
- Misi Regu: setiap misi butuh **5 petunjuk**. Petunjuk dibagikan merata ke anggota regu.

---

## 6. Musik & efek suara

- **Layar proyektor** memutar musik latar dan efek suara besar: pembuka babak, hitung mundur 10 detik terakhir, peluit waktu habis, efek "dramatis" saat klasemen dibekukan, pengungkapan jawaban final, dan fanfare juara. Browser hanya mengizinkan suara setelah diklik, jadi **klik tombol kuning "Klik untuk menyalakan musik"** di pojok kiri bawah layar proyektor. Klik lagi untuk bisu.
- **HP murid** hanya memutar efek pendek (benar, salah, kombo, misi berhasil). Murid bisa membisukan lewat tombol speaker di pojok kiri bawah.
- Semua suara dibuat langsung oleh aplikasi, jadi bebas hak cipta dan tidak perlu internet.
- Mau memakai lagu sendiri? Lihat `audio/BACA-SAYA.txt`.

## 7. Tips & catatan

- Kalau HP murid ter-refresh atau tertutup, cukup buka lagi link yang sama. Murid otomatis masuk lagi sebagai dirinya sendiri, jawabannya tetap tersimpan.
- Timer mengikuti jam server Firebase, jadi semua HP sinkron.
- **Uji coba dulu** dengan 2–3 HP sebelum hari-H, terutama koneksi Wi-Fi sekolah.
- Setelah acara: ekspor nilai, lalu **Reset sesi** atau ganti kode sesi untuk kelas berikutnya. Setiap kelas bisa memakai kode sesi berbeda (misal `7A`, `7B`).
- Aturan database di atas terbuka untuk siapa pun yang tahu alamatnya. Itu cukup untuk acara kelas, tapi setelah selesai sebaiknya hapus data sesi atau ubah Rules menjadi `".write": false`.
