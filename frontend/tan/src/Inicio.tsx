"use client"
import './Inicio.css'
// import {Modal} from './generalComponents/index'
import { AppProvider } from './context/AppContext'
// import { useState } from 'react'


//*Componente principal de la aplicacion
function AppContent() {
  return (
    <main className="min-h-screen bg-gray-100">
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

