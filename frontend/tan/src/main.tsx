import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Inicio from './Inicio.tsx'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {MainPageAdministrador, MainPageCliente, MainPageFinanzas, MainPageMiCaja, MainPagePerfil, MainPageReservas, MainPageRegistrarIngresoEgresoCaja, MainPageGerencia, LoginPage} from './routes/index.ts'
import AdministrarRolesDeUsuarioPage from './casosDeUso/AdministrarRolesDeUsuario/pages/AdministrarRolesDeUsuarioPage';
import { NavbarUniversal } from './generalComponents/index.ts';
import { UserProvider } from './context/UserContext';
import { FormFinalizarTareaAgregarIE } from './casosDeUso/FinalizarTarea/components/FormFinalizarTareaAgregarIE/FormFinalizarTareaAregarIE.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function AppRouter() {
  const location = useLocation();
  // Ocultar la navbar en la ruta de login
  const hideNavbar = location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <NavbarUniversal />}
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/login" element={<LoginPage/>}/>

        {/* Rutas protegidas dentro del Layout */}
        <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Inicio/>} />
          <Route path="admin" element={<ProtectedRoute allowedRoles={["ADMIN_SISTEMA"]}><MainPageAdministrador/></ProtectedRoute>} />
          <Route path="admin/roles" element={<ProtectedRoute allowedRoles={["ADMIN_SISTEMA"]}><AdministrarRolesDeUsuarioPage/></ProtectedRoute>} />
          <Route path="cliente" element={<MainPageCliente/>} />
          <Route path="finanzas" element={<ProtectedRoute allowedRoles={["FINANZAS"]}><MainPageFinanzas/></ProtectedRoute>} />
          <Route path="gerencia" element={<ProtectedRoute allowedRoles={["GERENCIA"]}><MainPageGerencia/></ProtectedRoute>} />
          <Route path="micaja" element={<MainPageMiCaja/>} />
          <Route path="perfil" element={<MainPagePerfil/>} />
          <Route path="reservas" element={<ProtectedRoute allowedRoles={["RESERVAS"]}><MainPageReservas/></ProtectedRoute>} />
          <Route path="registrarIngresoEgresoCaja" element={<ProtectedRoute allowedRoles={["EMPLEADO"]}><MainPageRegistrarIngresoEgresoCaja/></ProtectedRoute>} />
          <Route path="finalizar-tarea/agregar-ie/:tareaId" element={<FormFinalizarTareaAgregarIE />} />
        </Route>
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AppRouter />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
