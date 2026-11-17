import { ProductCard } from "../ui/ProductCard.js";
import { el } from "../utils/dom.js";

const SIZES = ["P", "M", "G", "GG"];

export class ProductPage {
  constructor({ repository, favorites }) {
    this.repository = repository;
    this.card = new ProductCard(favorites);
    this.container = document.querySelector("[data-product-detail]");
  }

  mount() {
    const slug = new URLSearchParams(window.location.search).get("item");
    const product = this.repository.findBySlug(slug);
    if (!product) return this.#renderNotFound();

    document.title = `${product.name} — STREETWEAR`;
    this.container.replaceChildren(this.#detail(product), this.#related(product));
  }

  #renderNotFound() {
    document.title = "Peça não encontrada — STREETWEAR";
    this.container.replaceChildren(
      el("section", { class: "not-found" },
        el("p", { class: "eyebrow" }, "ERRO 404"),
        el("h1", { class: "display" }, "PEÇA NÃO ", el("em", {}, "ENCONTRADA.")),
        el("a", { class: "button button-blue", href: "loja.html" }, "VOLTAR À LOJA ", el("span", {}, "↗"))
      )
    );
  }

  #detail(product) {
    // O botão "adicionar" usa data-action, então quem trata o clique é o SiteShell.
    const addButton = el("button", {
      type: "button",
      class: "button button-blue detail-add",
      dataset: { action: "add-to-cart", slug: product.slug, size: "M" }
    }, "ADICIONAR À SACOLA", el("span", {}, "+"));

    const sizes = el("div", { class: "detail-options", role: "group", "aria-label": "Tamanhos" },
      SIZES.map((size) => el("button", {
        type: "button",
        class: "size-option",
        "aria-pressed": String(size === "M"),
        onclick: (event) => {
          sizes.querySelectorAll(".size-option").forEach((option) => option.setAttribute("aria-pressed", String(option === event.currentTarget)));
          addButton.dataset.size = size;
        }
      }, size))
    );

    const image = el("img", { class: "product-detail-image", src: product.image, alt: product.alt });
    const zoomBox = el("div", {
      // Lupa: o ponto de origem do zoom acompanha o mouse
      onpointermove: (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        image.style.setProperty("--zx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        image.style.setProperty("--zy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      }
    }, image);

    const favorite = el("button", {
      type: "button",
      class: "favorite-button",
      dataset: { action: "favorite", slug: product.slug }
    });
    ProductCard.paintFavorite(favorite, this.card.favorites.has(product.slug), product.name);

    return el("section", { class: "product-detail" },
      el("div", { class: "product-detail-media reveal" }, zoomBox, favorite),
      el("div", { class: "product-detail-copy reveal", style: "--i: 1" },
        el("p", { class: "eyebrow" }, `DROP 001 / ${product.category.toUpperCase()}`),
        el("h1", {}, product.name),
        el("p", { class: "detail-price" }, product.formattedPrice),
        el("p", { class: "detail-description" }, product.description),
        el("p", { class: "eyebrow" }, "ESCOLHA SEU TAMANHO"),
        sizes,
        addButton,
        el("p", { class: "detail-note" }, "Troca fácil · Produzido com atenção aos detalhes"),
        el("div", { class: "product-detail-extra" },
          el("p", {}, el("strong", {}, "CAIMENTO"), el("span", {}, "Modelagem ampla. Escolha seu tamanho habitual para um caimento oversized.")),
          el("p", {}, el("strong", {}, "ENVIO & TROCA"), el("span", {}, "Frete grátis acima de R$ 299. Primeira troca gratuita."))
        )
      )
    );
  }

  #related(product) {
    return el("section", { class: "related-products" },
      el("div", { class: "section-heading reveal" },
        el("div", {},
          el("p", { class: "eyebrow" }, "COMPLETE SEU LOOK"),
          el("h2", { class: "title" }, "TAMBÉM PODE ", el("em", {}, "CURTIR."))
        ),
        el("a", { class: "text-link", href: "loja.html" }, "VER A LOJA ↗")
      ),
      el("div", { class: "product-grid related-grid" },
        this.repository.getRelated(product).map((item, index) => this.card.render(item, index))
      )
    );
  }
}
