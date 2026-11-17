/**
 * Moldes de HTML compartilhados por todas as páginas.
 * São textos fixos (nenhum dado do usuário entra aqui),
 * por isso é seguro usá-los com innerHTML.
 */

export const PAGES = [
  { key: "home", label: "Início", href: "index.html" },
  { key: "catalog", label: "Loja", href: "loja.html" },
  { key: "lookbook", label: "Lookbook", href: "lookbook.html" },
  { key: "about", label: "Sobre", href: "sobre.html" }
];

const MARK = 'STREET<span>WEAR</span><sup>®</sup>';

export function headerTemplate(currentPage) {
  const links = PAGES
    .map(({ key, label, href }) => `<a href="${href}"${key === currentPage ? ' aria-current="page"' : ""}>${label}</a>`)
    .join("");

  return `
    <div class="scroll-progress" data-scroll-progress></div>
    <div class="site-announcement">
      <span class="live-dot" aria-hidden="true"></span>
      <strong>DROP 001 AO VIVO</strong> · frete grátis acima de R$ 299
      <a href="loja.html">Comprar agora ↗</a>
    </div>
    <header class="site-header" data-site-header-bar>
      <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="primary-navigation">
        <span></span><span></span>
      </button>
      <a class="wordmark" href="index.html" aria-label="STREETWEAR início">${MARK}</a>
      <nav class="site-nav" id="primary-navigation" aria-label="Navegação principal">${links}</nav>
      <div class="header-actions">
        <a class="icon-button" href="loja.html" aria-label="Ver produtos">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>
        </a>
        <button class="icon-button bag-link" type="button" data-action="open-cart" aria-label="Abrir sacola">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16l-1.2 13H5.2L4 8Z"></path><path d="M9 9V6a3 3 0 0 1 6 0v3"></path></svg>
          <span class="bag-count" data-cart-count>0</span>
        </button>
      </div>
    </header>
    <div class="cart-backdrop" data-cart-backdrop></div>
    <aside class="cart-drawer" data-cart-drawer role="dialog" aria-modal="true" aria-label="Sua sacola" aria-hidden="true">
      <div class="cart-drawer-head">
        <h2>SUA SACOLA</h2>
        <button class="cart-close" type="button" data-action="close-cart" aria-label="Fechar sacola">×</button>
      </div>
      <div class="cart-items" data-cart-items></div>
      <div class="cart-total"><span>Subtotal</span><strong data-cart-total>R$ 0</strong></div>
      <p class="cart-message">Demonstração de interface · checkout não conectado.</p>
    </aside>
    <div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

export function footerTemplate() {
  const links = PAGES.map(({ label, href }) => `<a href="${href}">${label}</a>`).join("");
  return `
    <footer class="site-footer">
      <p class="footer-giant" aria-hidden="true">STREETWEAR®</p>
      <div class="footer-row">
        <span>FEITO PRA RUA. FEITO PRA VOCÊ.</span>
        <nav aria-label="Rodapé">${links}</nav>
        <span>© STREETWEAR ${new Date().getFullYear()}</span>
      </div>
    </footer>`;
}
