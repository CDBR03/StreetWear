import { el } from "../utils/dom.js";
import { formatPrice } from "../utils/format.js";

/**
 * A sacola lateral. Ela escuta o CartService:
 * toda vez que o carrinho muda, ela se redesenha sozinha.
 */
export class CartDrawer {
  #opener = null;

  constructor(cart) {
    this.cart = cart;
    this.drawer = document.querySelector("[data-cart-drawer]");
    this.backdrop = document.querySelector("[data-cart-backdrop]");
    this.list = document.querySelector("[data-cart-items]");
    this.total = document.querySelector("[data-cart-total]");
    this.count = document.querySelector("[data-cart-count]");

    this.cart.addEventListener("change", () => {
      this.render();
      this.#bumpCount();
    });
    this.backdrop.addEventListener("click", () => this.close());
    document.addEventListener("keydown", (event) => this.#onKeydown(event));
    this.render();
  }

  get isOpen() {
    return this.drawer.classList.contains("is-open");
  }

  open() {
    if (this.isOpen) return;
    this.#opener = document.activeElement;
    this.#setOpen(true);
    this.drawer.querySelector("[data-action=close-cart]").focus();
  }

  close() {
    if (!this.isOpen) return;
    this.#setOpen(false);
    this.#opener?.focus();
  }

  #setOpen(open) {
    this.drawer.classList.toggle("is-open", open);
    this.backdrop.classList.toggle("is-open", open);
    this.drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("is-locked", open);
  }

  render() {
    this.count.textContent = this.cart.count;
    const lines = this.cart.getItems().map((item) => this.#line(item));
    this.list.replaceChildren(...(lines.length ? lines : [el("p", { class: "empty-cart" }, "Sua sacola está esperando por você ✳")]));
    this.total.textContent = formatPrice(this.cart.total);
  }

  #line({ id, product, size, quantity }) {
    const qtyButton = (label, value, aria) =>
      el("button", { type: "button", dataset: { action: "set-quantity", id, quantity: value }, "aria-label": aria }, label);

    return el("article", { class: "cart-line" },
      el("img", { src: product.image, alt: product.alt }),
      el("div", {},
        el("h3", {}, product.name),
        el("p", {}, `${product.formattedPrice} · Tam. ${size}`),
        el("div", { class: "quantity-controls" },
          qtyButton("−", quantity - 1, "Diminuir quantidade"),
          el("span", {}, String(quantity)),
          qtyButton("+", quantity + 1, "Aumentar quantidade")
        )
      ),
      el("button", {
        type: "button",
        class: "remove-line",
        dataset: { action: "set-quantity", id, quantity: 0 },
        "aria-label": `Remover ${product.name} da sacola`
      }, "×")
    );
  }

  /** Faz o número da sacola "pular". */
  #bumpCount() {
    this.count.classList.remove("is-bumping");
    void this.count.offsetWidth; // força o navegador a "esquecer" a animação para poder repeti-la
    this.count.classList.add("is-bumping");
  }

  /** Esc fecha; Tab fica "preso" dentro da sacola enquanto ela está aberta. */
  #onKeydown(event) {
    if (!this.isOpen) return;
    if (event.key === "Escape") this.close();
    if (event.key !== "Tab") return;
    const focusable = [...this.drawer.querySelectorAll("button, a[href], input, select")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
