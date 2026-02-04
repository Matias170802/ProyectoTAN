import {type PropsFinalizarTarea} from './ModalFinalizarTareaTypes';
import {Modal, Button} from '../../../../generalComponents/index';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import './ModalFinalizarTarea.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIngresoEgresoCaja } from '../../../RegistrarIngresoEgresoCaja/hooks/useIngresoEgresoCaja';
import {type Transaccion} from './../FormFinalizarTareaAgregarIE/FormFinalizarTareaAgregarIETypes'

export const ModalFinalizarTarea: React.FC<PropsFinalizarTarea> = ({isOpen, onClose, title, description, tarea, showCloseButton}) => {

    const navigate = useNavigate();
    const location = useLocation();
    const [transaccionesTemporales, setTransaccionesTemporales] = useState<[Transaccion] | []>([]);
    const [mensajeError, setMensajeError] = useState<string | null>(null);
    const [mostrarError, setMostrarError] = useState(false);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);
    const [mostrarExito, setMostrarExito] = useState(false);
    const [cargando, setCargando] = useState(false);
    const {registrarIngresoEgresoCaja} = useIngresoEgresoCaja(); 
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    console.log("Tarea en modal finalizar:", tarea);
    // Cargar transacciones temporales cuando se abre el modal O cuando se vuelve de agregar IE
    useEffect(() => {
        if (isOpen || location.state?.volviendoDeAgregarIE) {
            const transacciones = sessionStorage.getItem('transaccionesTemporales');
            if (transacciones) {
                setTransaccionesTemporales(JSON.parse(transacciones));
            }
        }
    }, [isOpen, location.state]);

    // Escuchar cambios en sessionStorage para actualizar en tiempo real
    useEffect(() => {
        const handleStorageChange = () => {
            const transacciones = sessionStorage.getItem('transaccionesTemporales');
            if (transacciones) {
                setTransaccionesTemporales(JSON.parse(transacciones));
            } else {
                setTransaccionesTemporales([]);
            }
        };

        // Escuchar el evento storage
        window.addEventListener('storage', handleStorageChange);
        
        // También escuchar un evento personalizado para cambios en la misma pestaña
        window.addEventListener('transaccionesActualizadas', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('transaccionesActualizadas', handleStorageChange);
        };
    }, []);

    const handleAgregarIE = () => {
        console.log('handleAgregarIE - tarea:', tarea);
        
        if (!tarea) {
            setMensajeError('Error: No se encontró la tarea');
            setMostrarError(true);
            return;
        }
        
        // Guarda la tarea en sessionStorage para pasarla a la siguiente pantalla
        sessionStorage.setItem('tareaActual', JSON.stringify(tarea));
        console.log('Tarea guardada en sessionStorage:', JSON.stringify(tarea));
        
        // Guarda el estado de que el modal estaba abierto
        sessionStorage.setItem('modalFinalizarAbierto', 'true');
        
        // Navega a la nueva pantalla con el nroTarea como parámetro
        console.log('Navegando a:', `/finalizar-tarea/agregar-ie/${tarea.nroTarea}`);
        navigate(`/finalizar-tarea/agregar-ie/${tarea.nroTarea}`);

    };

    const handleFinalizarTarea = async () => {
        try {
            setCargando(true);
            setMensajeError(null);
            
            // Mapear las transacciones para enviar solo los campos que el backend necesita
            const movimientosParaBackend = transaccionesTemporales.map(t => ({
                tipoTransaccion: t.tipoTransaccion,
                categoria: t.categoria,
                monto: t.monto,
                descripcion: t.descripcion || '',
                moneda: t.moneda
            }));

            const bodyData = {
                nroTarea: tarea.nroTarea,
                movimientosARegistrar: movimientosParaBackend
            };

            const response = await fetch(`/api/reservas/finalizarTarea`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            })

            const result = await response.json();
            console.log('Respuesta del backend:', result);

            if (response.ok) {
                setMensajeExito('Tarea finalizada con éxito');
                setMostrarExito(true);
                // Limpiar las transacciones temporales del sessionStorage
                sessionStorage.removeItem('transaccionesTemporales');
                sessionStorage.removeItem('tareaActual');
                sessionStorage.removeItem('modalFinalizarAbierto');
                // Cerrar el modal después de 2 segundos
                setTimeout(() => {
                    onClose ? onClose() : null;
                    window.location.reload();
                }, 2000);
            } else {
                console.error('Error del backend:', result);
                const errorMsg = result.mensaje || result.message || 'Error desconocido al finalizar la tarea';
                setMensajeError(errorMsg);
                setMostrarError(true);
            }
            
        } catch (error) {
            console.error('Error al finalizar tarea:', error);
            const errorMsg = error instanceof Error ? error.message : 'Error de conexión. Intenta nuevamente.';
            setMensajeError(errorMsg);
            setMostrarError(true);
        } finally {
            setCargando(false);
        }
    };


    return (
        <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        showCloseButton={showCloseButton}
        >
            <div id='contenedorContenidoModal'>
                {/* Sección de éxito */}
                {mostrarExito && mensajeExito && (
                    <section id='seccionExito'>
                        <div className='contenedor-alerta-exito'>
                            <p className='titulo-exito'>✅ Éxito</p>
                            <p className='mensaje-exito'>{mensajeExito}</p>
                            <p className='subtitulo-exito'>El modal se cerrará automáticamente...</p>
                        </div>
                    </section>
                )}

                {/* Sección de error */}
                {mostrarError && mensajeError && (
                    <section id='seccionError'>
                        <div className='contenedor-alerta-error'>
                            <p className='titulo-error'>⚠️ Error</p>
                            <p className='mensaje-error'>{mensajeError}</p>
                            <button 
                                className='boton-cerrar-error'
                                onClick={() => {
                                    setMostrarError(false);
                                    setMensajeError(null);
                                }}
                            >
                                ✕ Cerrar
                            </button>
                        </div>
                    </section>
                )}

                <section id='seccionDetallesTarea'>
                    <p id='tituloDetallesTarea'>Detalles de la tarea:</p>
                    <p className='detallesTareaTexto'>Ubicación: {tarea.ubicacionTarea}</p>
                    <p className='detallesTareaTexto'>
                        Fecha y hora: {new Date(tarea.fechaYHoraTarea).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </section>

                {/* Mostrar transacciones temporales */}
                {transaccionesTemporales.length > 0 && (
                    <section id='seccionTransaccionesTemporales'>
                        <h4>Transacciones a registrar:</h4>
                        <div className="lista-transacciones-modal">
                            {transaccionesTemporales.map((transaccion, index) => (
                                <div key={index} className="transaccion-item-modal">
                                    <span className="tipo-monto">
                                        {transaccion.tipoTransaccion}: ${transaccion.monto}
                                    </span>
                                    <span className="categoria">{transaccion.categoria}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section id='contenedorBotones'>
                    <Button
                    label='Agregar Ingreso Egreso'
                    icon={<IoMdAddCircleOutline/>}
                    onClick={handleAgregarIE}
                    id='botonAgregarIngreso'
                    disabled={cargando}
                    />

                    <Button
                    label={cargando ? 'Finalizando...' : 'Finalizar Tarea'}
                    icon={<FaRegCheckCircle />}
                    onClick={handleFinalizarTarea}
                    id='botonFinalizarTarea'
                    disabled={cargando}
                    />
                </section>

            </div>
        </Modal>
    )
}