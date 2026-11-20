const STORAGE_KEY = "kopi-nusa-preferensi-kontak";
const PREVIEW_AWAL = "Data form akan muncul setelah disubmit.";

const form = document.querySelector("#form-kontak");
const preview = document.querySelector("#preview-form");
const formFeedback = document.querySelector("#form-feedback");
const statusPreferensi = document.querySelector("#status-preferensi");
const tombolSimpan = document.querySelector("#btn-simpan-preferensi");
const tombolHapus = document.querySelector("#btn-hapus-preferensi");

const fields = ["nama", "email", "whatsapp", "waktu", "paket", "pesan", "setuju"]
  .map((id) => document.querySelector(`#${id}`));
const topikInputs = document.querySelectorAll('input[name="topik"]');
const metodeInputs = document.querySelectorAll('input[name="metode"]');
const topikError = document.querySelector("#topik-error");

console.log(fields); 
function getFieldError(field) {
  const validity = field.validity;

  if (validity.valueMissing) {
    if (field.type === "checkbox") return "Centang persetujuan untuk melanjutkan.";
    if (field.tagName === "SELECT") return "Pilih salah satu opsi.";
    return "Bagian ini wajib diisi.";
  }
  if (validity.typeMismatch) return "Format data belum sesuai, contoh: nama@email.com.";
  if (validity.tooShort) return `Isi minimal ${field.minLength} karakter.`;
  if (validity.patternMismatch) {
    return field.title || "Format belum sesuai contoh yang diminta.";
  }
  return "";
}

function tampilkanError(field, pesan) {
  const error = document.querySelector(`#${field.id}-error`);

  field.setCustomValidity(pesan);
  field.setAttribute("aria-invalid", pesan ? "true" : "false");

  if (error) {
    error.textContent = pesan;
  }
}

function validasiField(field) {
  field.setCustomValidity("");
  const pesan = getFieldError(field);
  tampilkanError(field, pesan);
  return pesan === "";
}

function validasiTopik() {
  const valid = Array.from(topikInputs).some((input) => input.checked);

  topikError.textContent = valid ? "" : "Pilih salah satu topik pertanyaan.";
  topikInputs.forEach((input) => {
    input.setAttribute("aria-invalid", valid ? "false" : "true");
  });

  return valid;
}

function tampilkanPreview() {
  const data = new FormData(form);

  preview.textContent = [
    `Nama             : ${data.get("nama")}`,
    `Email            : ${data.get("email")}`,
    `WhatsApp         : ${data.get("whatsapp")}`,
    `Waktu pengiriman : ${data.get("waktu")}`,
    `Paket            : ${data.get("paket")}`,
    `Topik            : ${data.get("topik")}`,
    `Metode kontak    : ${data.get("metode") || "-"}`,
    `Pesan            : ${data.get("pesan")}`
  ].join("\n");

  formFeedback.textContent = "Form valid. Preview berhasil dibuat.";
  formFeedback.classList.add("success");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const semuaValid = fields.map((field) => validasiField(field)).every(Boolean);
  const topikValid = validasiTopik();

  if (!semuaValid || !topikValid || !form.checkValidity()) {
    formFeedback.textContent = "Periksa kembali bagian yang ditandai.";
    formFeedback.classList.remove("success");
    preview.textContent = PREVIEW_AWAL;

    form.reportValidity();
    form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
    return;
  }

  tampilkanPreview();
});

fields.forEach((field) => {
  const jenisEvent = field.type === "checkbox" || field.tagName === "SELECT"
    ? "change"
    : "input";

  field.addEventListener(jenisEvent, () => {
    if (field.getAttribute("aria-invalid") === "true") {
      validasiField(field);
    }
  });
});

topikInputs.forEach((input) => {
  input.addEventListener("change", validasiTopik);
});

/* ===== 7. localStorage dan JSON serialization ===== */
function setStatusPreferensi(teks) {
  statusPreferensi.textContent = teks;
}

function simpanPreferensi() {
  const data = new FormData(form);
  const preferensi = {
    paket: data.get("paket") || "",
    topik: data.get("topik") || "",
    metode: data.get("metode") || "",
    updatedAt: new Date().toISOString()
  };

  if (!preferensi.paket && !preferensi.topik && !preferensi.metode) {
    setStatusPreferensi("Pilih paket, topik, atau metode kontak dulu sebelum menyimpan.");
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    setStatusPreferensi("Preferensi tersimpan di browser ini.");
  } catch (error) {
    console.warn("Preferensi tidak bisa disimpan.", error);
    setStatusPreferensi("Preferensi tidak bisa disimpan di browser ini.");
  }
}

function muatPreferensi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);

    if (!tersimpan) {
      setStatusPreferensi("Belum ada preferensi tersimpan.");
      return;
    }

    const preferensi = JSON.parse(tersimpan);

    if (!preferensi || typeof preferensi !== "object") {
      throw new Error("Format preferensi bukan object.");
    }

    document.querySelector("#paket").value = preferensi.paket ?? "";
    topikInputs.forEach((input) => {
      input.checked = input.value === preferensi.topik;
    });
    metodeInputs.forEach((input) => {
      input.checked = input.value === preferensi.metode;
    });

    setStatusPreferensi("Preferensi dimuat dari penyimpanan browser.");
  } catch (error) {
    console.warn("Preferensi tidak valid.", error);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (errorHapus) {
      console.warn("Preferensi tidak bisa dihapus.", errorHapus);
    }
    setStatusPreferensi("Preferensi lama rusak dan sudah dibersihkan.");
  }
}

function hapusPreferensi() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Preferensi tidak bisa dihapus.", error);
    setStatusPreferensi("Preferensi tidak bisa dihapus di browser ini.");
    return;
  }

  document.querySelector("#paket").value = "";
  topikInputs.forEach((input) => { input.checked = false; });
  metodeInputs.forEach((input) => { input.checked = false; });

  setStatusPreferensi("Preferensi dihapus.");
}

tombolSimpan.addEventListener("click", simpanPreferensi);
tombolHapus.addEventListener("click", hapusPreferensi);

muatPreferensi();