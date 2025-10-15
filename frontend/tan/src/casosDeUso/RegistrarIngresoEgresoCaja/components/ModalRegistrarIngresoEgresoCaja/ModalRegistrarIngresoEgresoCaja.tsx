import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index'
import "./ModalRegistrarIngresoEgresoCaja.css"
import {type formSchemaRegistrarIngresoEgresoCajaType, schemaRegistrarIngresoEgresoCaja} from '../../models/modelRegistrarIngresoEgresoCaja'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver} from 'react-hook-form';
import {type Props} from './ModalRegistrarIngresoEgresoCajaTypes'

const ModalRegistrarIngresoEgresoCaja: React.FC<Props> = ({isOpen, onClose, title, description, showCloseButton}) => {
    
    const [activo, setActivo] = React.useState<'transaccion' | 'comprobante'>('transaccion');
    
    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register } = useForm<formSchemaRegistrarIngresoEgresoCajaType>({
        resolver: zodResolver(schemaRegistrarIngresoEgresoCaja) as Resolver<formSchemaRegistrarIngresoEgresoCajaType>,
        defaultValues: {
            tipoTransaccion: "Selecciona un tipo de transacción",
            categoria: "Selecciona una categoría",
            subcategoria: "Selecciona una subcategoría",
            tipoOperacion: "Selecciona un tipo de operación",
            monto: 0, 
            detalles: ""
        },
        mode: 'onBlur'
    });
    

    const onSubmit = async (data: formSchemaRegistrarIngresoEgresoCajaType) => {}
    
    return(
        
        <Modal
        title= {title}
        description={description}
        showCloseButton={showCloseButton}
        isOpen={isOpen}
        onClose={onClose}
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

            { activo === 'transaccion' && (
                <div id='contenedorTransaccion'>
                    <section id='datosTransaccion'>
                            
                            <label>Tipo de Transacción</label>
                            <select
                            {...register("tipoTransaccion")}
                            ></select>

                            <label>Categoría</label>
                            <select
                            {...register("categoria")}
                            ></select>

                            <label>(nombre de la categoria seleccionada)</label>
                            <select
                            {...register("subcategoria")}
                            >

                            </select>

                            <label>Tipo Operación</label>
                            <select
                            {...register("tipoOperacion")}
                            ></select>

                            <label>Monto</label>
                            <input
                            type='number'
                            {...register("monto")}
                            ></input>

                            <label>Detalles</label>
                            <input
                            type='text'
                            {...register("detalles")}
                            ></input>

                    </section>

                    <section id='contenedorBotonesAccionModalRegistrarIngresoEgresoCaja'>
                    <Button
                    label='Registrar Transacción'
                    id='botonRegistrarTransaccion'
                    type='submit'
                    onClick={handleSubmit(onSubmit)}
                    />
                </section>

            </div>
            )}

            { activo === 'comprobante' && (
                <section id='contenedorDatosComprobante'>
                    <p>Actualmente esta funcionalidad esta en desarrollo</p>
                </section>
            )}

        </Modal>
    )
}

export default ModalRegistrarIngresoEgresoCaja;