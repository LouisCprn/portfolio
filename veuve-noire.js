/* =========================================================
   LA VEUVE NOIRE - apparition au scroll + transition de retour
   au portfolio (même logique que sur la page Prizius).
   ========================================================= */

document.querySelectorAll(".vn-section, .vn-hero").forEach((el) => {
  el.classList.add("vn-reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("vn-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".vn-reveal").forEach((el) => observer.observe(el));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageEl = document.querySelector(".vn-page");

function zoomOutToPortfolio(href) {
  if (prefersReducedMotion || !pageEl) {
    window.location.href = href;
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "vn-exit-backdrop";
  document.body.insertBefore(backdrop, document.body.firstChild);

  const originX = window.scrollX + window.innerWidth / 2;
  const originY = window.scrollY + window.innerHeight / 2;
  pageEl.style.transformOrigin = `${originX}px ${originY}px`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageEl.classList.add("vn-page-exiting"));
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

// même transition pour tous les liens de sortie de page (retour au
// portfolio ET lien Contact), pas seulement le retour au portfolio
document.querySelectorAll('.vn-back, .vn-footer a[href="index.html"], .vn-contact-link').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    zoomOutToPortfolio(link.href);
  });
});
