/** Aviso rápido que aparece embaixo da tela e some sozinho. */
export class Toast {
  #timer = 0;

  constructor(element) {
    this.element = element;
  }

  show(message, duration = 2600) {
    this.element.textContent = message;
    this.element.classList.add("is-visible");
    window.clearTimeout(this.#timer);
    this.#timer = window.setTimeout(() => this.element.classList.remove("is-visible"), duration);
  }
}
