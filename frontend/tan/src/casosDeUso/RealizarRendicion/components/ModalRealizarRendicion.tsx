import './ModalRealizarRendicion.css';
import {Modal, Button} from '../../../generalComponents/index';
import { useForm, type Resolver } from 'react-hook-form';
import { type PropsModalRealizarRendicion } from './ModalRealizarRendicionTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRealizarRendicion } from '../hooks/useRealizarRendicion';
import {schemaRealizarRendicion, type formSchemaRealizarRendicionType} from '../models/modelRealizarRendicion';
import { useEffect, useState } from 'react';

export const ModalRealizarRendicion: React.FC<PropsModalRealizarRendicion> = ({isOpen, onClose, children, showCloseButton, refetchCajas, cajaMadre}) => {

    const {handleSubmit, control, formState: { errors }, reset, register, watch, setError, clearErrors} = useForm({
        resolver: zodResolver(schemaRealizarRendicion) as Resolver<formSchemaRealizarRendicionType>,
        mode: 'onBlur',
        defaultValues:{
            tipoRendicion: "SeleccioneUnTipoRendicion",
            empleadoSeleccionado: "seleccioneUnEmpleado",
            inmuebleSeleccionado: "seleccioneUnInmueble"
        }
    });

    const watchTipoRendicion = watch('tipoRendicion');
    const watchEmpleadoSeleccionado = watch('empleadoSeleccionado');
    const watchInmuebleSeleccionado = watch('inmuebleSeleccionado');
    // Determinar entidad seleccionada
    const entidadSeleccionada = watchTipoRendicion === 'RendicionEmpleado' 
        ? watchEmpleadoSeleccionado 
        : watchInmuebleSeleccionado;
        
    const {
        empleados, errorEmpleados, errorInmuebles, inmuebles,
        loadingEmpleados, loadingInmuebles, refetchEmpleados, refetchInmuebles, 
        balance, errorBalance, loadingBalance, refetchBalance
    } = useRealizarRendicion(watchTipoRendicion, entidadSeleccionada);
    const [mensajeExito, setMensajeExito] = useState<string>('');
    const [mensajeError, setMensajeError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const empleadoSeleccionado = () => {
        return empleados?.find(emp => emp.dniEmpleado === watchEmpleadoSeleccionado);
    }

    const inmuebleSeleccionado = () => {
        return inmuebles?.find(inm => inm.codInmueble === watchInmuebleSeleccionado);
    }

    const onSubmit = async (data: formSchemaRealizarRendicionType) => {
    try {
        setLoading(true);
        setMensajeError('');
        setMensajeExito('');

        // Validaciones previas
        if (!balance) {
            setMensajeError('No se puede proceder sin información del balance');
            return;
        }

        // Determinar el identificador según el tipo de rendición
        let identificador: string;
        let nombreEntidad: string;

        if (data.tipoRendicion === 'RendicionEmpleado') {
            if (!data.empleadoSeleccionado || data.empleadoSeleccionado === 'seleccioneUnEmpleado') {
                setMensajeError('Debe seleccionar un empleado');
                return;
            }
            identificador = data.empleadoSeleccionado;
            nombreEntidad = empleadoSeleccionado()?.nombreEmpleado || 'Empleado';
        } else if (data.tipoRendicion === 'RendicionInmueble') {
            if (!data.inmuebleSeleccionado || data.inmuebleSeleccionado === 'seleccioneUnInmueble') {
                setMensajeError('Debe seleccionar un inmueble');
                return;
            }
            identificador = data.inmuebleSeleccionado;
            nombreEntidad = inmuebleSeleccionado()?.nombreInmueble || 'Inmueble';
        } else {
            setMensajeError('Debe seleccionar un tipo de rendición válido');
            return;
        }

        // Verificar balance suficiente para inmuebles
        if (data.tipoRendicion === 'RendicionInmueble' && cajaMadre) {
            const insuficienteARS = balance.balanceARS && balance.balanceARS > (cajaMadre.balanceARS ?? 0);
            const insuficienteUSD = balance.balanceUSD && balance.balanceUSD > (cajaMadre.balanceUSD ?? 0);
            
            if (insuficienteARS || insuficienteUSD) {
                setMensajeError('No hay balance suficiente en la caja madre para realizar esta rendición');
                return;
            }
        }

        // Obtener token
        const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

        // Preparar el body con la estructura correcta
        const requestBody = {
            balanceARS: balance.balanceARS,
            balanceUSD: balance.balanceUSD
        };

        console.log("🚀 Enviando rendición:", {
            identificador,
            body: requestBody,
            url: `/api/finanzas/realizarRendicion/${identificador}`
        });

        // Realizar la petición POST
        const response = await fetch(`/api/finanzas/realizarRendicion/${identificador}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.text();
        console.log("Este es el resultado del back rendición:", result);
        console.log("este es el response.ok rendición:", response.ok);
        
        // Manejar errores del backend
        if (!response.ok) {
            console.log("Este es el mensaje del error del back rendición:", result);
            throw new Error(result || 'Error al realizar la rendición');
        }

        // ✅ ÉXITO - Mostrar mensaje y luego cerrar
        console.log("✅ Rendición completada exitosamente");
        
        // Mostrar mensaje de éxito
        setMensajeExito(`Rendición realizada exitosamente para ${nombreEntidad}`);
        setLoading(false);
        
        // Refrescar datos en background
        if (refetchCajas) {
            refetchCajas(); // Sin await para no bloquear
        }
        
        // Cerrar modal después de mostrar el mensaje
        setTimeout(() => {
            reset();
            setMensajeExito('');
            setMensajeError('');
            onClose();
        }, 2000); // 2 segundos para que el usuario vea el mensaje

    } catch (error) {
        console.error('❌ Error al realizar rendición:', error);
        setMensajeError(error instanceof Error ? error.message : 'Error al procesar la rendición');
        setLoading(false);
    }
};

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title='Realizar Rendición'
        description='Realice la rendicion de la caja de un empleado a caja madre, siempre y cuando cuente con saldo positivo, o
        realice la rendicion a un inmueble.
        '
        >

            <form onSubmit={handleSubmit(onSubmit)} id="formRealizarRendicion">
                {mensajeExito && (
                    <div id="mensajeExitoRendicion">{mensajeExito}</div>
                )}
            
                {mensajeError && (
                    <div id="mensajeErrorRendicion">{mensajeError}</div>
                )}
                
                <section id='contenedorSelects'>

                    <div>
                        <label>Tipo Rendicion</label>
                        <select {...register('tipoRendicion')} id='selectTipoRendicion'>
                            <option value={"SeleccioneUnTipoRendicion"}>Seleccione Un Tipo Rendicion</option>
                            <option value="RendicionInmueble">Rendición Inmueble</option>
                            <option value="RendicionEmpleado">Rendición Empleado</option>
                        </select>
                    </div>

                    {empleados == null && !loadingEmpleados && errorEmpleados && (
                        <div className="mensajeErrorSinBalance">
                            No se puede hacer la rendicion de ningun empleado pues ninguno tiene el balance suficiente
                        </div>
                    )}

                    {inmuebles == null && !loadingInmuebles && errorInmuebles && (
                        <div className="mensajeErrorSinBalance">
                            No se puede hacer la rendicion de ningun inmueble pues ninguno tiene el balance suficiente
                        </div>
                    )}

                    <div>
                        {watchTipoRendicion !== "SeleccioneUnTipoRendicion" && (empleados || inmuebles) && (
                            <label>{watchTipoRendicion == "RendicionEmpleado" ? "Empleado" : "Inmueble" }</label>
                        )}
                    
                        {watchTipoRendicion === 'RendicionInmueble' && inmuebles && inmuebles !== null && (
                            
                            <select {...register('inmuebleSeleccionado')} id='selectInmuebleRendicion'>
                                <option value={"seleccioneUnInmueble"}>Seleccione un Inmueble</option>
                                {inmuebles.map((inmueble) => {
                                    return <option key={inmueble.codInmueble} value={inmueble.codInmueble}>{inmueble.nombreInmueble}</option>
                                })}
                            </select>
                        )}

                        {watchTipoRendicion === 'RendicionEmpleado' && empleados && empleados !== null && (
                            <select {...register('empleadoSeleccionado')} id='selectEmpleadoRendicion'>
                                <option value={"seleccioneUnEmpleado"}>Seleccione un Empleado</option>
                                {empleados.map((empleado) => {
                                    return <option key={empleado.dniEmpleado} value={empleado.dniEmpleado}>{empleado.nombreEmpleado}</option>
                                })}
                            </select>
                        )}
                    
                    </div>

                </section>

                {balance && (watchEmpleadoSeleccionado !== "seleccioneUnEmpleado") && !loadingBalance && (
                    <section key="balance-empleado" id='contenedorBalanceCaja'>
                        <p>Caja {empleadoSeleccionado()?.nombreEmpleado}</p>
                        {balance.balanceARS !== null && (
                            <span key="ars-empleado">Balance: $ARS {balance?.balanceARS.toFixed(2)}</span>
                        )}

                        {balance.balanceUSD !== null && (
                            <span key="usd-empleado">Balance: $USD {balance?.balanceUSD.toFixed(2)}</span>
                        )}
                    </section>
                )}

                {balance && (watchInmuebleSeleccionado !== "seleccioneUnInmueble") && !loadingBalance && cajaMadre && (
                    <section key="balance-inmueble" id='contenedorBalanceCajaInmueble'>
                        <p>Total a pagar a Inmueble: {inmuebleSeleccionado()?.nombreInmueble}</p>
                        {balance.balanceUSD !== null && (
                            <span key="usd-inmueble">$USD {balance?.balanceUSD.toFixed(2)}</span>
                        )}

                        <div key="caja-madre" id='balanceCajaMadre'>
                            <p>Balance Caja Madre:</p>
                            <span key="usd-madre">$USD {cajaMadre.balanceUSD?.toFixed(2) || 0}</span>

                            {balance?.balanceUSD && balance.balanceUSD > (cajaMadre.balanceUSD ?? 0) && (
                                <span key="error-usd" className='mensajeErrorSinBalance'>
                                    No hay balance suficiente en la caja madre para realizar esta rendición en USD.
                                </span>
                            )}
                        </div>
                    </section>
                )}     

                {errorBalance && !loadingBalance && (
                    <div className="mensajeErrorSinBalance">
                        {errorBalance.message}
                    </div>
                )}

                <section id='contenedorBotonesRealizarRendicion'>

                    <Button
                        label={loading ? 'Procesando...' : 'Confirmar'}
                        id='botonConfirmarRendicion'
                        disabled={
                            loading || 
                            loadingBalance || 
                            watchTipoRendicion === "SeleccioneUnTipoRendicion" ||
                            (watchTipoRendicion === 'RendicionEmpleado' && (
                                watchEmpleadoSeleccionado === "seleccioneUnEmpleado" || !balance
                            )) ||
                            (watchTipoRendicion === 'RendicionInmueble' && (
                                watchInmuebleSeleccionado === "seleccioneUnInmueble" || 
                                !balance || 
                                (cajaMadre && balance && (
                                    (balance.balanceARS !== null && balance.balanceARS > (cajaMadre.balanceARS ?? 0)) ||
                                    (balance.balanceUSD !== null && balance.balanceUSD > (cajaMadre.balanceUSD ?? 0))
                                ))
                            ))
                        }
                    />

                </section>
            </form>
        </Modal>
    )
}

