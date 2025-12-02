import './ModalRegistrarCambioMoneda.css'
import {Modal} from '../../../../generalComponents/index'
import { type ProposModalRegistrarCambioMoneda } from './ModalRegistrarCambioMonedaTypes'
import { useState } from 'react';

export const ModalRegistrarCambioMoneda: React.FC<ProposModalRegistrarCambioMoneda> = ({isOpen, onClose}) => {

    const [tipoCambio, setTipoCambio] = useState<string>("seleccioneUnTipoDeCambio");
    //TODO: usar el watch de useForms para estar pendiente del select de tipo de cambio y mostrar u ocultar los campos correspondientes

    return (
        <Modal
        showCloseButton={true}
        title='Cambio de Moneda'
        description='Realiza un cambio de moneda de la Caja Madre utilizando la cotización del día'
        isOpen={isOpen}
        onClose={onClose}
        >

            <section id='contenedorCotizacionHoy'>
                <p>Cotización del Día ...</p>

                <div id='contenedorValoresCotizacion'>
                    <p>Compra: ...</p>
                    <p>Venta: ...</p>
                </div>
            </section>

            <section id='contenedorInfoCambioMoneda'>

                <div className='contenedorSelectsCambioMoneda'>
                    <label>Tipo de Cambio</label>
                    <select>
                        <option value={"seleccioneUnTipoDeCambio"}>Seleccione un Tipo de Cambio</option>
                        <option value={"dolaresAPesos"}>Dólares a Pesos Argentinos</option>
                        <option value={"pesosADolares"}>Pesos Argentinos a Dólares</option>
                    </select>
                </div>

                <div className='contenedorSelectsCambioMoneda'>
                    
                    <label>Monto a Convertir (USD o Pesos)</label>
                    <input type='number'>

                    </input>
                </div>

                <div>
                    <p>Balance Disponible: ....</p>
                </div>
            </section>


        </Modal>
    )
}