// Normaliza telefone brasileiro para E.164 (+55DDDNUMERO) para Enhanced Conversions.
// Retorna null se não houver dígitos suficientes para um número válido.
export function normalizeBRPhone(raw: string): string | null {
  const digits = (raw ?? '').replace(/\D/g, '')
  if (digits.length < 10) return null // DDD (2) + número (8 ou 9)

  // Já veio com código do país (55) na frente
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return `+${digits}`
  }
  // DDD + número local (10 ou 11 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`
  }
  return null
}
