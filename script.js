/* ========= KONFIGURASI ========= */
const WA_NUMBER = "6281234567890";   // nomor WhatsApp hotel (format 62...)
const IMG = {
  hero: [U("1551882547-ff40c63fe5fa"), U("1566073771259-6a8506099945"), U("1542314831-068cd1dbfeed")],
  pool: U("1520250497591-112f2f40a3f4"), lounge: U("1470337458703-46ad1756a187"), bar: U("1572116469696-31de0f17cc34"),
  resto: U("1414235077428-338989a2e8c0"), gym: U("1534438327276-14e5300c3a48"),
  spa: U("1540555700478-4be289fbecef"), meeting: U("1431540015161-0bf868a2d407"),
  g1: U("1517248135467-4c7edcad34c4"), g2: U("1514933651103-005eec06c04b")
};
const ICON = {
  pool: "M2 18c2 0 2-1.5 5-1.5S9 18 12 18s2-1.5 5-1.5S19 18 22 18M2 13c2 0 2-1.5 5-1.5S9 13 12 13s2-1.5 5-1.5S19 13 22 13M8 10V4a2 2 0 014 0M15 10V4a2 2 0 014 0",
  lounge: "M4 4h16l-8 9zM12 13v7M8 20h8", bar: "M9 3h6v4l2 3v11H7V10l2-3zM7 14h10",
  resto: "M6 3v8a2 2 0 002 2v8M10 3v6M6 7h4M17 3c-2 2-2 6 0 8v10", gym: "M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12",
  spa: "M12 21c-5 0-8-3-8-8 4 0 7 2 8 5 1-3 4-5 8-5 0 5-3 8-8 8zM12 17c-2-3-2-8 0-12 2 4 2 9 0 12z", meeting: "M3 5h18v11H3zM8 20h8M12 16v4"
};
const MENUS = [
  { g:"bar", t:"Bar & Lounge – Minuman", i:[["Signature Cocktails","Racikan bartender dengan bahan lokal dan rempah",95000],["Mocktails","Segar tanpa alkohol, dengan buah musiman",55000],["Premium Wines","Pilihan red, white, dan sparkling per gelas",120000],["Artisan Coffee","Biji pilihan, espresso atau manual brew",45000],["Imported Teas","Teh daun utuh dari berbagai negara",42000]] },
  { g:"bar", t:"Bar & Lounge – Tapas", i:[["Truffle Fries","Kentang goreng, minyak truffle, parmesan",75000],["Nachos Supreme","Keju leleh, salsa, guacamole",68000],["Mini Wagyu Sliders","Tiga burger mini wagyu",110000],["Cheese Platter","Aneka keju, buah kering, kacang, roti",135000]] },
  { g:"resto", t:"Restaurant – Hidangan Pembuka", i:[["Caesar Salad","Romaine, crouton, parmesan, saus caesar",65000],["Mushroom Soup","Sup krim jamur hangat dengan roti bawang",58000]] },
  { g:"resto", t:"Restaurant – Hidangan Utama", i:[["Nasi Goreng Spesial Hotel on Spot","Telur mata sapi, ayam suwir, sate, kerupuk",85000],["Grilled Australian Sirloin Steak","Sirloin panggang, kentang tumbuk, saus lada hitam",245000],["Pan-Seared Salmon with Lemon Butter Sauce","Salmon sangrai, saus mentega lemon, sayur panggang",195000],["Pasta Carbonara","Spaghetti, krim, telur, daging asap",110000]] },
  { g:"resto", t:"Restaurant – Hidangan Penutup", i:[["Tiramisu Classic","Mascarpone, kopi, kakao",72000],["Molten Lava Cake","Cokelat lumer dengan es krim vanilla",78000]] }
];
const SOC = [
  ["Instagram","https://instagram.com/","M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 5a4 4 0 100 8 4 4 0 000-8z"],
  ["Facebook","https://facebook.com/","M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z"],
  ["Twitter/X","https://x.com/","M4 4l16 16M20 4L4 20"],
  ["WhatsApp","https://wa.me/" + WA_NUMBER,"M3 21l1.6-4.8A8.5 8.5 0 1112 20.5a8.5 8.5 0 01-4-1L3 21zm6-12c0 3 3 6 6 6l1.5-1.5-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2L9 9z"],
  ["YouTube","https://youtube.com/","M3 8a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3H6a3 3 0 01-3-3V8zm7 1.5v5l4.5-2.5L10 9.5z"]
];

