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
    const {registrarIngresoEgresoCaja} = useIngresoEgresoCaja(); 
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

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
        // Guarda la tarea en sessionStorage para pasarla a la siguiente pantalla
        sessionStorage.setItem('tareaActual', JSON.stringify(tarea));
        
        // Guarda el estado de que el modal estaba abierto
        sessionStorage.setItem('modalFinalizarAbierto', 'true');
        
        // Navega a la nueva pantalla
        navigate('/finalizar-tarea/agregar-ie/1');
        
    };

    const handleFinalizarTarea = async () => {
        try {
            const response = await fetch(`/api/tareas/finalizar/${tarea.nroTarea}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tareaFinalizadaARegistrar: {
                        nroTarea: tarea.nroTarea,
                        movimientosARegistrar: transaccionesTemporales
                    }
                })
            })

            if (response.ok) {
                alert('Tarea finalizada con éxito');
            }
            
        } catch (error) {
            console.error('Error al finalizar tarea:', error);
            alert('Error al finalizar la tarea');
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
                <section id='seccionDetallesTarea'>
                    <p id='tituloDetallesTarea'>Detalles de la tarea:</p>
                    <p className='detallesTareaTexto'>Ubicación: {tarea.ubicacionTarea}</p>
                    <p className='detallesTareaTexto'>
                        Fecha y hora: {tarea.fechaYHoraTarea.toLocaleDateString('es-AR', {
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
                    />

                    <Button
                    label='Finalizar Tarea'
                    icon={<FaRegCheckCircle />}
                    onClick={handleFinalizarTarea}
                    id='botonFinalizarTarea'
                    />
                </section>

            </div>
        </Modal>
    )
}