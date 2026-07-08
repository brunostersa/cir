export function getNameError(name) {
  if (!name.trim()) return 'Digite seu nome'
  if (name.trim().length < 2) return 'Nome muito curto'
  return ''
}

export function getPhoneError(phone) {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return 'Digite seu WhatsApp'
  if (digits.length < 10) return 'Telefone incompleto — inclua o DDD'
  return ''
}
