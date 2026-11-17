/*
 * PLANO B — só entra em ação se o js/main.js NÃO carregar.
 *
 * Isso acontece quando alguém abre o arquivo com dois cliques
 * (endereço file:///...): o navegador bloqueia módulos ES fora
 * de um servidor. Em vez de mostrar uma página "quebrada",
 * deixamos o conteúdo visível e explicamos como abrir certo.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // O main.js marca <html data-app="ready">. Se marcou, está tudo certo.
    if (document.documentElement.dataset.app === "ready") return;

    // Mostra o que estava escondido esperando animação
    document.querySelectorAll(".reveal, .reveal-clip").forEach(function (element) {
      element.classList.add("is-visible");
    });

    var notice = document.createElement("div");
    notice.className = "site-announcement";
    notice.textContent = "Abra este site por um servidor local (ex.: Live Server no VS Code) para ver a loja completa.";
    document.body.prepend(notice);
  });
}());
