import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from './Inicio.tsx'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {MainPageAdministrador, MainPageCliente, MainPageFinanzas, MainPageGerencia, MainPageMiCaja, MainPagePerfil, MainPageReservas, MainPageRegistrarIngresoEgresoCaja, MainPageReportes} from './routes/index.ts'
import AdministrarRolesDeUsuarioPage from './casosDeUso/AdministrarRolesDeUsuario/pages/AdministrarRolesDeUsuarioPage';
import { Navbar } from './generalComponents/index.ts';
import { FormFinalizarTareaAgregarIE } from './casosDeUso/FinalizarTarea/components/FormFinalizarTareaAgregarIE/FormFinalizarTareaAgregarIE.tsx';
import LoginPage from './routes/login/LoginPage.tsx';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

const NavbarWrapper = () => {
  const location = useLocation();
  // No mostrar navbar en la página de login
  if (location.pathname === '/login') {
    return null;
  }
  return <Navbar />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <NavbarWrapper />
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginPage/>}/>

          {/* Todas las demás rutas están protegidas */}
          <Route path="/" element={<ProtectedRoute><Inicio/></ProtectedRoute>}/>
          <Route path="/admin" element={<ProtectedRoute><MainPageAdministrador/></ProtectedRoute>}/>
          <Route path="/admin/roles" element={<ProtectedRoute><AdministrarRolesDeUsuarioPage/></ProtectedRoute>}/>
          <Route path="/cliente" element={<ProtectedRoute><MainPageCliente/></ProtectedRoute>}/>
          <Route path="/finanzas" element={<ProtectedRoute><MainPageFinanzas/></ProtectedRoute>}/>
          <Route path="/gerencia" element={<ProtectedRoute><MainPageGerencia/></ProtectedRoute>}/>
          <Route path="/micaja" element={<ProtectedRoute><MainPageMiCaja/></ProtectedRoute>}/>
          <Route path="/perfil" element={<ProtectedRoute><MainPagePerfil/></ProtectedRoute>}/>
          <Route path="/reservas" element={<ProtectedRoute><MainPageReservas/></ProtectedRoute>}/>
          <Route path="/reportes" element={<ProtectedRoute><MainPageReportes/></ProtectedRoute>}/>
          <Route path="/registrarIngresoEgresoCaja" element={<ProtectedRoute><MainPageRegistrarIngresoEgresoCaja/></ProtectedRoute>}/>
          <Route path="/finalizar-tarea/agregar-ie/:tareaId" element={<ProtectedRoute><FormFinalizarTareaAgregarIE /></ProtectedRoute>} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
