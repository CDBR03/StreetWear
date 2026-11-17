import { prefersReducedMotion } from "../utils/motion.js";

/**
 * Revela elementos quando eles entram na tela.
 * Funciona com: .reveal (sobe e aparece), .reveal-clip (cortina)
 * e .split (letras do SplitText).
 */
const SELECTOR = ".reveal:not(.is-visible), .reveal-clip:not(.is-visible), .split:not(.is-visible)";

export class Reveal {
  // Para cada elemento observado, quais elementos devem ganhar .is-visible
  #targets = new Map();

  constructor() {
    this.observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => this.#onIntersect(entries), { threshold: 0.15, rootMargin: "0px 0px -5% 0px" })
      : null;
  }

  start() {
    // Espera a cortina de abertura subir antes de começar a revelar
    const curtainVisible = document.querySelector(".curtain") && !prefersReducedMotion();
    window.setTimeout(() => this.scan(), curtainVisible ? 700 : 0);
    // Cartões criados depois (ex.: troca de filtro) também precisam ser observados
    document.addEventListener("streetwear:content-updated", () => this.scan());
  }

  scan() {
    document.querySelectorAll(SELECTOR).forEach((element) => {
      if (!this.observer) return element.classList.add("is-visible");

      // Um .reveal-clip começa com clip-path "fechado" (altura zero visível) e o
      // IntersectionObserver leva esse corte em conta: ele nunca "veria" o elemento.
      // Por isso observamos o PAI e, quando o pai aparece, revelamos o filho.
      const watched = element.classList.contains("reveal-clip") ? element.parentElement : element;
      if (!this.#targets.has(watched)) this.#targets.set(watched, new Set());
      this.#targets.get(watched).add(element);
      this.observer.observe(watched);
    });
  }

  #onIntersect(entries) {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      this.#targets.get(entry.target)?.forEach((element) => element.classList.add("is-visible"));
      this.#targets.delete(entry.target);
      this.observer.unobserve(entry.target);
    }
  }
}
