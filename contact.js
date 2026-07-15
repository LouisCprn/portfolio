/* =========================================================
   CONTACT - pas de backend : le formulaire ouvre le client mail
   de l'utilisateur avec le message pré-rempli (mailto:).
   ========================================================= */

const form = document.getElementById("contact-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const subject = encodeURIComponent(`Contact portfolio — ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

  window.location.href = `mailto:cprnlouis@gmail.com?subject=${subject}&body=${body}`;
});

/* ---------------------------------------------------------------
   Transition de retour au portfolio : même effet que sur les pages
   Prizius / La Veuve Noire (la page rétrécit vers son centre, fond
   noir en dessous), pour que le retour ne soit plus un jump cut.
   --------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageEl = document.querySelector(".contact-page");

function zoomOutToPortfolio(href) {
  if (prefersReducedMotion || !pageEl) {
    window.location.href = href;
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "contact-exit-backdrop";
  document.body.insertBefore(backdrop, document.body.firstChild);

  const originX = window.scrollX + window.innerWidth / 2;
  const originY = window.scrollY + window.innerHeight / 2;
  pageEl.style.transformOrigin = `${originX}px ${originY}px`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageEl.classList.add("contact-page-exiting"));
  });

  let navigated = false;
  const go = () => {
    if (navigated) return;
    navigated = true;
    window.location.href = href;
  };
  pageEl.addEventListener("transitionend", (e) => {
    if (e.propertyName === "transform") go();
  });
  setTimeout(go, 750);
}

document.querySelectorAll(".contact-back").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    zoomOutToPortfolio(link.href);
  });
});
