import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useUserRoles from '../hooks/useUserRoles';

const Layout: React.FC = () => {
  const { user, loading } = useUserRoles();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    // Si es cliente y no está en rutas de cliente, redirigir
    if (user.tipoUsuario === 'CLIENTE' && !location.pathname.startsWith('/cliente')) {
      navigate('/cliente', { replace: true });
    }

    // Si es empleado y está en ruta /cliente, redirigir al home
    if (user.tipoUsuario === 'EMPLEADO' && location.pathname.startsWith('/cliente')) {
      navigate('/', { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <div id="app-layout">
      <Outlet />
    </div>
  );
}

export default Layout;
