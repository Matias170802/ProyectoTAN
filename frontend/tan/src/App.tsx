"use client"
import 'App.css'
import BarraSuperior from './generalComponents/componentesViejosDeGuia/BarraSuperior'
import { AppProvider } from './context/AppContext'


//*Componente principal de la aplicacion
function AppContent() {
  return (
    <main className="min-h-screen bg-gray-100">
      <BarraSuperior/>
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

