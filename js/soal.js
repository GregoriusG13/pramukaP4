/* =========================================================
   BANK SOAL MISI SAMPAH
   Silakan edit / tambah soal di file ini.
   - Untuk soal pilihan ganda, jawaban BENAR selalu ditulis
     di urutan PERTAMA (indeks 0). Urutan pilihan diacak
     otomatis untuk setiap murid.
   - Semua murid mendapat soal yang SAMA, hanya urutannya
     yang diacak. Soal sengaja dibuat banyak supaya murid
     tetap sibuk sampai waktu habis. Nilai dihitung dari soal
     yang DIKERJAKAN (lihat MIN_DIKERJAKAN di game.js).
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
  { id: "p20", nama: "Puntung rokok",           ikon: "🚬", tong: "residu",    info: "Puntung rokok tidak bisa didaur ulang." },

  // --- Organik (tambahan) ---
  { id: "p21", nama: "Kulit jeruk",             ikon: "🍊", tong: "organik",   info: "Kulit buah cepat membusuk dan bisa dikomposkan." },
  { id: "p22", nama: "Kulit semangka",          ikon: "🍉", tong: "organik",   info: "Sisa buah termasuk sampah organik." },
  { id: "p23", nama: "Sisa sayur bayam",        ikon: "🥬", tong: "organik",   info: "Sisa sayur bagus untuk kompos." },
  { id: "p24", nama: "Tulang ikan",             ikon: "🐟", tong: "organik",   info: "Sisa makanan dari hewan juga organik." },
  { id: "p25", nama: "Ampas kelapa",            ikon: "🥥", tong: "organik",   info: "Ampas kelapa mudah terurai." },
  { id: "p26", nama: "Bonggol jagung",          ikon: "🌽", tong: "organik",   info: "Bonggol jagung bisa jadi kompos atau pakan ternak." },
  { id: "p27", nama: "Kulit bawang",            ikon: "🧅", tong: "organik",   info: "Kulit bawang berasal dari tumbuhan, jadi organik." },
  { id: "p28", nama: "Bunga layu",              ikon: "🥀", tong: "organik",   info: "Bunga dan daun layu bisa dikomposkan." },
  { id: "p29", nama: "Kulit kentang",           ikon: "🥔", tong: "organik",   info: "Kulit umbi-umbian termasuk organik." },
  { id: "p30", nama: "Sisa roti",               ikon: "🍞", tong: "organik",   info: "Sisa makanan termasuk organik." },

  // --- Anorganik (tambahan) ---
  { id: "p31", nama: "Kardus bekas",            ikon: "📦", tong: "anorganik", info: "Kardus kering bisa didaur ulang dan laku di bank sampah." },
  { id: "p32", nama: "Koran bekas",             ikon: "📰", tong: "anorganik", info: "Kertas kering bisa didaur ulang." },
  { id: "p33", nama: "Kertas HVS bekas",        ikon: "📄", tong: "anorganik", info: "Kertas bersih dan kering bisa didaur ulang." },
  { id: "p34", nama: "Kantong plastik bersih",  ikon: "🛍️", tong: "anorganik", info: "Kantong plastik bersih bisa dipakai ulang atau didaur ulang." },
  { id: "p35", nama: "Keranjang plastik rusak", ikon: "🧺", tong: "anorganik", info: "Plastik keras bisa dicacah dan didaur ulang." },
  { id: "p36", nama: "Baut dan paku bekas",     ikon: "🔩", tong: "anorganik", info: "Logam bekas bisa dilebur ulang." },
  { id: "p37", nama: "Botol kecap kaca",        ikon: "🍶", tong: "anorganik", info: "Botol kaca bisa dicuci dan dipakai lagi." },
  { id: "p38", nama: "Mainan plastik rusak",    ikon: "🪀", tong: "anorganik", info: "Plastik keras bisa didaur ulang." },
  { id: "p39", nama: "Toples bekas",            ikon: "🫙", tong: "anorganik", info: "Toples bisa dipakai ulang jadi wadah." },
  { id: "p40", nama: "Klip kertas & staples bekas", ikon: "📎", tong: "anorganik", info: "Logam kecil tetap bisa didaur ulang." },

  // --- B3 (tambahan) ---
  { id: "p41", nama: "HP rusak",                ikon: "📱", tong: "b3",        info: "Sampah elektronik mengandung logam berat berbahaya." },
  { id: "p42", nama: "Kabel & charger rusak",   ikon: "🔌", tong: "b3",        info: "Sampah elektronik harus dipisah sebagai B3." },
  { id: "p43", nama: "Tinta printer bekas",     ikon: "🖨️", tong: "b3",       info: "Tinta mengandung bahan kimia berbahaya." },
  { id: "p44", nama: "Botol cairan kimia lab",  ikon: "🧪", tong: "b3",        info: "Wadah bahan kimia termasuk sampah B3." },
  { id: "p45", nama: "Kaleng sisa cat tembok",  ikon: "🎨", tong: "b3",        info: "Sisa cat mengandung bahan kimia berbahaya." },
  { id: "p46", nama: "Botol cairan pemutih",    ikon: "🫧", tong: "b3",        info: "Pemutih pakaian bersifat korosif dan beracun." },
  { id: "p47", nama: "Laptop rusak",            ikon: "💻", tong: "b3",        info: "Sampah elektronik termasuk B3." },
  { id: "p48", nama: "Baterai HP soak",         ikon: "🪫", tong: "b3",        info: "Baterai bisa bocor dan meledak kalau dibuang sembarangan." },
  { id: "p49", nama: "Kemasan racun tikus",     ikon: "☠️", tong: "b3",        info: "Kemasan racun dan pestisida sangat berbahaya." },
  { id: "p50", nama: "Aki motor bekas",         ikon: "🛵", tong: "b3",        info: "Aki berisi asam dan timbal yang berbahaya." },

  // --- Residu (tambahan) ---
  { id: "p51", nama: "Plester luka bekas",      ikon: "🩹", tong: "residu",    info: "Plester bekas tidak bisa didaur ulang." },
  { id: "p52", nama: "Masker sekali pakai bekas", ikon: "😷", tong: "residu",  info: "Masker bekas dibuang sebagai residu, sebaiknya digunting dulu." },
  { id: "p53", nama: "Bungkus permen",          ikon: "🍬", tong: "residu",    info: "Bungkus kecil berlapis sulit didaur ulang." },
  { id: "p54", nama: "Bungkus mi instan",       ikon: "🍜", tong: "residu",    info: "Kemasan berlapis aluminium dan plastik sulit diolah." },
  { id: "p55", nama: "Kemasan saset kecap",     ikon: "🧂", tong: "residu",    info: "Kemasan saset hampir tidak bisa didaur ulang." },
  { id: "p56", nama: "Sikat gigi bekas",        ikon: "🪥", tong: "residu",    info: "Campuran plastik dan bulu sikat sulit dipisah." },
  { id: "p57", nama: "Pulpen bekas",            ikon: "🖊️", tong: "residu",   info: "Pulpen terdiri dari campuran bahan, jadi residu." },
  { id: "p58", nama: "Spons cuci piring bekas", ikon: "🧽", tong: "residu",    info: "Spons bekas tidak bisa didaur ulang." },
  { id: "p59", nama: "Debu sapuan lantai",      ikon: "🧹", tong: "residu",    info: "Debu dan kotoran sapuan masuk residu." },
  { id: "p60", nama: "Kotak makanan berminyak", ikon: "🥡", tong: "residu",    info: "Kertas yang sudah berminyak tidak bisa didaur ulang." }
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
    info: "Asap plastik berbahaya untuk pernapasan." },
  { id: "k11", tanya: "Mikroplastik adalah…",
    pilihan: ["Potongan plastik sangat kecil yang mencemari air dan tanah", "Plastik baru yang dijual di toko", "Bakteri pengurai sampah", "Debu halus dari kayu"],
    info: "Ukurannya kurang dari 5 mm dan bisa masuk ke tubuh hewan." },
  { id: "k12", tanya: "Dari prinsip 3R, mana yang paling utama dilakukan PERTAMA?",
    pilihan: ["Reduce", "Reuse", "Recycle", "Semuanya sama saja"],
    info: "Paling baik adalah tidak menghasilkan sampah sejak awal." },
  { id: "k13", tanya: "Undang-undang yang mengatur pengelolaan sampah di Indonesia adalah…",
    pilihan: ["UU Nomor 18 Tahun 2008", "UU Nomor 12 Tahun 2010", "UU Nomor 20 Tahun 2003", "UU Nomor 32 Tahun 2009"],
    info: "UU 18/2008 tentang Pengelolaan Sampah. UU 12/2010 adalah tentang Gerakan Pramuka." },
  { id: "k14", tanya: "Lubang resapan biopori berguna untuk…",
    pilihan: ["Menyerap air hujan sekaligus mengolah sampah organik jadi kompos", "Membuang sampah plastik", "Menyimpan baterai bekas", "Tempat membakar sampah"],
    info: "Biopori membantu mencegah genangan air." },
  { id: "k15", tanya: "Maggot (larva lalat BSF) dimanfaatkan untuk…",
    pilihan: ["Mengurai sampah organik dengan cepat", "Mendaur ulang plastik", "Menetralkan sampah B3", "Membersihkan kaca"],
    info: "Maggot memakan sisa makanan dan bisa dijadikan pakan ternak." },
  { id: "k16", tanya: "TPS 3R adalah…",
    pilihan: ["Tempat mengolah sampah dengan prinsip 3R di lingkungan sekitar", "Tempat menumpuk sampah tanpa diolah", "Toko barang bekas", "Pabrik pembuat plastik"],
    info: "Di TPS 3R sampah dipilah, dikomposkan, dan didaur ulang." },
  { id: "k17", tanya: "Jenis sampah apa yang paling banyak dihasilkan rumah tangga di Indonesia?",
    pilihan: ["Sisa makanan", "Kaca", "Logam", "Sampah elektronik"],
    info: "Sisa makanan adalah penyumbang sampah terbesar. Jangan sisakan makananmu!" },
  { id: "k18", tanya: "Mengapa tumpukan sampah organik di TPA bisa berbahaya?",
    pilihan: ["Menghasilkan gas metana yang mudah terbakar", "Berubah menjadi plastik", "Membuat tanah jadi lebih subur", "Tidak berbahaya sama sekali"],
    info: "Gas metana bisa memicu kebakaran dan ledakan di TPA." },
  { id: "k19", tanya: "Simbol segitiga panah dengan angka di kemasan plastik menunjukkan…",
    pilihan: ["Jenis bahan plastik untuk daur ulang", "Tanggal kedaluwarsa", "Harga barang", "Jumlah isi kemasan"],
    info: "Kode ini membantu pemilahan plastik di tempat daur ulang." },
  { id: "k20", tanya: "Komposter adalah…",
    pilihan: ["Wadah untuk membuat kompos", "Alat pembakar sampah", "Mesin pencacah plastik", "Tempat sampah B3"],
    info: "Komposter bisa dibuat dari ember atau tong bekas." },
  { id: "k21", tanya: "Upcycling artinya…",
    pilihan: ["Mengubah barang bekas menjadi barang baru yang nilainya lebih tinggi", "Membuang sampah ke tempat yang tinggi", "Membakar sampah", "Membeli barang baru"],
    info: "Contoh: ban bekas dijadikan kursi taman." },
  { id: "k22", tanya: "Sampah residu adalah sampah yang…",
    pilihan: ["Sulit atau tidak bisa didaur ulang", "Mudah membusuk", "Mengandung racun", "Bisa dijual mahal"],
    info: "Residu biasanya berakhir di TPA, jadi sebaiknya dikurangi." },
  { id: "k23", tanya: "Mana yang merupakan contoh REUSE?",
    pilihan: ["Memakai toples bekas sebagai tempat pensil", "Mengolah kertas bekas jadi kertas baru", "Menolak sedotan plastik", "Membakar sampah kering"],
    info: "Reuse = barang dipakai lagi tanpa diolah ulang." },
  { id: "k24", tanya: "Mana yang merupakan contoh RECYCLE?",
    pilihan: ["Kertas bekas diolah menjadi kertas daur ulang", "Memakai tas belanja kain", "Memakai kembali botol minum", "Mengurangi jajan berkemasan"],
    info: "Recycle = bahan diolah menjadi produk baru." },
  { id: "k25", tanya: "Apa manfaat bank sampah bagi warga?",
    pilihan: ["Mengurangi sampah sekaligus menghasilkan tabungan", "Membuat sampah makin banyak", "Tempat membakar sampah", "Menyimpan sampah selamanya"],
    info: "Sampah bernilai ditimbang lalu dicatat sebagai tabungan." },
  { id: "k26", tanya: "Sampah elektronik seperti HP rusak termasuk sampah…",
    pilihan: ["B3", "Organik", "Residu biasa", "Anorganik biasa"],
    info: "Komponen elektronik mengandung logam berat." },
  { id: "k27", tanya: "Kapan waktu terbaik untuk memilah sampah?",
    pilihan: ["Sejak dari sumbernya, misalnya di rumah atau kelas", "Setelah sampai di TPA", "Setelah sampah dibakar", "Tidak perlu dipilah"],
    info: "Sampah yang sudah tercampur sulit dipisahkan lagi." },
  { id: "k28", tanya: "Apa dampak sampah plastik di laut bagi hewan?",
    pilihan: ["Hewan bisa mengira plastik sebagai makanan", "Hewan jadi lebih sehat", "Air laut jadi lebih jernih", "Tidak ada dampaknya"],
    info: "Penyu sering mengira kantong plastik sebagai ubur-ubur." },
  { id: "k29", tanya: "Membuang sampah ke sungai dapat menyebabkan…",
    pilihan: ["Banjir saat hujan deras", "Air sungai lebih bersih", "Ikan bertambah banyak", "Sungai lebih dalam"],
    info: "Sampah menyumbat aliran air." },
  { id: "k30", tanya: "Kenapa sampah B3 tidak boleh dicampur dengan sampah biasa?",
    pilihan: ["Bisa mencemari tanah dan air serta membahayakan petugas", "Karena warnanya berbeda", "Karena lebih berat", "Karena mudah membusuk"],
    info: "B3 butuh penanganan khusus." }
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
    info: "Barang bekas diberi nilai baru = Reuse dan Recycle." },
  { id: "s11", tanya: "Pensilmu patah jadi dua, tapi kedua potongannya masih cukup panjang. Apa yang kamu lakukan?",
    pilihan: ["Meraut kedua potongan dan memakainya lagi", "Membuang keduanya dan membeli pensil baru", "Membuang satu, menyimpan satu tanpa dipakai", "Mematahkannya lagi"],
    info: "Memakai barang sampai habis mengurangi sampah." },
  { id: "s12", tanya: "Kamu diminta ibu berbelanja ke minimarket. Apa yang sebaiknya kamu bawa?",
    pilihan: ["Tas belanja sendiri", "Tidak membawa apa-apa, nanti minta kantong plastik", "Minta kantong plastik tambahan", "Kantong plastik baru dari rumah untuk dibuang"],
    info: "Tas belanja yang dipakai berulang mengurangi sampah kantong plastik." },
  { id: "s13", tanya: "Kamu membeli es teh dan bisa meminumnya langsung dari gelas. Penjual menawarkan sedotan. Apa yang kamu lakukan?",
    pilihan: ["Menolak sedotan", "Minta dua sedotan", "Menerima sedotan lalu membuangnya", "Menyimpan sedotan di laci"],
    info: "Menolak barang sekali pakai yang tidak perlu = Reduce." },
  { id: "s14", tanya: "Kamu melihat botol plastik di dalam tong sampah organik. Apa yang kamu lakukan?",
    pilihan: ["Memindahkannya ke tong anorganik", "Membiarkannya saja", "Menambah sampah plastik lain ke tong itu", "Membakar isi tong"],
    info: "Sampah yang salah tong membuat pengolahan jadi sulit." },
  { id: "s15", tanya: "Lampu belajarmu di rumah rusak. Bagaimana membuangnya?",
    pilihan: ["Menyimpannya terpisah sebagai B3 lalu menyerahkan ke pengumpulan sampah B3", "Membuangnya ke tong organik", "Memecahkannya dulu supaya muat", "Membuangnya ke sungai"],
    info: "Lampu bisa mengandung merkuri, jangan dipecahkan." },
  { id: "s16", tanya: "Bajumu sudah kekecilan tapi masih bagus. Apa yang paling tepat?",
    pilihan: ["Menyumbangkannya kepada yang membutuhkan", "Membuangnya ke tempat sampah", "Membakarnya", "Menyimpannya selamanya di lemari"],
    info: "Barang layak pakai bisa bermanfaat untuk orang lain." },
  { id: "s17", tanya: "Kamu punya banyak kertas ulangan bekas yang hanya terpakai satu sisi. Apa yang kamu lakukan?",
    pilihan: ["Memakai sisi kosongnya untuk coretan, lalu menyetor ke bank sampah", "Langsung membuangnya", "Membakarnya", "Membasahinya lalu dibuang"],
    info: "Pakai ulang dulu, baru daur ulang." },
  { id: "s18", tanya: "Kantin menyediakan mangkuk yang bisa dicuci dan juga kemasan styrofoam. Kamu makan di kantin. Pilih yang mana?",
    pilihan: ["Mangkuk yang bisa dicuci", "Kemasan styrofoam", "Styrofoam dibungkus plastik lagi", "Dua styrofoam supaya kuat"],
    info: "Styrofoam termasuk residu yang sulit diolah." },
  { id: "s19", tanya: "Kamu memegang bungkus jajan, tapi tidak ada tempat sampah di dekatmu. Apa yang kamu lakukan?",
    pilihan: ["Menyimpannya di tas sampai menemukan tempat sampah", "Membuangnya di pinggir jalan", "Menyelipkannya di bawah bangku", "Membuangnya ke selokan"],
    info: "Bertanggung jawab atas sampah sendiri adalah sikap Pramuka." },
  { id: "s20", tanya: "Temanmu ingin membakar tumpukan daun kering di halaman rumahnya. Apa saranmu?",
    pilihan: ["Menjadikan daun itu kompos", "Membakarnya malam hari saja", "Menambahkan plastik supaya cepat terbakar", "Membuangnya ke sungai"],
    info: "Asap pembakaran mengganggu kesehatan, kompos menyuburkan tanah." },
  { id: "s21", tanya: "Selokan di depan rumahmu tersumbat sampah plastik. Apa yang paling tepat?",
    pilihan: ["Mengajak keluarga dan tetangga kerja bakti membersihkan dan memilah sampahnya", "Membiarkannya sampai banjir", "Menambahkan tanah supaya tertutup", "Membakar sampah di selokan"],
    info: "Kerja bakti mencegah banjir dan penyakit." },
  { id: "s22", tanya: "HP lamamu rusak total dan tidak bisa diperbaiki. Apa yang kamu lakukan?",
    pilihan: ["Menyerahkannya ke tempat pengumpulan sampah elektronik", "Membuangnya ke tong sampah biasa", "Membakarnya", "Menguburnya di halaman"],
    info: "Sampah elektronik termasuk B3." },
  { id: "s23", tanya: "Kamu membawa bekal makan siang ke sekolah. Wadah apa yang paling ramah lingkungan?",
    pilihan: ["Kotak bekal yang bisa dicuci dan dipakai lagi", "Kantong plastik sekali pakai", "Styrofoam", "Bungkus kertas minyak"],
    info: "Wadah pakai ulang tidak menambah sampah setiap hari." },
  { id: "s24", tanya: "Regumu ditugasi membuat poster tentang sampah. Bahan apa yang paling cocok?",
    pilihan: ["Kardus atau kertas bekas", "Membeli banyak kertas karton baru", "Styrofoam baru", "Plastik laminasi berlapis-lapis"],
    info: "Poster tentang sampah lebih bermakna kalau dibuat dari bahan bekas." },
  { id: "s25", tanya: "Di rumahmu menumpuk banyak botol plastik bekas. Apa yang sebaiknya dilakukan?",
    pilihan: ["Mencuci, mengeringkan, lalu menyetornya ke bank sampah", "Membakarnya di halaman", "Membuangnya ke sungai", "Mencampurnya dengan sisa makanan"],
    info: "Botol bersih dan kering bernilai di bank sampah." },
  { id: "s26", tanya: "Saat kegiatan Pramuka, panitia menyediakan galon air minum. Apa yang kamu lakukan?",
    pilihan: ["Mengisi botol minum sendiri dari galon", "Tetap membeli air kemasan gelas", "Minta gelas plastik baru setiap kali minum", "Tidak minum seharian"],
    info: "Isi ulang = tanpa sampah kemasan." },
  { id: "s27", tanya: "Selesai upacara, lapangan sekolah penuh sampah plastik. Apa yang kamu lakukan?",
    pilihan: ["Ikut memungut dan memilah sampah bersama teman", "Pura-pura tidak melihat", "Menunggu petugas kebersihan saja", "Menendang sampah ke pinggir lapangan"],
    info: "Pramuka peduli dan rela menolong." },
  { id: "s28", tanya: "Di rumah ada minyak goreng bekas (jelantah). Bagaimana membuangnya?",
    pilihan: ["Mengumpulkannya dalam botol lalu menyetor ke pengepul atau bank sampah jelantah", "Menuangnya ke wastafel", "Membuangnya ke selokan", "Menyiramkannya ke tanaman"],
    info: "Jelantah menyumbat saluran air dan mencemari tanah." },
  { id: "s29", tanya: "Adikmu ingin membuang mainan plastik yang masih bagus. Apa saranmu?",
    pilihan: ["Memberikannya kepada anak lain yang membutuhkan", "Membuangnya ke tong residu", "Membakarnya", "Menyimpannya di gudang selamanya"],
    info: "Barang yang masih layak bisa dipakai orang lain (Reuse)." },
  { id: "s30", tanya: "Kamu terpilih jadi pengurus kelas dan ingin kelas bebas sampah berserakan. Langkah apa yang paling tepat?",
    pilihan: ["Membuat jadwal piket dan menyediakan tong sampah terpilah", "Melarang teman makan di sekolah", "Menyimpan semua sampah di laci", "Membakar sampah kelas setiap pulang"],
    info: "Sistem yang jelas membuat kebiasaan baik lebih mudah." }
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
    pilihan: ["Memisahkannya sebagai sampah B3 lalu menyerahkan ke tempat pengumpulan B3", "Membuangnya ke tong biasa tapi dibungkus rapat", "Menguburnya di halaman sekolah", "Membakarnya supaya habis"] },
  { id: "m5", judul: "Perkemahan Sabtu-Minggu",
    petunjuk: [
      "Tahun lalu perkemahan menghasilkan banyak sekali botol air minum plastik.",
      "Panitia bisa menyediakan galon air minum di setiap tenda.",
      "Setiap peserta wajib membawa perlengkapan pribadi.",
      "Tempat sampah di bumi perkemahan sedikit dan jauh dari tenda.",
      "Pengelola meminta lokasi perkemahan dikembalikan dalam keadaan bersih."
    ],
    tanya: "Aturan apa yang paling tepat untuk perkemahan tahun ini?",
    pilihan: ["Wajib bawa botol minum sendiri, isi ulang dari galon, dan sampah dibawa pulang dalam kantong terpilah", "Membagikan lebih banyak air botol plastik", "Membakar semua sampah di api unggun setiap malam", "Mengubur sampah di sekitar tenda"] },
  { id: "m6", judul: "Sampah Kertas Kelas",
    petunjuk: [
      "Setiap minggu kelasmu membuang dua kantong besar berisi kertas.",
      "Sebagian besar kertas itu baru terpakai satu sisi.",
      "Kertas bekas yang kering bisa dijual ke bank sampah.",
      "Guru mengizinkan latihan soal dikerjakan di kertas bekas.",
      "Sekolah sudah punya bank sampah."
    ],
    tanya: "Rencana apa yang paling baik untuk kelasmu?",
    pilihan: ["Memakai sisi kosong untuk latihan, lalu kertas yang penuh disetor ke bank sampah", "Membuang semua kertas ke tong residu", "Membakar kertas bekas setiap minggu", "Membeli kertas baru yang lebih tipis"] }
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
