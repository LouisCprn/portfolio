/* =========================================================
   LOGIQUE DU PORTFOLIO - damier plein écran
   ========================================================= */

const nameEl = document.getElementById("site-name");
const boardWrapperEl = document.getElementById("board-wrapper");
const boardEl = document.getElementById("board");
const toastEl = document.getElementById("toast");
const themeToggleEl = document.getElementById("theme-toggle");

let toastTimer = null;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("visible"), 2200);
}

/* ---------------- THEME SOMBRE / CLAIR ---------------- */

const THEME_KEY = "portfolio-theme";

function applyTheme(theme) {
  document.body.classList.toggle("light-theme", theme === "light");
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(saved);
}

themeToggleEl.addEventListener("click", () => {
  const next = document.body.classList.contains("light-theme") ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

initTheme();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function openProject(project, cellEl) {
  const hasRealLink = project.link && project.link !== "#";
  if (!hasRealLink) {
    const lang = typeof getLang === "function" ? getLang() : "fr";
    const dict = (typeof PAGE_I18N !== "undefined" && PAGE_I18N[lang]) || {};
    const template = dict.toastMissingLink || 'Ajoute le lien de "{title}" dans data.js';
    showToast(template.replace("{title}", project.title));
    return;
  }
  zoomIntoCell(cellEl, project);
}

/* ---------------------------------------------------------------
   Transition d'ouverture : on clone la dalle cliquée dans un calque
   fixe positionné exactement par-dessus, puis on l'anime pour
   qu'elle remplisse tout l'écran ("zoom dedans"), avec un flash de
   la couleur d'accent du projet. La navigation se fait dans le même
   onglet (sinon la transition ne serait jamais visible) une fois
   l'animation terminée.
   --------------------------------------------------------------- */
function zoomIntoCell(cellEl, project) {
  if (prefersReducedMotion) {
    window.location.href = project.link;
    return;
  }

  const rect = cellEl.getBoundingClientRect();
  const overlay = document.createElement("div");
  overlay.className = "zoom-overlay";
  overlay.style.setProperty("--accent", project.accent || "var(--tile-bg)");
  overlay.style.top = `${rect.top}px`;
  overlay.style.left = `${rect.left}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.innerHTML = cellEl.innerHTML;
  if (project.thumbnail) {
    overlay.classList.add("cell-thumbnail");
    overlay.style.backgroundImage = `url("${project.thumbnail}")`;
  }
  document.body.appendChild(overlay);
  boardWrapperEl.style.pointerEvents = "none";

  // double rAF : laisse le navigateur peindre l'état de départ
  // avant de déclencher la transition vers l'état "plein écran".
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add("zoom-overlay-active"));
  });

  let navigated = false;
  const go = () => {
    if (navigated) return;
    navigated = true;
    window.location.href = project.link;
  };
  overlay.addEventListener("transitionend", (e) => {
    if (e.propertyName === "width") go();
  });
  setTimeout(go, 700); // filet de sécurité si transitionend ne se déclenche pas
}

function renderHeader() {
  nameEl.textContent = SITE_INFO.fullName;
}

// --- centres (en px, relatifs à board-wrapper) de chaque dalle,
//     utilisés pour calculer l'effet de soulèvement continu ---
let cellCenters = [];

// --- construit un damier de dalles rectangulaires, espacées de 5px,
//     qui remplit exactement l'espace restant sous la ligne ---
function buildBoard() {
  const rect = boardWrapperEl.getBoundingClientRect();
  const availW = rect.width;
  const availH = rect.height;
  const isMobile = availW < 640;
  // ratio façon miniature YouTube (16:9), encore agrandi
  const cellW = isMobile ? 220 : 380;
  const cellH = isMobile ? 124 : 214;
  // espacement généreux : le lift (scale + translateY) ne doit
  // jamais faire chevaucher deux dalles voisines
  const gap = isMobile ? 18 : 30;

  const rows = Math.max(1, Math.ceil(availH / (cellH + gap)) + 1);
  // 2 dalles de marge en largeur : avec le décalage en quinconce,
  // il en faut plus pour couvrir toute la largeur sans trou.
  const colsPerRow = Math.max(1, Math.ceil(availW / (cellW + gap)) + 2);
  const total = rows * colsPerRow;

  boardEl.innerHTML = "";
  cellCenters = [];

  // les 4 premiers projets restent groupés côte à côte sur la même
  // ligne (comme à l'origine) ; tout projet ajouté au-delà descend
  // sur une nouvelle ligne, centrée, juste en dessous.
  const PROJECTS_PER_ROW = 4;
  const positions = new Map();
  for (let i = 0; i < PROJECTS.length; i += PROJECTS_PER_ROW) {
    const rowProjects = PROJECTS.slice(i, i + PROJECTS_PER_ROW);
    const rowIndex = i / PROJECTS_PER_ROW;
    const targetRow = Math.min(rows - 1, 1 + rowIndex);
    // les lignes incomplètes (moins de PROJECTS_PER_ROW projets, ex.
    // "Tu Connais ?" seul) sont décalées d'une case vers la gauche
    // par rapport au centrage strict.
    const isPartialRow = rowProjects.length < PROJECTS_PER_ROW;
    const centerOffset = isPartialRow ? 1 : 0;
    const startCol = Math.max(0, Math.floor((colsPerRow - rowProjects.length) / 2) - centerOffset);
    rowProjects.forEach((project, j) => {
      const col = Math.min(colsPerRow - 1, startCol + j);
      const index = targetRow * colsPerRow + col;
      positions.set(index, project);
    });
  }

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    // une rangée sur deux est décalée d'une demi-dalle : motif brique/quinconce
    const rowOffset = r % 2 === 1 ? -(cellW + gap) / 2 : 0;

    for (let c = 0; c < colsPerRow; c++) {
      const left = c * (cellW + gap) + rowOffset;
      const top = r * (cellH + gap);

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.left = `${left}px`;
      cell.style.top = `${top}px`;
      cell.style.width = `${cellW}px`;
      cell.style.height = `${cellH}px`;

      const project = positions.get(idx);
      if (project) {
        cell.classList.add("cell-project");
        cell.tabIndex = 0;
        cell.setAttribute("role", "button");
        cell.setAttribute("aria-label", project.title);

        if (project.thumbnail) {
          // miniature façon YouTube : l'image remplit toute la dalle,
          // pas d'icône ni de nom séparé par-dessus
          cell.classList.add("cell-thumbnail");
          cell.style.backgroundImage = `url("${project.thumbnail}")`;
        } else {
          // visuel représentant la DA du projet (logo fourni, ou
          // sinon un monogramme de repli avec la 1ère lettre du nom)
          const visual = document.createElement("div");
          visual.className = "cell-visual";
          if (project.logo) {
            visual.innerHTML = project.logo;
          } else {
            const mono = document.createElement("span");
            mono.className = "cell-monogram";
            mono.textContent = project.title.charAt(0).toUpperCase();
            visual.appendChild(mono);
          }
          cell.appendChild(visual);

          const name = document.createElement("span");
          name.className = "cell-name";
          name.textContent = project.title;
          cell.appendChild(name);
        }

        cell.addEventListener("click", () => openProject(project, cell));
        cell.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProject(project, cell);
          }
        });
      }

      boardEl.appendChild(cell);

      // centre de la dalle, en px, relatif au coin haut-gauche du damier
      cellCenters.push({ el: cell, cx: left + cellW / 2, cy: top + cellH / 2 });
      idx++;
    }
  }

  const gridW = colsPerRow * (cellW + gap);
  const gridH = rows * (cellH + gap);
  boardDiagonal = Math.hypot(gridW, gridH);

  // rayon du "spot" lumineux autour de la souris : environ une dalle,
  // pour qu'entre deux dalles chacune ne soit éclairée qu'à moitié
  glowRadius = Math.max(cellW, cellH) * 1.15;
}

/* ---------------------------------------------------------------
   Effet de soulèvement : la dalle sous la souris se soulève au
   maximum, et les dalles voisines se soulèvent de moins en moins
   en fonction de leur distance au curseur (dégradé sur tout le
   damier, comme une vague/effet magnétique).

   Effet de lueur : un halo circulaire suit la souris. Une dalle
   pile sous le curseur est éclairée à 100%, une dalle à la limite
   du halo (par exemple entre deux dalles) n'est éclairée qu'à moitié.
   --------------------------------------------------------------- */
const LIFT_CURVE = 1.6; // >1 = pic plus concentré autour du curseur
let boardDiagonal = 1;
let glowRadius = 1;
let pendingMove = null;
let rafScheduled = false;

function applyLift(clientX, clientY) {
  const rect = boardWrapperEl.getBoundingClientRect();
  const mx = clientX - rect.left;
  const my = clientY - rect.top;

  cellCenters.forEach(({ el, cx, cy }) => {
    const dist = Math.hypot(mx - cx, my - cy);

    const liftRaw = Math.max(0, 1 - dist / boardDiagonal);
    const lift = Math.pow(liftRaw, LIFT_CURVE);

    const glow = Math.max(0, 1 - dist / glowRadius);

    el.style.setProperty("--lift", lift.toFixed(3));
    el.style.setProperty("--glow", glow.toFixed(3));
    el.style.zIndex = Math.round(lift * 50);
  });
}

function resetLift() {
  cellCenters.forEach(({ el }) => {
    el.style.setProperty("--lift", 0);
    el.style.setProperty("--glow", 0);
    el.style.zIndex = 0;
  });
}

function onPointerMove(e) {
  pendingMove = e;
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      if (pendingMove) applyLift(pendingMove.clientX, pendingMove.clientY);
      rafScheduled = false;
    });
  }
}

boardWrapperEl.addEventListener("mousemove", onPointerMove);
boardWrapperEl.addEventListener("mouseleave", resetLift);

// --- recalcule tout au redimensionnement (avec un léger débounce) ---
let resizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(buildBoard, 150);
});

renderHeader();
buildBoard();
