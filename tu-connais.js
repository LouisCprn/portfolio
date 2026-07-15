/* =========================================================
   TU CONNAIS ? - apparition au scroll + transition de retour au
   portfolio (même logique que Prizius / La Veuve Noire / CDUI).
   ========================================================= */

document.querySelectorAll(".tc-section, .tc-hero").forEach((el) => {
  el.classList.add("tc-reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("tc-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".tc-reveal").forEach((el) => observer.observe(el));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageEl = document.querySelector(".tc-page");

function zoomOutToPortfolio(href) {
  if (prefersReducedMotion || !pageEl) {
    window.location.href = href;
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "tc-exit-backdrop";
  document.body.insertBefore(backdrop, document.body.firstChild);

  const originX = window.scrollX + window.innerWidth / 2;
  const originY = window.scrollY + window.innerHeight / 2;
  pageEl.style.transformOrigin = `${originX}px ${originY}px`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageEl.classList.add("tc-page-exiting"));
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

document.querySelectorAll('.tc-back, .tc-footer a[href="index.html"], .tc-contact-link').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    zoomOutToPortfolio(link.href);
  });
});
