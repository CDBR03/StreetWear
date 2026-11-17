const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

/** 189 → "R$ 189" */
export function formatPrice(value) {
  return currency.format(value);
}

/** "calcas" → "Calcas" */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
