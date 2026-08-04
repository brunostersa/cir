export function formatPhoneInput(value) {
  let digits = value.replace(/\D/g, '')
  // autopreenchimento do celular às vezes entrega o número completo com código
  // do país (+55). Só removemos o "55" quando sobra mais que DDD + 9 dígitos —
  // um DDD real (inclusive 55, válido em partes do RS) nunca produz mais que 11.
  if (digits.length > 11 && digits.startsWith('55')) {
    digits = digits.slice(2)
  }
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}
