import {type PropsConsultarEstadisticas} from './ModalConsultarEstadisticasGerenciaTypes';
import './ModalConsultarEstadisticasGerencia.css';
import {Modal} from '../../../../generalComponents/index';

export const ModalConsultarEstadisticasGerencia: React.FC<PropsConsultarEstadisticas> = ({isOpen, onClose, description, showCloseButton, children}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            description={description}
            showCloseButton={showCloseButton}
        >
            <></>
        </Modal>
    )
}