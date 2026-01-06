import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../generalComponents';
import { useEmpleados } from '../hook/useEmpleados';
import { asignarCheckIn, asignarCheckOut } from '../serviceAsignarCheckInOut';
import type { ReservaDetailsForModal, DTOTarea } from '../types';
import './ModalAsignarCheckInOut.css';

interface ModalAsignarCheckInOutProps {
    isOpen: boolean;
    onClose: () => void;
    reserva: ReservaDetailsForModal | null;
    onSuccess?: () => void;
}

const ModalAsignarCheckInOut: React.FC<ModalAsignarCheckInOutProps> = ({
    isOpen,
    onClose,
    reserva,
    onSuccess,
}) => {
    const { empleados, loading: empleadosLoading } = useEmpleados();
    const [empleadoCheckIn, setEmpleadoCheckIn] = useState<string>('');
    const [empleadoCheckOut, setEmpleadoCheckOut] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resetear formulario cuando se abre el modal o cambia la reserva
    useEffect(() => {
        if (isOpen) {
            setEmpleadoCheckIn('');
            setEmpleadoCheckOut('');
            setError(null);
        }
    }, [isOpen, reserva?.codReserva]);

    const handleAssign = async () => {
        if (!reserva) return;

        // Validar que se haya seleccionado al menos un empleado
        if (!empleadoCheckIn && !empleadoCheckOut) {
            setError('Por favor selecciona al menos un empleado');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log('[ModalAsignarCheckInOut] Iniciando asignación');
            console.log('[ModalAsignarCheckInOut] Reserva:', reserva);
            console.log('[ModalAsignarCheckInOut] Check-in empleado:', empleadoCheckIn);
            console.log('[ModalAsignarCheckInOut] Check-out empleado:', empleadoCheckOut);

            // Crear tareas para check-in
            if (empleadoCheckIn) {
                console.log('[ModalAsignarCheckInOut] Creando tarea CHECK-IN...');
                const dtoCheckIn: DTOTarea = {
                    nombreTarea: `Check-in para ${reserva.propiedad}`,
                    descripcionTarea: `Check-in de la reserva ${reserva.codReserva}`,
                    codEmpleado: empleadoCheckIn,
                    codReserva: reserva.codReserva,
                    codTipoTarea: 'TT001', // CHECK_IN
                };
                console.log('[ModalAsignarCheckInOut] DTO Check-in:', dtoCheckIn);
                const respuestaCheckIn = await asignarCheckIn(dtoCheckIn);
                console.log('[ModalAsignarCheckInOut] ✅ Check-in asignado:', respuestaCheckIn);
            }

            // Crear tareas para check-out
            if (empleadoCheckOut) {
                console.log('[ModalAsignarCheckInOut] Creando tarea CHECK-OUT...');
                const dtoCheckOut: DTOTarea = {
                    nombreTarea: `Check-out para ${reserva.propiedad}`,
                    descripcionTarea: `Check-out de la reserva ${reserva.codReserva}`,
                    codEmpleado: empleadoCheckOut,
                    codReserva: reserva.codReserva,
                    codTipoTarea: 'TT002', // CHECK_OUT
                };
                console.log('[ModalAsignarCheckInOut] DTO Check-out:', dtoCheckOut);
                const respuestaCheckOut = await asignarCheckOut(dtoCheckOut);
                console.log('[ModalAsignarCheckInOut] ✅ Check-out asignado:', respuestaCheckOut);
            }

            console.log('[ModalAsignarCheckInOut] ✅ Todas las tareas asignadas exitosamente');

            // Si todo fue exitoso, cerrar modal y llamar callback
            if (onSuccess) {
                console.log('[ModalAsignarCheckInOut] Llamando onSuccess callback');
                onSuccess();
            }
            onClose();
        } catch (err) {
            console.error('[ModalAsignarCheckInOut] ❌ Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al asignar empleados';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!reserva) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Asignar Empleados para Reserva"
            showCloseButton={true}
        >
            <div className="modal-asignar-content">
                {/* Detalles de la Reserva */}
                <div className="reserva-details">
                    <h3>Detalles de la Reserva:</h3>
                    <div className="details-grid">
                        <div className="detail-item">
                            <label>Propiedad:</label>
                            <span className="detail-value">{reserva.propiedad}</span>
                        </div>
                        <div className="detail-item">
                            <label>Check-in:</label>
                            <span className="detail-value">{reserva.checkin}</span>
                        </div>
                        <div className="detail-item">
                            <label>Check-out:</label>
                            <span className="detail-value">{reserva.checkout}</span>
                        </div>
                        <div className="detail-item">
                            <label>Huésped:</label>
                            <span className="detail-value">{reserva.huesped}</span>
                        </div>
                        <div className="detail-item">
                            <label>Estado:</label>
                            <span className={`detail-value status-${reserva.estado.toLowerCase()}`}>
                                {reserva.estado}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Formulario de Asignación */}
                <div className="asignacion-form">
                    <div className="form-group">
                        <label htmlFor="empleado-checkin">Empleado para Check-in</label>
                        <select
                            id="empleado-checkin"
                            value={empleadoCheckIn}
                            onChange={(e) => setEmpleadoCheckIn(e.target.value)}
                            disabled={empleadosLoading || isSubmitting}
                            className="form-select"
                        >
                            <option value="">Seleccionar empleado</option>
                            {empleados.map((emp) => (
                                <option key={emp.codEmpleado} value={emp.codEmpleado}>
                                    {emp.nombreEmpleado}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="empleado-checkout">Empleado para Check-out</label>
                        <select
                            id="empleado-checkout"
                            value={empleadoCheckOut}
                            onChange={(e) => setEmpleadoCheckOut(e.target.value)}
                            disabled={empleadosLoading || isSubmitting}
                            className="form-select"
                        >
                            <option value="">Seleccionar empleado</option>
                            {empleados.map((emp) => (
                                <option key={emp.codEmpleado} value={emp.codEmpleado}>
                                    {emp.nombreEmpleado}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mensajes de Error */}
                {error && (
                    <div className="error-message">
                        <strong>⚠️ Error:</strong> {error}
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="modal-actions">
                    <Button
                        type="button"
                        label="Cancelar"
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <Button
                        type="button"
                        label={isSubmitting ? 'Asignando...' : 'Asignar'}
                        onClick={handleAssign}
                        disabled={isSubmitting || empleadosLoading}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ModalAsignarCheckInOut;
