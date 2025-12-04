import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index';
import './ModalRegistrarCotizacionMoneda.css'
import {type PropsRegistrarCotizacionMoneda} from './ModalRegistrarCotizacionMonedaTypes'
import {useMoneda} from '../../hooks/useMoneda'
import {type formSchemaRegistrarCotizacionMonedaType, schemaRegistrarCotizacionMoneda} from '../../models/modelRegistrarCotizacionMoneda'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver} from 'react-hook-form';

const ModalRegistrarCotizacionMoneda: React.FC<PropsRegistrarCotizacionMoneda> = ({isOpen, onClose, title, description, showCloseButton, onSuccess}) => {

    const {monedas, loading, error, registrarCotizacionMoneda, errorEncontrado, resetError} = useMoneda();
    const [showMensajeExito, setShowMensajeExito] = React.useState(false);

    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register } = useForm<formSchemaRegistrarCotizacionMonedaType>({
        resolver: zodResolver(schemaRegistrarCotizacionMoneda) as Resolver<formSchemaRegistrarCotizacionMonedaType>,
        defaultValues: {
            nombreMoneda: "Selecciona una moneda",
        },
        mode: 'onBlur'
    });


    //* Reinicia el modal cuando hay error después de 3 segundos
    React.useEffect(() => {
        if (errorEncontrado) {
            const timer = setTimeout(() => {
                resetError(); 
                reset();      
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [errorEncontrado, reset, resetError]);


    const onSubmit = async (data: formSchemaRegistrarCotizacionMonedaType) => {
        const exito = await registrarCotizacionMoneda(data);
        console.log("Este es mi exito", exito)

        if (exito) {
            setShowMensajeExito(true);
            reset();
            setTimeout(() => {
                setShowMensajeExito(false);
                if (onSuccess) {
                    onSuccess(); // Llamar al callback de éxito
                } else if (onClose) {
                    onClose();
                }
                
            }, 3000);
        }else {
            setShowMensajeExito(false);
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
                {errorEncontrado && <div id='mensajeError'>No se puedo registrar la cotizacion para la moneda seleccionada pues {errorEncontrado}</div>}


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
                    <p className="mensajeErrorFormulario">{errors.nombreMoneda.message}</p>
                )}


                <div id='contenedorMontos'>
                    <div id='montoCompra'>
                        <label>Monto Compra en ARG</label>
                        <input type='number' {...register("montoCompra")} placeholder='0.00'/>
                        {errors.montoCompra && (
                            <p className="mensajeErrorFormulario">{errors.montoCompra.message}</p>
                        )}
                    </div>

                    <div id='montoVenta'>
                        <label>Monto Venta en ARG</label>
                        <input type='number' {...register("montoVenta")} placeholder='0.00'/>
                        {errors.montoVenta && (
                            <p className="mensajeErrorFormulario">{errors.montoVenta.message}</p>
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