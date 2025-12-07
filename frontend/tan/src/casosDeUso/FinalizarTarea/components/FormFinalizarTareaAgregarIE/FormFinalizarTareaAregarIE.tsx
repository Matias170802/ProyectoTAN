import {type Tarea, type Transaccion} from './FormFinalizarTareaAgregarIETypes';
import './FormFinalizarTareaAgregarIE.css';
import {default as FormRegistrarIngresoEgresoCaja} from '../../../RegistrarIngresoEgresoCaja/components/FormRegistrarIngresoEgresoCaja/FormRegistrarIngresoEgresoCaja';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '../../../../generalComponents/index';
import { IoMdArrowRoundBack } from "react-icons/io";

export const FormFinalizarTareaAgregarIE: React.FC = () => {

    const navigate = useNavigate();
    const [tarea, setTarea] = useState<Tarea | null>(null);
    const [transacciones, setTransacciones] = useState<Transaccion[]>([]);

    useEffect(() => {
        // Recupera la tarea desde sessionStorage
        const tareaGuardada = sessionStorage.getItem('tareaActual');
        if (tareaGuardada) {
            setTarea(JSON.parse(tareaGuardada));
        } else {
            // Si no hay tarea, regresa al inicio
            navigate('/');
        }

        const transaccionesGuardadas = sessionStorage.getItem('transaccionesTemporales');
        if (transaccionesGuardadas) {
            setTransacciones(JSON.parse(transaccionesGuardadas));
        }

    }, [navigate]);

    // Función para manejar cuando se agrega una nueva transacción
    const handleNuevaTransaccion = (datosTransaccion: any) => {
        const nuevaTransaccion: Transaccion = {
        id: crypto.randomUUID(),
        tipoTransaccion: datosTransaccion.tipoTransaccion,
        categoria: datosTransaccion.categoria,
        monto: datosTransaccion.monto,
        descripcion: datosTransaccion.descripcion,
        moneda: datosTransaccion.moneda,
        fechaCreacion: new Date()
    };

        // Actualiza el estado local
        const transaccionesActualizadas = [...transacciones, nuevaTransaccion];
        setTransacciones(transaccionesActualizadas);

        // Guarda en sessionStorage para persistencia
        sessionStorage.setItem('transaccionesTemporales', JSON.stringify(transaccionesActualizadas));

        // Dispara evento personalizado para notificar cambios
        window.dispatchEvent(new Event('transaccionesActualizadas'));

        console.log('Nueva transacción agregada:', nuevaTransaccion);
    };

    // Función para eliminar una transacción
    const handleEliminarTransaccion = (id: string) => {
        const transaccionesFiltradas = transacciones.filter(t => t.id !== id);
        setTransacciones(transaccionesFiltradas);
        sessionStorage.setItem('transaccionesTemporales', JSON.stringify(transaccionesFiltradas));
    };

    const handleVolver = () => {
        // Navegar de vuelta con estado que indica que venimos de agregar IE
        navigate('/', { 
            state: { 
                volviendoDeAgregarIE: true,
                abrirModalFinalizar: true,
                tareaSeleccionada: tarea 
            } 
        });
    };

    // Función para limpiar todas las transacciones
    const handleLimpiarTransacciones = () => {
        setTransacciones([]);
        sessionStorage.removeItem('transaccionesTemporales');
    };

    if (!tarea) return <div>Cargando...</div>

    return (
        <div id='pageAgregarIEFinalizarTarea'>
            {/* Header con navegación */}
            <header id='headerAgregarIE'>
                <Button
                    label='Volver'
                    icon={<IoMdArrowRoundBack />}
                    onClick={handleVolver}
                />
                <h1>Agregar Ingreso/Egreso</h1>
            </header>

            {/* Contenido principal */}
            <main id='mainPageAgregarIEFinalizarTarea'>
                <section id="contenedorDetallesTarea">
                    <h2>Detalles de la Tarea</h2>
                    <p id="descripcionTituloDetallesTarea">
                        Información sobre la tarea actual próxima a finalizar
                    </p>

                    <section id="contenedorContenidoTarea">
                        <p><strong>Tarea:</strong> {tarea.nombreTarea}</p>
                        <p><strong>Ubicación:</strong> {tarea.ubicacionTarea}</p>
                        <p><strong>Fecha y Hora:</strong> {tarea.fechaTarea}, {tarea.horaTarea}</p>
                        <p><strong>Descripción:</strong> Recibir huéspedes</p>
                    </section>

                    {/* Sección de transacciones registradas */}
                    <section id="contenedorNuevosIEAgregados">
                        <h2>Transacciones Registradas</h2>
                        <p>Transacciones ya agregadas para esta tarea</p>
                        
                        {transacciones.length > 0 ? (
                            <div className="lista-transacciones">
                                {transacciones.map((transaccion) => (
                                    <div key={transaccion.id} className="transaccion-item">
                                        <div className="transaccion-info">
                                            <span className="tipo-monto">
                                                {transaccion.tipoTransaccion}: ${transaccion.monto}
                                            </span>
                                            <span className="categoria">{transaccion.categoria}</span>
                                        </div>
                                        <button 
                                            className="btn-eliminar"
                                            onClick={() => handleEliminarTransaccion(transaccion.id)}
                                            title="Eliminar transacción"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Botón para limpiar todas */}
                                <button 
                                    className="btn-limpiar-todo"
                                    onClick={handleLimpiarTransacciones}
                                >
                                    Limpiar todas las transacciones
                                </button>
                            </div>
                        ) : (
                            <p className="sin-transacciones">
                                No hay transacciones registradas aún
                            </p>
                        )}
                    </section>
                </section>

                <section id="contenedroFormRegistrarIE">
                    <FormRegistrarIngresoEgresoCaja 
                        title='Nueva Transacción'
                        description='Agregar un nuevo ingreso o egreso'
                        onTransaccionAgregada={handleNuevaTransaccion}
                        modo='temporal'
                    />
                </section>
            </main>
        </div>
    );
}