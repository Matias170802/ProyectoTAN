import {type PropsFinalizarTarea} from './ModalFinalizarTareaTypes';
import {Modal, Button} from '../../../../generalComponents/index';
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";
import './ModalFinalizarTarea.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useIngresoEgresoCaja } from '../../../RegistrarIngresoEgresoCaja/hooks/useIngresoEgresoCaja';
import {type Transaccion} from './../FormFinalizarTareaAgregarIE/FormFinalizarTareaAgregarIETypes'

export const ModalFinalizarTarea: React.FC<PropsFinalizarTarea> = ({isOpen, onClose, title, description, tarea, showCloseButton}) => {

    const navigate = useNavigate();
    const [transaccionesTemporales, setTransaccionesTemporales] = useState<[Transaccion] | []>([]);
    const {registrarIngresoEgresoCaja} = useIngresoEgresoCaja(); 


    // Cargar transacciones temporales cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            const transacciones = sessionStorage.getItem('transaccionesTemporales');
            if (transacciones) {
                setTransaccionesTemporales(JSON.parse(transacciones));
            }
        }
    }, [isOpen]);

    const handleAgregarIE = () => {
        // Guarda la tarea en sessionStorage para pasarla a la siguiente pantalla
        sessionStorage.setItem('tareaActual', JSON.stringify(tarea));
        
        // Navega a la nueva pantalla
        navigate('/finalizar-tarea/agregar-ie/1');
        
        // Cierra el modal
        if (onClose){
            onClose();
        }
    };

    const handleFinalizarTarea = async () => {
        try {
            // 1. Registrar todas las transacciones temporales en el backend
            for (const transaccion of transaccionesTemporales) {
                await registrarIngresoEgresoCaja(transaccion);
            }

            // 2. Limpiar sessionStorage
            sessionStorage.removeItem('transaccionesTemporales');
            sessionStorage.removeItem('tareaActual');

            // 3. Aquí puedes agregar la lógica para finalizar la tarea
            console.log('Tarea finalizada con éxito');
            
            // 4. Cerrar modal
            onClose?.();
            
            // 5. Opcional: Mostrar mensaje de éxito
            alert('Tarea finalizada con éxito');
            
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
                    <p className='detallesTareaTexto'>Fecha y hora: {tarea.fechaTarea}, {tarea.horaTarea}</p>
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