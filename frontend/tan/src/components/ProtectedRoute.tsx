import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import useUserRoles from '../hooks/useUserRoles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // any of these roles
  only?: 'EMPLEADO' | 'CLIENTE';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, only }) => {
  // Primero verificar token simple
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = useUserRoles();

  if (loading) return null; // o spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (only && user.tipoUsuario !== only) {
    // No es el tipo de usuario correcto
    // Evitar redirect si ya estamos en la página home
    if (location.pathname !== '/') return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAny = allowedRoles.some(r => user.roles?.some(ur => ur === r || ur === `ROLE_${r}`));
    if (!hasAny) {
      // Evitar redirect infinito
      if (location.pathname !== '/') return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;