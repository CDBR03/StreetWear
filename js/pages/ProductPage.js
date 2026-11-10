import { ProductCard } from "../ui/ProductCard.js";

export class ProductPage {
  constructor(repository, cart, shell, favorites) {
    this.repository = repository;
    this.cart = cart;
    this.shell = shell;
    this.card = new ProductCard(favorites);
    this.container = document.querySelector("[data-product-detail]");
  }

  mount() {
    const slug = new URLSearchParams(window.location.search).get("item");
    const product = this.repository.findBySlug(slug);
    if (!product) {
      document.title = "Peça não encontrada — STREETWEAR";
      this.container.innerHTML = '<section class="not-found"><p class="eyebrow">STREETWEAR®</p><h1>PEÇA NÃO ENCONTRADA.</h1><a class="button button-blue" href="loja.html">VOLTAR À LOJA ↗</a></section>';
      return;
    }
    document.title = `${product.name} — STREETWEAR`;
    const detail = document.createElement("section");
    detail.className = "product-detail";
    const image = document.createElement("img");
    image.className = "product-detail-image";
    image.src = product.image;
    image.alt = product.alt;
    const copy = document.createElement("div");
    copy.className = "product-detail-copy";
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = `DROP 001 / ${product.category.toUpperCase()}`;
    const title = document.createElement("h1");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.className = "detail-price";
    price.textContent = product.formattedPrice;
    const description = document.createElement("p");
    description.className = "detail-description";
    description.textContent = product.description;
    const sizeLabel = document.createElement("p");
    sizeLabel.className = "eyebrow";
    sizeLabel.textContent = "ESCOLHA SEU TAMANHO";
    const options = document.createElement("div");
    options.className = "detail-options";
    let selectedSize = "M";
    for (const size of ["P", "M", "G", "GG"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "size-option";
      button.textContent = size;
      button.setAttribute("aria-pressed", String(size === selectedSize));
      button.addEventListener("click", () => {
        selectedSize = size;
        options.querySelectorAll(".size-option").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
      });
      options.append(button);
    }
    const add = document.createElement("button");
    add.type = "button";
    add.className = "button button-blue detail-add";
    add.textContent = "ADICIONAR À SACOLA  +";
    add.addEventListener("click", () => {
      this.cart.add(product.slug, selectedSize);
      this.shell.renderCart();
      this.shell.showToast(`${product.name} · tam. ${selectedSize} adicionada à sacola ✳`);
    });
    const note = document.createElement("p");
    note.className = "detail-note";
    note.textContent = "Troca fácil · Produzido com atenção aos detalhes";
    const extra = document.createElement("div");
    extra.className = "product-detail-extra";
    extra.innerHTML = "<p><strong>CAIMENTO</strong><span>Modelagem ampla. Escolha seu tamanho habitual para um caimento oversized.</span></p><p><strong>ENVIO & TROCA</strong><span>Frete grátis acima de R$ 299. Primeira troca gratuita.</span></p>";
    copy.append(eyebrow, title, price, description, sizeLabel, options, add, note, extra);
    detail.append(image, copy);
    const related = this.#relatedProducts(product);
    this.container.replaceChildren(detail, related);
  }

  #relatedProducts(product) {
    const section = document.createElement("section");
    section.className = "related-products";
    const heading = document.createElement("div");
    heading.className = "section-heading";
    const copy = document.createElement("div");
    const eyebrow = document.createElement("p");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "COMPLETE SEU LOOK";
    const title = document.createElement("h2");
    title.textContent = "TAMBÉM PODE " ;
    const accent = document.createElement("em");
    accent.textContent = "CURTIR.";
    title.append(accent);
    copy.append(eyebrow, title);
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = "loja.html";
    link.textContent = "VER A LOJA ↗";
    heading.append(copy, link);
    const grid = document.createElement("div");
    grid.className = "product-grid related-grid";
    const suggestions = this.repository.findByCategory(product.category).filter((candidate) => candidate.slug !== product.slug);
    const fallback = this.repository.getFeatured().filter((candidate) => candidate.slug !== product.slug);
    for (const suggestion of [...suggestions, ...fallback].slice(0, 3)) grid.append(this.card.render(suggestion));
    section.append(heading, grid);
    return section;
  }
}
