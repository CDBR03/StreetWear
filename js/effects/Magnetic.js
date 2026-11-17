import { canAnimatePointer } from "../utils/motion.js";

/**
 * Botões "magnéticos": quando o mouse chega perto,
 * o botão é puxado levemente na direção dele.
 */
export class Magnetic {
  constructor(strength = 0.3) {
    this.strength = strength;
  }

  start() {
    if (!canAnimatePointer()) return;
    document.querySelectorAll(".button, [data-magnetic]").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        // "translate" é separado de "transform", então não briga com o hover do CSS
        element.style.translate = `${x * this.strength}px ${y * this.strength}px`;
      });
      element.addEventListener("pointerleave", () => {
        element.style.translate = "";
      });
    });
  }
}
