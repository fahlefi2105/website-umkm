const dataProduk = [
  {
    nama: "Kopi Tubruk Signature",
    kategori: "Kopi Bubuk",
    harga: 18000,
    stok: 15,
    ukuran: "250 gram",
    deskripsi: "Karakter cokelat dan kacang dengan body yang kuat."
  },
  {
    nama: "Cold Brew Aren",
    kategori: "Minuman",
    harga: 22000,
    stok: 5,
    ukuran: "Botol 250 ml",
    deskripsi: "Kopi dingin dengan rasa ringan dan manis aren seimbang."
  },
  {
    nama: "Kopi Susu Nusa",
    kategori: "Minuman",
    harga: 20000,
    stok: 20,
    ukuran: "Botol 250 ml",
    deskripsi: "Espresso, susu segar, dan sedikit karamel."
  },
  {
    nama: "Paket Tester Kopi Nusa",
    kategori: "Paket",
    harga: 15000,
    stok: 8,
    ukuran: "3 sachet",
    deskripsi: "Paket tester untuk pelanggan baru."
  }
];

const productList = document.querySelector("#product-list");
const productTableBody = document.querySelector("#product-table-body");
const productSummary = document.querySelector("#product-summary");

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
};

function cekStok(stok) {
  if (stok === 0) {
    return "Stok habis";
  } else if (stok <= 5) {
    return "Stok terbatas";
  } else {
    return "Tersedia";
  }
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi Bubuk":
      return "Terlaris";
    case "Minuman":
      return "Segar";
    case "Paket":
      return "Paket Hemat";
    default:
      return "Pilihan";
  }
}

if (productList) {
  productList.innerHTML = dataProduk.map((produk) => {
    const statusStok = cekStok(produk.stok);
    const kelasStok = produk.stok === 0 ? "stok-habis" :
      produk.stok <= 5 ? "stok-terbatas" : "stok-tersedia";

    return `
      <article class="product-card">
        <span class="product-badge">${labelKategori(produk.kategori)}</span>
        <h3>${produk.nama}</h3>
        <p>${produk.deskripsi}</p>
        <p class="product-detail">Kategori: ${produk.kategori}</p>
        <p class="product-detail">Ukuran: ${produk.ukuran}</p>
        <p class="price">${formatRupiah(produk.harga)}</p>
        <p class="stock-status ${kelasStok}">
          ${statusStok} (${produk.stok})
        </p>
        <div class="card-actions">
          <a class="button" href="kontak.html">Tanya produk!</a>
          <a href="#harga-title">Lihat tabel harga!</a>
        </div>
      </article>
    `;
  }).join("");
}

if (productTableBody) {
  productTableBody.innerHTML = dataProduk.map((produk) => `
    <tr>
      <td>${produk.nama}</td>
      <td>${formatRupiah(produk.harga)}</td>
      <td>${produk.ukuran}</td>
      <td>${cekStok(produk.stok)} (${produk.stok})</td>
      <td>${produk.deskripsi}</td>
    </tr>
  `).join("");
}

// Operator untuk menghitung jumlah produk dan total stok.
const jumlahProduk = dataProduk.length;
const totalStok = dataProduk.reduce((total, produk) => {
  return total + produk.stok;
}, 0);

if (productSummary) {
  productSummary.textContent =
    `Menampilkan ${jumlahProduk} produk Kopi Nusa dengan total stok ${totalStok} item.`;
}

console.log("Data produk Kopi Nusa:");
console.table(dataProduk);
console.log("Jumlah produk:", jumlahProduk);
console.log("Total stok:", totalStok);