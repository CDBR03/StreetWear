const STORAGE_KEY = "streetwear-cart-v1";

/**
 * Carrinho de compras.
 * Herda de EventTarget para poder "gritar" um evento "change"
 * sempre que muda — quem quiser reagir (a sacola, o contador)
 * só precisa escutar. Ninguém precisa chamar render() na mão.
 */
export class CartService extends EventTarget {
  #items = new Map();

  constructor(repository) {
    super();
    this.repository = repository;
    this.#restore();
  }

  #restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      for (const line of saved) {
        const size = line.size || "M";
        if (this.repository.findBySlug(line.slug) && Number.isInteger(line.quantity) && line.quantity > 0) {
          this.#items.set(this.#lineId(line.slug, size), { slug: line.slug, size, quantity: line.quantity });
        }
      }
    } catch {
      this.#items.clear();
    }
  }

  #commit() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.#items.values()]));
    } catch {
      // Sem localStorage (aba anônima, por ex.), o carrinho vale só nesta página.
    }
    this.dispatchEvent(new Event("change"));
  }

  #lineId(slug, size) {
    return `${slug}::${size}`;
  }

  add(slug, size = "M") {
    if (!this.repository.findBySlug(slug)) return false;
    const id = this.#lineId(slug, size);
    const existing = this.#items.get(id);
    this.#items.set(id, { slug, size, quantity: (existing?.quantity || 0) + 1 });
    this.#commit();
    return true;
  }

  setQuantity(id, quantity) {
    if (!this.#items.has(id) || !Number.isInteger(quantity)) return;
    if (quantity <= 0) this.#items.delete(id);
    else this.#items.set(id, { ...this.#items.get(id), quantity });
    this.#commit();
  }

  getItems() {
    return [...this.#items].map(([id, { slug, size, quantity }]) => ({
      id,
      product: this.repository.findBySlug(slug),
      size,
      quantity
    }));
  }

  get count() {
    return [...this.#items.values()].reduce((total, line) => total + line.quantity, 0);
  }

  get total() {
    return this.getItems().reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  }
}
