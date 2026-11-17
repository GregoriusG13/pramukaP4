/* =========================================================
   BANK SOAL MISI SAMPAH
   Silakan edit / tambah soal di file ini.
   - Untuk soal pilihan ganda, jawaban BENAR selalu ditulis
     di urutan PERTAMA (indeks 0). Urutan pilihan diacak
     otomatis untuk setiap murid.
   - Semua murid mendapat soal yang SAMA, hanya urutannya
     yang diacak (supaya penilaian adil).
   Kompetensi:
     K1 = Mengenal jenis sampah
     K2 = Memahami prinsip 3R & pengelolaan sampah
     K3 = Menerapkan dalam situasi sehari-hari
     K4 = Menganalisis masalah & solusi (Misi Regu)
   ========================================================= */

const KOMPETENSI = {
  K1: "Mengenal jenis sampah",
  K2: "Memahami 3R & pengelolaan sampah",
  K3: "Menerapkan dalam situasi nyata",
  K4: "Menganalisis masalah (Misi Regu)"
};

const BABAK = {
  1: { nama: "Pilah Sampah", kompetensi: "K1" },
  2: { nama: "Kuis 3R", kompetensi: "K2" },
  3: { nama: "Apa yang Kamu Lakukan?", kompetensi: "K3" },
  4: { nama: "Misi Regu", kompetensi: "K4" },
  5: { nama: "Final Poin Ganda", kompetensi: "campuran" }
};

const TONG = {
  organik:   { nama: "Organik",   warna: "#2E7D45", teks: "#FFFFFF" },
  anorganik: { nama: "Anorganik", warna: "#F2B632", teks: "#1B2A1F" },
  b3:        { nama: "B3",        warna: "#B7382A", teks: "#FFFFFF" },
  residu:    { nama: "Residu",    warna: "#555E69", teks: "#FFFFFF" }
};

/* ---------- BABAK 1: PILAH SAMPAH (K1) ---------- */
const SOAL_PILAH = [
  { id: "p1",  nama: "Kulit pisang",            ikon: "🍌", tong: "organik",   info: "Kulit buah mudah membusuk dan bisa jadi kompos." },
  { id: "p2",  nama: "Sisa nasi",               ikon: "🍚", tong: "organik",   info: "Sisa makanan termasuk sampah organik." },
  { id: "p3",  nama: "Daun kering",             ikon: "🍂", tong: "organik",   info: "Daun bisa diolah jadi kompos." },
  { id: "p4",  nama: "Ampas teh",               ikon: "🍵", tong: "organik",   info: "Ampas teh dan kopi mudah terurai." },
  { id: "p5",  nama: "Kulit telur",             ikon: "🥚", tong: "organik",   info: "Kulit telur bagus untuk campuran kompos." },
  { id: "p6",  nama: "Botol sampo bekas",       ikon: "🧴", tong: "anorganik", info: "Botol plastik bersih bisa didaur ulang." },
  { id: "p7",  nama: "Kaleng sarden bekas",     ikon: "🥫", tong: "anorganik", info: "Kaleng logam bisa didaur ulang dan laku di bank sampah." },
  { id: "p8",  nama: "Botol kaca bekas sirup",  ikon: "🍾", tong: "anorganik", info: "Kaca bisa dipakai ulang atau didaur ulang." },
  { id: "p9",  nama: "Gelas plastik air mineral", ikon: "🥤", tong: "anorganik", info: "Gelas plastik bersih bisa didaur ulang." },
  { id: "p10", nama: "Ember plastik rusak",     ikon: "🪣", tong: "anorganik", info: "Plastik keras bisa dicacah dan didaur ulang." },
  { id: "p11", nama: "Baterai bekas",           ikon: "🔋", tong: "b3",        info: "Baterai mengandung logam berbahaya." },
  { id: "p12", nama: "Lampu rusak",             ikon: "💡", tong: "b3",        info: "Lampu, terutama lampu hemat energi dan neon, mengandung merkuri." },
  { id: "p13", nama: "Kaleng obat nyamuk semprot", ikon: "🦟", tong: "b3",     info: "Kaleng semprot bertekanan dan isinya beracun." },
  { id: "p14", nama: "Obat kedaluwarsa",        ikon: "💊", tong: "b3",        info: "Obat tidak boleh dibuang sembarangan." },
  { id: "p15", nama: "Termometer raksa pecah",  ikon: "🌡️", tong: "b3",       info: "Raksa (merkuri) sangat beracun." },
  { id: "p16", nama: "Tisu bekas",              ikon: "🧻", tong: "residu",    info: "Tisu kotor tidak bisa didaur ulang." },
  { id: "p17", nama: "Popok bayi bekas",        ikon: "👶", tong: "residu",    info: "Popok bekas sulit diolah, jadi residu." },
  { id: "p18", nama: "Bungkus snack mengilap",  ikon: "🍿", tong: "residu",    info: "Kemasan berlapis sulit didaur ulang." },
  { id: "p19", nama: "Styrofoam bekas makanan", ikon: "🍱", tong: "residu",    info: "Styrofoam kotor sulit diolah kembali." },
  { id: "p20", nama: "Puntung rokok",           ikon: "🚬", tong: "residu",    info: "Puntung rokok tidak bisa didaur ulang." }
];