/* ========= HELPER ========= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const ph = (src, h, cap, extra = "") =>
  `<div class="ph ${extra}" style="height:${h}px"><img src="${esc(src)}" alt="${esc(cap || "")}" loading="lazy" onerror="this.remove()">${cap ? `<span class="cap">${esc(cap)}</span>` : ""}</div>`;
const badge = s => `<span class="badge b-${s}">${LBL[s] || s}</span>`;
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
function toast(m){ const t = $("#toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = "none", 3200); }
function wa(msg){ window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener"); }
$$(".ci-t").forEach(e => e.textContent = JAM_CHECKIN); $$(".co-t").forEach(e => e.textContent = JAM_CHECKOUT);

/* ========= RENDER STATIS ========= */
$("#slides").innerHTML = IMG.hero.map((s, i) => `<div class="slide ${i ? "" : "on"}" style="background-image:url('${s}')"></div>`).join("");
$("#dots").innerHTML = IMG.hero.map((_, i) => `<button class="${i ? "" : "on"}" aria-label="Slide ${i + 1}"></button>`).join("");
$("#fh").src = IMG.pool;
const GAL = [[IMG.lounge,"Lounge & Bar"],[IMG.resto,"Restaurant"],[IMG.g1,"Fine dining"],[IMG.g2,"Suasana malam"]];
$("#gallery").innerHTML = GAL.map((g, i) => `<button class="ph zoom" style="height:230px;border:0;padding:0;cursor:zoom-in" data-g="${i}"><img src="${g[0]}" alt="${g[1]}" loading="lazy" onerror="this.remove()"><span class="cap">${g[1]}</span></button>`).join("");
function renderMenu(g){
  $("#menus").innerHTML = MENUS.filter(m => g === "all" || m.g === g).map(m => `<div><h2 class="serif text-3xl mb-1">${m.t}</h2>${m.i.map(x => `<div class="menu-row"><div><p style="font-weight:400">${x[0]}</p><p class="text-sm mute">${x[1]}</p></div><p class="gold whitespace-nowrap">${rp(x[2])}</p></div>`).join("")}</div>`).join("");
  $$("#mtabs button").forEach(b => b.classList.toggle("on", b.dataset.g === g));
}
$("#mtabs").innerHTML = [["all","Semua"],["bar","Bar & Lounge"],["resto","Restaurant"]].map(t => `<button data-g="${t[0]}">${t[1]}</button>`).join("");
$("#mtabs").onclick = e => { if (e.target.dataset.g) renderMenu(e.target.dataset.g); };
renderMenu("all");
$("#soc").innerHTML = SOC.map(s => `<a href="${s[1]}" target="_blank" rel="noopener" aria-label="${s[0]}" class="w-11 h-11 rounded-full flex items-center justify-center transition hover:bg-[#d6b36a] hover:text-black" style="border:1px solid var(--gold2);color:var(--gold2)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="${s[2]}"/></svg></a>`).join("");

/* ========= RENDER DINAMIS (dari DB) ========= */
const roomCard = (t, full) => `
  <article class="card lift flex flex-col rv">${ph(t.foto, full ? 230 : 220, `${t.kapasitas} tamu · ${t.jumlah_tempat_tidur} tempat tidur`)}
    <div class="p-6 flex flex-col flex-1"><h3 class="serif text-3xl">Kamar ${esc(t.nama_tipe)}</h3>
    ${full ? `<ul class="mt-3 space-y-1 list-disc pl-5 flex-1">${t.fasilitas.map(l => `<li>${esc(l)}</li>`).join("")}</ul>` : `<p class="mute mt-2 text-sm flex-1">${esc(t.deskripsi)}</p>`}
    <p class="gold serif text-3xl mt-4">${rp(t.harga_per_malam)} <span class="text-sm" style="font-family:Jost">/ malam</span></p>
    <div class="mt-3 flex gap-2 flex-wrap"><button class="btn btn-o" data-detail="${t.id_tipe}">Detail</button><button class="btn" data-pick="${t.id_tipe}">Pesan</button></div></div></article>`;

