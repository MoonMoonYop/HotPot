const $ = s => document.querySelector(s);
const badge = s => `<span class="badge b-${s}">${LBL[s] || s}</span>`;
function toast(m){ const t = $("#toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = "none", 2600); }
const TABS = [["dashboard","Dashboard"],["reservasi","Kelola Reservasi"],["kamar","Kelola Kamar"],["tipe","Kelola Tipe Kamar",true],["tamu","Data Tamu"],["bayar","Pembayaran"],["ulasan","Ulasan"]];
let me = null, tab = "dashboard";

/* ===== LOGIN ===== */
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
  $("#side").innerHTML = TABS.filter(t => !t[2] || me.role === "admin").map(t => `<a data-t="${t[0]}">${t[1]}</a>`).join("") + `<a data-t="reset" style="color:#e57373">Reset data demo</a>`;
  render();
}
$("#side").onclick = e => {
  const t = e.target.dataset.t; if (!t) return;
  if (t === "reset") { if (confirm("Kembalikan semua data ke data demo awal?")) { resetDB(); toast("Data direset."); render(); } return; }
  tab = t; $("#side").classList.remove("open"); render();
};

/* ===== HELPERS ===== */
const tm = id => db.tamu.find(x => x.id_tamu === id);
const km = id => db.kamar.find(x => x.id_kamar === id);
const tbl = (heads, rows) => `<div class="tbl-w"><table class="tbl"><thead><tr>${heads.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("") || `<tr><td colspan="${heads.length}" class="mute">Belum ada data.</td></tr>`}</tbody></table></div>`;
const btn = (act, id, label, cls = "") => `<button class="sbtn ${cls}" data-act="${act}" data-id="${id}">${label}</button>`;

/* ===== VIEW ===== */
const V = {
  dashboard(){
    const t = todayS();
    const masuk = db.reservasi.filter(r => r.tgl_checkin === t && ["dikonfirmasi", "check-in"].includes(r.status));
    const keluar = db.reservasi.filter(r => r.tgl_checkout === t && r.status === "check-in");
    const terisi = db.kamar.filter(k => k.status === "terisi").length, bersih = db.kamar.filter(k => k.status === "dibersihkan").length, ready = db.kamar.filter(k => k.status === "tersedia").length;
    const omzet = db.pembayaran.filter(p => p.status === "lunas").reduce((s, p) => s + p.jumlah, 0);
    const bulan = db.pembayaran.filter(p => p.status === "lunas" && p.tgl_bayar.slice(0, 7) === t.slice(0, 7)).reduce((s, p) => s + p.jumlah, 0);
    const list = a => a.length ? a.map(r => `<li>${r.kode_booking} · ${esc(tm(r.id_tamu).nama)} · kamar ${km(r.id_kamar).no_kamar}</li>`).join("") : `<li class="mute">Tidak ada.</li>`;
    return `<h1 class="serif text-4xl mb-6">Dashboard</h1>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="card p-5"><p class="mute text-sm">Check-in hari ini</p><p class="serif text-4xl gold">${masuk.length}</p></div>
      <div class="card p-5"><p class="mute text-sm">Check-out hari ini</p><p class="serif text-4xl gold">${keluar.length}</p></div>
      <div class="card p-5"><p class="mute text-sm">Kamar terisi vs tersedia</p><p class="serif text-4xl gold">${terisi} / ${ready}</p><p class="text-xs mute">${bersih} sedang dibersihkan · total ${db.kamar.length}</p></div>
      <div class="card p-5"><p class="mute text-sm">Pendapatan (lunas)</p><p class="serif text-3xl gold">${rp(omzet)}</p><p class="text-xs mute">Bulan ini ${rp(bulan)}</p></div>
    </div>
    <div class="grid gap-4 md:grid-cols-2 mt-6"><div class="card p-5"><p class="serif text-2xl mb-2">Check-in hari ini</p><ul class="list-disc pl-5">${list(masuk)}</ul></div><div class="card p-5"><p class="serif text-2xl mb-2">Check-out hari ini</p><ul class="list-disc pl-5">${list(keluar)}</ul></div></div>`;
  },
  reservasi(){
    return `<h1 class="serif text-4xl mb-6">Kelola Reservasi</h1>` + tbl(["Kode", "Tamu", "Kamar", "Tanggal", "Total", "Dibayar", "Status", "Aksi"], db.reservasi.slice().reverse().map(r => {
      const a = [];
      if (r.status === "menunggu_pembayaran") a.push(btn("konfirmasi", r.id_reservasi, "Konfirmasi"));
      if (r.status === "dikonfirmasi") a.push(btn("checkin", r.id_reservasi, "Check-in"));
      if (r.status === "check-in") a.push(btn("checkout", r.id_reservasi, "Check-out"), btn("layanan", r.id_reservasi, "+ Layanan"));
      if (["menunggu_pembayaran", "dikonfirmasi", "check-in"].includes(r.status) && dibayar(r) < r.total_harga) a.push(btn("catat", r.id_reservasi, "Catat bayar"));
      if (["menunggu_pembayaran", "dikonfirmasi"].includes(r.status)) a.push(btn("batal", r.id_reservasi, "Batalkan", "danger"));
      return `<tr><td>${r.kode_booking}</td><td>${esc(tm(r.id_tamu).nama)}<br><span class="mute text-xs">${esc(tm(r.id_tamu).no_hp)}</span></td><td>${km(r.id_kamar).no_kamar} · ${esc(tipeOf(r).nama_tipe)}</td><td>${r.tgl_checkin} → ${r.tgl_checkout}</td><td>${rp(r.total_harga)}</td><td>${rp(dibayar(r))}</td><td>${badge(r.status)}</td><td class="acts">${a.join("") || "–"}</td></tr>`;
    }));
  },
  kamar(){
    return `<h1 class="serif text-4xl mb-6">Kelola Kamar</h1>` + tbl(["No. kamar", "Tipe", "Status", "Ubah status"], db.kamar.map(k => `<tr><td>${k.no_kamar}</td><td>${esc(db.tipe_kamar.find(t => t.id_tipe === k.id_tipe).nama_tipe)}</td><td>${k.status}</td><td><select data-kamar="${k.id_kamar}" style="width:auto">${["tersedia", "terisi", "dibersihkan"].map(s => `<option ${s === k.status ? "selected" : ""}>${s}</option>`).join("")}</select></td></tr>`));
  },
  tipe(){
    return `<h1 class="serif text-4xl mb-2">Kelola Tipe Kamar</h1><p class="mute mb-6">Perubahan harga, foto, dan fasilitas langsung tampil di website tamu. Khusus admin.</p><div class="grid gap-5 lg:grid-cols-2">` + db.tipe_kamar.map(t => `
      <div class="card p-5 grid gap-3" data-card="${t.id_tipe}"><p class="serif text-3xl">${esc(t.nama_tipe)}</p>
        <div><label>Harga per malam (Rp)</label><input data-f="harga" type="number" min="0" value="${t.harga_per_malam}"></div>
        <div class="grid grid-cols-2 gap-3"><div><label>Kapasitas</label><input data-f="kap" type="number" min="1" value="${t.kapasitas}"></div><div><label>Jumlah tempat tidur</label><input data-f="bed" type="number" min="1" value="${t.jumlah_tempat_tidur}"></div></div>
        <div><label>URL foto</label><input data-f="foto" value="${esc(t.foto)}"></div>
        <div><label>Deskripsi</label><textarea data-f="desk" rows="2">${esc(t.deskripsi)}</textarea></div>
        <div><label>Fasilitas (satu per baris)</label><textarea data-f="fas" rows="5">${esc(t.fasilitas.join("\n"))}</textarea></div>
        ${btn("simpantipe", t.id_tipe, "Simpan perubahan", "gold-b")}</div>`).join("") + `</div>`;
  },
  tamu(){
    return `<h1 class="serif text-4xl mb-6">Data Tamu</h1>` + tbl(["Nama", "Kontak", "Alamat", "No. identitas", "Riwayat reservasi"], db.tamu.map(t => {
      const rs = db.reservasi.filter(r => r.id_tamu === t.id_tamu);
      return `<tr><td>${esc(t.nama)}</td><td>${esc(t.no_hp)}<br><span class="mute text-xs">${esc(t.email)}</span></td><td>${esc(t.alamat || "–")}</td><td>${esc(t.no_identitas || "–")}</td><td>${rs.length ? rs.map(r => `${r.kode_booking} (${r.tgl_checkin}) ${badge(r.status)}`).join("<br>") : "–"}</td></tr>`;
    }));
  },
  bayar(){
    return `<h1 class="serif text-4xl mb-6">Pembayaran</h1>` + tbl(["Reservasi", "Tamu", "Metode", "Jumlah", "Tanggal", "Status", "Aksi"], db.pembayaran.slice().reverse().map(p => {
      const r = db.reservasi.find(x => x.id_reservasi === p.id_reservasi);
      return `<tr><td>${r.kode_booking}</td><td>${esc(tm(r.id_tamu).nama)}</td><td>${esc(p.metode)}</td><td>${rp(p.jumlah)}</td><td>${p.tgl_bayar}</td><td>${badge(p.status)}</td><td class="acts">${p.status === "menunggu_verifikasi" ? btn("verif", p.id_pembayaran, "Verifikasi") + btn("tolak", p.id_pembayaran, "Tolak", "danger") : "–"}</td></tr>`;
    }));
  },
  ulasan(){
    return `<h1 class="serif text-4xl mb-6">Ulasan</h1>` + tbl(["Tamu", "Rating", "Komentar", "Tanggal", "Tampil", "Aksi"], db.ulasan.slice().reverse().map(u => `<tr><td>${esc(tm(u.id_tamu).nama)}</td><td class="gold">${"★".repeat(u.rating)}</td><td>${esc(u.komentar)}</td><td>${u.tgl_ulasan}</td><td>${u.tampil ? "Ya" : "Disembunyikan"}</td><td class="acts">${btn("tampil", u.id_ulasan, u.tampil ? "Sembunyikan" : "Tampilkan")}</td></tr>`));
  }
};
function render(){ reload(); if (tab === "tipe" && me.role !== "admin") tab = "dashboard"; $("#main").innerHTML = V[tab](); document.querySelectorAll("#side a").forEach(a => a.classList.toggle("on", a.dataset.t === tab)); }

/* ===== AKSI ===== */
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
    $("#ovc").innerHTML = `<p class="serif text-2xl mb-3">Tambah layanan – ${r.kode_booking}</p><div class="grid gap-3"><div><label>Layanan</label><select id="ls">${db.layanan_tambahan.map(l => `<option value="${l.id_layanan}">${esc(l.nama)} – ${rp(l.harga)}</option>`).join("")}</select></div><div><label>Jumlah</label><input id="lj" type="number" min="1" value="1"></div><button class="btn" id="lok">Tambahkan</button></div>`;
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
