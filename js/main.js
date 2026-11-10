import { productData } from "./data/products.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { CartService } from "./services/CartService.js";
import { FavoritesService } from "./services/FavoritesService.js";
import { SiteShell } from "./ui/SiteShell.js";
import { HomePage } from "./pages/HomePage.js";
import { CatalogPage } from "./pages/CatalogPage.js";
import { ProductPage } from "./pages/ProductPage.js";

class StreetwearApp {
  constructor() {
    this.repository = new ProductRepository(productData);
    this.cart = new CartService(this.repository);
    this.favorites = new FavoritesService();
    this.shell = new SiteShell(this.cart, this.favorites, this.repository);
  }

  start() {
    this.shell.mount();
    const routes = {
      home: () => new HomePage(this.repository, this.favorites).mount(),
      catalog: () => new CatalogPage(this.repository, this.favorites).mount(),
      product: () => new ProductPage(this.repository, this.cart, this.shell, this.favorites).mount()
    };
    routes[document.body.dataset.page]?.();
    this.#observeReveals();
  }

  #observeReveals() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  }
}

new StreetwearApp().start();
