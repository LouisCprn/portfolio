/* =========================================================
   CONTENU DU PORTFOLIO
   -> Fichier à modifier pour personnaliser le site.

   SITE_INFO.fullName : ton nom complet (affiché en majuscule).
   PROJECTS : une entrée par projet.
     - title     : nom affiché
     - link      : page du projet ("#" = pas encore de lien -> toast)
     - accent    : couleur de la DA du projet, utilisée pour le flash
                   de couleur pendant la transition "zoom" à l'ouverture
     - logo      : petit visuel SVG (inline) representant la DA du
                   projet, affiché dans la dalle. Laisser null pour un
                   monogramme de repli (1ère lettre du nom).
     - thumbnail : chemin d'image utilisée comme fond ENTIER de la dalle
                   (façon miniature YouTube), à la place de l'icône +
                   du nom. Laisser vide si tu préfères le rendu icône/nom.
   Ajoute/retire des entrées à volonté, la grille de dalles
   s'adapte automatiquement.
   ========================================================= */

const SITE_INFO = {
  fullName: "Louis Capron"
};

const PROJECTS = [
  {
    title: "Prizius",
    link: "prizius.html",
    accent: "#55336f",
    thumbnail: "images/Miniature.webp"
  },
  {
    title: "La Veuve Noire",
    link: "veuve-noire.html",
    accent: "#141414",
    thumbnail: "images/veuve-noire.webp"
  },
  {
    title: "Projet CDUI",
    link: "cdui.html",
    accent: "#2a0e86",
    thumbnail: "images/cdui.webp"
  },
  {
    title: "École Notre Dame",
    link: "notre-dame-albert.html",
    accent: "#3D6A98",
    thumbnail: "images/NDA.webp"
  },
  {
    title: "Tu Connais ?",
    link: "tu-connais.html",
    accent: "#e2661d",
    thumbnail: "images/Miniature Tu Connais.png"
  }
];
