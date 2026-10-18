/* =====================================================
   DB SIMULASI (localStorage) – mengikuti 12 tabel di dokumen
   tamu, tipe_kamar, kamar, reservasi, pembayaran, fasilitas, staf,
   admin, ulasan, layanan_tambahan, pemakaian_layanan, promo
   Catatan: ini hanya untuk demo di browser. Di proyek sungguhan
   ganti dengan PHP + MySQL dan password di-hash (bcrypt).
   ===================================================== */
const KEY = "hos_db_v2";
const JAM_CHECKIN = "14.00", JAM_CHECKOUT = "12.00";
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;
const LBL = { menunggu_pembayaran:"Menunggu pembayaran", dikonfirmasi:"Dikonfirmasi", "check-in":"Check-in", "check-out":"Selesai (check-out)", dibatalkan:"Dibatalkan", lunas:"Lunas", menunggu_verifikasi:"Menunggu verifikasi", ditolak:"Ditolak" };

const rp = n => "Rp " + Number(n).toLocaleString("id-ID");
const iso = d => d.toISOString().slice(0, 10);
const todayS = () => iso(new Date());
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d); };
const nights = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const nid = (arr, k) => arr.reduce((m, x) => Math.max(m, x[k]), 0) + 1;
const hashPw = s => { let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); } h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909); h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909); return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16); };

let db;
db = load();
function load() { try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} const d = seed(); try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} return d; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
function reload() { db = load(); }
function resetDB() { try { localStorage.removeItem(KEY); } catch (e) {} db = load(); }

