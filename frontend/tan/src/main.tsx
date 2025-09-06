import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Inicio from './Inicio.tsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MainPageAdministrador, MainPageCliente, MainPageFinanzas, MainPageMiCaja, MainPagePerfil, MainPageReservas} from './routes/index.ts';
import Navbar from './generalComponents/Navbar/Navbar';
import AdministrarRolesDeUsuarioPage from './casosDeUso/AdministrarRolesDeUsuario/pages/AdministrarRolesDeUsuarioPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/admin" element={<MainPageAdministrador/>}/>
        <Route path="/admin/roles" element={<AdministrarRolesDeUsuarioPage/>}/>
        <Route path="/cliente" element={<MainPageCliente/>}/>
        <Route path="/finanzas" element={<MainPageFinanzas/>}/>
        <Route path="/micaja" element={<MainPageMiCaja/>}/>
        <Route path="/perfil" element={<MainPagePerfil/>}/>
        <Route path="/reservas" element={<MainPageReservas/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
