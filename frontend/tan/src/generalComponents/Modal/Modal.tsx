import {type Props} from './ModalTypes'
import {Button} from '../index'
import './Modal.css'

const Modal = ({isOpen, onClose, children, title, showCloseButton}: Props) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
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