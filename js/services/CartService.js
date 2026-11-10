const STORAGE_KEY = "streetwear-cart-v1";

export class CartService {
  #items = new Map();

  constructor(repository) {
    this.repository = repository;
    this.#restore();
  }

  #restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      for (const line of saved) {
        if (this.repository.findBySlug(line.slug) && Number.isInteger(line.quantity) && line.quantity > 0) {
          this.#items.set(this.#lineId(line.slug, line.size || "M"), { slug: line.slug, size: line.size || "M", quantity: line.quantity });
        }
      }
    } catch {
      this.#items.clear();
    }
  }

  #persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.#items.values()]));
    } catch {
      // The cart remains usable for the current page when browser storage is unavailable.
    }
  }

  #lineId(slug, size) {
    return `${slug}::${size}`;
  }

  add(slug, size = "M") {
    if (!this.repository.findBySlug(slug)) return false;
    const id = this.#lineId(slug, size);
    const existing = this.#items.get(id);
    this.#items.set(id, { slug, size, quantity: (existing?.quantity || 0) + 1 });
    this.#persist();
    return true;
  }

  setQuantity(id, quantity) {
    if (!this.#items.has(id) || !Number.isInteger(quantity)) return;
    if (quantity <= 0) this.#items.delete(id);
    else this.#items.set(id, { ...this.#items.get(id), quantity });
    this.#persist();
  }

  getItems() {
    return [...this.#items].map(([id, { slug, size, quantity }]) => ({ id, product: this.repository.findBySlug(slug), size, quantity }));
  }

  get count() {
    return [...this.#items.values()].reduce((total, line) => total + line.quantity, 0);
  }

  get total() {
    return this.getItems().reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  }
}
