/* g0v.tomoyo.systems: tema, efeitos e o mon flutuante. Porte em JS puro do que o
   tomoyo.systems faz e do que o Perdeu, Playboy usa (Fx.tsx). */
(() => {
  const root = document.documentElement;
  const isTyping = (target) => {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
  };
  const store = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  };

  // Teclas: T tema, F efeitos, 1 abre o primeiro projeto.
  addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
    if (event.key === "t" || event.key === "T") {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
    } else if (event.key === "f" || event.key === "F") {
      const on = !root.classList.contains("fx");
      root.classList.toggle("fx", on);
      store("pp-fx", on ? "on" : "off");
    } else if (event.key === "1") {
      location.href = "/perdeu-playboy/";
    }
  });

  // --- Mon flutuante: arrasta pela tela; um clique sem arrastar abre o tomoyo.systems -------
  document.querySelectorAll(".mon-float").forEach((float) => {
    const link = float.querySelector(".mon-float__link");
    let startX = 0, startY = 0, left = 0, top = 0, holding = false, dragged = false;
    const move = (event) => {
      const dx = event.clientX - startX, dy = event.clientY - startY;
      if (!dragged && Math.hypot(dx, dy) < 5) return;
      dragged = true;
      float.classList.add("is-dragging");
      const w = float.offsetWidth, h = float.offsetHeight;
      Object.assign(float.style, {
        left: `${Math.min(Math.max(left + dx, 0), innerWidth - w)}px`,
        top: `${Math.min(Math.max(top + dy, 0), innerHeight - h)}px`,
        right: "auto",
        bottom: "auto"
      });
    };
    const up = (event) => {
      holding = false;
      float.classList.remove("is-dragging", "is-holding");
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
    };
    float.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest(".float-close")) return;
      const box = float.getBoundingClientRect();
      startX = event.clientX; startY = event.clientY; left = box.left; top = box.top;
      holding = true; dragged = false;
      float.classList.add("is-holding");
      addEventListener("pointermove", move);
      addEventListener("pointerup", up);
      addEventListener("pointercancel", up);
    });
    link.addEventListener("click", (event) => { if (dragged) event.preventDefault(); });
    float.querySelector(".float-close").addEventListener("click", () => {
      root.dataset.hide = ((root.dataset.hide || "") + " mon").trim();
    });
  });

})();