function seed() {
  const d = {
    tipe_kamar: [
      { id_tipe:1, nama_tipe:"Reguler", harga_per_malam:650000, kapasitas:2, jumlah_tempat_tidur:1, foto:U("1631049307264-da0ec9d70304"),
        deskripsi:"Cocok untuk menginap semalam yang hanya butuh tempat tidur.",
        fasilitas:["Tempat tidur nyaman (Single/Double Bed)","Lemari pakaian minimalis dan meja kerja","TV LED dan AC","Pembuat kopi/teh","Kamar mandi standar bersih, shower air hangat/dingin"] },
      { id_tipe:2, nama_tipe:"Eksekutif", harga_per_malam:1250000, kapasitas:3, jumlah_tempat_tidur:1, foto:U("1566665797739-1674de7a421a"),
        deskripsi:"Kenyamanan ekstra dengan pemandangan kota untuk tamu yang ingin lebih santai.",
        fasilitas:["Ruangan lebih luas dengan city view","Kasur Double/Queen lebih empuk dan lebar","Lemari pakaian besar, TV LED layar datar 43 inci","Sofa santai di dalam kamar","Kamar mandi dengan bathtub elegan dan perlengkapan mandi premium"] },
      { id_tipe:3, nama_tipe:"VIP", harga_per_malam:2800000, kapasitas:4, jumlah_tempat_tidur:2, foto:U("1578774204375-826dc5d996ed"),
        deskripsi:"Kenyamanan dan fasilitas maksimal yang tiada duanya, di lantai tertinggi.",
        fasilitas:["Panoramic view dari lantai tertinggi, kamar sangat luas","Kasur standar luxury hotel yang sangat empuk","Ruang tamu: sofa mewah, Smart TV 55 inci, minibar gratis","2 kamar mandi, masing-masing dengan shower terpisah","Bathtub jacuzzi eksklusif"] }
    ],
    kamar: [],
    tamu: [
      { id_tamu:1, nama:"Rina Anggraini", no_hp:"081234567801", email:"rina@example.com", alamat:"Jakarta", no_identitas:"" },
      { id_tamu:2, nama:"Budi Santoso", no_hp:"081234567802", email:"budi@example.com", alamat:"Bandung", no_identitas:"" },
      { id_tamu:3, nama:"Clara Wijaya", no_hp:"081234567803", email:"clara@example.com", alamat:"Surabaya", no_identitas:"" }
    ],
    reservasi: [], pembayaran: [], ulasan: [], pemakaian_layanan: [],
    fasilitas: [
      { id_fasilitas:1, kunci:"pool", nama:"Swimming Pool", jam_operasional:"06.00–21.00", deskripsi:"Kolam renang outdoor air hangat dengan pemandangan cakrawala kota, lengkap dengan area berjemur dan kursi santai (sun loungers)." },
      { id_fasilitas:2, kunci:"lounge", nama:"Lounge", jam_operasional:"17.00–01.00", deskripsi:"Tempat santai elegan di lantai atas dengan suasana akustik di malam hari." },
      { id_fasilitas:3, kunci:"bar", nama:"Bar", jam_operasional:"17.00–01.00", deskripsi:"Koktail premium dan anggur pilihan, diracik langsung oleh bartender kami." },
      { id_fasilitas:4, kunci:"resto", nama:"Restaurant", jam_operasional:"06.00–23.00", deskripsi:"Restoran utama berkonsep fine dining, menyajikan menu lokal nusantara hingga hidangan internasional kelas atas." },
      { id_fasilitas:5, kunci:"gym", nama:"Gym & Pusat Kebugaran", jam_operasional:"05.30–22.00", deskripsi:"Ruang fitness modern berstandar internasional dengan alat angkat beban, treadmill, sepeda statis, dan instruktur profesional." },
      { id_fasilitas:6, kunci:"spa", nama:"Spa & Wellness", jam_operasional:"10.00–21.00", deskripsi:"Layanan relaksasi tubuh, pijat tradisional, aromaterapi, dan sauna untuk memulihkan kebugaran tamu." },
      { id_fasilitas:7, kunci:"meeting", nama:"Meeting & Event Rooms", jam_operasional:"08.00–22.00", deskripsi:"Ruang pertemuan berteknologi tinggi untuk acara korporat, seminar, maupun resepsi pernikahan privat." }
    ],
    staf: [
      { id_staf:1, nama:"Andi Pratama", jabatan:"Security", no_hp:"081200000001" },
      { id_staf:2, nama:"Sari Dewi", jabatan:"Resepsionis", no_hp:"081200000002" }
    ],
    admin: [
      { id_admin:1, username:"admin", password:hashPw("admin123"), nama:"Administrator", role:"admin" },
      { id_admin:2, username:"resepsionis", password:hashPw("resep123"), nama:"Sari Dewi", role:"resepsionis" }
    ],
    layanan_tambahan: [
      { id_layanan:1, nama:"Room Service (biaya antar)", harga:50000 },
      { id_layanan:2, nama:"Laundry (per kg)", harga:25000 },
      { id_layanan:3, nama:"Spa (1 sesi)", harga:350000 }
    ],
    promo: [
      { id_promo:1, kode:"SPOT10", potongan:10, tgl_mulai:addDays(-30), tgl_selesai:addDays(365) },
      { id_promo:2, kode:"LIBURAN15", potongan:15, tgl_mulai:addDays(-30), tgl_selesai:addDays(365) }
    ]
  };
  [[1, 5], [2, 4], [3, 2]].forEach(([t, n]) => { for (let i = 1; i <= n; i++) d.kamar.push({ id_kamar: d.kamar.length + 1, no_kamar: String(t * 100 + i), id_tipe: t, status: "tersedia" }); });
  db = d;
  const mk = (kode, tamu, kamar, a, b, st, jml, req, promo) => {
    const r = { id_reservasi: d.reservasi.length + 1, kode_booking: kode, id_tamu: tamu, id_kamar: kamar, id_promo: promo || null, tgl_checkin: addDays(a), tgl_checkout: addDays(b), jumlah_tamu: jml, permintaan_khusus: req || "", total_harga: 0, status: st };
    d.reservasi.push(r); r.total_harga = hitungTotal(r);
    if (st !== "menunggu_pembayaran") d.pembayaran.push({ id_pembayaran: d.pembayaran.length + 1, id_reservasi: r.id_reservasi, metode: "Transfer Bank", jumlah: r.total_harga, tgl_bayar: addDays(a - 2), status: "lunas" });
    return r;
  };
  mk("HOS-D3M001", 3, 10, -20, -18, "check-out", 2, "Dekorasi anniversary");
  mk("HOS-D3M002", 1, 6, -14, -12, "check-out", 2);
  mk("HOS-D3M003", 2, 1, -10, -9, "check-out", 1);
  mk("HOS-D3M004", 1, 7, 0, 2, "dikonfirmasi", 2, "Lantai tinggi", 1);
  mk("HOS-D3M005", 2, 2, -1, 0, "check-in", 1); d.kamar[1].status = "terisi";
  const w = mk("HOS-D3M006", 2, 3, 5, 7, "menunggu_pembayaran", 2);
  d.pembayaran.push({ id_pembayaran: d.pembayaran.length + 1, id_reservasi: w.id_reservasi, metode: "QRIS", jumlah: w.total_harga, tgl_bayar: todayS(), status: "menunggu_verifikasi" });
  [[1, 3, 1, 5, "Pemandangan kota luar biasa, jacuzzi-nya nyaman. Resepsionis sangat sigap membantu dekorasi."], [2, 2, 2, 5, "Kamar luas dan bersih, bathtub-nya nyaman. Keamanan hotel juga terasa terjaga."], [3, 1, 3, 4, "Kamar bersih dan lokasi strategis, cocok untuk perjalanan bisnis."]]
    .forEach(([res, tm, , rt, k], i) => d.ulasan.push({ id_ulasan: i + 1, id_tamu: tm, id_reservasi: res, rating: rt, komentar: k, tgl_ulasan: addDays(-9 + i), tampil: true }));
  return d;
}

