import './ModalRegistrarCambioMoneda.css'
import {Modal, Button} from '../../../../generalComponents/index'
import { type ProposModalRegistrarCambioMoneda } from './ModalRegistrarCambioMonedaTypes'
import { useForm, type Resolver } from 'react-hook-form';
import { type formSchemaRegistrarCambioMonedaType, schemaRegistrarCambioMoneda } from '../../models/modelRegistrarCambioMoneda';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegistrarCambioMoneda } from '../../hooks/useRegistrarCambioMoneda';
import { MdAttachMoney } from "react-icons/md";
import { useState } from 'react';
import {default as ModalRegistrarCotizacionMoneda} from '../../../RegistrarCotizacionMoneda/components/ModalRegistrarCotizacionMoneda/ModalRegistrarCotizacionMoneda'

export const ModalRegistrarCambioMoneda: React.FC<ProposModalRegistrarCambioMoneda> = ({isOpen, onClose}) => {

    const {handleSubmit, control, formState: { errors }, reset, register, watch} = useForm<formSchemaRegistrarCambioMonedaType>({
        resolver: zodResolver(schemaRegistrarCambioMoneda) as Resolver<formSchemaRegistrarCambioMonedaType>,
        defaultValues: {
            tipoCambio: "seleccioneUnTipoDeCambio"
        },
        mode: 'onBlur'
    })
    const watchTipoCambio = watch("tipoCambio", "seleccioneUnTipoDeCambio");
    const tipoCambioParaHook = watchTipoCambio !== "seleccioneUnTipoDeCambio" ? watchTipoCambio : undefined;
    const {cotizacionMonedaHoy, loading, errorCotizacionHoy, refreshCotizacion, registrarCambioMoneda, errorEncontrado} = useRegistrarCambioMoneda(tipoCambioParaHook);
    const [abrirModalCotizacionMoneda, setAbrirModalCotizacionMoneda] = useState(false);
    const [showMensajeExito, setShowMensajeExito] = useState(false);

    const onSubmit = async (data: formSchemaRegistrarCambioMonedaType) => {
        const exito = await registrarCambioMoneda(data);
        console.log("Este es mi exito", exito)

        if (exito) {
            setShowMensajeExito(true);
            reset();
            setTimeout(() => {
                setShowMensajeExito(false);
                if (onClose) {
                    onClose();
                }
                
            }, 3000);
        }else {
            setShowMensajeExito(false);
        }
    }

    // Función para manejar el cierre exitoso del modal de cotización
    const handleCotizacionRegistrada = () => {
        setAbrirModalCotizacionMoneda(false);
        // Refrescar los datos usando refetch
        refreshCotizacion();
    };

    return (
        <>
            <Modal
                showCloseButton={true}
                title='Cambio de Moneda - Caja Madre'
                description='Realiza un cambio de moneda utilizando la cotización del día'
                isOpen={isOpen}
                onClose={onClose}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    
                    {showMensajeExito && <div id='mensajeExito'>Cambio Moneda registrado con éxito</div>}
                    {errorEncontrado && <div id='mensajeError'>No se puedo registrar el cambio para la moneda seleccionada pues {errorEncontrado}</div>}

                    {/* CASO 1: Se seleccionó tipo de cambio y HAY cotización */}
                    {watchTipoCambio !== "seleccioneUnTipoDeCambio" && cotizacionMonedaHoy && !loading && (
                        <section id='contenedorCotizacionHoy'>
                            <p>Cotización del Día - USD</p>
                            <div id='contenedorValoresCotizacion'>
                                <p>Compra: $ARS {cotizacionMonedaHoy.montoCompra}</p>
                                <p>Venta: $ARS {cotizacionMonedaHoy.montoVenta}</p>
                            </div>
                        </section>
                    )}

                    {/* CASO 2: Se seleccionó tipo de cambio y NO HAY cotización */}
                    {watchTipoCambio !== "seleccioneUnTipoDeCambio" && !cotizacionMonedaHoy && !loading && (
                        <section id='contenedorSinCotizacion'>
                            <div className='mensaje-sin-cotizacion'>
                                <p>No hay cotización registrada para hoy. Debes agregar una cotización antes de realizar el cambio.</p>
                            </div>
                            
                            <Button
                                className='btn-agregar-cotizacion'
                                label='Agregar Cotización del Día'
                                icon={<MdAttachMoney/>}
                                onClick={() => {setAbrirModalCotizacionMoneda(true)}}
                            />
                        </section>
                    )}

                    {/* CASO 3: Cargando cotización */}
                    {watchTipoCambio !== "seleccioneUnTipoDeCambio" && loading && (
                        <section id='contenedorCargando'>
                            <div className='mensaje-cargando'>
                                <p>Cargando cotización del día...</p>
                            </div>
                        </section>
                    )}

                    {/* CASO 4: Error al cargar cotización */}
                    {watchTipoCambio !== "seleccioneUnTipoDeCambio" && errorCotizacionHoy && !loading && (
                        <section id='contenedorError'>
                            <div className='mensaje-error-cotizacion'>
                                <p>Error al cargar la cotización del día. Por favor, intente nuevamente.</p>
                            </div>
                        </section>
                    )}

                    <section id='contenedorInfoCambioMoneda'>
                        <div className='contenedorSelectsCambioMoneda'>
                            <label>Tipo de Cambio</label>
                            <select {...register("tipoCambio")}>
                                <option value={"seleccioneUnTipoDeCambio"}>Seleccione un Tipo de Cambio</option>
                                <option value={"dolaresAPesos"}>Dólares → Pesos Argentinos</option>
                                <option value={"pesosADolares"}>Pesos Argentinos → Dólares</option>
                            </select>
                            {errors.tipoCambio && <p className='mensajeErrorFormulario'>{errors.tipoCambio.message}</p>}
                        </div>

                        <div className='contenedorSelectsCambioMoneda'>
                            <label>
                                Monto a Convertir {watchTipoCambio === "dolaresAPesos" ? "(USD)" : watchTipoCambio === "pesosADolares" ? "(ARS)" : ""}
                            </label>
                            <input 
                                type='number'
                                step="0.01"
                                placeholder="0.00"
                                disabled={watchTipoCambio === "seleccioneUnTipoDeCambio"}
                                {...register("montoAConvertir")}
                            />
                            {errors.montoAConvertir && <p className='mensajeErrorFormulario'>{errors.montoAConvertir.message}</p>}
                        </div>

                        {watchTipoCambio !== "seleccioneUnTipoDeCambio" && cotizacionMonedaHoy && (
                            <div>
                                <p>Balance disponible: {watchTipoCambio === "dolaresAPesos" ? "US$50..." : "$ARS 12,345..."}</p>
                            </div>
                        )}
                    </section>

                    <div className='modal-buttons'>
                        <Button
                            className='btn-cancelar' 
                            onClick={onClose}
                            label='Cancelar'
                        />

                        <Button 
                            type='submit' 
                            className='btn-realizar-cambio'
                            disabled={
                                watchTipoCambio === "seleccioneUnTipoDeCambio" || 
                                !cotizacionMonedaHoy ||
                                loading
                            }
                            label='Realizar Cambio'
                        />
                    </div>

                </form>
            </Modal>
            
            {abrirModalCotizacionMoneda && (
                        <ModalRegistrarCotizacionMoneda 
                                isOpen={abrirModalCotizacionMoneda} 
                                description='Ingresa los valores de compra y venta para la moneda seleccionada.' 
                                onClose={() => setAbrirModalCotizacionMoneda(false)}
                                title='Registrar Cotización de Moneda'
                                onSuccess={handleCotizacionRegistrada}
                                showCloseButton={true}
                        />
            )}
        </>
    )
}