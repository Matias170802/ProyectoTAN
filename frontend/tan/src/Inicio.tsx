"use client"
import './Inicio.css'
import {Modal, Button} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
import { useState } from 'react'


//*Componente principal de la aplicacion
function AppContent() {
  
  const [openModal, setOpenModal] = useState(false);
  return (
    <main className="min-h-screen bg-gray-100">
      <Button label="Abrir modal" onClick={() => setOpenModal(true)} /> 
      
      {openModal && (
        <Modal
        isOpen={true}
        onClose={() => setOpenModal(false)}
        children={<div>Contenido del modal
          
        </div>}
        ></Modal>
      )}
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

