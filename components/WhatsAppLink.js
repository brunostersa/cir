import { useWhatsAppModal } from './WhatsAppModalProvider'

export default function WhatsAppLink({ message, source, cidade, estado, className, children, onClick, style, ...rest }) {
  const { openModal } = useWhatsAppModal()

  const handleClick = (e) => {
    openModal({ message, source, cidade, estado })
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
