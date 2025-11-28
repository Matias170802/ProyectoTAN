"use client"
import './Inicio.css'
import {Button, Modal} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState } from 'react'
import { GoInfo } from "react-icons/go";
import { FaRegCheckCircle } from "react-icons/fa";
import { ModalFinalizarTarea } from './casosDeUso/FinalizarTarea/components/ModalFinalizarTarea/ModalFinalizarTarea';



//*Componente principal de la aplicacion
function AppContent() {
  //TODO: traer las tareas con el useStateInicio o al AppContext
  const [] = useState();
  const tareas = [
    {
      nombreTarea: "Check-in: Apartamento Centro",
      fechaTarea: "15/04/25",
      horaTarea: "14:00", 
      ubicacionTarea: "Apartamento Centro, Calle Principal 123",
      tipoTarea: "Check-in"
    },
    {
      nombreTarea: "Check-out: Casa de Playa",
      fechaTarea: "16/4/2025",
      horaTarea: "10:00", 
      ubicacionTarea: "Casa de Playa, Av. Costanera 456",
      tipoTarea: "Check-out"
    }
  ]
  const [verDetalles, setVerDetalles] = useState<number | null>(null);
  const [finalizarTareaSeleccionada, setFinalizarTareaSeleccionada] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-gray-100" id='mainPageInicio'>
      
      <p className='titulo'>Panel de Control</p>

      <section id='contenedorPrincipalTareasAsignadas'>

        <p id='tituloTareasAsignadas'>Tareas Asignadas</p>

        <div id='contenedorItemsTareasAsignadas'>
          {//TODO: logica de que por cada tarea crear un nuevo item en la lista de tareas     
          }

          {tareas && tareas.length >0 && (
            tareas.map((tarea,index) => (
              <section key={index} className='itemTareaAsignada'>

                <span className={`etiquetaTipoTarea ${
                  tarea.tipoTarea.toLowerCase() === 'check-in' ? 'etiqueta-checkin' : 
                  tarea.tipoTarea.toLowerCase() === 'check-out' ? 'etiqueta-checkout' : ''
                }`}>
                  {tarea.tipoTarea}
                </span>

                <div id='contenedorDetallesTareaAsignada'>
                  <p id='nombreTareaAsignada'>{tarea.nombreTarea}</p>
                  <p className='detalleTareaAsignada'>Fecha: {tarea.fechaTarea} - Hora: {tarea.horaTarea}</p>
                  <p className='detalleTareaAsignada'>Ubicación: {tarea.ubicacionTarea}</p>
                </div>

                <div id='contenedorBotonesTareaAsignada'>
                  <Button
                  label='Detalles'
                  onClick={()=> setVerDetalles(verDetalles === index ? null : index)}
                  icon={<GoInfo />}
                  id='botonDetallesTarea'
                  />

                  <Button
                  label='Finalizar Tarea'
                  icon={<FaRegCheckCircle />}
                  id='botonFinalizaTarea'
                  onClick={()=>{setFinalizarTareaSeleccionada(index)}}
                  />
                </div>

                {verDetalles===index && (
                  <Modal
                  isOpen={verDetalles === index ? true : false}
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
                        <p className="valor-detalle">{tarea.fechaTarea}</p>
                      </div>

                      {/* Hora */}
                      <div className="detalle-item">
                        <div className="detalle-icono-titulo">
                          <span className="icono-hora">🕐</span>
                          <span className="titulo-detalle">Hora</span>
                        </div>
                        <p className="valor-detalle">{tarea.horaTarea}</p>
                      </div>

                      {/* Descripción */}
                      <div className="detalle-item">
                        <div className="detalle-icono-titulo">
                          <span className="icono-descripcion">📝</span>
                          <span className="titulo-detalle">Descripción</span>
                        </div>
                        <p className="valor-detalle">
                          {tarea.tipoTarea === 'Check-in' 
                            ? `Recibir a Juan Pérez y familia (2 adultos, 1 niño)` 
                            : `Despedir a los huéspedes y revisar el estado de la propiedad`
                          }
                        </p>
                      </div>
                    </div>

                  </Modal>
              
                )}

                {finalizarTareaSeleccionada === index && (
                  <ModalFinalizarTarea
                  isOpen={finalizarTareaSeleccionada === index ? true : false}
                  onClose={() => setFinalizarTareaSeleccionada(null)}
                  title={"Finalizar tarea: " + tarea.nombreTarea}
                  tarea={tarea}
                  showCloseButton={true}
                  />
                )}
              </section>
            ))
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

