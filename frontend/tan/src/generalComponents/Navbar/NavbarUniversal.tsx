import React from 'react';
import useUserRoles from '../../hooks/useUserRoles';
import NavbarEmpleado from './NavbarEmpleado';
import NavbarCliente from './NavbarCliente';

const NavbarUniversal: React.FC = () => {
  const { user, loading } = useUserRoles();

  if (loading) return null;

  if (!user) return null;

  if (user.tipoUsuario === 'CLIENTE') return <NavbarCliente />;

  // Default to empleado navbar
  return <NavbarEmpleado />;
}

export default NavbarUniversal;
