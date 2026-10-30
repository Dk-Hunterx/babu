/* Bestie Forever — friendship-only interactions */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const pages = [...document.querySelectorAll(".page")];
  let currentPage = 0;
  const floating = $("#floatingContainer");
  const popup = $("#popup");
  const yesBtn = $("#yesBtn");
  const noBtn = $("#noBtn");
  const puzzle = $("#puzzle");

  function show(id) {
    const next = document.getElementById(id);
    if (!next) return;
    pages.forEach((page) => page.classList.toggle("active", page === next));
    currentPage = pages.indexOf(next);
    next.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (id === "page7") celebrate();
    if (id === "page1") resetButtons();
  }

  function makeFloaties() {
    if (!floating) return;
    floating.innerHTML = "";
    const icons = ["⭐", "🫂", "🤝", "🎉", "✨", "💛", "😎"];
    for (let i = 0; i < 15; i++) {
      const item = document.createElement("span");
      item.className = "floating-element";
      item.textContent = icons[Math.floor(Math.random() * icons.length)];
      item.style.left = Math.random() * 100 + "%";
      item.style.animationDuration = 7 + Math.random() * 7 + "s";
      item.style.animationDelay = Math.random() * 5 + "s";
      floating.appendChild(item);
    }
  }

  let yesSize = 18;
  let noSize = 16;
  function resetButtons() {
    yesSize = 18; noSize = 16;
    yesBtn.style.fontSize = "";
    yesBtn.style.padding = "";
    noBtn.style.cssText = "";
    noBtn.classList.remove("running-away");
  }
  function dodgeNo() {
    const maxX = Math.max(8, window.innerWidth - noBtn.offsetWidth - 16);
    const maxY = Math.max(8, window.innerHeight - noBtn.offsetHeight - 16);
    noBtn.classList.add("running-away");
    noBtn.style.left = Math.random() * maxX + "px";
    noBtn.style.top = Math.random() * maxY + "px";
    yesSize = Math.min(30, yesSize + 2);
    noSize = Math.max(10, noSize - 1);
    yesBtn.style.fontSize = yesSize + "px";
    noBtn.style.fontSize = noSize + "px";
  }
  noBtn.addEventListener("mouseenter", dodgeNo);
  noBtn.addEventListener("click", (event) => { event.preventDefault(); dodgeNo(); });
  yesBtn.addEventListener("click", () => show("page2"));

  $("#lateBtn").addEventListener("click", () => {
    popup.classList.remove("overlay-hidden");
    popup.setAttribute("aria-hidden", "false");
  });
  function closePopup() {
    popup.classList.add("overlay-hidden");
    popup.setAttribute("aria-hidden", "true");
  }
  $("#goBack").addEventListener("click", closePopup);
  popup.addEventListener("click", (event) => { if (event.target === popup) closePopup(); });
  $("#readLetter").addEventListener("click", () => { closePopup(); show("page3"); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopup();
  });

  $("#memories").addEventListener("click", () => show("page4"));
  document.querySelectorAll(".heart-card").forEach((card) => {
    const reveal = () => card.classList.toggle("revealed");
    card.addEventListener("click", reveal);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); reveal(); }
    });
  });
  $("#playPuzzle").addEventListener("click", () => show("page5"));

  let order = [0,1,2,3,4,5,6,7,8];
  let emptyIndex = 8;
  function drawPuzzle() {
    puzzle.innerHTML = "";
    order.forEach((piece, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "puzzle-piece" + (piece === 8 ? " empty" : "");
      tile.setAttribute("aria-label", piece === 8 ? "Empty puzzle space" : "Puzzle piece " + (piece + 1));
      if (piece !== 8) {
        tile.style.backgroundPosition = ((piece % 3) * 50) + "% " + (Math.floor(piece / 3) * 50) + "%";
      }
      tile.addEventListener("click", () => movePiece(index));
      puzzle.appendChild(tile);
    });
  }
  function movePiece(index) {
    const row = Math.floor(index / 3), col = index % 3;
    const erow = Math.floor(emptyIndex / 3), ecol = emptyIndex % 3;
    if ((Math.abs(row-erow) + Math.abs(col-ecol)) !== 1) return;
    [order[index], order[emptyIndex]] = [order[emptyIndex], order[index]];
    emptyIndex = index;
    drawPuzzle();
    if (order.every((value, i) => value === i)) {
      setTimeout(() => {
        alert("🏆 Puzzle complete! Teamwork makes the best memories. Bestie forever! 🤝");
        show("page6");
      }, 180);
    }
  }
  function shufflePuzzle() {
    do {
      order = [0,1,2,3,4,5,6,7,8].sort(() => Math.random() - .5);
    } while (!solvable() || order.every((value, i) => value === i));
    emptyIndex = order.indexOf(8);
    drawPuzzle();
  }
  function solvable() {
    let inversions = 0;
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 9; j++) {
      if (order[i] !== 8 && order[j] !== 8 && order[i] > order[j]) inversions++;
    }
    return inversions % 2 === 0;
  }
  $("#shuffle").addEventListener("click", shufflePuzzle);
  $("#whyLove").addEventListener("click", () => show("page6"));
  $("#final").addEventListener("click", () => show("page7"));
  $("#restart").addEventListener("click", () => {
    closePopup();
    document.querySelectorAll(".heart-card").forEach((card) => card.classList.remove("revealed"));
    shufflePuzzle();
    show("page1");
  });

  function celebrate() {
    const fireworks = $("#fireworksContainer");
    const confetti = $("#confettiContainer");
    fireworks.innerHTML = ""; confetti.innerHTML = "";
    const colors = ["#38bdf8", "#facc15", "#34d399", "#a78bfa", "#fb923c"];
    for (let burst = 0; burst < 7; burst++) {
      setTimeout(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight * .55;
        for (let i = 0; i < 22; i++) {
          const dot = document.createElement("i");
          const angle = i / 22 * Math.PI * 2;
          dot.className = "firework-particle";
          dot.style.left = x + "px"; dot.style.top = y + "px";
          dot.style.background = colors[Math.floor(Math.random() * colors.length)];
          dot.style.setProperty("--tx", Math.cos(angle) * (65 + Math.random()*75) + "px");
          dot.style.setProperty("--ty", Math.sin(angle) * (65 + Math.random()*75) + "px");
          fireworks.appendChild(dot);
          setTimeout(() => dot.remove(), 1700);
        }
      }, burst * 260);
    }
    const icons = ["🎉", "⭐", "✨", "🤝", "💛", "🫂"];
    for (let i = 0; i < 45; i++) {
      setTimeout(() => {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.textContent = icons[Math.floor(Math.random() * icons.length)];
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.animationDuration = 2.5 + Math.random() * 2 + "s";
        confetti.appendChild(piece);
        setTimeout(() => piece.remove(), 4800);
      }, i * 45);
    }
  }

  pages.forEach((page, index) => page.classList.toggle("active", index === 0));
  popup.classList.add("overlay-hidden");
  makeFloaties();
  shufflePuzzle();
})();
