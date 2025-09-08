import {type Props} from './ModalTypes'
import {Button} from '../index'
import './Modal.css'

const Modal: React.FC<Props> = ({isOpen, onClose, children, title, showCloseButton}) => {

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
                                id='cerrarOpcion'
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