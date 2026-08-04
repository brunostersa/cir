import { useRouter } from 'next/router'

export default function WhatsAppLink({ message, source, cidade, estado, className, children, onClick, style, ...rest }) {
  const router = useRouter()

  const handleClick = (e) => {
    const params = new URLSearchParams()
    if (message) params.set('message', message)
    if (source) params.set('source', source)
    if (cidade) params.set('cidade', cidade)
    if (estado) params.set('estado', estado)

    router.push(`/orcamento?${params.toString()}`)
    if (onClick) onClick(e)
  }

  return (
    <button
      type="button"
      className={`wa-btn-reset ${className || ''}`}
      onClick={handleClick}
      style={style}
      {...rest}
    >
      {children}
    </button>
  )
}
