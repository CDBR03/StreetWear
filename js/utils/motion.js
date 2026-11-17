/** true quando a pessoa pediu ao sistema operacional para reduzir animações. */
export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true quando há um mouse (ponteiro "fino"); false em telas de toque. */
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Efeitos "pesados" só rodam se houver mouse E a pessoa não pediu menos movimento. */
export const canAnimatePointer = () => hasFinePointer() && !prefersReducedMotion();
