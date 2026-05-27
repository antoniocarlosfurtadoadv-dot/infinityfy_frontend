const BRL_FORMATTER = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function normalizeMoneyValue(value: string | number) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return value / 100;
  }

  if (!value) {
    return 0;
  }

  const sanitized = value.replace(/[^\d.,-]/g, "");

  if (/^\d+$/.test(sanitized)) {
    return Number.parseInt(sanitized, 10) / 100;
  }

  const normalizedDecimal = sanitized.includes(",")
    ? sanitized.replace(/\./g, "").replace(",", ".")
    : sanitized.replace(/,/g, "");

  const parsed = Number.parseFloat(normalizedDecimal);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function toMoneyString(value: string | number) {
  return BRL_FORMATTER.format(normalizeMoneyValue(value));
}

export function toMoneyInt(value: string) {
  if (!value) {
    return 0;
  }

  const normalized = value.replace(/\D/g, "");
  return normalized ? Number.parseInt(normalized, 10) : 0;
}
