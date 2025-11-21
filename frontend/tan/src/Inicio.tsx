"use client"
import './Inicio.css'
import {Button} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState } from 'react'



//*Componente principal de la aplicacion
function AppContent() {
  //TODO: traer las tareas con el useStateInicio o al AppContext
  const [] = useState();

  return (
    <main className="min-h-screen bg-gray-100" id='mainPageInicio'>
      
      <p className='titulo'>Panel de Control</p>

      <section id='contenedorPrincipalTareasAsignadas'>

        <p>Tareas Asignadas</p>

        <div id='contenedorSecundarioTareasAsignadas'>
          //TODO: logica de que por cada tarea crear un nuevo item en la lista de tareas
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

