import './ModalPagarSueldos.css';
import {type PropsModalPagarSueldos} from './ModalPagarSueldosTypes'
import { Modal } from '../../../generalComponents/index';

export const ModalPagarSueldos: React.FC<PropsModalPagarSueldos> = ({cajaMadre, onClose, isOpen, showCloseButton, children}) => {

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title='Pagar Sueldos'
        description='Seleccione a un empleado al cual desea pagarle el sueldo'
        >

        <section>

        </section>

        </Modal>
    )
}