const R = {
  home(){
    $("#room-prev").innerHTML = db.tipe_kamar.map(t => roomCard(t, false)).join("");
    $("#fac-prev").innerHTML = db.fasilitas.slice(0, 8).map(f => `<a href="#fasilitas" class="card tile rv"><svg viewBox="0 0 24 24"><path d="${ICON[f.kunci] || ICON.meeting}"/></svg><p class="serif text-2xl">${esc(f.nama)}</p><p class="text-xs mute">${esc(f.jam_operasional)}</p></a>`).join("");
    const rv = db.ulasan.filter(u => u.tampil).slice(-3).reverse();
    $("#reviews").innerHTML = rv.length ? rv.map(reviewCard).join("") : `<p class="mute">Belum ada ulasan.</p>`;
  },
  fasilitas(){
    $("#fac-list").innerHTML = db.fasilitas.map((f, i) => `
      <article class="grid gap-8 md:grid-cols-2 items-center rv">
        <div class="${i % 2 ? "md:order-2" : ""}">${ph(IMG[f.kunci] || IMG.meeting, 340, f.nama, "zoom")}</div>
        <div><h2 class="title" style="font-size:2.4rem">${esc(f.nama)}</h2><div class="rule"></div><p>${esc(f.deskripsi)}</p><p class="gold mt-3">Jam operasional: ${esc(f.jam_operasional)}</p></div>
      </article>`).join("");
    $("#lay-list").innerHTML = db.layanan_tambahan.map(l => `<div class="card p-5"><p class="serif text-2xl">${esc(l.nama)}</p><p class="gold">${rp(l.harga)}</p></div>`).join("");
  },
  resto(){},
  booking(){
    $("#rooms").innerHTML = db.tipe_kamar.map(t => roomCard(t, true)).join("");
    const cur = $("#rt").value;
    $("#rt").innerHTML = db.tipe_kamar.map(t => `<option value="${t.id_tipe}">${esc(t.nama_tipe)} – ${rp(t.harga_per_malam)}</option>`).join("");
    if (cur) $("#rt").value = cur;
    calc();
  },
  bayar(kode){
    const r = db.reservasi.find(x => x.kode_booking === (kode || "").toUpperCase());
    if (!r) { $("#bayar-box").innerHTML = `<p class="mute">Reservasi tidak ditemukan. <a class="gold" href="#pesanan">Cek pesanan</a> dengan kode booking Anda.</p>`; return; }
    const pay = db.pembayaran.filter(p => p.id_reservasi === r.id_reservasi && p.status !== "ditolak" && p.status !== "dibatalkan").pop();
    let aksi;
    if (r.status === "dibatalkan") aksi = `<p class="mute">Reservasi ini sudah dibatalkan.</p>`;
    else if (pay) aksi = `<div class="card p-6"><p>Status pembayaran: ${badge(pay.status)}</p><p class="mute mt-2">Metode: ${esc(pay.metode)} · ${rp(pay.jumlah)}.${pay.status === "menunggu_verifikasi" ? " Staf hotel akan memverifikasi pembayaran Anda." : ""}</p><div class="mt-4 flex gap-2 flex-wrap"><a class="btn" href="#pesanan/${r.kode_booking}">Lihat konfirmasi</a><button class="btn btn-o" data-wa="${r.kode_booking}">Konfirmasi via WhatsApp</button></div></div>`;
    else aksi = `<form id="pf" class="card p-6 grid gap-4" data-k="${r.kode_booking}"><p class="serif text-2xl">Pilih metode pembayaran</p>
      ${["Transfer Bank (BCA 123 456 7890 a.n. Hotel on Spot)", "QRIS", "Kartu Kredit/Debit", "Bayar di Hotel (saat check-in)"].map((m, i) => `<label class="flex gap-3 items-center card p-3" style="cursor:pointer"><input type="radio" name="mt" value="${esc(m)}" ${i ? "" : "checked"} style="width:auto"> ${m}</label>`).join("")}
      <button class="btn" type="submit">Konfirmasi pembayaran ${rp(r.total_harga)}</button></form>`;
    $("#bayar-box").innerHTML = `${detail(r)}<div class="mt-6">${aksi}</div>`;
  },
  pesanan(kode){
    if (!kode) { $("#pesanan-box").innerHTML = `<p class="mute">Masukkan kode booking yang Anda terima setelah membuat reservasi.</p>`; return; }
    $("#ck").value = kode;
    const r = db.reservasi.find(x => x.kode_booking === kode.toUpperCase());
    if (!r) { $("#pesanan-box").innerHTML = `<p style="color:#c0392b">Kode booking tidak ditemukan.</p>`; return; }
    const pay = db.pembayaran.filter(p => p.id_reservasi === r.id_reservasi && p.status !== "ditolak" && p.status !== "dibatalkan").pop();
    const sudahUlas = db.ulasan.some(u => u.id_reservasi === r.id_reservasi);
    const acts = [];
    if (!pay && r.status === "menunggu_pembayaran") acts.push(`<a class="btn" href="#bayar/${r.kode_booking}">Bayar sekarang</a>`);
    if (r.status === "menunggu_pembayaran" || r.status === "dikonfirmasi") acts.push(`<button class="btn btn-o" data-cancel="${r.kode_booking}">Batalkan pesanan</button>`);
    if (r.status === "check-out" && !sudahUlas) acts.push(`<a class="btn" href="#ulasan/${r.kode_booking}">Tulis ulasan</a>`);
    acts.push(`<button class="btn btn-o" data-wa="${r.kode_booking}">Hubungi via WhatsApp</button>`);
    $("#pesanan-box").innerHTML = `${detail(r)}<div class="card p-5 mt-4">Pembayaran: ${pay ? badge(pay.status) + ` <span class="mute">${esc(pay.metode)}</span>` : `<span class="mute">Belum ada pembayaran</span>`}</div><div class="mt-5 flex gap-2 flex-wrap">${acts.join("")}</div>`;
  },
  ulasan(kode){
    if (kode) $("#uk").value = kode;
    const list = db.ulasan.filter(u => u.tampil).slice().reverse();
    $("#ulasan-list").innerHTML = list.length ? list.map(reviewCard).join("") : `<p class="mute">Belum ada ulasan.</p>`;
  }
};
function reviewCard(u){
  const t = db.tamu.find(x => x.id_tamu === u.id_tamu), r = db.reservasi.find(x => x.id_reservasi === u.id_reservasi);
  return `<blockquote class="card p-6 lift rv"><p class="stars" aria-label="${u.rating} dari 5 bintang">${stars(u.rating)}</p><p class="mt-2">${esc(u.komentar)}</p><p class="mt-3 text-sm mute">${esc(t ? t.nama : "Tamu")}${r ? ", Kamar " + esc(tipeOf(r).nama_tipe) : ""} · ${esc(u.tgl_ulasan)}</p></blockquote>`;
}
function detail(r){
  const t = db.tamu.find(x => x.id_tamu === r.id_tamu), tp = tipeOf(r), p = db.promo.find(x => x.id_promo === r.id_promo);
  const lay = db.pemakaian_layanan.filter(x => x.id_reservasi === r.id_reservasi);
  return `<div class="card p-6"><div class="flex justify-between flex-wrap gap-2 items-center"><p class="serif text-3xl">${r.kode_booking}</p>${badge(r.status)}</div>
    <div class="grid sm:grid-cols-2 gap-x-8 gap-y-1 mt-4 text-[0.95rem]">
      <p><span class="mute">Tamu:</span> ${esc(t.nama)}</p><p><span class="mute">Telepon:</span> ${esc(t.no_hp)}</p>
      <p><span class="mute">Kamar:</span> ${esc(tp.nama_tipe)}</p><p><span class="mute">Jumlah tamu:</span> ${r.jumlah_tamu}</p>
      <p><span class="mute">Check-in:</span> ${r.tgl_checkin} (mulai ${JAM_CHECKIN})</p><p><span class="mute">Check-out:</span> ${r.tgl_checkout} (maks. ${JAM_CHECKOUT})</p>
      <p><span class="mute">Lama menginap:</span> ${nights(r.tgl_checkin, r.tgl_checkout)} malam</p>${p ? `<p><span class="mute">Promo:</span> ${esc(p.kode)} (−${p.potongan}%)</p>` : ""}
      ${r.permintaan_khusus ? `<p class="sm:col-span-2"><span class="mute">Permintaan khusus:</span> ${esc(r.permintaan_khusus)}</p>` : ""}</div>
    ${lay.length ? `<div class="mt-3 text-sm mute">Layanan tambahan: ${lay.map(l => `${esc(db.layanan_tambahan.find(x => x.id_layanan === l.id_layanan).nama)} ×${l.jumlah}`).join(", ")}</div>` : ""}
    <p class="gold serif text-3xl mt-4">Total ${rp(r.total_harga)}</p></div>`;
}

