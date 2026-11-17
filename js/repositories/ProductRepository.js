import { Product } from "../models/Product.js";

const SORTERS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price
};

export class ProductRepository {
  #products;

  constructor(productData) {
    this.#products = productData.map((data) => new Product(data));
  }

  getAll() {
    return [...this.#products];
  }

  getFeatured() {
    return this.#products.filter((product) => product.featured);
  }

  findBySlug(slug) {
    return this.#products.find((product) => product.slug === slug) ?? null;
  }

  findByCategory(category) {
    return category === "todos" ? this.getAll() : this.#products.filter((product) => product.category === category);
  }

  /** Filtra e ordena de uma vez — é o que a loja precisa. */
  query({ category = "todos", sort = "featured" } = {}) {
    return this.findByCategory(category).sort(SORTERS[sort] ?? SORTERS.featured);
  }

  /** Peças da mesma categoria primeiro; completa com destaques. */
  getRelated(product, limit = 3) {
    const sameCategory = this.findByCategory(product.category);
    const unique = new Set([...sameCategory, ...this.getFeatured()]);
    unique.delete(product);
    return [...unique].slice(0, limit);
  }
}
