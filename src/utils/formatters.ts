/**
 * Format a numeric value as BRL currency string (e.g. "R$ 1.200.000")
 */
export function formatCurrencyBRL(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value.replace(/\D/g, "")) / 100 : value;
  if (isNaN(num)) return "";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

/**
 * Handle currency input masking. Returns the raw cents value and the formatted display string.
 * Usage: const { raw, display } = parseCurrencyInput(inputValue)
 */
export function parseCurrencyInput(value: string): { raw: number; display: string } {
  const digits = value.replace(/\D/g, "");
  const raw = parseInt(digits || "0", 10);
  const num = raw / 100;
  const display = num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return { raw, display: `R$ ${display}` };
}

/**
 * Format a CPF string (000.000.000-00)
 */
export function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/**
 * Format a CNPJ string (00.000.000/0000-00)
 */
export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/**
 * Auto-detect and format CPF or CNPJ based on digit count
 */
export function formatCpfCnpj(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) return formatCPF(value);
  return formatCNPJ(value);
}

/**
 * Format a phone number string ((00) 00000-0000)
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Format a CEP string (00000-000)
 */
export function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}