/* ========= NAVIGASI ========= */
const PAGES = [["home","Home"],["fasilitas","Fasilitas"],["resto","Restaurant & Bar/Lounge"],["booking","Booking / Check-in / Kamar"],["pesanan","Cek Pesanan"],["ulasan","Ulasan"]];
const navHTML = PAGES.map(p => `<a href="#${p[0]}" data-p="${p[0]}">${p[1]}</a>`).join("");
$("#nav").innerHTML = navHTML; $("#mnav").innerHTML = navHTML;
let page = "home";
function header(){ $("#hdr").classList.toggle("solid", scrollY > 40 || page !== "home"); $("#top").style.display = scrollY > 500 ? "block" : "none"; }
function show(){
  reload();
  const [p, arg] = (location.hash || "#home").slice(1).split("/");
  page = [...PAGES.map(x => x[0]), "bayar"].includes(p) ? p : "home";
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "v-" + page));
  $$("[data-p]").forEach(a => a.classList.toggle("on", a.dataset.p === page));
  $("#mnav").classList.add("hidden"); $("#mnav").classList.remove("flex");
  $("#burger").setAttribute("aria-expanded", "false");
  if (page === "fasilitas" || page === "home") R.fasilitas();
  R[page](arg);
  scrollTo(0, 0); header(); observe();
}
addEventListener("hashchange", show);
addEventListener("scroll", header, { passive: true });
$("#burger").onclick = () => { const m = $("#mnav"), h = m.classList.toggle("hidden"); m.classList.toggle("flex", !h); $("#burger").setAttribute("aria-expanded", String(!h)); };
$("#top").onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* ========= EFEK ========= */
let si = 0;
const slides = $$(".slide"), dots = $$("#dots button");
function go(n){ si = n; slides.forEach((s, i) => s.classList.toggle("on", i === n)); dots.forEach((d, i) => d.classList.toggle("on", i === n)); }
dots.forEach((d, i) => d.onclick = () => go(i));
setInterval(() => go((si + 1) % slides.length), 6500);
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
function observe(){ $$(".view.on .rv").forEach(el => io.observe(el)); }

