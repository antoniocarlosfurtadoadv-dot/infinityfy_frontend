const WEIGHT_FORMATTER = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Converts a weight integer (where 100 = 1 kg) or a raw digit string to a
 * human-readable decimal string (e.g. 450 → "4,50").
 */
export function toWeightString(value: string | number): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "0,00";
    return WEIGHT_FORMATTER.format(value / 100);
  }

  if (!value) return "";

  const sanitized = value.replace(/[^\d.,-]/g, "");

  let parsed: number;

  if (/^\d+$/.test(sanitized)) {
    parsed = Number.parseInt(sanitized, 10) / 100;
  } else {
    const normalizedDecimal = sanitized.includes(",")
      ? sanitized.replace(/\./g, "").replace(",", ".")
      : sanitized.replace(/,/g, "");
    parsed = Number.parseFloat(normalizedDecimal);
  }

  return Number.isFinite(parsed) ? WEIGHT_FORMATTER.format(parsed) : "";
}

/**
 * Converts a formatted weight string (e.g. "4,50") back to the integer
 * representation (e.g. 450). Returns 0 for empty / invalid input.
 */
export function toWeightInt(value: string): number {
  if (!value) return 0;
  const digits = value.replace(/\D/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}
