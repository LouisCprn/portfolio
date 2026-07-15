/* =========================================================
   MOTEUR DE TRADUCTION PARTAGÉ (FR / EN) - toutes les pages.

   Chaque page définit AVANT ce script un objet global :
     const PAGE_I18N = {
       fr: { cle: "texte FR", ... },
       en: { cle: "texte EN", ... }
     };

   Puis marque les éléments à traduire :
     - texte visible  : <p data-i18n="cle">...</p>
     - un ou plusieurs attributs (alt, aria-label, placeholder...) :
       <img data-i18n-attr="alt:cle1,aria-label:cle2" ...>

   La langue choisie est mémorisée (localStorage) et reste la
   même en naviguant d'une page à l'autre du site.
   ========================================================= */

const LANG_KEY = "portfolio-lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) || "fr";
}

function applyTranslations(lang) {
  if (typeof PAGE_I18N === "undefined") return;
  const dict = PAGE_I18N[lang] || PAGE_I18N.fr;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.getAttribute("data-i18n-attr").split(",").forEach((pair) => {
      const [attr, key] = pair.split(":").map((s) => s.trim());
      if (attr && dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });
  });

  document.documentElement.lang = lang;

  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "fr" ? "EN" : "FR";
}

function initLang() {
  applyTranslations(getLang());
}

const langToggleEl = document.getElementById("lang-toggle");
if (langToggleEl) {
  langToggleEl.addEventListener("click", () => {
    const next = getLang() === "fr" ? "en" : "fr";
    localStorage.setItem(LANG_KEY, next);
    applyTranslations(next);
  });
}

initLang();