/* ========= MODAL & KLIK ========= */
const ov = $("#ov");
const open = html => { $("#ovc").innerHTML = html; ov.classList.add("on"); };
const close = () => ov.classList.remove("on");
ov.onclick = e => { if (e.target === ov || e.target.classList.contains("x")) close(); };
addEventListener("keydown", e => { if (e.key === "Escape") close(); });
function avail(el){
  const a = $("#dci").value, b = $("#dco").value, id = +el.dataset.t;
  $("#dav").textContent = (a && b && b > a) ? (freeRooms(id, a, b).length ? `Tersedia ${freeRooms(id, a, b).length} kamar pada tanggal tersebut.` : "Maaf, kamar penuh pada tanggal tersebut.") : "Pilih tanggal check-in dan check-out untuk melihat ketersediaan.";
}
document.addEventListener("input", e => { if (e.target.id === "dci" || e.target.id === "dco") avail($("#dav")); });
document.addEventListener("click", e => {
  const d = e.target.closest("[data-detail]");
  if (d) {
    const t = db.tipe_kamar.find(x => x.id_tipe === +d.dataset.detail);
    open(`<div class="modal">${ph(t.foto, 280)}<div class="p-7"><h2 class="title" style="font-size:2.4rem">Kamar ${esc(t.nama_tipe)}</h2><p class="mute mt-1">${t.kapasitas} tamu · ${t.jumlah_tempat_tidur} tempat tidur</p><p class="mt-3">${esc(t.deskripsi)}</p><ul class="mt-3 space-y-1 list-disc pl-5">${t.fasilitas.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
      <p class="gold serif text-3xl mt-4">${rp(t.harga_per_malam)} / malam</p>
      <div class="grid grid-cols-2 gap-3 mt-4"><div><label for="dci">Check-in</label><input type="date" id="dci" min="${todayS()}" value="${$("#ci").value}"></div><div><label for="dco">Check-out</label><input type="date" id="dco" min="${todayS()}" value="${$("#co").value}"></div></div>
      <p id="dav" data-t="${t.id_tipe}" class="mt-2 mute">Pilih tanggal check-in dan check-out untuk melihat ketersediaan.</p>
      <button class="btn mt-4" data-pick="${t.id_tipe}">Pesan kamar ini</button></div></div>`);
    avail($("#dav"));
  }
  const g = e.target.closest("[data-g]");
  if (g && g.dataset.g.length === 1) open(`<img src="${GAL[g.dataset.g][0]}" alt="" style="max-height:88vh;max-width:100%">`);
  const p = e.target.closest("[data-pick]");
  if (p) {
    if ($("#dci")) { $("#ci").value = $("#dci").value; $("#co").value = $("#dco").value; }
    close(); if (location.hash !== "#booking") { location.hash = "booking"; } 
    setTimeout(() => { $("#rt").value = p.dataset.pick; calc(); $("#bf").scrollIntoView({ behavior: "smooth" }); }, 120);
  }
  const w = e.target.closest("[data-wa]");
  if (w) { const r = db.reservasi.find(x => x.kode_booking === w.dataset.wa); wa(`Halo Hotel on Spot, saya ingin konfirmasi pesanan dengan kode booking ${r.kode_booking}.\nNama: ${db.tamu.find(x => x.id_tamu === r.id_tamu).nama}\nKamar: ${tipeOf(r).nama_tipe}\nCheck-in: ${r.tgl_checkin}\nCheck-out: ${r.tgl_checkout}\nTotal: ${rp(r.total_harga)}\nTerima kasih.`); }
  const c = e.target.closest("[data-cancel]");
  if (c && confirm("Yakin ingin membatalkan pesanan ini?")) {
    const r = db.reservasi.find(x => x.kode_booking === c.dataset.cancel);
    r.status = "dibatalkan"; db.pembayaran.filter(p => p.id_reservasi === r.id_reservasi && p.status === "menunggu_verifikasi").forEach(p => p.status = "dibatalkan");
    save(); toast("Pesanan dibatalkan."); R.pesanan(r.kode_booking);
  }
});

