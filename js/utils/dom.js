/**
 * el() — cria um elemento HTML de forma curta e segura.
 *
 *   el("a", { href: "loja.html", class: "text-link" }, "VER LOJA")
 *   → <a href="loja.html" class="text-link">VER LOJA</a>
 *
 * Textos são inseridos como texto puro (nunca como HTML),
 * então nenhum dado consegue "injetar" código na página.
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === "class") node.className = value;
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (key in node) node[key] = value;
    else node.setAttribute(key, value);
  }

  node.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
  return node;
}

/** Avisa os efeitos (Reveal, Tilt...) que entrou conteúdo novo na página. */
export function announceContentUpdate() {
  document.dispatchEvent(new Event("streetwear:content-updated"));
}
