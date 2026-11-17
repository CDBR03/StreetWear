import { canAnimatePointer } from "../utils/motion.js";

/**
 * Inclina em 3D os elementos com [data-tilt] seguindo o mouse,
 * e informa ao CSS onde está o mouse (--mx, --my) para o brilho.
 */
export class Tilt {
  constructor(maxAngle = 8) {
    this.maxAngle = maxAngle;
  }

  start() {
    if (!canAnimatePointer()) return;
    // Delegação: um ouvinte no documento serve para todos os cartões, inclusive os criados depois
    document.addEventListener("pointermove", (event) => this.#onMove(event));
    document.addEventListener("pointerout", (event) => this.#onLeave(event));
  }

  #onMove(event) {
    const target = event.target.closest("[data-tilt]");
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;  // 0 (esquerda) → 1 (direita)
    const y = (event.clientY - rect.top) / rect.height;  // 0 (topo)     → 1 (base)
    target.style.setProperty("--rx", `${((x - 0.5) * this.maxAngle * 2).toFixed(2)}deg`);
    target.style.setProperty("--ry", `${((0.5 - y) * this.maxAngle * 2).toFixed(2)}deg`);
    target.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    target.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }

  #onLeave(event) {
    const target = event.target.closest("[data-tilt]");
    if (!target || target.contains(event.relatedTarget)) return; // ainda está dentro do cartão
    target.style.setProperty("--rx", "0deg");
    target.style.setProperty("--ry", "0deg");
  }
}
