"use strict";

const formNewsletter = document.querySelector("#form-newsletter");
const newsletterEmail = document.querySelector("#newsletter-email");
const newsletterError = document.querySelector("#newsletter-email-error");
const newsletterStatus = document.querySelector("#newsletter-status");

const NEWSLETTER_KEY = "kopi-nusa-newsletter-email";

function getNewsletterError() {
  const validity = newsletterEmail.validity;

  if (validity.valueMissing) return "Email wajib diisi.";
  if (validity.typeMismatch) return "Format email belum sesuai, contoh: nama@email.com.";
  return "";
}

function validasiNewsletter() {
  newsletterEmail.setCustomValidity("");
  const pesan = getNewsletterError();

  newsletterEmail.setCustomValidity(pesan);
  newsletterEmail.setAttribute("aria-invalid", pesan ? "true" : "false");
  newsletterError.textContent = pesan;

  return pesan === "";
}

function hapusNewsletterAman() {
  try {
    localStorage.removeItem(NEWSLETTER_KEY);
  } catch (error) {
    console.warn("Data newsletter tidak bisa dihapus.", error);
  }
}

function simpanNewsletter(email) {
  const data = { email, updatedAt: new Date().toISOString() };

  try {
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn("Email newsletter tidak bisa disimpan.", error);
    return false;
  }
}

function muatNewsletter() {
  try {
    const tersimpan = localStorage.getItem(NEWSLETTER_KEY);
    if (!tersimpan) return;

    const data = JSON.parse(tersimpan);
    newsletterEmail.value = data.email ?? "";
    newsletterStatus.textContent = "Email terakhir dimuat dari penyimpanan browser.";
    newsletterStatus.classList.add("success");
  } catch (error) {
    console.warn("Data newsletter tidak valid.", error);
    hapusNewsletterAman();
    newsletterStatus.textContent = "Data newsletter rusak dan sudah direset.";
    newsletterStatus.classList.remove("success");
  }
}

formNewsletter.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValid = validasiNewsletter();

  if (!emailValid || !formNewsletter.checkValidity()) {
    newsletterStatus.textContent = "Periksa kembali bagian yang ditandai.";
    newsletterStatus.classList.remove("success");
    formNewsletter.reportValidity();
    newsletterEmail.focus();
    return;
  }

  const email = newsletterEmail.value.trim();
  const berhasil = simpanNewsletter(email);

  newsletterStatus.textContent = berhasil
    ? `Terima kasih. ${email} tercatat untuk newsletter (data dummy).`
    : "Email valid, tetapi tidak bisa disimpan di browser ini.";
  newsletterStatus.classList.toggle("success", berhasil);
});

newsletterEmail.addEventListener("input", () => {
  if (newsletterEmail.getAttribute("aria-invalid") === "true") {
    validasiNewsletter();
  }
});

muatNewsletter();