import { el } from "../utils/dom.js";
import { capitalize } from "../utils/format.js";

const BADGE_COLORS = { "DROP LIMITADO": "blue", "NOVO": "cream" };

/** Monta o cartão de um produto (foto, selo, favorito, preço). */
export class ProductCard {
  constructor(favorites) {
    this.favorites = favorites;
  }

  render(product, index = 0) {
    const favorite = el("button", {
      type: "button",
      class: "favorite-button",
      dataset: { action: "favorite", slug: product.slug }
    });
    ProductCard.paintFavorite(favorite, this.favorites.has(product.slug), product.name);

    const badge = product.badge
      ? el("span", { class: `product-tag ${BADGE_COLORS[product.badge] ?? ""}` }, product.badge)
      : null;

    return el("article", { class: "product-card reveal", style: `--i: ${index % 4}` },
      el("div", { class: "product-image", dataset: { tilt: "" } },
        el("a", { href: product.url, "aria-label": `Ver ${product.name}` },
          el("img", { src: product.image, alt: product.alt, loading: "lazy", decoding: "async" })
        ),
        badge,
        favorite,
        el("button", {
          type: "button",
          class: "quick-add",
          dataset: { action: "add-to-cart", slug: product.slug },
          "aria-label": `Adicionar ${product.name} à sacola`
        }, "ADICIONAR", el("span", { "aria-hidden": "true" }, "+"))
      ),
      el("div", { class: "product-info" },
        el("div", {},
          el("h3", {}, el("a", { href: product.url }, product.name)),
          el("p", {}, capitalize(product.category))
        ),
        el("span", { class: "product-price" }, product.formattedPrice)
      )
    );
  }

  /** Pinta o coração cheio/vazio. É "static" porque não depende de um cartão específico. */
  static paintFavorite(button, active, productName) {
    button.classList.toggle("is-favorite", active);
    button.textContent = active ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", `${active ? "Remover" : "Adicionar"} ${productName} ${active ? "dos" : "aos"} favoritos`);
  }
}
