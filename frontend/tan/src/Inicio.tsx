"use client"
import './Inicio.css'
import {Button} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState } from 'react'



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
    }
  ]

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
              <div key={index} className='itemTareaAsignada'>
                <p className='nombreTareaAsignada'>{tarea.nombreTarea}</p>
                <p className='detalleTareaAsignada'>Fecha: {tarea.fechaTarea} - Hora: {tarea.horaTarea}</p>
                <p className='detalleTareaAsignada'>Ubicación: {tarea.ubicacionTarea}</p>
                <p className='detalleTareaAsignada'>Tipo de Tarea: {tarea.tipoTarea}</p>
              </div>
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

