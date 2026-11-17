import { ProductCard } from "../ui/ProductCard.js";
import { announceContentUpdate } from "../utils/dom.js";

export class CatalogPage {
  constructor({ repository, favorites }) {
    this.repository = repository;
    this.card = new ProductCard(favorites);
    this.pills = [...document.querySelectorAll("[data-category]")];
    this.sort = document.querySelector("[data-sort-order]");
    this.grid = document.querySelector('[data-product-grid="catalog"]');
    this.resultCount = document.querySelector("[data-result-count]");
    this.emptyState = document.querySelector(".empty-state");
    this.category = "todos";
  }

  mount() {
    // Se a URL vier com ?categoria=jaquetas, já começa filtrado
    const requested = new URLSearchParams(window.location.search).get("categoria");
    if (this.pills.some((pill) => pill.dataset.category === requested)) this.category = requested;

    this.pills.forEach((pill) => pill.addEventListener("click", () => {
      this.category = pill.dataset.category;
      this.#syncUrl();
      this.render();
    }));
    this.sort.addEventListener("change", () => this.render());
    this.render();
  }

  render() {
    const products = this.repository.query({ category: this.category, sort: this.sort.value });

    this.pills.forEach((pill) => pill.setAttribute("aria-pressed", String(pill.dataset.category === this.category)));
    this.grid.replaceChildren(...products.map((product, index) => this.card.render(product, index)));
    this.resultCount.textContent = products.length;
    this.emptyState.hidden = products.length > 0;

    // Reinicia a animação de entrada da grade
    this.grid.classList.remove("is-updating");
    void this.grid.offsetWidth;
    this.grid.classList.add("is-updating");

    announceContentUpdate();
  }

  /** Atualiza a URL sem recarregar — assim o link pode ser compartilhado já filtrado. */
  #syncUrl() {
    const url = new URL(window.location.href);
    if (this.category === "todos") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", this.category);
    history.replaceState(null, "", url);
  }
}
