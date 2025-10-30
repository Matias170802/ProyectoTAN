import {type Props} from './ModalTypes'
import {Button} from '../index'
import './Modal.css'


interface ModalProps extends Props {
    wide?: boolean;
}

const Modal = ({isOpen, onClose, children, title, showCloseButton, wide}: ModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content${wide ? ' modal-content--wide' : ''}`} onClick={(e) => e.stopPropagation()}>
                {(title || showCloseButton) && (
                    <div className="modal-header-flex">
                        {title && <h2>{title}</h2>}
                        {showCloseButton && (
                            <Button 
                                onClick={onClose} 
                                className='cerrarOpcion'
                                icon="close"
                            />
                        )}
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal