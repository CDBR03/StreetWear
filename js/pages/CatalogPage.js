import { ProductCard } from "../ui/ProductCard.js";

export class CatalogPage {
  constructor(repository, favorites) {
    this.repository = repository;
    this.card = new ProductCard(favorites);
    this.category = document.querySelector("[data-category-filter]");
    this.sort = document.querySelector("[data-sort-order]");
    this.grid = document.querySelector('[data-product-grid="catalog"]');
    this.resultCount = document.querySelector("[data-result-count]");
    this.emptyState = document.querySelector(".empty-state");
  }

  mount() {
    const requestedCategory = new URLSearchParams(window.location.search).get("categoria");
    if (requestedCategory && [...this.category.options].some((option) => option.value === requestedCategory)) {
      this.category.value = requestedCategory;
    }
    this.category.addEventListener("change", () => this.render());
    this.sort.addEventListener("change", () => this.render());
    this.render();
  }

  render() {
    const products = this.repository.findByCategory(this.category.value);
    const sorters = {
      featured: (a, b) => Number(b.featured) - Number(a.featured),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price
    };
    products.sort(sorters[this.sort.value] || sorters.featured);
    this.grid.replaceChildren(...products.map((product) => this.card.render(product)));
    this.resultCount.textContent = products.length;
    this.emptyState.hidden = products.length > 0;
    document.dispatchEvent(new Event("streetwear:content-updated"));
  }
}
