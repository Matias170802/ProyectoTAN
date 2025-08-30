"use client"
import './App.css'
import Navbar from './generalComponents/Navbar/Navbar'
import { AppProvider } from './context/AppContext'


//*Componente principal de la aplicacion
function AppContent() {
  return (
    <main className="min-h-screen bg-gray-100">
  <Navbar/>
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

