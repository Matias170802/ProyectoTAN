import {Modal, Button} from '../../../../generalComponents/index';
import './ModalRegistrarCotizacionMoneda.css'
import {type Props} from './ModalRegistrarCotizacionMonedaTypes'

const ModalRegistrarCotizacionMoneda: React.FC<Props> = ({isOpen, onClose, title, description, showCloseButton}) => {

    return (
        <Modal 
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        showCloseButton={showCloseButton}
        >
            <label>Moneda</label>
            <select></select>

            <div id='contenedorMontos'>
                <div id='montoCompra'>
                    <label>Monto Compra</label>
                    <input placeholder='0.00' type='number'/>
                </div>

                <div id='montoVenta'>
                    <label>Monto Venta</label>
                    <input placeholder='0.00' type='number'/>
                </div>
            </div>

            <div id='buttonsContainer'>
                <Button label='Cancelar' onClick={onClose} id='botonCancelarRegistrarCotizacionMoneda'/>
                <Button label='Registrar Cotización' onClick={() => {}} id='botonRegistrarCotizacionMoneda'/>
            </div>
            
        </Modal>
    )
}

export default ModalRegistrarCotizacionMoneda;