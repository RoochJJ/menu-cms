// Formata valores para exibir na tela no padrão brasileiro

const priceFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

const timeFormat = new Intl.DateTimeFormat("pt-BR", {
  timeStyle: "short",
});

// 29.9 → "R$ 29,90"
export function formatPrice(value: number | string) {
  return priceFormat.format(Number(value));
}

// "2026-11-21T13:05:00Z" → "21/11/2026, 10:05"
export function formatDateTime(value: string | Date) {
  return dateTimeFormat.format(new Date(value));
}

// "2026-11-21T13:05:00Z" → "10:05"
export function formatTime(value: string | Date) {
  return timeFormat.format(new Date(value));
}