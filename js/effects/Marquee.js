/**
 * Faixas de texto infinitas.
 * O HTML tem UMA .marquee-track; aqui criamos uma cópia ao lado.
 * As duas andam juntas para a esquerda (-100% no CSS): quando a
 * primeira sai da tela, a cópia está exatamente no lugar dela,
 * então a emenda nunca aparece.
 */
export class Marquee {
  start() {
    document.querySelectorAll(".marquee").forEach((marquee) => {
      const track = marquee.querySelector(".marquee-track");
      const copy = track.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      marquee.append(copy);
    });
  }
}
