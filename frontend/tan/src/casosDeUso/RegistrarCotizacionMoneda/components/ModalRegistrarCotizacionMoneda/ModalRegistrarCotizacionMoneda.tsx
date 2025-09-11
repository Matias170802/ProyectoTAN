import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index';
import './ModalRegistrarCotizacionMoneda.css'
import {type Props} from './ModalRegistrarCotizacionMonedaTypes'
import {useMoneda} from '../../hooks/useMoneda'
import {type formSchemaRegistrarCotizacionMonedaType, schemaRegistrarCotizacionMoneda} from '../../models/modelRegistrarCotizacionMoneda'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver} from 'react-hook-form';

const ModalRegistrarCotizacionMoneda: React.FC<Props> = ({isOpen, onClose, title, description, showCloseButton}) => {

    const {monedas, loading, error, registrarCotizacionMoneda, errorEncontrado} = useMoneda();
    const [showMensajeExito, setShowMensajeExito] = React.useState(false);

    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register } = useForm<formSchemaRegistrarCotizacionMonedaType>({
        resolver: zodResolver(schemaRegistrarCotizacionMoneda) as Resolver<formSchemaRegistrarCotizacionMonedaType>,
        defaultValues: {
            nombreMoneda: "Selecciona una moneda"
        },
        mode: 'onBlur'
    });


    const onSubmit = async (data: formSchemaRegistrarCotizacionMonedaType) => {
        const exito = await registrarCotizacionMoneda(data);

        if (exito) {
            setShowMensajeExito(true);
            reset();
            setTimeout(() => {
                setShowMensajeExito(false);
                onClose();
            }, 3000);
        }else {
            
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            showCloseButton={showCloseButton}
            >
                
                {showMensajeExito && <div id='mensajeExito'>Cotización registrada con éxito</div>}
                {errorEncontrado && <div id='mensajeError'>Error: {errorEncontrado}</div>}


                <label>Moneda</label>
                <select
                {...register("nombreMoneda")}
                >
                    <option value="Selecciona una moneda">Selecciona una moneda</option>
                    {monedas && monedas.length > 0 && (
                        monedas.map((moneda, index) => (
                            <option key={index} value={moneda.nombreMoneda}>{moneda.nombreMoneda}</option>
                        ))
                    )}
                </select>

                {errors.nombreMoneda && (
                    <span className="error">{errors.nombreMoneda.message}</span>
                )}


                <div id='contenedorMontos'>
                    <div id='montoCompra'>
                        <label>Monto Compra en ARG</label>
                        <input type='number' {...register("montoCompra")} placeholder='0.00'/>
                        {errors.montoCompra && (
                            <span className="error">{errors.montoCompra.message}</span>
                        )}
                    </div>

                    <div id='montoVenta'>
                        <label>Monto Venta en ARG</label>
                        <input type='number' {...register("montoVenta")} placeholder='0.00'/>
                        {errors.montoVenta && (
                            <span className="error">{errors.montoVenta.message}</span>
                        )}
                    </div>
                </div>

                <div id='buttonsContainer'>
                    <Button label='Cancelar' onClick={onClose} id='botonCancelarRegistrarCotizacionMoneda'/>
                    <Button label='Registrar Cotización' id='botonAceptarRegistrarCotizacionMoneda' type='submit'/>
                </div>

            </Modal>
        </form>
    )
}

export default ModalRegistrarCotizacionMoneda;