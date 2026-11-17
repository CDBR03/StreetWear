/**
 * Quebra um título em letras para animar uma por uma.
 *
 *   <h1 data-split>VISTA <em>SUA</em></h1>
 * vira
 *   <h1 class="split"><span class="word"><span class="char">V</span>...</span> <em>...</em></h1>
 *
 * Preserva <em>, <span> e <br>, então as cores continuam iguais.
 */
export class SplitText {
  start() {
    document.querySelectorAll("[data-split]").forEach((heading) => this.split(heading));
  }

  split(heading) {
    heading.setAttribute("aria-label", heading.textContent.replace(/\s+/g, " ").trim());
    this.counter = 0;
    this.#walk(heading);
    heading.classList.add("split");
  }

  /** Percorre os "filhos" do elemento. Texto vira letras; tags são percorridas por dentro. */
  #walk(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) child.replaceWith(this.#splitText(child.textContent));
      else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
        child.setAttribute("aria-hidden", "true");
        this.#walk(child);
      }
    }
  }

  #splitText(text) {
    const fragment = document.createDocumentFragment();
    // Separa em palavras mantendo os espaços: "VISTA SUA" → ["VISTA", " ", "SUA"]
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(" ");
        continue;
      }
      const word = document.createElement("span");
      word.className = "word";
      word.setAttribute("aria-hidden", "true");
      word.style.whiteSpace = "nowrap"; // uma palavra nunca é quebrada no meio
      for (const letter of part) {
        const char = document.createElement("span");
        char.className = "char";
        char.style.setProperty("--c", this.counter++);
        char.textContent = letter;
        word.append(char);
      }
      fragment.append(word);
    }
    return fragment;
  }
}
