/**
 * Normaliza números de telefone brasileiros para 11 dígitos (DDD + 9 + número)
 * Regras aplicadas:
 * - Remove tudo que não for dígito
 * - Remove prefixo internacional 55 se presente
 * - Se após limpar o número tiver 10 dígitos (sem o 9 adicional), insere o '9' após os dois dígitos do DDD
 * - Retorna null se o número não puder ser normalizado para 11 dígitos
 */
export function normalizePhoneBR(raw: string): string | null {
  if (!raw) return null;
  // Remove tudo que não for dígito
  let digits = raw.replace(/\D/g, "");

  // Remove prefixo internacional 55
  if (digits.startsWith("55")) digits = digits.slice(2);

  // Se já tem 11 dígitos e começa com DDD válido (2 dígitos), retorna com DDI 55
  if (/^\d{11}$/.test(digits)) return `55${digits}`;

  // Se tem 10 dígitos (ex: DDD + 8 dígitos), insere o '9' após os 2 primeiros (DDD)
  if (/^\d{10}$/.test(digits)) {
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    return `55${ddd}9${rest}`;
  }

  return null;
}
