"use client"
import './Inicio.css'
import {Button} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState } from 'react'



//*Componente principal de la aplicacion
function AppContent() {
  
  const [openModal, setOpenModal] = useState(false);
  return (
    <main className="min-h-screen bg-gray-100">
      
      <Button label="Abrir modal" onClick={() => setOpenModal(true)} /> 
      
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

