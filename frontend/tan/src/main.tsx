import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from './Inicio.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MainPageAdministrador, MainPageCliente, MainPageFinanzas, MainPageMiCaja, MainPagePerfil, MainPageReservas, MainPageRegistrarIngresoEgresoCaja} from './routes/index.ts'
import AdministrarRolesDeUsuarioPage from './casosDeUso/AdministrarRolesDeUsuario/pages/AdministrarRolesDeUsuarioPage';
import { Navbar } from './generalComponents/index.ts';
import { FormFinalizarTareaAgregarIE } from './casosDeUso/FinalizarTarea/components/FormFinalizarTareaAgregarIE/FormFinalizarTareaAregarIE.tsx';

import LoginPage from './routes/login/LoginPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar/>
      <Routes>
         {/* Ruta pública de login */}
        <Route path="/login" element={<LoginPage/>}/>

        {/* Todas las demás rutas deberian estar protegidas */}
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
