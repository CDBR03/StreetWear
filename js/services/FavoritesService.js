const STORAGE_KEY = "streetwear-favorites-v1";

export class FavoritesService {
  #slugs = new Set();

  constructor() {
    try {
      this.#slugs = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      this.#slugs = new Set();
    }
  }

  has(slug) {
    return this.#slugs.has(slug);
  }

  /** Liga/desliga o favorito e devolve o novo estado (true = favoritado). */
  toggle(slug) {
    if (this.has(slug)) this.#slugs.delete(slug);
    else this.#slugs.add(slug);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.#slugs]));
    } catch {
      // Sem localStorage, os favoritos valem até fechar a página.
    }
    return this.has(slug);
  }
}
