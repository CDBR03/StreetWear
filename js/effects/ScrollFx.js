import { prefersReducedMotion } from "../utils/motion.js";

/**
 * Tudo que reage à rolagem da página:
 *  - barra de progresso no topo
 *  - cabeçalho que "encolhe"
 *  - parallax nas fotos com [data-parallax]
 *  - palavra gigante do fundo com [data-drift]
 */
export class ScrollFx {
  #ticking = false;

  start() {
    this.progress = document.querySelector("[data-scroll-progress]");
    this.header = document.querySelector("[data-site-header-bar]");
    this.parallax = prefersReducedMotion() ? [] : [...document.querySelectorAll("[data-parallax]")];
    this.drift = prefersReducedMotion() ? [] : [...document.querySelectorAll("[data-drift]")];

    window.addEventListener("scroll", () => this.#requestUpdate(), { passive: true });
    window.addEventListener("resize", () => this.#requestUpdate());
    this.#update();
  }

  /** Evita recalcular mais de uma vez por quadro de animação (≈60x por segundo). */
  #requestUpdate() {
    if (this.#ticking) return;
    this.#ticking = true;
    requestAnimationFrame(() => {
      this.#update();
      this.#ticking = false;
    });
  }

  #update() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    this.progress?.style.setProperty("--progress", maxScroll > 0 ? scrollY / maxScroll : 0);
    this.header?.classList.toggle("is-scrolled", scrollY > 40);

    for (const element of this.parallax) {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue; // fora da tela: ignora
      const speed = Number(element.dataset.parallax) || 0.15;
      // distância entre o centro do elemento e o centro da tela
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      element.style.setProperty("--parallax", `${(-offset * speed).toFixed(1)}px`);
    }

    for (const element of this.drift) {
      element.style.setProperty("--shift", `${(-scrollY * (Number(element.dataset.drift) || 0.4)).toFixed(1)}px`);
    }
  }
}
