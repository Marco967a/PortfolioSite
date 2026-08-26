/**
 * Portfolio - Marco Santagati
 * Interactive JavaScript (Vanilla ES6+)
 */

document.addEventListener("DOMContentLoaded", () => {
  initDynamicYear();
  initMobileNavigation();
  initScrollSpy();
  initProjectFilters();
  initSpotlightToggle();
  initCopyEmail();
  initContactForm();
  initBackToTop();
});

/**
 * 1. Anno corrente dinamico nel footer
 */
function initDynamicYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Gestione Menu Mobile e Accessibilità
 */
function initMobileNavigation() {
  const nav = document.getElementById("mainNav");
  const navToggle = document.getElementById("navToggle");

  if (!nav || !navToggle) return;

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle("nav--open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const closeMenu = () => {
    nav.classList.remove("nav--open");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", toggleMenu);

  // Chiudi quando si clicca su un link di navigazione
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  // Chiudi premendo il tasto ESC
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("nav--open")) {
      closeMenu();
    }
  });

  // Chiudi cliccando all'esterno dell'header
  document.addEventListener("click", event => {
    const header = document.getElementById("siteHeader");
    if (header && !header.contains(event.target) && nav.classList.contains("nav--open")) {
      closeMenu();
    }
  });
}

/**
 * 3. ScrollSpy per evidenziare la voce di menu attiva
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * 4. Filtro interattivo per le categorie di progetti, Spotlight & Notebooks
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const spotlightCard = document.getElementById("boxofficeSpotlight");

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Aggiorna stato attivo dei bottoni
      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filterValue = btn.getAttribute("data-filter");

      // Gestione visibilità Spotlight Card
      if (spotlightCard) {
        const spotlightCat = spotlightCard.getAttribute("data-category") || "";
        if (filterValue === "all" || filterValue === "boxoffice" || spotlightCat.includes(filterValue)) {
          spotlightCard.classList.remove("hidden");
        } else {
          spotlightCard.classList.add("hidden");
        }
      }

      // Filtra le card della griglia
      projectCards.forEach(card => {
        const cardCategories = card.getAttribute("data-category") || "";
        
        if (filterValue === "all" || cardCategories.includes(filterValue)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

/**
 * 5. Toggle per i dettagli tecnici della Pipeline NewBoxofficeProject
 */
function initSpotlightToggle() {
  const toggleBtn = document.getElementById("togglePipelineDetails");
  const detailsBox = document.getElementById("pipelineDetailsBox");
  const btnText = document.getElementById("pipelineBtnText");

  if (!toggleBtn || !detailsBox || !btnText) return;

  toggleBtn.addEventListener("click", () => {
    const isHidden = detailsBox.hasAttribute("hidden");

    if (isHidden) {
      detailsBox.removeAttribute("hidden");
      btnText.textContent = "Nascondi Dettagli Architettura";
      toggleBtn.classList.add("btn--primary");
      toggleBtn.classList.remove("btn--ghost");
    } else {
      detailsBox.setAttribute("hidden", "");
      btnText.textContent = "Dettagli Architettura & Query";
      toggleBtn.classList.remove("btn--primary");
      toggleBtn.classList.add("btn--ghost");
    }
  });
}

/**
 * 6. Copia rapida dell'indirizzo Email con notifica
 */
function initCopyEmail() {
  const copyBtn = document.getElementById("copyEmailBtn");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.getAttribute("data-email") || "marco.santagati96@gmail.com";
    const originalText = copyBtn.querySelector("span") ? copyBtn.querySelector("span").textContent : "Copia indirizzo";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      if (copyBtn.querySelector("span")) {
        copyBtn.querySelector("span").textContent = "Copiato negli appunti! ✓";
      }
      copyBtn.style.borderColor = "var(--accent-cyan)";
      copyBtn.style.color = "#34d399";

      setTimeout(() => {
        if (copyBtn.querySelector("span")) {
          copyBtn.querySelector("span").textContent = originalText;
        }
        copyBtn.style.borderColor = "";
        copyBtn.style.color = "";
      }, 2500);
    } catch (err) {
      console.error("Impossibile copiare l'email: ", err);
    }
  });
}

/**
 * 7. Validazione e invio form contatti con simulazione asincrona
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  if (!form || !submitBtn || !formMessage) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Reset errori
    clearErrors();
    formMessage.className = "form-message";
    formMessage.textContent = "";

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    let isValid = true;

    if (!nameInput.value.trim()) {
      showError("nameError", nameInput, "Il nome è obbligatorio.");
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      showError("emailError", emailInput, "L'email è obbligatoria.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError("emailError", emailInput, "Inserisci un indirizzo email valido.");
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError("messageError", messageInput, "Il messaggio non può essere vuoto.");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError("messageError", messageInput, "Il messaggio deve contenere almeno 10 caratteri.");
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;

      formMessage.className = "form-message success";
      formMessage.textContent = `Grazie ${nameInput.value.trim()}! Il tuo messaggio è stato registrato. Ti risponderò al più presto all'indirizzo ${emailInput.value.trim()}.`;

      form.reset();
    }, 1000);
  });

  function showError(errorId, inputElement, message) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
    inputElement.closest(".form-field")?.classList.add("has-error");
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".form-field").forEach(el => el.classList.remove("has-error"));
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/**
 * 8. Pulsante Floating "Torna su"
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  if (!backToTopBtn) return;

  const toggleButtonVisibility = () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleButtonVisibility, { passive: true });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
