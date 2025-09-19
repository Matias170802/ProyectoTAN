import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index'
import "./ModalRegistrarIngresoEgresoCaja.css"

const ModalRegistrarIngresoEgresoCaja: React.FC = () => {
    
    const [activo, setActivo] = React.useState<'transaccion' | 'comprobante'>('transaccion');
    
    return(
        <Modal
        title='Registrar Nueva Transacción'
        description='Completa el formulario para registrar un nuevo ingreso o egreso en tu caja'
        isOpen={true}
        >
            <section id='contenedorBotonesModalRegistrarIngresoEgresoCaja'>
                <Button
                    label="Transacción"
                    id="botonTransaccion"
                    type="button"
                    onClick={() => setActivo('transaccion')}
                    className={activo === 'transaccion' ? 'toggle-active' : 'toggle-inactive'}
                />
                <Button
                    label="Comprobante"
                    id="botonComprobante"
                    type="button"
                    onClick={() => setActivo('comprobante')}
                    className={activo === 'comprobante' ? 'toggle-active' : 'toggle-inactive'}
                />
            </section>
        </Modal>
    )
}

export default ModalRegistrarIngresoEgresoCaja;