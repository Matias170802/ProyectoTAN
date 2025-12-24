import { useMemo } from 'react';
import { useUserContext } from '../context/UserContext';

export function useUserRoles() {
  const { user, loading, error, refresh, logout } = useUserContext();

  const isEmpleado = useMemo(() => user?.tipoUsuario === 'EMPLEADO', [user]);
  const isCliente = useMemo(() => user?.tipoUsuario === 'CLIENTE', [user]);

  function normalize(role: string) {
    return role.replace(/^ROLE_/, '').toUpperCase();
  }

  function hasRole(role: string) {
    if (!user || !user.roles) return false;
    const norm = normalize(role);
    return user.roles.some(r => normalize(r) === norm);
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
