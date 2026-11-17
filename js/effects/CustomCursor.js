import { canAnimatePointer } from "../utils/motion.js";

/**
 * Bolinha que segue o mouse "com atraso" e cresce sobre links e botões.
 * mix-blend-mode: difference (no CSS) inverte as cores por baixo dela.
 */
export class CustomCursor {
  start() {
    if (!canAnimatePointer()) return;

    this.dot = document.createElement("div");
    this.dot.className = "cursor is-hidden";
    this.dot.setAttribute("aria-hidden", "true");
    document.body.append(this.dot);

    this.target = { x: 0, y: 0 };  // onde o mouse ESTÁ
    this.current = { x: 0, y: 0 }; // onde a bolinha está desenhada

    document.addEventListener("pointermove", (event) => {
      this.target = { x: event.clientX, y: event.clientY };
      this.dot.classList.remove("is-hidden");
      this.dot.classList.toggle("is-hovering", Boolean(event.target.closest("a, button, select, [data-tilt]")));
    });
    document.addEventListener("pointerleave", () => this.dot.classList.add("is-hidden"));

    this.#loop();
  }

  #loop() {
    // "lerp": a cada quadro anda 20% do caminho até o mouse → movimento suave
    this.current.x += (this.target.x - this.current.x) * 0.2;
    this.current.y += (this.target.y - this.current.y) * 0.2;
    this.dot.style.transform = `translate(${this.current.x}px, ${this.current.y}px)`;
    requestAnimationFrame(() => this.#loop());
  }
}