/* ===== LOGIKA BISNIS ===== */
function tipeOf(r) { return db.tipe_kamar.find(t => t.id_tipe === db.kamar.find(k => k.id_kamar === r.id_kamar).id_tipe); }
function hitungTotal(r) {
  const t = tipeOf(r), p = db.promo.find(x => x.id_promo === r.id_promo);
  const kamar = t.harga_per_malam * nights(r.tgl_checkin, r.tgl_checkout);
  const pot = p ? Math.round(kamar * p.potongan / 100) : 0;
  const lay = db.pemakaian_layanan.filter(x => x.id_reservasi === r.id_reservasi).reduce((s, x) => s + x.subtotal, 0);
  return kamar - pot + lay;
}
const dibayar = r => db.pembayaran.filter(p => p.id_reservasi === r.id_reservasi && p.status === "lunas").reduce((s, p) => s + p.jumlah, 0);
function sinkronBayar(r) { if (r.status === "menunggu_pembayaran" && dibayar(r) >= r.total_harga) r.status = "dikonfirmasi"; }
function promoValid(kode) { const t = todayS(); return db.promo.find(p => p.kode === String(kode).trim().toUpperCase() && p.tgl_mulai <= t && p.tgl_selesai >= t); }
function freeRooms(id_tipe, ci, co) {
  return db.kamar.filter(k => k.id_tipe === +id_tipe && !db.reservasi.some(r => r.id_kamar === k.id_kamar && r.status !== "dibatalkan" && ci < r.tgl_checkout && co > r.tgl_checkin));
}
function buatReservasi(f) {
  const free = freeRooms(f.id_tipe, f.ci, f.co);
  if (!free.length) return { err: "Maaf, tipe kamar ini sudah penuh pada tanggal tersebut. Coba tanggal atau tipe lain." };
  let tamu = db.tamu.find(t => t.no_hp === f.hp && t.nama.toLowerCase() === f.nama.toLowerCase());
  if (!tamu) { tamu = { id_tamu: nid(db.tamu, "id_tamu"), nama: f.nama, no_hp: f.hp, email: f.email, alamat: f.alamat, no_identitas: f.ident }; db.tamu.push(tamu); }
  else { tamu.email = f.email || tamu.email; tamu.alamat = f.alamat || tamu.alamat; tamu.no_identitas = f.ident || tamu.no_identitas; }
  const p = f.promo ? promoValid(f.promo) : null;
  let kode; do { kode = "HOS-" + Math.random().toString(36).slice(2, 8).toUpperCase(); } while (db.reservasi.some(r => r.kode_booking === kode));
  const r = { id_reservasi: nid(db.reservasi, "id_reservasi"), kode_booking: kode, id_tamu: tamu.id_tamu, id_kamar: free[0].id_kamar, id_promo: p ? p.id_promo : null, tgl_checkin: f.ci, tgl_checkout: f.co, jumlah_tamu: f.jumlah, permintaan_khusus: f.req, total_harga: 0, status: "menunggu_pembayaran" };
  db.reservasi.push(r); r.total_harga = hitungTotal(r); save();
  return { r };
}