/* ========= FORM RESERVASI ========= */
["ci", "co", "qin", "qout"].forEach(id => $("#" + id).min = todayS());
const okDates = () => $("#ci").value && $("#co").value && $("#co").value > $("#ci").value;
function calc(){
  const t = db.tipe_kamar.find(x => x.id_tipe === +$("#rt").value);
  if (!t || !okDates()) { $("#sum").textContent = "Pilih tanggal dan tipe kamar untuk melihat ketersediaan dan estimasi biaya."; return; }
  const n = nights($("#ci").value, $("#co").value), free = freeRooms(t.id_tipe, $("#ci").value, $("#co").value).length;
  const code = $("#pr").value.trim(), p = code ? promoValid(code) : null;
  const sub = t.harga_per_malam * n, total = Math.round(sub * (100 - (p ? p.potongan : 0)) / 100);
  $("#sum").innerHTML = `<p>${esc(t.nama_tipe)} × ${n} malam</p><p>Subtotal: ${rp(sub)}</p>${p ? `<p class="gold">Promo ${esc(p.kode)}: −${p.potongan}%</p>` : code ? `<p>Kode promo tidak berlaku.</p>` : ""}<p class="serif text-3xl mt-2" style="color:var(--ink)">${rp(total)}</p><p class="mt-2" style="color:${free ? "#2e7d32" : "#c0392b"}">${free ? `Tersedia ${free} kamar` : "Kamar penuh pada tanggal ini"}</p>`;
}
["ci", "co", "rt", "pr"].forEach(id => $("#" + id).addEventListener("input", calc));
$("#quick").addEventListener("submit", e => {
  e.preventDefault();
  $("#ci").value = $("#qin").value; $("#co").value = $("#qout").value; $("#gs").value = $("#qg").value;
  location.hash = "booking"; setTimeout(() => { calc(); $("#bf").scrollIntoView({ behavior: "smooth" }); }, 150);
});
$("#bf").addEventListener("submit", e => {
  e.preventDefault();
  const err = m => { $("#err").textContent = m; };
  const f = { nama: $("#nm").value.trim(), hp: $("#hp").value.replace(/[\s-]/g, ""), email: $("#em").value.trim(), alamat: $("#al").value.trim(), ident: $("#idn").value.trim(), id_tipe: +$("#rt").value, ci: $("#ci").value, co: $("#co").value, jumlah: +$("#gs").value, req: $("#rq").value.trim(), promo: $("#pr").value.trim() };
  const t = db.tipe_kamar.find(x => x.id_tipe === f.id_tipe);
  if (!okDates()) return err("Isi tanggal check-in dan check-out (check-out harus setelah check-in).");
  if (f.ci < todayS()) return err("Tanggal check-in tidak boleh sebelum hari ini.");
  if (f.nama.length < 3) return err("Isi nama lengkap tamu.");
  if (!/^(\+62|62|0)8\d{7,12}$/.test(f.hp)) return err("Nomor telepon tidak valid. Contoh: 081234567890.");
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return err("Isi email yang valid.");
  if (f.jumlah < 1 || f.jumlah > t.kapasitas) return err(`Kapasitas kamar ${t.nama_tipe} maksimal ${t.kapasitas} tamu.`);
  if (f.promo && !promoValid(f.promo)) return err("Kode promo tidak berlaku.");
  err("");
  reload(); const res = buatReservasi(f);
  if (res.err) return err(res.err);
  toast("Reservasi dibuat. Silakan lanjut ke pembayaran."); $("#bf").reset(); $("#gs").value = 2;
  location.hash = "bayar/" + res.r.kode_booking;
});

