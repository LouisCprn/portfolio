/* =========================================================
   PRIZIUS - petites animations d'apparition au scroll
   ========================================================= */

// .pz-section porte le fond ondulé en background-attachment:fixed :
// on lui applique une variante SANS transform (juste un fondu),
// car un transform sur ce même élément casse le fond fixe pendant
// toute la transition. Le slide+fade complet reste réservé au
// contenu du hero (qui ne porte pas le fond).
document.querySelectorAll(".pz-section").forEach((el) => {
  el.classList.add("pz-reveal-fade");
});
document.querySelectorAll(".pz-hero-text, .pz-hero-art").forEach((el) => {
  el.classList.add("pz-reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("pz-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".pz-reveal, .pz-reveal-fade").forEach((el) => observer.observe(el));

/* ---------------------------------------------------------------
   Transition de retour au portfolio : la page entière rétrécit et
   s'estompe vers son centre, avec un fond noir fixe en dessous (la
   couleur d'arrivée) -> ce qui se révèle autour, c'est du noir, pas
   la page Prizius elle-même (contrairement à la 1ère version, où un
   calque rétrécissait PAR-DESSUS la page encore visible en dessous).
   --------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageEl = document.querySelector(".pz-page");

function zoomOutToPortfolio(href) {
  if (prefersReducedMotion || !pageEl) {
    window.location.href = href;
    return;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "pz-exit-backdrop";
  document.body.insertBefore(backdrop, document.body.firstChild);

  // transform-origin: "center" est centré sur toute la hauteur de
  // .pz-page (souvent bien plus grande que l'écran), pas sur ce que
  // l'utilisateur voit -> le dézoom semblait partir du bas. On calcule
  // le centre du viewport ACTUEL en coordonnées de .pz-page (qui
  // commence en haut du document) pour que le rétrécissement parte
  // toujours de ce qui est visible à l'écran au moment du clic.
  const originX = window.scrollX + window.innerWidth / 2;
  const originY = window.scrollY + window.innerHeight / 2;
  pageEl.style.transformOrigin = `${originX}px ${originY}px`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => pageEl.classList.add("pz-page-exiting"));
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
document.querySelectorAll('a.pz-back, .pz-footer a[href="index.html"], .pz-contact-link').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    zoomOutToPortfolio(link.href);
  });
});
