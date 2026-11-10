/* Permite abrir o protótipo diretamente pelo arquivo, sem servidor local. */
(function () {
  "use strict";

  var products = [
    ["camiseta-volume-01", "Camiseta Volume 01", "Camisetas", "R$ 189", "MAIS VENDIDO", "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", "Modelo em look streetwear rosa"],
    ["jaqueta-corta-vento", "Jaqueta Corta-Vento", "Jaquetas", "R$ 429", "DROP LIMITADO", "https://images.unsplash.com/photo-1677052088400-9d88145befc4?auto=format&fit=crop&w=900&q=85", "Modelo com jaqueta streetwear e calça cargo"],
    ["calca-cargo-wide", "Calça Cargo Wide", "Calças", "R$ 349", "NOVO", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85", "Modelo usando look urbano de caimento amplo"],
    ["camiseta-grafica-rua", "Camiseta Gráfica Rua", "Camisetas", "R$ 169", "", "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85", "Modelo em produção de moda contemporânea"],
    ["moletom-oversized", "Moletom Oversized", "Jaquetas", "R$ 319", "", "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85", "Duas amigas em looks urbanos"],
    ["calca-street-denim", "Calça Street Denim", "Calças", "R$ 379", "", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85", "Look de moda com calça jeans"],
    ["camisa-overshirt", "Camisa Overshirt", "Jaquetas", "R$ 289", "", "https://images.unsplash.com/photo-1610902209686-dcc8ba828637?auto=format&fit=crop&w=900&q=85", "Modelo masculino em look urbano"],
    ["bone-seu-espaco", "Boné Seu Espaço", "Acessórios", "R$ 119", "", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85", "Retrato editorial com styling contemporâneo"]
  ];

  function card(item) {
    var badge = item[4] ? '<span class="product-tag' + (item[4] === "DROP LIMITADO" ? " blue" : item[4] === "NOVO" ? " cream" : "") + '">' + item[4] + "</span>" : "";
    return '<article class="product-card"><div class="product-image"><a href="produto.html?item=' + item[0] + '"><img src="' + item[5] + '" alt="' + item[6] + '" loading="lazy"></a>' + badge + '<button class="favorite-button" type="button" aria-label="Adicionar aos favoritos">♡</button><a class="quick-add" href="produto.html?item=' + item[0] + '">VER DETALHES <span>+</span></a></div><div class="product-info"><div><h3>' + item[1] + "</h3><p>" + item[2] + "</p></div><span class=\"product-price\">" + item[3] + "</span></div></article>";
  }

  function header(page) {
    var links = [["home", "Início", "index.html"], ["catalog", "Loja", "loja.html"], ["lookbook", "Lookbook", "lookbook.html"], ["about", "Sobre", "sobre.html"]];
    var navigation = links.map(function (link) {
      return '<a href="' + link[2] + '"' + (page === link[0] ? ' aria-current="page"' : "") + ">" + link[1] + "</a>";
    }).join("");
    return '<div class="site-announcement"><strong>FRETE GRÁTIS</strong> acima de R$ 299 <span>✳</span><a href="loja.html">Comprar agora ↗</a></div><header class="site-header"><button class="menu-toggle" type="button" aria-label="Abrir menu"><span></span><span></span></button><a class="wordmark" href="index.html">STREET<span>WEAR</span><sup>®</sup></a><nav class="site-nav">' + navigation + '</nav><div class="header-actions"><a class="icon-button" href="loja.html" aria-label="Ver loja"><svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg></a><a class="icon-button bag-link" href="loja.html" aria-label="Ver sacola"><svg viewBox="0 0 24 24"><path d="M4 8h16l-1.2 13H5.2L4 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg><span class="bag-count">0</span></a></div></header>';
  }

  function footer() {
    return '<footer class="site-footer"><a class="wordmark" href="index.html">STREET<span>WEAR</span><sup>®</sup></a><div class="footer-note"><span>FEITO PRA RUA. FEITO PRA VOCÊ.</span><span>© STREETWEAR 2026</span></div><div class="social-links"><a href="lookbook.html">IG ↗</a><a href="lookbook.html">TT ↗</a></div></footer>';
  }

  function renderCatalog() {
    var grid = document.querySelector('[data-product-grid="catalog"]');
    if (!grid) return;
    grid.innerHTML = products.map(card).join("");
    var count = document.querySelector("[data-result-count]");
    if (count) count.textContent = products.length;
  }

  function renderProduct() {
    var area = document.querySelector("[data-product-detail]");
    if (!area) return;
    var slug = new URLSearchParams(window.location.search).get("item") || products[0][0];
    var product = products.filter(function (item) { return item[0] === slug; })[0] || products[0];
    area.innerHTML = '<section class="product-detail"><img class="product-detail-image" src="' + product[5] + '" alt="' + product[6] + '"><div class="product-detail-copy"><p class="eyebrow">DROP 001 / ' + product[2].toUpperCase() + '</p><h1>' + product[1] + '</h1><p class="detail-price">' + product[3] + '</p><p class="detail-description">Uma peça feita para criar combinações livres, confortáveis e cheias de presença.</p><p class="eyebrow">ESCOLHA SEU TAMANHO</p><div class="detail-options"><button class="size-option">P</button><button class="size-option" aria-pressed="true">M</button><button class="size-option">G</button><button class="size-option">GG</button></div><a class="button button-blue detail-add" href="loja.html">CONTINUAR COMPRANDO +</a><p class="detail-note">Frete grátis acima de R$ 299 · Primeira troca gratuita</p></div></section>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.dataset.page || "home";
    var headerTarget = document.querySelector("[data-site-header]");
    var footerTarget = document.querySelector("[data-site-footer]");
    if (headerTarget) headerTarget.innerHTML = header(page);
    if (footerTarget) footerTarget.innerHTML = footer();
    document.querySelectorAll(".reveal").forEach(function (element) { element.classList.add("is-visible"); });
    document.querySelectorAll('[data-product-grid="featured"]').forEach(function (grid) { grid.innerHTML = products.slice(0, 4).map(card).join(""); });
    renderCatalog();
    renderProduct();
    var menu = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".site-nav");
    if (menu && nav) menu.addEventListener("click", function () { nav.classList.toggle("is-open"); });
  });
}());
