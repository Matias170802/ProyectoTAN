import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from './Inicio.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MainPageAdministrador, MainPageCliente, MainPageFinanzas, MainPageMiCaja, MainPagePerfil, MainPageReservas, MainPageRegistrarIngresoEgresoCaja} from './routes/index.ts'
import AdministrarRolesDeUsuarioPage from './casosDeUso/AdministrarRolesDeUsuario/pages/AdministrarRolesDeUsuarioPage';
import { Navbar } from './generalComponents/index.ts';
import { FormFinalizarTareaAgregarIE } from './casosDeUso/FinalizarTarea/components/FormFinalizarTareaAgregarIE/FormFinalizarTareaAregarIE.tsx';

<<<<<<< HEAD
=======
import LoginPage from './routes/login/LoginPage.tsx';
>>>>>>> 351db2d96a8aeee2f824b73e725c5446b85fe889

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/admin" element={<MainPageAdministrador/>}/>
        <Route path="/admin/roles" element={<AdministrarRolesDeUsuarioPage/>}/>
        <Route path="/cliente" element={<MainPageCliente/>}/>
        <Route path="/finanzas" element={<MainPageFinanzas/>}/>
        <Route path="/micaja" element={<MainPageMiCaja/>}/>
        <Route path="/perfil" element={<MainPagePerfil/>}/>
        <Route path="/reservas" element={<MainPageReservas/>}/>
        <Route path="/registrarIngresoEgresoCaja" element={<MainPageRegistrarIngresoEgresoCaja/>}/>
        <Route path="/finalizar-tarea/agregar-ie/:tareaId" element={<FormFinalizarTareaAgregarIE />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
