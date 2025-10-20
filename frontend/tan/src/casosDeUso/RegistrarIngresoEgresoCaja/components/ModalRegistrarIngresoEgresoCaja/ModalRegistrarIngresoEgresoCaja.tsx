import React from 'react';
import {Modal, Button} from '../../../../generalComponents/index'
import "./ModalRegistrarIngresoEgresoCaja.css"
import {type formSchemaRegistrarIngresoEgresoCajaType, schemaRegistrarIngresoEgresoCaja} from '../../models/modelRegistrarIngresoEgresoCaja'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver} from 'react-hook-form';
import {type Props} from './ModalRegistrarIngresoEgresoCajaTypes'
import {useIngresoEgresoCaja} from '../../hooks/useIngresoEgresoCaja'

const ModalRegistrarIngresoEgresoCaja: React.FC<Props> = ({isOpen, onClose, title, description, showCloseButton}) => {
    
    const [activo, setActivo] = React.useState<'transaccion' | 'comprobante'>('transaccion');
    const {tiposTransaccion} = useIngresoEgresoCaja();
    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register, watch } = useForm<formSchemaRegistrarIngresoEgresoCajaType>({
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
    const categoriaValue = watch("categoria");
    

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
                            >

                                <option value={"Selecciona un tipo de transacción"}>"Selecciona un tipo de transacción"</option>
                                {tiposTransaccion && tiposTransaccion.length > 0 && (
                                    tiposTransaccion.map((tiposTransaccion, index) => (
                                        <option key={index} value={tiposTransaccion.nombreTipoTransaccion}>{tiposTransaccion.nombreTipoTransaccion}</option>
                                    ))
                                )}
                                
                            </select>

                            <label>Categoría</label>
                            <select
                            {...register("categoria")}
                            >
                                <option value={"Selecciona una categoría"}>"Selecciona una categoría"</option>
                                <option value={"Empleado"}></option>
                                <option value={"Inmueble"}></option>
                            </select>

                            <label>{categoriaValue}</label>
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