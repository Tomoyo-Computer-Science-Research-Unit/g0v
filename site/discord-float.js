/* Discord flutuante do g0v.tomoyo.systems, igual ao do tomoyo.systems: canto inferior direito,
   96 px (52 px em telas estreitas), invertido no tema escuro, × para fechar (lembrado no navegador).
   Incluído pela landing e pelos projetos com <script src="/discord-float.js" defer>. */
(() => {
  const KEY = "g0v-hide-discord";
  const URL = "https://discord.gg/A4hCteqAse";
  try {
    if (localStorage.getItem(KEY) === "1") return;
  } catch (e) {}
  if (document.querySelector(".g0v-discord")) return;

  const css = `
.g0v-discord{position:fixed;right:16px;bottom:var(--g0v-discord-bottom,16px);z-index:70;padding:10px;user-select:none}
.g0v-discord a{display:block}
.g0v-discord img{display:block;width:96px;height:96px;image-rendering:pixelated;transition:transform .12s ease-out}
.g0v-discord a:hover img,.g0v-discord a:focus-visible img{transform:scale(1.06)}
:root[data-theme="dark"] .g0v-discord img{filter:invert(1)}
.g0v-discord button{position:absolute;top:0;right:0;display:grid;place-items:center;width:22px;height:22px;padding:0;
 border:1px solid var(--ink,#0e0e0e);border-radius:50%;background:var(--paper,#fafaf8);color:var(--ink,#0e0e0e);
 font:12px/1 sans-serif;cursor:pointer;opacity:0;transition:opacity .12s}
.g0v-discord:hover button,.g0v-discord:focus-within button{opacity:1}
.g0v-discord button:hover,.g0v-discord button:focus-visible{background:var(--ink,#0e0e0e);color:var(--paper,#fafaf8)}
@media (hover:none){.g0v-discord button{opacity:1}}
@media (max-width:600px){.g0v-discord{right:8px;padding:6px}.g0v-discord img{width:52px;height:52px}}`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const box = document.createElement("aside");
  box.className = "g0v-discord";
  box.setAttribute("aria-label", "Comunidade");
  box.innerHTML = `<a href="${URL}" target="_blank" rel="noopener" draggable="false" aria-label="Discord da Tomoyo"><img src="/discord.gif" alt="" width="96" height="96" decoding="async" draggable="false"></a><button type="button" aria-label="Fechar: Discord">×</button>`;
  box.querySelector("button").addEventListener("click", () => {
    box.remove();
    try {
      localStorage.setItem(KEY, "1");
    } catch (e) {}
  });
  const mount = () => document.body.appendChild(box);
  if (document.body) mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
