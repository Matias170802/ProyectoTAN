import './ModalPagarSueldos.css';
import {type PropsModalPagarSueldos} from './ModalPagarSueldosTypes'
import { Modal, Button } from '../../../generalComponents/index';
import { usePagarSueldos } from '../hooks/usePagarSueldos';
import { useForm, type Resolver } from 'react-hook-form';
import {type formSchemaPagarSueldosType, schemaPagarSueldos} from '../models/modelPagarSueldos';
import { zodResolver } from '@hookform/resolvers/zod';


export const ModalPagarSueldos: React.FC<PropsModalPagarSueldos> = ({cajaMadre, onClose, isOpen, showCloseButton, children}) => {

    const {empleados, loadingEmpleados, refetchEmpleados, errorEmpleados} = usePagarSueldos();
    const {handleSubmit, control, formState: { errors }, reset, register, watch, setError, clearErrors} = useForm<formSchemaPagarSueldosType>({
        resolver: zodResolver(schemaPagarSueldos) as Resolver<formSchemaPagarSueldosType>,
        defaultValues: {
            dniEmpleado: "SeleccioneUnEmpleado",
        },
        mode: 'onBlur',    
    });
    const empleadoSeleccionado = watch('dniEmpleado');

    const onSubmit = async (data: formSchemaPagarSueldosType) => {
        //TODO: hacer logica para mandar dni en la url
    }

    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        showCloseButton={showCloseButton}
        title='Pagar Sueldos'
        description='Seleccione a un empleado al cual desea pagarle el sueldo'
        >

        <form onSubmit={handleSubmit(onSubmit)} id='formPagarSueldos'>
            <section id='contenedorContenidoPagarSueldos'>
                
                <div id='balanceCajaMadre'>
                    <p>Balance Caja Madre:</p>
                    <span>$ARS {cajaMadre.balanceARS?.toFixed(2) || 0}</span>
                </div>
                
                <div id='selectEmpleado'>
                    <label>Empleado</label>

                    <select
                    {...register('dniEmpleado')}
                    >
                        <option value={"SeleccioneUnEmpleado"}>Seleccione un empleado</option>
                        {!loadingEmpleados && !errorEmpleados && empleados && empleados.map((empleado) => (
                            <option key={empleado.dniEmpleado} value={empleado.dniEmpleado}>
                                {empleado.nombreEmpleado}
                            </option>
                        ))}

                        {errors.dniEmpleado && (
                            <span className='mensajeErrorSelectEmpleado'>{errors.dniEmpleado.message}</span>
                        )}
                    </select>
                </div>

                <div id='contenedorSueldoEmpleado'>
                    <p id='pSueldoAPagar'>Sueldo a pagar:</p>
                    {empleadoSeleccionado && empleadoSeleccionado !== "SeleccioneUnEmpleado" && (
                        <span id='valorSueldo'>
                            $ARS{empleados?.find(emp => emp.dniEmpleado === empleadoSeleccionado)?.sueldoEmpleado.toFixed(2)}
                        </span>
                    )}
                </div>
            </section>

            {cajaMadre.balanceARS < (empleados?.find(emp => emp.dniEmpleado === empleadoSeleccionado)?.sueldoEmpleado || 0) && (
                <span id='mensajeErrorBalanceInsuficiente'>No hay balance suficiente en la caja madre para pagar el sueldo de este empleado.</span>
            )}

            <section id='contenedorBotonesPagarSueldo'>
                <Button
                label='Pagar Sueldo'
                id='botonPagarSueldo'
                disabled={empleadoSeleccionado === "SeleccioneUnEmpleado" || 
                    cajaMadre.balanceARS < (empleados?.find(emp => emp.dniEmpleado === empleadoSeleccionado)?.sueldoEmpleado || 0)}
                />
            </section>
        </form>

        </Modal>
    )
}