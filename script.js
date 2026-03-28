// Gestione anno nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Menu mobile
const nav = document.getElementById("mainNav");
const navToggle = document.getElementById("navToggle");

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("nav--open");
  });

  // Chiudi il menu quando clicchi un link
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
    });
  });
}

// Scroll "morbido" per gli anchor link interni
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const targetId = anchor.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Messaggio finto invio form
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    formMessage.textContent =
      "Questo è solo un esempio: qui potresti collegare il form a un backend o a un servizio di email.";
  });
}
