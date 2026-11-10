export class Product {
  constructor({ slug, name, category, description, price, image, alt, badge = "", featured = false }) {
    if (!slug || !name || !category || !image || !Number.isFinite(price)) {
      throw new TypeError("Produto inválido: campos essenciais ausentes.");
    }
    Object.assign(this, { slug, name, category, description, price, image, alt, badge, featured });
    Object.freeze(this);
  }

  get formattedPrice() {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(this.price);
  }
}