/* ---------- BABAK 2: KUIS 3R (K2) ---------- */
const SOAL_KUIS = [
  { id: "k1", tanya: "Membawa botol minum sendiri ke sekolah adalah contoh prinsip…",
    pilihan: ["Reduce (mengurangi)", "Recycle (mendaur ulang)", "Replant (menanam kembali)", "Recover (memulihkan)"],
    info: "Dengan botol sendiri, kamu mengurangi sampah botol plastik." },
  { id: "k2", tanya: "Memakai sisi belakang kertas bekas untuk coret-coretan adalah contoh…",
    pilihan: ["Reuse (memakai ulang)", "Reduce (mengurangi)", "Recycle (mendaur ulang)", "Replace (mengganti)"],
    info: "Kertasnya dipakai lagi tanpa diolah ulang." },
  { id: "k3", tanya: "Botol plastik dicacah lalu dilelehkan menjadi barang baru. Ini contoh…",
    pilihan: ["Recycle (mendaur ulang)", "Reuse (memakai ulang)", "Reduce (mengurangi)", "Replant (menanam kembali)"],
    info: "Daur ulang = bahan diolah menjadi produk baru." },
  { id: "k4", tanya: "B3 adalah singkatan dari…",
    pilihan: ["Bahan Berbahaya dan Beracun", "Barang Bekas Buangan", "Bahan Bisa Busuk", "Benda Bekas Berguna"],
    info: "Contoh sampah B3: baterai, lampu neon, obat kedaluwarsa." },
  { id: "k5", tanya: "Mana yang PALING LAMA terurai di alam?",
    pilihan: ["Botol kaca", "Kulit pisang", "Koran bekas", "Kain katun"],
    info: "Kaca bisa bertahan sangat lama, bahkan ribuan tahun." },
  { id: "k6", tanya: "Sampah organik seperti sisa sayur paling baik diolah menjadi…",
    pilihan: ["Kompos", "Biji plastik", "Kertas daur ulang", "Bahan bakar kendaraan"],
    info: "Kompos menyuburkan tanah dan mengurangi sampah ke TPA." },
  { id: "k7", tanya: "Hari Peduli Sampah Nasional diperingati setiap tanggal…",
    pilihan: ["21 Februari", "5 Juni", "22 April", "14 Agustus"],
    info: "21 Februari mengenang tragedi longsor sampah Leuwigajah tahun 2005." },
  { id: "k8", tanya: "Tempat menabung sampah yang sudah dipilah dan bisa ditukar uang disebut…",
    pilihan: ["Bank sampah", "TPA", "Gudang sekolah", "Koperasi"],
    info: "Di bank sampah, sampah bernilai dicatat seperti tabungan." },
  { id: "k9", tanya: "Ecobrick adalah…",
    pilihan: ["Botol plastik yang diisi padat dengan sampah plastik kering", "Batu bata dari tanah liat", "Kompos yang dicetak kotak", "Kertas daur ulang yang ditumpuk"],
    info: "Ecobrick bisa dirangkai jadi kursi, meja, atau taman." },
  { id: "k10", tanya: "Apa akibat membakar sampah plastik?",
    pilihan: ["Menghasilkan asap beracun dan polusi udara", "Plastik berubah jadi pupuk", "Udara menjadi lebih bersih", "Tidak ada akibatnya"],
    info: "Asap plastik berbahaya untuk pernapasan." }
];

