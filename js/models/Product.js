import { formatPrice } from "../utils/format.js";

export class Product {
  constructor({ slug, name, category, description, price, image, alt, badge = "", featured = false }) {
    if (!slug || !name || !category || !image || !Number.isFinite(price)) {
      throw new TypeError("Produto inválido: campos essenciais ausentes.");
    }
    Object.assign(this, { slug, name, category, description, price, image, alt, badge, featured });
    Object.freeze(this);
  }

  get formattedPrice() {
    return formatPrice(this.price);
  }

  get url() {
    return `produto.html?item=${encodeURIComponent(this.slug)}`;
  }
}
