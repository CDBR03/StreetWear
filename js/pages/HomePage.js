import { ProductCard } from "../ui/ProductCard.js";

export class HomePage {
  constructor(repository, favorites) {
    this.repository = repository;
    this.card = new ProductCard(favorites);
  }

  mount() {
    const grid = document.querySelector('[data-product-grid="featured"]');
    if (grid) grid.replaceChildren(...this.repository.getFeatured().map((product) => this.card.render(product)));
    const form = document.querySelector(".newsletter-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      form.querySelector(".form-message").textContent = "Você está na lista. Seu próximo drop começa aqui ✳";
      form.reset();
    });
  }
}
