// Utility functions to format fields like phone numbers, CPF, and CEP.
function toPattern(value: string, pattern: string): string {
  let valueIndex = 0;
  let formatted = "";

  for (const patternChar of pattern) {
    if (patternChar === "9") {
      if (valueIndex >= value.length) {
        break;
      }

      formatted += value[valueIndex];
      valueIndex += 1;
      continue;
    }

    if (valueIndex < value.length) {
      formatted += patternChar;
    }
  }

  return formatted;
}

export function formatPhone(value: string | undefined): string {
  const digits = (value || "").replace(/\W/g, "");
  return toPattern(
    digits,
    digits.length === 11 ? "(99) 99999-9999" : "(99) 9999-9999",
  );
}

export function formatCpf(value: string | undefined): string {
  const digits = (value || "").replace(/\D/g, "");
  return toPattern(digits, "999.999.999-99");
}

export function formatCep(value: string | undefined): string {
  const digits = (value || "").replace(/\D/g, "");
  return toPattern(digits, "99999-999");
}
