// ===== Dados e regras de negócio =====
import { productData } from "./data/products.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { CartService } from "./services/CartService.js";
import { FavoritesService } from "./services/FavoritesService.js";

// ===== Interface =====
import { SiteShell } from "./ui/SiteShell.js";
import { HomePage } from "./pages/HomePage.js";
import { CatalogPage } from "./pages/CatalogPage.js";
import { ProductPage } from "./pages/ProductPage.js";

// ===== Efeitos visuais =====
import { SplitText } from "./effects/SplitText.js";
import { Reveal } from "./effects/Reveal.js";
import { ScrollFx } from "./effects/ScrollFx.js";
import { Tilt } from "./effects/Tilt.js";
import { Magnetic } from "./effects/Magnetic.js";
import { CustomCursor } from "./effects/CustomCursor.js";
import { Countdown } from "./effects/Countdown.js";
import { Marquee } from "./effects/Marquee.js";

// Cada página do site (data-page no <body>) aponta para o seu controlador
const ROUTES = {
  home: HomePage,
  catalog: CatalogPage,
  product: ProductPage
};

class StreetwearApp {
  constructor() {
    // Monta as dependências uma vez e compartilha entre todo mundo
    const repository = new ProductRepository(productData);
    this.context = {
      repository,
      cart: new CartService(repository),
      favorites: new FavoritesService()
    };
  }

  start() {
    // Avisa o fallback.js que os módulos carregaram (ele então não faz nada)
    document.documentElement.dataset.app = "ready";

    new SiteShell(this.context).mount();

    const Page = ROUTES[document.body.dataset.page];
    if (Page) new Page(this.context).mount();

    // Efeitos rodam por último, quando todo o HTML já existe
    [new SplitText(), new Reveal(), new ScrollFx(), new Tilt(), new Magnetic(), new CustomCursor(), new Countdown(), new Marquee()]
      .forEach((effect) => effect.start());
  }
}

new StreetwearApp().start();
