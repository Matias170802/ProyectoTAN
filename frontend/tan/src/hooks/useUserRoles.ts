import { useMemo } from 'react';
import { useUserContext } from '../context/UserContext';

export function useUserRoles() {
  const { user, loading, error, refresh, logout } = useUserContext();

  const isEmpleado = useMemo(() => user?.tipoUsuario === 'EMPLEADO', [user]);
  const isCliente = useMemo(() => user?.tipoUsuario === 'CLIENTE', [user]);

  function hasRole(role: string) {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  return {
    user,
    loading,
    error,
    refresh,
    logout,
    isEmpleado,
    isCliente,
    hasRole,
  };
}

export default useUserRoles;
