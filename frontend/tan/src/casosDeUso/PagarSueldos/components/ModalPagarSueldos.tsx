import './ModalPagarSueldos.css';
import { type PropsModalPagarSueldos } from './ModalPagarSueldosTypes'
import { Modal, Button } from '../../../generalComponents/index';
import { usePagarSueldos } from '../hooks/usePagarSueldos';
import { useForm, type Resolver } from 'react-hook-form';
import { type formSchemaPagarSueldosType, schemaPagarSueldos } from '../models/modelPagarSueldos';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

export const ModalPagarSueldos: React.FC<PropsModalPagarSueldos> = ({ cajaMadre, onClose, isOpen, showCloseButton, children, refetchCajas }) => {

    const { empleados, loadingEmpleados, refetchEmpleados, errorEmpleados } = usePagarSueldos();
    const { handleSubmit, control, formState: { errors }, reset, register, watch, setError, clearErrors } = useForm<formSchemaPagarSueldosType>({
        resolver: zodResolver(schemaPagarSueldos) as Resolver<formSchemaPagarSueldosType>,
        defaultValues: {
            dniEmpleado: "SeleccioneUnEmpleado",
        },
        mode: 'onBlur',
    });

    // Estados para mensajes
    const [loading, setLoading] = useState(false);
    const [mensajeExito, setMensajeExito] = useState<string>('');
    const [mensajeError, setMensajeError] = useState<string>('');

    const empleadoSeleccionado = watch('dniEmpleado');
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || '';

    // Extraer la lógica del empleado para evitar repetir la búsqueda
    const empleado = empleados?.find(emp => emp.dniEmpleado === empleadoSeleccionado);
    const sueldoEmpleado = empleado?.sueldoEmpleado || 0;
    const hasValidEmployee = empleadoSeleccionado && empleadoSeleccionado !== "SeleccioneUnEmpleado" && empleado;
    const hasInsufficientBalance = cajaMadre.balanceARS < sueldoEmpleado;

    const onSubmit = async (data: formSchemaPagarSueldosType) => {
        try {
            setLoading(true);
            setMensajeError('');
            setMensajeExito('');

            const empleado = empleados?.find(emp => emp.dniEmpleado === data.dniEmpleado);
            if (!empleado) {
                setMensajeError('Empleado no encontrado');
                return;
            }

            if (cajaMadre.balanceARS < empleado.sueldoEmpleado) {
                setMensajeError('Saldo insuficiente en caja madre');
                return;
            }

            const response = await fetch(`/api/finanzas/pagarSueldos/${data.dniEmpleado}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                setMensajeExito(`Sueldo pagado exitosamente a ${empleado.nombreEmpleado}`);
                
                // Refrescar tanto empleados como cajas
                refetchEmpleados();
                if (refetchCajas) {
                    refetchCajas();
                }
                
                setTimeout(() => {
                    reset();
                    setMensajeExito('');
                    onClose();
                }, 2500);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al pagar sueldo');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensajeError(error instanceof Error ? error.message : 'Error al procesar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={showCloseButton}
            title='Pagar Sueldos'
            description='Seleccione a un empleado al cual desea pagarle el sueldo'
        >

            <form onSubmit={handleSubmit(onSubmit)} id='formPagarSueldos'>
                
                {/* Mensajes de estado */}
                {mensajeExito && (
                    <div id="mensajeExitoPagarSueldo">
                        {mensajeExito}
                    </div>
                )}

                {mensajeError && (
                    <div id="mensajeErrorPagarSueldo">
                        {mensajeError}
                    </div>
                )}

                <section id='contenedorContenidoPagarSueldos'>

                    <div id='balanceCajaMadre'>
                        <p>Balance Caja Madre:</p>
                        <span>$ARS {cajaMadre.balanceARS?.toFixed(2) || 0}</span>
                    </div>

                    <div id='selectEmpleado'>
                        <label>Empleado</label>

                        <select {...register('dniEmpleado')}>
                            <option value={"SeleccioneUnEmpleado"}>Seleccione un empleado</option>
                            {!loadingEmpleados && !errorEmpleados && empleados && empleados.map((empleado) => (
                                <option key={empleado.dniEmpleado} value={empleado.dniEmpleado}>
                                    {empleado.nombreEmpleado}
                                </option>
                            ))}
                        </select>

                        {errors.dniEmpleado && (
                            <span className='mensajeErrorSelectEmpleado'>{errors.dniEmpleado.message}</span>
                        )}
                    </div>

                    <div id='contenedorSueldoEmpleado'>
                        <p id='pSueldoAPagar'>Sueldo a pagar:</p>
                        {hasValidEmployee && (
                            <span id='valorSueldo'>
                                $ARS {sueldoEmpleado.toFixed(2)}
                            </span>
                        )}
                    </div>
                </section>

                {hasInsufficientBalance && hasValidEmployee && !mensajeExito && (
                    <span id='mensajeErrorBalanceInsuficiente'>
                        No hay balance suficiente en la caja madre para pagar el sueldo de este empleado.
                    </span>
                )}

                <section id='contenedorBotonesPagarSueldo'>
                    <Button
                        label={loading ? 'Pagando...' : 'Pagar Sueldo'}
                        id='botonPagarSueldo'
                        disabled={loading || !hasValidEmployee || hasInsufficientBalance}
                    />
                </section>
            </form>

        </Modal>
    )
}