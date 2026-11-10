export class SiteShell {
  constructor(cart, favorites, repository) {
    this.cart = cart;
    this.favorites = favorites;
    this.repository = repository;
    this.toastTimer = 0;
  }

  mount() {
    const current = document.body.dataset.page;
    const pages = [
      ["home", "Início", "index.html"],
      ["catalog", "Loja", "loja.html"],
      ["lookbook", "Lookbook", "lookbook.html"],
      ["about", "Sobre", "sobre.html"]
    ];
    const navLinks = pages.map(([key, label, href]) => `<a href="${href}"${key === current ? ' aria-current="page"' : ""}>${label}</a>`).join("");
    document.querySelector("[data-site-header]").innerHTML = `
      <div class="site-announcement"><strong>FRETE GRÁTIS</strong> na primeira compra acima de R$ 299 <span>✳</span><a href="loja.html">Aproveite agora ↗</a></div>
      <header class="site-header">
        <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="primary-navigation"><span></span><span></span></button>
        <a class="wordmark" href="index.html" aria-label="STREETWEAR início">STREET<span>WEAR</span><sup>®</sup></a>
        <nav class="site-nav" id="primary-navigation" aria-label="Navegação principal">${navLinks}</nav>
        <div class="header-actions"><a class="icon-button" href="loja.html" aria-label="Ver produtos"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg></a><button class="icon-button bag-link" type="button" data-action="open-cart" aria-label="Abrir sacola"><svg viewBox="0 0 24 24"><path d="M4 8h16l-1.2 13H5.2L4 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg><span class="bag-count" data-cart-count>0</span></button></div>
      </header>
      <div class="cart-backdrop" data-cart-backdrop></div>
      <aside class="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-label="Sua sacola" aria-hidden="true"><div class="cart-drawer-head"><h2>SUA SACOLA</h2><button class="cart-close" type="button" data-action="close-cart" aria-label="Fechar sacola">×</button></div><div class="cart-items" data-cart-items></div><div class="cart-total"><span>Subtotal</span><strong data-cart-total>R$ 0</strong></div><p class="cart-message">Demonstração de interface · checkout não conectado.</p></aside>
      <div class="toast" role="status" aria-live="polite" data-toast></div>`;
    document.querySelector("[data-site-footer]").innerHTML = `
      <footer class="site-footer"><a class="wordmark" href="index.html">STREET<span>WEAR</span><sup>®</sup></a><div class="footer-note"><span>FEITO PRA RUA. FEITO PRA VOCÊ.</span><span>© STREETWEAR 2026</span></div><div class="social-links"><a href="lookbook.html" aria-label="Instagram">IG ↗</a><a href="lookbook.html" aria-label="TikTok">TT ↗</a></div></footer>`;
    this.#bindEvents();
    this.renderCart();
  }

  showToast(message) {
    const toast = document.querySelector("[data-toast]");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  renderCart() {
    const count = document.querySelector("[data-cart-count]");
    const list = document.querySelector("[data-cart-items]");
    const total = document.querySelector("[data-cart-total]");
    if (!count || !list || !total) return;
    count.textContent = this.cart.count;
    list.replaceChildren();
    if (!this.cart.count) {
      const empty = document.createElement("p");
      empty.className = "empty-cart";
      empty.textContent = "Sua sacola está esperando por você ✳";
      list.append(empty);
    }
    for (const { id, product, size, quantity } of this.cart.getItems()) list.append(this.#cartLine(id, product, size, quantity));
    total.textContent = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(this.cart.total);
  }

  #cartLine(id, product, size, quantity) {
    const line = document.createElement("article");
    line.className = "cart-line";
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = product.name;
    const price = document.createElement("p");
    price.textContent = `${product.formattedPrice} · Tam. ${size}`;
    const controls = document.createElement("div");
    controls.className = "quantity-controls";
    controls.append(this.#quantityButton("−", id, quantity - 1, "Diminuir quantidade"));
    const amount = document.createElement("span");
    amount.textContent = quantity;
    controls.append(amount, this.#quantityButton("+", id, quantity + 1, "Aumentar quantidade"));
    details.append(title, price, controls);
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-line";
    remove.dataset.action = "set-quantity";
    remove.dataset.id = id;
    remove.dataset.quantity = "0";
    remove.setAttribute("aria-label", `Remover ${product.name} da sacola`);
    remove.textContent = "×";
    line.append(image, details, remove);
    return line;
  }

  #quantityButton(label, id, quantity, ariaLabel) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = "set-quantity";
    button.dataset.id = id;
    button.dataset.quantity = quantity;
    button.setAttribute("aria-label", ariaLabel);
    button.textContent = label;
    return button;
  }

  #toggleCart(open) {
    const drawer = document.querySelector("[data-cart-drawer]");
    const backdrop = document.querySelector("[data-cart-backdrop]");
    const wasOpen = drawer.classList.contains("is-open");
    if (open && !wasOpen) this.cartOpener = document.activeElement;
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("cart-open", open);
    if (open) drawer.querySelector("[data-action=close-cart]").focus();
    else if (wasOpen) this.cartOpener?.focus();
  }

  #bindEvents() {
    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;
      const { action, slug, size = "M", id } = control.dataset;
      if (action === "open-cart") this.#toggleCart(true);
      if (action === "close-cart") this.#toggleCart(false);
      if (action === "add-to-cart" && this.cart.add(slug, size)) {
        this.renderCart();
        this.showToast(`${this.repository.findBySlug(slug).name} adicionada à sacola ✳`);
      }
      if (action === "set-quantity") {
        this.cart.setQuantity(id, Number(control.dataset.quantity));
        this.renderCart();
      }
      if (action === "favorite") {
        const active = this.favorites.toggle(slug);
        control.classList.toggle("is-favorite", active);
        control.textContent = active ? "♥" : "♡";
        control.setAttribute("aria-label", `${active ? "Remover" : "Adicionar"} ${this.repository.findBySlug(slug).name} dos favoritos`);
        this.showToast(active ? "Peça salva nos favoritos ✳" : "Peça removida dos favoritos");
      }
    });
    document.querySelector("[data-cart-backdrop]").addEventListener("click", () => this.#toggleCart(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.#toggleCart(false);
      const drawer = document.querySelector("[data-cart-drawer]");
      if (event.key === "Tab" && drawer.classList.contains("is-open")) {
        const focusable = [...drawer.querySelectorAll('button:not([disabled]),a[href],input,select,[tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }
}
