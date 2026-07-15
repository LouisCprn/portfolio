/* =========================================================
   DIAG'EXPERT - apparition au scroll + transition de retour
   au portfolio (même logique que les autres pages projet).
   ========================================================= */

document.querySelectorAll(".dg-section, .dg-hero").forEach((el) => {
  el.classList.add("dg-reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("dg-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".dg-reveal").forEach((el) => observer.observe(el));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageEl = document.querySelector(".dg-page");

function zoomOutToPortfolio(href) {
  if (prefersReducedMotion || !pageEl) {
    window.location.href = href;
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "dg-exit-backdrop";
  document.body.insertBefore(backdrop, document.body.firstChild);

  const originX = window.scrollX + window.innerWidth / 2;
  const originY = window.scrollY + window.innerHeight / 2;
  pageEl.style.transformOrigin = `${originX}px ${originY}px`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageEl.classList.add("dg-page-exiting"));
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

document.querySelectorAll('.dg-back, .dg-footer a[href="index.html"], .dg-contact-link').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    zoomOutToPortfolio(link.href);
  });
});