/* ---------- BABAK 3: APA YANG KAMU LAKUKAN? (K3) ---------- */
const SOAL_SKENARIO = [
  { id: "s1", tanya: "Kamu membeli satu roti di kantin, lalu penjual memberikan kantong plastik. Apa yang kamu lakukan?",
    pilihan: ["Menolak kantong plastik dan langsung membawa rotinya", "Menerima kantong lalu membuangnya", "Minta dua kantong supaya aman", "Menerima kantong dan menyimpannya di laci kelas"],
    info: "Menolak plastik yang tidak perlu = mengurangi sampah." },
  { id: "s2", tanya: "Setelah makan, kamu punya kulit jeruk dan gelas plastik bekas. Bagaimana membuangnya?",
    pilihan: ["Kulit jeruk ke tong organik, gelas plastik ke tong anorganik", "Keduanya ke tong organik", "Keduanya ke tong residu", "Ditinggal di meja kantin"],
    info: "Memilah sejak awal memudahkan pengolahan." },
  { id: "s3", tanya: "Baterai remote TV di rumah sudah habis. Apa yang sebaiknya kamu lakukan?",
    pilihan: ["Mengumpulkannya terpisah dan menyerahkan ke tempat pengumpulan sampah B3", "Membuangnya ke tong sampah biasa", "Membuangnya ke selokan", "Membakarnya"],
    info: "Baterai adalah sampah B3, jangan dicampur sampah biasa." },
  { id: "s4", tanya: "Kamu melihat teman membuang bungkus jajan di lapangan. Apa yang kamu lakukan?",
    pilihan: ["Menegur dengan sopan dan mengajaknya membuang ke tempat sampah", "Membiarkan saja", "Ikut membuang sampah di situ", "Memarahinya di depan banyak orang"],
    info: "Mengingatkan dengan sopan adalah sikap Pramuka sejati." },
  { id: "s5", tanya: "Kelasmu akan merayakan ulang tahun teman. Pilihan yang paling ramah lingkungan?",
    pilihan: ["Membawa piring dan gelas sendiri yang bisa dicuci", "Membeli piring styrofoam sekali pakai", "Memakai banyak balon plastik", "Membeli minuman gelas plastik untuk semua"],
    info: "Alat makan yang bisa dicuci mengurangi sampah sekali pakai." },
  { id: "s6", tanya: "Buku tulismu tahun lalu masih punya banyak halaman kosong. Apa yang kamu lakukan?",
    pilihan: ["Memakai halaman kosongnya untuk latihan atau catatan", "Langsung membuangnya", "Membakarnya", "Menyobek semua halaman lalu dibuang"],
    info: "Memakai ulang barang yang masih layak = Reuse." },
  { id: "s7", tanya: "Di rumah banyak sisa sayur dan kulit buah setiap hari. Apa solusi terbaik?",
    pilihan: ["Mengolahnya menjadi kompos atau memasukkan ke lubang biopori", "Mencampurnya dengan sampah plastik", "Membuangnya ke sungai", "Membakarnya setiap sore"],
    info: "Sampah organik bisa kembali ke tanah sebagai pupuk." },
  { id: "s8", tanya: "Saat berkemah Pramuka, regumu punya sampah bekas makan. Apa yang paling tepat?",
    pilihan: ["Mengumpulkan semua sampah dalam kantong dan membawanya ke tempat pembuangan yang tersedia", "Mengubur plastik di dalam tanah", "Membakar semua sampah di api unggun", "Meninggalkannya, nanti dibersihkan petugas"],
    info: "Pramuka meninggalkan tempat kemah lebih bersih dari saat datang." },
  { id: "s9", tanya: "Kamu haus dan ingin membeli minuman. Pilihan yang paling ramah lingkungan?",
    pilihan: ["Mengisi ulang botol minum sendiri", "Membeli air dalam botol plastik kecil", "Membeli minuman gelas plastik dengan sedotan", "Membeli dua botol sekaligus"],
    info: "Isi ulang = tidak menambah sampah kemasan." },
  { id: "s10", tanya: "Sekolah mengadakan lomba kerajinan tangan. Bahan apa yang paling sesuai semangat 3R?",
    pilihan: ["Barang bekas seperti botol, kardus, atau kain perca", "Membeli bahan plastik baru", "Kertas HVS baru satu rim", "Styrofoam baru"],
    info: "Barang bekas diberi nilai baru = Reuse dan Recycle." }
];

/* ---------- BABAK 4: MISI REGU (K4) ----------
   Tiap misi punya 5 petunjuk yang dibagikan ke anggota regu.
   Jawaban terkunci kalau semua anggota yang online memilih jawaban yang sama. */
