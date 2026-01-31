"use client"
import './Inicio.css'
import {Button, Modal} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { GoInfo } from "react-icons/go";
import { FaRegCheckCircle } from "react-icons/fa";
import { ModalFinalizarTarea } from './casosDeUso/FinalizarTarea/components/index';
import { useInicio } from './useInicio'



//*Componente principal de la aplicacion!
function AppContent() {
  
  const {tareas,  isLoadingTareas, errorTareas} = useInicio();
  const [verDetalles, setVerDetalles] = useState<number | null>(null);
  const [finalizarTareaSeleccionada, setFinalizarTareaSeleccionada] = useState<number | null>(null);
  const location = useLocation();

  console.log("Tareas asignadas:", tareas);
  // Efecto para manejar el regreso desde agregar IE
    useEffect(() => {
    if (location.state?.volviendoDeAgregarIE && location.state?.abrirModalFinalizar) {
        // Buscar el nroTarea de la tarea que se estaba finalizando
        const tareaRegreso = location.state.tareaSeleccionada;
        const tareaEncontrada = tareas?.find(t => 
            t.nombreTarea === tareaRegreso.nombreTarea && 
            t.fechaYHoraTarea === tareaRegreso.fechaYHoraTarea // Cambiado de fechaTarea
        );
        
        if (tareaEncontrada) {
            setFinalizarTareaSeleccionada(tareaEncontrada.nroTarea);
        }
        
        // Limpiar el estado para evitar que se ejecute de nuevo
        window.history.replaceState({}, document.title);
    }
}, [location.state, tareas]);

  return (
    <main className="min-h-screen bg-gray-100" id='mainPageInicio'>
      
      <p className='titulo'>Panel de Control</p>

      <section id='contenedorPrincipalTareasAsignadas'>

        <p id='tituloTareasAsignadas'>Tareas Asignadas</p>

        <div id='contenedorItemsTareasAsignadas'>

          {tareas && tareas.length >0 && !isLoadingTareas && (
            tareas.map((tarea) => (
              <section key={tarea.nroTarea} className='itemTareaAsignada'>

                <span className={`etiquetaTipoTarea ${
                  tarea.tipoTarea.toLowerCase() === 'check-in' ? 'etiqueta-checkin' : 
                  tarea.tipoTarea.toLowerCase() === 'check-out' ? 'etiqueta-checkout' : ''
                }`}>
                  {tarea.tipoTarea}
                </span>

                <div id='contenedorDetallesTareaAsignada'>
                  <p id='nombreTareaAsignada'>{tarea.nombreTarea}</p>
                  <p className='detalleTareaAsignada'>Fecha y Hora: {new Date(tarea.fechaYHoraTarea).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: '2-digit', 
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className='detalleTareaAsignada'>Ubicación: {tarea.ubicacionTarea}</p>
                </div>

                <div id='contenedorBotonesTareaAsignada'>
                  <Button
                  label='Detalles'
                  onClick={()=> setVerDetalles(verDetalles === tarea.nroTarea ? null : tarea.nroTarea)}
                  icon={<GoInfo />}
                  id='botonDetallesTarea'
                  />

                  <Button
                  label='Finalizar Tarea'
                  icon={<FaRegCheckCircle />}
                  id='botonFinalizaTarea'
                  onClick={()=>{setFinalizarTareaSeleccionada(tarea.nroTarea)}}
                  />
                </div>

                {verDetalles===tarea.nroTarea && (
                  <Modal
                  isOpen={verDetalles === tarea.nroTarea ? true : false}
                  title={tarea.nombreTarea}
                  showCloseButton={true}
                  onClose={() => {setVerDetalles(null)}}
                  >
                    <div className="contenido-modal-detalles">

                      {/* Ubicación */}
                      <div className="detalle-item">
                        <div className="detalle-icono-titulo">
                          <span className="icono-ubicacion">📍</span>
                          <span className="titulo-detalle">Ubicación</span>
                        </div>
                        <p className="valor-detalle">{tarea.ubicacionTarea}</p>
                      </div>

                      {/* Fecha */}
                      <div className="detalle-item">
                        <div className="detalle-icono-titulo">
                          <span className="icono-fecha">📅</span>
                          <span className="titulo-detalle">Fecha</span>
                        </div>
                        <p className="valor-detalle">
                          {new Date(tarea.fechaYHoraTarea).toLocaleDateString('es-AR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Descripción */}
                      <div className="detalle-item">
                        <div className="detalle-icono-titulo">
                          <span className="icono-descripcion">📝</span>
                          <span className="titulo-detalle">Descripción</span>
                        </div>
                        <p className="valor-detalle">
                          {tarea.descripcionTarea}
                        </p>
                      </div>
                    </div>

                  </Modal>
              
                )}

                {finalizarTareaSeleccionada === tarea.nroTarea && (
                  <ModalFinalizarTarea
                  isOpen={finalizarTareaSeleccionada === tarea.nroTarea ? true : false}
                  onClose={() => setFinalizarTareaSeleccionada(null)}
                  title={"Finalizar tarea: " + tarea.nombreTarea}
                  tarea={tarea}
                  showCloseButton={true}
                  />
                )}
              </section>
            ))
          )}

          {isLoadingTareas && (
              <div className="textoLoading">
                  <span>🔄</span> Cargando tareas asignadas...
              </div>
          )}

          {!isLoadingTareas && (!tareas || tareas.length === 0) && !errorTareas && (
              <p id='textoSinTareas'>
                  No hay tareas asignadas en este momento
              </p>
          )}

          {errorTareas && (
              <div className="textoError">
                  Error al cargar las tareas: {errorTareas.message}
              </div>
          )}
        </div>
      </section>
      
      
    </main>
  )
}

//*Componente que envuelve la aplicacion con el proveedor de contexto
function Inicio(){
  return (
    <AppProvider>
      <AppContent/>
    </AppProvider>
  )
}

export default Inicio

