const $ = s => document.querySelector(s);
const badge = s => {
  let c = 'bg-stone-200 text-stone-800';
  if (['lunas', 'dikonfirmasi', 'check-out'].includes(s)) c = 'bg-emerald-100 text-emerald-800';
  else if (['menunggu_pembayaran', 'menunggu_verifikasi'].includes(s)) c = 'bg-amber-100 text-amber-800';
  else if (s === 'check-in') c = 'bg-sky-100 text-sky-800';
  else if (['dibatalkan', 'ditolak'].includes(s)) c = 'bg-rose-100 text-rose-800';
  return `<span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${c}">${LBL[s] || s}</span>`;
};

function toast(m){ const t = $("#toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = "none", 2600); }
const TABS = [["dashboard","Dashboard"],["reservasi","Kelola Reservasi"],["kamar","Kelola Kamar"],["tipe","Kelola Tipe Kamar",true],["tamu","Data Tamu"],["bayar","Pembayaran"],["ulasan","Ulasan"]];
let me = null, tab = "dashboard";

$("#lf").onsubmit = e => {
  e.preventDefault(); reload();
  const a = db.admin.find(x => x.username === $("#u").value.trim() && x.password === hashPw($("#p").value));
  if (!a) return $("#le").textContent = "Username atau password salah.";
  sessionStorage.setItem("hos_admin", a.id_admin); start();
};
$("#out").onclick = () => { sessionStorage.removeItem("hos_admin"); location.reload(); };
$("#mburger").onclick = () => $("#side").classList.toggle("open");

function start(){
  reload(); me = db.admin.find(x => x.id_admin === +sessionStorage.getItem("hos_admin"));
  if (!me) return;
  $("#login").hidden = true; $("#app").hidden = false;
  $("#who").textContent = `${me.nama} (${me.role})`;
  $("#side").innerHTML = TABS.filter(t => !t[2] || me.role === "admin").map(t => `<a data-t="${t[0]}" class="block px-6 py-3 cursor-pointer border-l-4 border-transparent hover:bg-[#f5efe4] hover:border-[#b08a3e]">${t[1]}</a>`).join("") + `<a data-t="reset" class="block px-6 py-3 cursor-pointer border-l-4 border-transparent hover:bg-[#f5efe4] hover:border-red-500 text-red-600 font-medium">Reset data demo</a>`;
  render();
}

$("#side").onclick = e => {
  const t = e.target.dataset.t; if (!t) return;
  if (t === "reset") { if (confirm("Kembalikan semua data ke data demo awal?")) { resetDB(); toast("Data direset."); render(); } return; }
  tab = t; $("#side").classList.remove("open"); render();
};

const tm = id => db.tamu.find(x => x.id_tamu === id);
const km = id => db.kamar.find(x => x.id_kamar === id);
const tbl = (heads, rows) => `<div class="overflow-x-auto border border-[#e3d9c6] bg-[#fffdf9] shadow-sm"><table class="w-full border-collapse text-sm"><thead><tr class="bg-[#f5efe4]">${heads.map(h => `<th class="text-left p-3 font-medium whitespace-nowrap border-b border-[#e3d9c6]">${h}</th>`).join("")}</tr></thead><tbody>${rows.join("") || `<tr><td colspan="${heads.length}" class="p-4 text-center text-[#6d675d]">Belum ada data.</td></tr>`}</tbody></table></div>`;
const btn = (act, id, label, cls = "") => `<button class="border border-[#b08a3e] bg-transparent text-[#2b2a28] px-3 py-1 text-xs font-medium cursor-pointer transition hover:bg-[#b08a3e] ${cls}" data-act="${act}" data-id="${id}">${label}</button>`;

const V = {
  dashboard(){
    const t = todayS();
    const masuk = db.reservasi.filter(r => r.tgl_checkin === t && ["dikonfirmasi", "check-in"].includes(r.status));
    const keluar = db.reservasi.filter(r => r.tgl_checkout === t && r.status === "check-in");
    const terisi = db.kamar.filter(k => k.status === "terisi").length, bersih = db.kamar.filter(k => k.status === "dibersihkan").length, ready = db.kamar.filter(k => k.status === "tersedia").length;
    const omzet = db.pembayaran.filter(p => p.status === "lunas").reduce((s, p) => s + p.jumlah, 0);
    const bulan = db.pembayaran.filter(p => p.status === "lunas" && p.tgl_bayar.slice(0, 7) === t.slice(0, 7)).reduce((s, p) => s + p.jumlah, 0);
    const list = a => a.length ? a.map(r => `<li>${r.kode_booking} · ${esc(tm(r.id_tamu).nama)} · kamar ${km(r.id_kamar).no_kamar}</li>`).join("") : `<li class="text-[#6d675d]">Tidak ada.</li>`;
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Dashboard</h1>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="text-[#6d675d] text-sm">Check-in hari ini</p><p class="font-serif text-4xl text-[#b08a3e] font-semibold">${masuk.length}</p></div>
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="text-[#6d675d] text-sm">Check-out hari ini</p><p class="font-serif text-4xl text-[#b08a3e] font-semibold">${keluar.length}</p></div>
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="text-[#6d675d] text-sm">Kamar terisi vs tersedia</p><p class="font-serif text-4xl text-[#b08a3e] font-semibold">${terisi} / ${ready}</p><p class="text-xs text-[#6d675d] mt-1">${bersih} sedang dibersihkan · total ${db.kamar.length}</p></div>
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="text-[#6d675d] text-sm">Pendapatan (lunas)</p><p class="font-serif text-3xl text-[#b08a3e] font-semibold">${rp(omzet)}</p><p class="text-xs text-[#6d675d] mt-1">Bulan ini ${rp(bulan)}</p></div>
    </div>
    <div class="grid gap-4 md:grid-cols-2 mt-6">
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="font-serif text-2xl font-semibold mb-3">Check-in hari ini</p><ul class="list-disc pl-5 space-y-1">${list(masuk)}</ul></div>
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 shadow-sm"><p class="font-serif text-2xl font-semibold mb-3">Check-out hari ini</p><ul class="list-disc pl-5 space-y-1">${list(keluar)}</ul></div>
    </div>`;
  },
  reservasi(){
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Kelola Reservasi</h1>` + tbl(["Kode", "Tamu", "Kamar", "Tanggal", "Total", "Dibayar", "Status", "Aksi"], db.reservasi.slice().reverse().map(r => {
      const a = [];
      if (r.status === "menunggu_pembayaran") a.push(btn("konfirmasi", r.id_reservasi, "Konfirmasi"));
      if (r.status === "dikonfirmasi") a.push(btn("checkin", r.id_reservasi, "Check-in"));
      if (r.status === "check-in") a.push(btn("checkout", r.id_reservasi, "Check-out"), btn("layanan", r.id_reservasi, "+ Layanan"));
      if (["menunggu_pembayaran", "dikonfirmasi", "check-in"].includes(r.status) && dibayar(r) < r.total_harga) a.push(btn("catat", r.id_reservasi, "Catat bayar"));
      if (["menunggu_pembayaran", "dikonfirmasi"].includes(r.status)) a.push(btn("batal", r.id_reservasi, "Batalkan", "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"));
      return `<tr><td>${r.kode_booking}</td><td>${esc(tm(r.id_tamu).nama)}<br><span class="text-[#6d675d] text-xs">${esc(tm(r.id_tamu).no_hp)}</span></td><td>${km(r.id_kamar).no_kamar} · ${esc(tipeOf(r).nama_tipe)}</td><td>${r.tgl_checkin} → ${r.tgl_checkout}</td><td>${rp(r.total_harga)}</td><td>${rp(dibayar(r))}</td><td>${badge(r.status)}</td><td><div class="flex gap-1.5 flex-wrap">${a.join("") || "–"}</div></td></tr>`;
    }));
  },
  kamar(){
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Kelola Kamar</h1>` + tbl(["No. kamar", "Tipe", "Status", "Ubah status"], db.kamar.map(k => `<tr><td>${k.no_kamar}</td><td>${esc(db.tipe_kamar.find(t => t.id_tipe === k.id_tipe).nama_tipe)}</td><td>${k.status}</td><td><select data-kamar="${k.id_kamar}" class="bg-[#f5efe4] border border-[#e3d9c6] p-1.5 text-xs w-auto">${["tersedia", "terisi", "dibersihkan"].map(s => `<option ${s === k.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`));
  },
  tipe(){
    return `<h1 class="font-serif text-4xl font-semibold mb-2">Kelola Tipe Kamar</h1><p class="text-[#6d675d] mb-6 text-sm">Perubahan harga, foto, dan fasilitas langsung tampil di website tamu. Khusus admin.</p><div class="grid gap-5 lg:grid-cols-2">` + db.tipe_kamar.map(t => `
      <div class="bg-[#fffdf9] border border-[#e3d9c6] p-5 grid gap-3 shadow-sm" data-card="${t.id_tipe}"><p class="font-serif text-3xl font-semibold">${esc(t.nama_tipe)}</p>
        <div><label class="text-xs block mb-1">Harga per malam (Rp)</label><input data-f="harga" type="number" min="0" value="${t.harga_per_malam}" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm"></div>
        <div class="grid grid-cols-2 gap-3"><div><label class="text-xs block mb-1">Kapasitas</label><input data-f="kap" type="number" min="1" value="${t.kapasitas}" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm"></div><div><label class="text-xs block mb-1">Jumlah tempat tidur</label><input data-f="bed" type="number" min="1" value="${t.jumlah_tempat_tidur}" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm"></div></div>
        <div><label class="text-xs block mb-1">URL foto</label><input data-f="foto" value="${esc(t.foto)}" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm"></div>
        <div><label class="text-xs block mb-1">Deskripsi</label><textarea data-f="desk" rows="2" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm">${esc(t.deskripsi)}</textarea></div>
        <div><label class="text-xs block mb-1">Fasilitas (satu per baris)</label><textarea data-f="fas" rows="5" class="bg-[#f5efe4] border border-[#e3d9c6] p-2 w-full text-sm">${esc(t.fasilitas.join("\n"))}</textarea></div>
        ${btn("simpantipe", t.id_tipe, "Simpan perubahan", "bg-[#b08a3e] text-[#1b1a17] font-medium")}</div>`).join("") + `</div>`;
  },
  tamu(){
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Data Tamu</h1>` + tbl(["Nama", "Kontak", "Alamat", "No. identitas", "Riwayat reservasi"], db.tamu.map(t => {
      const rs = db.reservasi.filter(r => r.id_tamu === t.id_tamu);
      return `<tr><td>${esc(t.nama)}</td><td>${esc(t.no_hp)}<br><span class="text-[#6d675d] text-xs">${esc(t.email)}</span></td><td>${esc(t.alamat || "–")}</td><td>${esc(t.no_identitas || "–")}</td><td>${rs.length ? rs.map(r => `${r.kode_booking} (${r.tgl_checkin}) ${badge(r.status)}`).join("<br>") : "–"}</td></tr>`;
    }));
  },
  bayar(){
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Pembayaran</h1>` + tbl(["Reservasi", "Tamu", "Metode", "Jumlah", "Tanggal", "Status", "Aksi"], db.pembayaran.slice().reverse().map(p => {
      const r = db.reservasi.find(x => x.id_reservasi === p.id_reservasi);
      return `<tr><td>${r.kode_booking}</td><td>${esc(tm(r.id_tamu).nama)}</td><td>${esc(p.metode)}</td><td>${rp(p.jumlah)}</td><td>${p.tgl_bayar}</td><td>${badge(p.status)}</td><td><div class="flex gap-1.5 flex-wrap">${p.status === "menunggu_verifikasi" ? btn("verif", p.id_pembayaran, "Verifikasi") + btn("tolak", p.id_pembayaran, "Tolak", "border-red-600 text-red-600 hover:bg-red-600 hover:text-white") : "–"}</div></td></tr>`;
    }));
  },
  ulasan(){
    return `<h1 class="font-serif text-4xl font-semibold mb-6">Ulasan</h1>` + tbl(["Tamu", "Rating", "Komentar", "Tanggal", "Tampil", "Aksi"], db.ulasan.slice().reverse().map(u => `<tr><td>${esc(tm(u.id_tamu).nama)}</td><td class="text-[#b08a3e]">${"★".repeat(u.rating)}</td><td>${esc(u.komentar)}</td><td>${u.tgl_ulasan}</td><td>${u.tampil ? "Ya" : "Disembunyikan"}</td><td>${btn("tampil", u.id_ulasan, u.tampil ? "Sembunyikan" : "Tampilkan")}</td></tr>`));
  }
};

function render(){ 
  reload(); 
  if (tab === "tipe" && me.role !== "admin") tab = "dashboard"; 
  $("#main").innerHTML = V[tab](); 
  $$("#side a").forEach(a => {
    const active = a.dataset.t === tab;
    if (active) {
      a.className = "block px-6 py-3 cursor-pointer border-l-4 border-[#b08a3e] bg-[#f5efe4] font-medium";
    } else if (a.dataset.t === "reset") {
      a.className = "block px-6 py-3 cursor-pointer border-l-4 border-transparent hover:bg-[#f5efe4] hover:border-red-500 text-red-600 font-medium";
    } else {
      a.className = "block px-6 py-3 cursor-pointer border-l-4 border-transparent hover:bg-[#f5efe4] hover:border-[#b08a3e]";
    }
  }); 
}

const ov = $("#ov");
ov.onclick = e => { if (e.target === ov) ov.classList.remove("on"); };
$("#main").onchange = e => {
  const id = e.target.dataset.kamar; if (!id) return;
  km(+id).status = e.target.value; save(); toast("Status kamar diubah."); render();
};
$("#main").onclick = e => {
  const b = e.target.closest("[data-act]"); if (!b) return;
  reload();
  const id = +b.dataset.id, act = b.dataset.act;
  const r = db.reservasi.find(x => x.id_reservasi === id);
  if (act === "konfirmasi") r.status = "dikonfirmasi";
  if (act === "checkin") { r.status = "check-in"; km(r.id_kamar).status = "terisi"; }
  if (act === "checkout") { r.status = "check-out"; km(r.id_kamar).status = "dibersihkan"; toast("Check-out selesai. Kamar masuk status dibersihkan."); }
  if (act === "batal") { if (!confirm("Batalkan reservasi ini?")) return; r.status = "dibatalkan"; db.pembayaran.filter(p => p.id_reservasi === id && p.status === "menunggu_verifikasi").forEach(p => p.status = "dibatalkan"); }
  if (act === "catat") {
    const sisa = r.total_harga - dibayar(r);
    db.pembayaran.push({ id_pembayaran: nid(db.pembayaran, "id_pembayaran"), id_reservasi: id, metode: "Tunai (di hotel)", jumlah: sisa, tgl_bayar: todayS(), status: "lunas" });
    sinkronBayar(r); toast("Pembayaran " + rp(sisa) + " dicatat.");
  }
  if (act === "verif" || act === "tolak") {
    const p = db.pembayaran.find(x => x.id_pembayaran === id); p.status = act === "verif" ? "lunas" : "ditolak";
    if (act === "verif") sinkronBayar(db.reservasi.find(x => x.id_reservasi === p.id_reservasi));
  }
  if (act === "tampil") { const u = db.ulasan.find(x => x.id_ulasan === id); u.tampil = !u.tampil; }
  if (act === "simpantipe") {
    const c = b.closest("[data-card]"), g = f => c.querySelector(`[data-f="${f}"]`).value, t = db.tipe_kamar.find(x => x.id_tipe === id);
    if (+g("harga") <= 0 || +g("kap") < 1) return toast("Harga dan kapasitas harus valid.");
    Object.assign(t, { harga_per_malam: +g("harga"), kapasitas: +g("kap"), jumlah_tempat_tidur: +g("bed"), foto: g("foto").trim(), deskripsi: g("desk").trim(), fasilitas: g("fas").split("\n").map(s => s.trim()).filter(Boolean) });
    toast("Tipe kamar disimpan.");
  }
  if (act === "layanan") {
    $("#ovc").innerHTML = `<p class="font-serif text-2xl font-semibold mb-3">Tambah layanan – ${r.kode_booking}</p><div class="grid gap-3"><div><label class="text-xs block mb-1">Layanan</label><select id="ls" class="bg-[#f5efe4] border border-[#e3d9c6] p-2.5 w-full text-sm">${db.layanan_tambahan.map(l => `<option value="${l.id_layanan}">${esc(l.nama)} – ${rp(l.harga)}</option>`).join("")}</select></div><div><label class="text-xs block mb-1">Jumlah</label><input id="lj" type="number" min="1" value="1" class="bg-[#f5efe4] border border-[#e3d9c6] p-2.5 w-full text-sm"></div><button class="bg-[#b08a3e] text-[#1b1a17] py-2.5 font-medium border border-[#b08a3e] cursor-pointer transition hover:bg-[#d6b36a]" id="lok">Tambahkan</button></div>`;
    ov.classList.add("on");
    $("#lok").onclick = () => {
      reload(); const rr = db.reservasi.find(x => x.id_reservasi === id), l = db.layanan_tambahan.find(x => x.id_layanan === +$("#ls").value), j = Math.max(1, +$("#lj").value || 1);
      db.pemakaian_layanan.push({ id_pemakaian: nid(db.pemakaian_layanan, "id_pemakaian"), id_reservasi: id, id_layanan: l.id_layanan, jumlah: j, subtotal: l.harga * j });
      rr.total_harga = hitungTotal(rr); save(); ov.classList.remove("on"); toast("Layanan ditambahkan."); render();
    };
    return;
  }
  save(); render();
};

if (sessionStorage.getItem("hos_admin")) start();