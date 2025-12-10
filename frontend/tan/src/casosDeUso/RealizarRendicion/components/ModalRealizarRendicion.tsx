import './ModalRealizarRendicion.css';
import {Modal, Button} from '../../../generalComponents/index';
import { useForm, type Resolver } from 'react-hook-form';
import { type PropsModalRealizarRendicion } from './ModalRealizarRendicionTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRealizarRendicion } from '../hooks/useRealizarRendicion';
import {schemaRealizarRendicion, type formSchemaRealizarRendicionType} from '../models/modelRealizarRendicion';
import { useState } from 'react';

export const ModalRealizarRendicion: React.FC<PropsModalRealizarRendicion> = ({isOpen, onClose, children, showCloseButton, refetchCajas}) => {

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


    const empleadoSeleccionado = () => {
        return empleados?.find(emp => emp.dniEmpleado === watchEmpleadoSeleccionado);
    }

    const inmuebleSeleccionado = () => {
        return inmuebles?.find(inm => inm.codInmueble === watchInmuebleSeleccionado);
    }

    console.log("Inmuebles" , inmuebles)

    const onSubmit = async (data: any) => {}

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title='Realizar Rendición'
        description='Realice la rendicion de la caja de un empleado a caja madre. Siempre y cuando cuente con saldo.
        Realice la rendicion a un inmueble.
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

                {balance && (watchEmpleadoSeleccionado !== "seleccioneUnEmpleado" || watchInmuebleSeleccionado!== "seleccioneUnInmueble") && !loadingBalance && (
                    <section id='contenedorBalanceCaja'>

                    <p>Caja {watchEmpleadoSeleccionado !== "seleccioneUnEmpleado" ? empleadoSeleccionado()?.nombreEmpleado : inmuebleSeleccionado()?.nombreInmueble}</p>
                    {balance.balanceARS !== null && (
                        <span>Balance: $ARS {balance?.balanceARS.toFixed(2)}</span>
                    )}

                    {balance.balanceUSD !== null && (
                        <span>Balance: $USD {balance?.balanceUSD.toFixed(2)}</span>
                    )}
                    
                    </section>
                )}
                

                <section id='contenedorBotonesRealizarRendicion'>

                    <Button
                    label='Confirmar'
                    id='botonConfirmarRendicion'
                    />

                </section>
            </form>
        </Modal>
    )
}

