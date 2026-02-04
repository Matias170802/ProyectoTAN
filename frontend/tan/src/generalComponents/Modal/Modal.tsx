import { type Props } from './ModalTypes'
import { IoCloseSharp } from 'react-icons/io5'
import './Modal.css'

interface ModalProps extends Props {
    wide?: boolean
    description?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, showCloseButton, wide = false, description }) => {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content${wide ? ' modal-content--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header-flex">
                    {title && <h2 className="modal-title">{title}</h2>}
                    {showCloseButton && (
                        <button onClick={onClose} className="botonCerrarOpcion">
                            <IoCloseSharp />
                        </button>
                    )}
                </div>
                {description && <p className="modal-description">{description}</p>}
                <div className="modal-body">{children}</div>
            </div>
        </div>
    )
}

export default Modal