/* ========= PEMBAYARAN, CEK PESANAN, ULASAN ========= */
document.addEventListener("submit", e => {
  if (e.target.id === "pf") {
    e.preventDefault();
    const r = db.reservasi.find(x => x.kode_booking === e.target.dataset.k);
    db.pembayaran.push({ id_pembayaran: nid(db.pembayaran, "id_pembayaran"), id_reservasi: r.id_reservasi, metode: e.target.mt.value, jumlah: r.total_harga, tgl_bayar: todayS(), status: "menunggu_verifikasi" });
    save(); toast("Pembayaran dicatat, menunggu verifikasi staf."); R.bayar(r.kode_booking);
  }
});
$("#cf").addEventListener("submit", e => { e.preventDefault(); const k = $("#ck").value.trim().toUpperCase(); if (k) location.hash = "pesanan/" + k; });
$("#uf").addEventListener("submit", e => {
  e.preventDefault();
  const err = m => { $("#uerr").textContent = m; };
  reload();
  const r = db.reservasi.find(x => x.kode_booking === $("#uk").value.trim().toUpperCase()), km = $("#ukm").value.trim();
  if (!r) return err("Kode booking tidak ditemukan.");
  if (r.status !== "check-out") return err("Ulasan hanya dapat ditulis setelah Anda check-out.");
  if (db.ulasan.some(u => u.id_reservasi === r.id_reservasi)) return err("Anda sudah menulis ulasan untuk pesanan ini.");
  if (km.length < 5) return err("Tulis komentar minimal beberapa kata.");
  err("");
  db.ulasan.push({ id_ulasan: nid(db.ulasan, "id_ulasan"), id_tamu: r.id_tamu, id_reservasi: r.id_reservasi, rating: +$("#ur").value, komentar: km, tgl_ulasan: todayS(), tampil: true });
  save(); $("#uf").reset(); toast("Terima kasih atas ulasan Anda!"); R.ulasan();
});

show();
