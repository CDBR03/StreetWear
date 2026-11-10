export class ProductCard {
  constructor(favorites) {
    this.favorites = favorites;
  }

  render(product) {
    const article = document.createElement("article");
    article.className = "product-card reveal";

    const media = document.createElement("div");
    media.className = "product-image";
    const link = document.createElement("a");
    link.href = `produto.html?item=${encodeURIComponent(product.slug)}`;
    link.setAttribute("aria-label", `Ver ${product.name}`);
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.loading = "lazy";
    image.decoding = "async";
    link.append(image);
    media.append(link);

    if (product.badge) {
      const badge = document.createElement("span");
      badge.className = `product-tag${product.badge === "DROP LIMITADO" ? " blue" : product.badge === "NOVO" ? " cream" : ""}`;
      badge.textContent = product.badge;
      media.append(badge);
    }

    const favorite = document.createElement("button");
    const isFavorite = this.favorites.has(product.slug);
    favorite.type = "button";
    favorite.className = `favorite-button${isFavorite ? " is-favorite" : ""}`;
    favorite.dataset.action = "favorite";
    favorite.dataset.slug = product.slug;
    favorite.textContent = isFavorite ? "♥" : "♡";
    favorite.setAttribute("aria-label", `${isFavorite ? "Remover" : "Adicionar"} ${product.name} dos favoritos`);
    media.append(favorite);

    const add = document.createElement("button");
    add.type = "button";
    add.className = "quick-add";
    add.dataset.action = "add-to-cart";
    add.dataset.slug = product.slug;
    add.setAttribute("aria-label", `Adicionar ${product.name} à sacola`);
    add.append(document.createTextNode("ADICIONAR À SACOLA"));
    const plus = document.createElement("span");
    plus.textContent = "+";
    add.append(plus);
    media.append(add);
    article.append(media);

    const info = document.createElement("div");
    info.className = "product-info";
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.textContent = product.category[0].toUpperCase() + product.category.slice(1);
    copy.append(title, description);
    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = product.formattedPrice;
    info.append(copy, price);
    article.append(info);
    return article;
  }
}
