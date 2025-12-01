import React, { useState } from 'react';
import {Button} from '../../../../generalComponents/index'
import "./FormRegistrarIngresoEgresoCaja.css"
import {type formSchemaRegistrarIngresoEgresoCajaType, schemaRegistrarIngresoEgresoCaja} from '../../models/modelRegistrarIngresoEgresoCaja'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver} from 'react-hook-form';
import {type Props} from './FormRegistrarIngresoEgresoCajaTypes'
import {useIngresoEgresoCaja} from '../../hooks/useIngresoEgresoCaja'

const FormRegistrarIngresoEgresoCaja: React.FC<Props> = ({title, description, onTransaccionAgregada, modo  }) => {
    
    const [activo, setActivo] = React.useState<'transaccion' | 'comprobante'>('transaccion');
    const {tiposTransaccion, tiposMoneda, categorias, registrarIngresoEgresoCaja, errorEncontrado} = useIngresoEgresoCaja();
    const [showMensajeExito, setShowMensajeExito] = useState(false);
    //*uso del zod, useForm para manejar el formulario
    const { handleSubmit, control, formState: { errors }, reset, register} = useForm<formSchemaRegistrarIngresoEgresoCajaType>({
        resolver: zodResolver(schemaRegistrarIngresoEgresoCaja) as Resolver<formSchemaRegistrarIngresoEgresoCajaType>,
        defaultValues: {
            tipoTransaccion: "Selecciona un tipo de transacción",
            categoria: "Selecciona una categoría",
            moneda: "Selecciona una moneda", 
            descripcion: ""
        },
        mode: 'onBlur'
    });
    console.log('Componente renderizado con modo:', modo);
        console.log('Categorías recibidas del hook:', categorias);
        console.log('Tipos transacción:', tiposTransaccion);
        console.log('Tipos moneda:', tiposMoneda);
    const onSubmit = async (data: formSchemaRegistrarIngresoEgresoCajaType) => {
        if (modo === 'temporal') {
            console.log('Datos del formulario:', data);

            // Modo temporal: solo guarda en memoria/sessionStorage
            if (onTransaccionAgregada) {
                onTransaccionAgregada(data);
            }
            
            setShowMensajeExito(true);
            reset();
            setTimeout(() => {
                setShowMensajeExito(false);
            }, 3000);
            
        } else {
            // Modo normal: registra en backend
            const exito = await registrarIngresoEgresoCaja(data);
            console.log("Este es mi exito", exito)

            if (exito) {
                if (onTransaccionAgregada) {
                    onTransaccionAgregada(data);
                }
                
                setShowMensajeExito(true);
                reset();
                setTimeout(() => {
                    setShowMensajeExito(false);
                }, 3000);
            } else {
                setShowMensajeExito(false);
            }
        }
    }

    console.log(categorias);
    
    return(
        
        <div id='formRegistrarIngresoEgreso'>
            <header>
                <h2 id='tituloForm'>{title}</h2>
                <p id='descripcionForm'>{description}</p>
            </header>

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

            {showMensajeExito && <div id='mensajeExito'>Transacción registrada con éxito</div>}
            {errorEncontrado && <div id='mensajeError'>No se puedo registrar la transacción pues {errorEncontrado}</div>}


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

                            {errors.tipoTransaccion && <span className='mensajeErrorValidacion'>{errors.tipoTransaccion.message}</span>}
                    

                            <label>Categoría</label>
                            <select
                            {...register("categoria")}
                            >
                                <option value={"Selecciona una categoría"}>"Selecciona una categoría"</option>
                                {categorias && categorias.length > 0 && (
                                    categorias.map((categorias, index) => (
                                        <option key={index} value={categorias.nombreCategoria}>{categorias.nombreCategoria}</option>
                                    ))
                                )}
                            </select>

                            {errors.categoria && <span className='mensajeErrorValidacion'>{errors.categoria.message}</span>}


                            <label>Moneda</label>
                            <select
                            {...register("moneda")}
                            >
                                <option value={"Selecciona una moneda"}>"Selecciona una moneda"</option>
                                {tiposMoneda && tiposMoneda.length > 0 && (
                                    tiposMoneda.map((tiposMoneda, index) => (
                                        <option key={index} value={tiposMoneda.nombreMoneda}>{tiposMoneda.nombreMoneda}</option>
                                    )
                                ))}
                            </select>

                            {errors.moneda && <span className='mensajeErrorValidacion'>{errors.moneda.message}</span>}


                            <label>Monto</label>
                            <input
                            type='number'
                            placeholder='Ingrese el monto de la transacción'
                            {...register("monto")}
                            ></input>

                            {errors.monto && <span className='mensajeErrorValidacion'>{errors.monto.message}</span>}


                            <label>Descripcion</label>
                            <input
                            type='text'
                            placeholder='Ingrese una pequeña descripcion de la transacción'
                            {...register("descripcion")}
                            ></input>

                            {errors.descripcion && <span className='mensajeErrorValidacion'>{errors.descripcion.message}</span>}


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

        </div>
    )
}

export default FormRegistrarIngresoEgresoCaja;