const SOAL_MISI = [
  { id: "m1", judul: "Kantin Kelas 7",
    petunjuk: [
      "Setiap hari kantin membuang sekitar 40 gelas plastik sekali pakai.",
      "Sebagian besar murid membeli es teh di kantin setiap istirahat.",
      "Tong sampah kantin selalu penuh sebelum jam pulang.",
      "Banyak murid sebenarnya punya tumbler, tapi lupa membawanya.",
      "Penjual mau memberi potongan harga kalau pembeli membawa wadah sendiri."
    ],
    tanya: "Solusi mana yang paling efektif mengurangi sampah kantin?",
    pilihan: ["Gelas isi ulang + diskon untuk yang membawa tumbler", "Menambah jumlah tong sampah di kantin", "Membakar sampah plastik setiap minggu", "Melarang murid membeli minuman"] },
  { id: "m2", judul: "Taman Sekolah",
    petunjuk: [
      "Setiap pagi petugas menyapu sekitar 3 karung daun kering.",
      "Selama ini daun kering dibakar di belakang sekolah.",
      "Asap pembakaran membuat kelas di dekatnya batuk-batuk.",
      "Sekolah punya lahan kosong kecil di dekat taman.",
      "Kebun sayur sekolah membutuhkan pupuk."
    ],
    tanya: "Apa yang sebaiknya dilakukan dengan daun kering itu?",
    pilihan: ["Diolah menjadi kompos untuk kebun sekolah", "Dibakar lebih pagi supaya asapnya tidak mengganggu", "Dibuang ke sungai dekat sekolah", "Dimasukkan ke tong sampah anorganik"] },
  { id: "m3", judul: "Bank Sampah Kelas",
    petunjuk: [
      "Kelas 7 ingin membuat bank sampah kelas.",
      "Pengepul hanya mau menerima botol plastik yang bersih dan kering.",
      "Selama ini botol plastik dibuang bercampur sisa makanan.",
      "Kertas yang basah dan kotor tidak laku dijual.",
      "Uang hasil bank sampah akan dipakai untuk kas kelas."
    ],
    tanya: "Langkah pertama yang paling penting agar bank sampah berhasil?",
    pilihan: ["Memilah sampah sejak dari kelas supaya terpisah dan tetap bersih", "Mengumpulkan sampah sebanyak-banyaknya tanpa dipilah", "Membeli satu tong sampah besar yang baru", "Menyerahkan semua pemilahan ke petugas kebersihan"] },
  { id: "m4", judul: "Kardus di Lab Komputer",
    petunjuk: [
      "Di lab komputer ada kardus berisi baterai bekas dan lampu rusak.",
      "Petugas berencana membuangnya ke tong sampah biasa.",
      "Baterai dan lampu neon mengandung bahan berbahaya seperti logam berat dan merkuri.",
      "Ada tempat pengumpulan sampah B3 dan elektronik di dekat sekolah.",
      "Sampah biasa dari sekolah berakhir di TPA tanpa penanganan khusus."
    ],
    tanya: "Apa tindakan yang paling tepat?",
    pilihan: ["Memisahkannya sebagai sampah B3 lalu menyerahkan ke tempat pengumpulan B3", "Membuangnya ke tong biasa tapi dibungkus rapat", "Menguburnya di halaman sekolah", "Membakarnya supaya habis"] }
];

/* ---------- BABAK 5: FINAL POIN GANDA (campuran) ----------
   Soal tampil BERSAMAAN di layar proyektor dan HP. */
const SOAL_FINAL = [
  { id: "f1", kompetensi: "K1", tanya: "Kulit pisang termasuk sampah…",
    pilihan: ["Organik", "Anorganik", "B3", "Residu"], info: "Kulit buah mudah membusuk." },
  { id: "f2", kompetensi: "K1", tanya: "Baterai bekas termasuk sampah…",
    pilihan: ["B3", "Organik", "Anorganik", "Residu"], info: "Baterai mengandung logam berbahaya." },
  { id: "f3", kompetensi: "K2", tanya: "Reduce artinya…",
    pilihan: ["Mengurangi pemakaian barang yang menjadi sampah", "Memakai barang bekas untuk fungsi lain", "Mengolah sampah menjadi barang baru", "Membuang sampah di tempatnya"], info: "Reduce adalah langkah 3R yang paling utama." },
  { id: "f4", kompetensi: "K2", tanya: "Mana yang BUKAN manfaat memilah sampah?",
    pilihan: ["Membuat sampah lebih cepat menumpuk", "Memudahkan daur ulang", "Sampah organik bisa jadi kompos", "Mengurangi sampah yang dibawa ke TPA"], info: "Memilah justru mengurangi tumpukan sampah." },
  { id: "f5", kompetensi: "K3", tanya: "Kamu lupa membawa tempat makan. Saat membeli nasi di kantin, pilihan paling ramah lingkungan adalah…",
    pilihan: ["Makan di kantin memakai piring kantin", "Minta dibungkus styrofoam", "Minta dibungkus plastik dobel", "Tidak usah makan"], info: "Piring yang bisa dicuci tidak menjadi sampah." },
  { id: "f6", kompetensi: "K3", tanya: "Ada botol kaca bekas sirup di rumah. Cara Reuse yang tepat adalah…",
    pilihan: ["Dicuci lalu dipakai lagi sebagai wadah", "Dipecahkan lalu dibuang", "Dibuang ke tong organik", "Dibakar"], info: "Botol kaca awet dan aman dipakai ulang setelah dicuci." }
];

/* Pengaturan babak final: detik menjawab + detik melihat jawaban per soal */
const FINAL_JAWAB = 20;
const FINAL_BAHAS = 10;
