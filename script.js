/**
 * Portfolio - Marco Santagati
 * Interactive JavaScript (Vanilla ES6+)
 */

document.addEventListener("DOMContentLoaded", () => {
  initDynamicYear();
  initMobileNavigation();
  initScrollSpy();
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
 * 4. Toggle per i dettagli tecnici della Pipeline NewBoxofficeProject
 */
function initSpotlightToggle() {
  const toggleBtn = document.getElementById("togglePipelineDetails");
  const detailsBox = document.getElementById("pipelineDetailsBox");
  const btnText = document.getElementById("pipelineBtnText");

  if (!toggleBtn || !detailsBox || !btnText) return;

  toggleBtn.addEventListener("click", () => {
    const willOpen = detailsBox.hasAttribute("hidden");

    detailsBox.toggleAttribute("hidden", !willOpen);
    toggleBtn.setAttribute("aria-expanded", String(willOpen));
    btnText.textContent = willOpen
      ? "Nascondi dettagli architettura"
      : "Dettagli architettura & query";
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
 * 7. Validazione e invio asincrono del form contatti (Formspree / Web3Forms)
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  if (!form || !submitBtn || !formMessage) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  // Rimuovi gli errori in tempo reale durante la digitazione
  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener("input", () => {
      const field = input.closest(".form-field");
      if (field && field.classList.contains("has-error")) {
        field.classList.remove("has-error");
        const errSpan = field.querySelector(".field-error");
        if (errSpan) errSpan.textContent = "";
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Reset errori precedenti
    clearErrors();
    formMessage.className = "form-message";
    formMessage.innerHTML = "";

    // 1. Controllo Trappola Antispam Honeypot
    const honeypot = form.querySelector('input[name="_gotcha"]');
    if (honeypot && honeypot.value.trim() !== "") {
      // Se il campo è compilato, si tratta di un bot automatico:
      // Simula invio immediato con successo senza inoltrare nulla
      formMessage.className = "form-message success";
      formMessage.textContent = "Messaggio inviato con successo!";
      form.reset();
      return;
    }

    // 2. Validazione campi obbligatori
    let isValid = true;
    const nameVal = nameInput ? nameInput.value.trim() : "";
    const emailVal = emailInput ? emailInput.value.trim() : "";
    const messageVal = messageInput ? messageInput.value.trim() : "";

    if (!nameVal) {
      showError("nameError", nameInput, "Il nome è obbligatorio.");
      isValid = false;
    }

    if (!emailVal) {
      showError("emailError", emailInput, "L'email è obbligatoria.");
      isValid = false;
    } else if (!isValidEmail(emailVal)) {
      showError("emailError", emailInput, "Inserisci un indirizzo email valido.");
      isValid = false;
    }

    if (!messageVal) {
      showError("messageError", messageInput, "Il messaggio non può essere vuoto.");
      isValid = false;
    } else if (messageVal.length < 10) {
      showError("messageError", messageInput, "Il messaggio deve contenere almeno 10 caratteri.");
      isValid = false;
    }

    if (!isValid) return;

    // 3. Stato di invio in corso
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;

    const endpoint = form.getAttribute("action");

    // Modalità configurazione / dev: se l'utente non ha ancora sostituito YOUR_FORM_ID
    if (!endpoint || endpoint.includes("YOUR_FORM_ID")) {
      setTimeout(() => {
        submitBtn.classList.remove("is-loading");
        submitBtn.disabled = false;
        formMessage.className = "form-message success";
        formMessage.innerHTML = `<strong>Pronto per l'attivazione!</strong><br>I dati sono stati convalidati correttamente. Per ricevere le email reali, inserisci il tuo ID Formspree in <code>index.html</code> (nell'attributo <code>action</code> del form).`;
        form.reset();
      }, 700);
      return;
    }

    // 4. Chiamata asincrona reale con fetch API
    try {
      const formData = new FormData(form);
      const subjectInput = document.getElementById("subject");
      const subjectVal = subjectInput ? subjectInput.value.trim() : "";
      const emailSubject = subjectVal || `Contatto dal Portfolio - ${nameVal}`;

      // Configura l'oggetto predefinito per la notifica email Formspree
      formData.set("subject", emailSubject);
      formData.set("_subject", emailSubject);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        formMessage.className = "form-message success";
        formMessage.textContent = `Grazie ${nameVal}! Il tuo messaggio è stato inviato correttamente. Ti risponderò al più presto all'indirizzo ${emailVal}.`;
        form.reset();
      } else {
        const errorData = await response.json().catch(() => null);
        let errorText = "Si è verificato un errore durante l'invio del messaggio.";
        if (errorData && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorText = errorData.errors.map(err => err.message).join(", ");
        }
        formMessage.className = "form-message error";
        formMessage.innerHTML = `${errorText} In alternativa, puoi scrivermi direttamente a <a href="mailto:marco.santagati96@gmail.com">marco.santagati96@gmail.com</a>.`;
      }
    } catch (networkError) {
      console.error("Errore di rete nell'invio del form:", networkError);
      formMessage.className = "form-message error";
      formMessage.innerHTML = `Impossibile contattare il server. Verifica la connessione o scrivimi direttamente a <a href="mailto:marco.santagati96@gmail.com">marco.santagati96@gmail.com</a>.`;
    } finally {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;
    }
  });

  function showError(errorId, inputElement, message) {
    const errorSpan = document.getElementById(errorId);
    if (errorSpan) {
      errorSpan.textContent = message;
    }
    inputElement.closest(".form-field")?.classList.add("has-error");
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => (el.textContent = ""));
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
