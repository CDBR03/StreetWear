import { headerTemplate, footerTemplate } from "./templates.js";
import { CartDrawer } from "./CartDrawer.js";
import { Toast } from "./Toast.js";
import { ProductCard } from "./ProductCard.js";

/**
 * A "casca" do site: cabeçalho, rodapé, menu, sacola e toast.
 * Também é a central de cliques: qualquer elemento com
 * data-action="..." em QUALQUER página é tratado aqui.
 */
export class SiteShell {
  constructor({ cart, favorites, repository }) {
    this.cart = cart;
    this.favorites = favorites;
    this.repository = repository;
  }

  mount() {
    const page = document.body.dataset.page;
    document.querySelector("[data-site-header]").innerHTML = headerTemplate(page);
    document.querySelector("[data-site-footer]").innerHTML = footerTemplate();

    this.drawer = new CartDrawer(this.cart);
    this.toast = new Toast(document.querySelector("[data-toast]"));
    this.#bindMenu();
    this.#bindActions();
  }

  #bindMenu() {
    const button = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("is-locked", open);
    };
    button.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  /** Um único "ouvinte" de cliques para o site todo (delegação de eventos). */
  #bindActions() {
    const actions = {
      "open-cart": () => this.drawer.open(),
      "close-cart": () => this.drawer.close(),
      "add-to-cart": ({ slug, size = "M" }) => {
        if (this.cart.add(slug, size)) {
          this.toast.show(`${this.repository.findBySlug(slug).name} · tam. ${size} na sacola ✳`);
        }
      },
      "set-quantity": ({ id, quantity }) => this.cart.setQuantity(id, Number(quantity)),
      favorite: ({ slug }) => {
        const active = this.favorites.toggle(slug);
        const name = this.repository.findBySlug(slug).name;
        // Atualiza TODOS os corações desse produto que estiverem na tela
        document.querySelectorAll(`[data-action="favorite"][data-slug="${slug}"]`)
          .forEach((button) => ProductCard.paintFavorite(button, active, name));
        this.toast.show(active ? "Salvo nos favoritos ♥" : "Removido dos favoritos");
      }
    };

    document.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;
      actions[control.dataset.action]?.(control.dataset);
    });
  }
}
