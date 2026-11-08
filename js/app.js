"use strict";

console.log("P10 JavaScript aktif");

const dataProduk = [
  {
    nama: "Kopi Tubruk Signature",kategori: "Kopi Bubuk",
    harga: 20000,
    stok: 15,
    ukuran: "250 gram",
    deskripsi: "Karakter cokelat dan kacang dengan body yang kuat.",
    unggulan: true,
    diskonPersen: 10
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Minuman",
    harga: 22000,
    stok: 10,
    ukuran: "Botol 250 ml",
    deskripsi: "Kopi dingin dengan rasa ringan dan manis aren seimbang.",
    unggulan: false
  },
  {
    nama: "Kopi Susu Nusa",
    kategori: "Minuman",
    harga: 22222,
    stok: 20,
    ukuran: "Botol 250 ml",
    deskripsi: "Espresso, susu segar, dan sedikit karamel.",
    unggulan: false,
    diskonPersen: 10
  },
  {
    nama: "Paket Tester Kopi Nusa",
    kategori: "Paket",
    harga: 25000,
    stok: 3,
    ukuran: "3 sachet",
    deskripsi: "Paket tester untuk pelanggan baru.",
    unggulan: false
  }
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

function hitungHargaPromo(produk) {
  const diskon = produk.diskonPersen;

  if (typeof diskon !== "number" || !Number.isFinite(diskon)) {
    return produk.harga;
  }
  if (diskon <= 0 || diskon > 100) {
    return produk.harga;
  }

  const potongan = (produk.harga * diskon) / 100;
  return Math.round(produk.harga - potongan);
}

function buatHtmlHarga(produk) {
  return formatRupiah(hitungHargaPromo(produk));
}

function buatHtmlHargaKartu(produk) {
  const hargaPromo = hitungHargaPromo(produk);

  if (hargaPromo >= produk.harga) {
    return formatRupiah(produk.harga);
  }

  return `
    <del class="price-normal">${formatRupiah(produk.harga)}</del>
    <span class="price-promo">${formatRupiah(hargaPromo)}</span>
    <span class="discount-badge">${produk.diskonPersen}%</span>
  `;
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Stok habis", className: "empty" };
  }
  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }
  return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Bubuk":
      return "Kopi seduh pilihan";
    case "Minuman":
      return "Minuman siap saji";
    case "Paket":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}


function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";

  return `
    <article class="product-card js-product-card">
      <h3>${produk.nama}</h3>
      <p class="product-detail">${kategori} · ${produk.ukuran}</p>
      <p>${produk.deskripsi}</p>
      <p class="price">${buatHtmlHargaKartu(produk)}</p>
      <p class="stock-badge ${status.className}">${status.label}</p>
      <p class="product-detail">${labelAksi}</p>
    </article>
  `;
}

function buatBarisTabel(produk) {
  const status = statusStok(produk.stok);

  return `
    <tr>
      <td>${produk.nama}</td>
      <td>${produk.ukuran}</td>
      <td>${status.label} (${produk.stok})</td>
      <td>${produk.deskripsi}</td>
      <td>${buatHtmlHarga(produk)}</td>
    </tr>
  `;
}

function hitungTotalStok(daftarProduk) {
  let total = 0;
  for (const produk of daftarProduk) {
    total = total + produk.stok;
  }
  return total;
}

function logDebugProduk(daftarProduk) {
  daftarProduk.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });
  console.table(daftarProduk);
}

function renderProduk() {
  const productList = document.querySelector("#product-list");
  const productTableBody = document.querySelector("#product-table-body");
  const productSummary = document.querySelector("#product-summary");
  const productHighlight = document.querySelector("#product-highlight");

  
  if (!productList || !productTableBody) {
    return;
  }

  logDebugProduk(dataProduk);

  const produkTersedia = dataProduk.filter((produk) => produk.stok > 0);
  const produkUnggulan = dataProduk.find((produk) => produk.unggulan === true);
  
  const kartuMarkup = produkTersedia.map(buatKartuProduk).join("");
  const barisMarkup = dataProduk.map(buatBarisTabel).join("");

  console.log("Jumlah produk tersedia:", produkTersedia.length);
  dataProduk.forEach((produk) => {
    console.log("Harga:", produk.nama, produk.harga, "->", hitungHargaPromo(produk));
  });

  productList.innerHTML = kartuMarkup;
  productTableBody.innerHTML = barisMarkup;

  if (productSummary) {
    productSummary.textContent =
      `${produkTersedia.length} produk tersedia dari ${dataProduk.length} data, total stok ${hitungTotalStok(dataProduk)} item.`;
  }

  if (productHighlight) {
    productHighlight.textContent = produkUnggulan
      ? `Produk unggulan: ${produkUnggulan.nama}`
      : "Belum ada produk unggulan.";
  }
}

function aktifkanTombolPromo() {
  const promoButton = document.querySelector("#promoButton");

  if (!promoButton) {
    return;
  }

  promoButton.addEventListener("click", function () {
    alert("Promo hari ini: beli 2 Kopi Susu Nusa, gratis 1 Kopi Tubruk Signature!");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderProduk();
  aktifkanTombolPromo();
});