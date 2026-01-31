import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useUserContext } from '../context/UserContext';
import { canAccessRoute } from '../constants/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Rol específico requerido (opcional)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const location = useLocation();
  const { user, loading } = useUserContext();

  // Mostrar nada mientras se carga el usuario
  if (loading) {
    return null;
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario es cliente puro, solo puede acceder a rutas del cliente
  if (user.esCliente && !user.esEmpleado) {
    // Permitir solo rutas permitidas para clientes
    const clienteRoutes = ['/cliente', '/perfil', '/micaja'];
    if (!clienteRoutes.includes(location.pathname)) {
      return <Navigate to="/cliente" replace />;
    }
  }

  // Verificar acceso a la ruta según los roles (solo para empleados)
  if (user.esEmpleado && !canAccessRoute(user.roles, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // Verificar rol específico si se proporciona
  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;