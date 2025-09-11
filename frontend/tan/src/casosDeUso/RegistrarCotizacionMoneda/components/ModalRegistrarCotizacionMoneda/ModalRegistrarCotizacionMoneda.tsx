import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index';
import './ModalRegistrarCotizacionMoneda.css'
import {type Props} from './ModalRegistrarCotizacionMonedaTypes'
import {useMoneda} from '../../hooks/useMoneda'
import {type formSchemaRegistrarCotizacionMonedaType, schemaRegistrarCotizacionMoneda} from '../../models/modelRegistrarCotizacionMoneda'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';

const ModalRegistrarCotizacionMoneda: React.FC<Props> = ({isOpen, onClose, title, description, showCloseButton}) => {

    const {monedas, loading, error} = useMoneda();

    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register } = useForm<formSchemaRegistrarCotizacionMonedaType>({
        resolver: zodResolver(schemaRegistrarCotizacionMoneda),
        defaultValues: {
            moneda: "Selecciona una moneda",
            montoCompra: 0,
            montoVenta: 0
        },
        mode: 'onBlur'
    });


    const onSubmit = () => {
        console.log("submiting form...");
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
                
                <label>Moneda</label>
                <select
                {...register("moneda")}
                >
                    <option value="Selecciona una moneda">Selecciona una moneda</option>
                    {monedas && monedas.length > 0 && (
                        monedas.map((moneda, index) => (
                            <option key={index} value={moneda.nombreMoneda}>{moneda.nombreMoneda}</option>
                        ))
                    )}
                </select>

                <div id='contenedorMontos'>
                    <div id='montoCompra'>
                        <label>Monto Compra</label>
                        <input placeholder='0.00' type='number' {...register("montoCompra")}/>
                    </div>

                    <div id='montoVenta'>
                        <label>Monto Venta</label>
                        <input placeholder='0.00' type='number' {...register("montoVenta")}/>
                    </div>
                </div>

                <div id='buttonsContainer'>
                    <Button label='Cancelar' onClick={onClose} id='botonCancelarRegistrarCotizacionMoneda'/>
                    <Button label='Registrar Cotización' onClick={() => {}} id='botonAceptarRegistrarCotizacionMoneda'/>
                </div>

            </Modal>
        </form>
    )
}

export default ModalRegistrarCotizacionMoneda;