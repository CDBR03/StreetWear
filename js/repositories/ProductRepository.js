import { Product } from "../models/Product.js";

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
}
