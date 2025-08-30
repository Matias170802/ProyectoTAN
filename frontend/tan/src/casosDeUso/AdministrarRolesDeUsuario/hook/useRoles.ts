// Hook para manejar la lógica de roles de usuario
import { useState, useEffect } from 'react';
import { getRolesEmpleado, getRolesDisponibles, asignarRoles, desasignarRoles, getEmpleadosConRoles } from '../serviceAdministrarRolesDeUsuario';

export const useRoles = () => {
  const [empleados, setEmpleados] = useState<any[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<any | null>(null);
  const [rolesEmpleado, setRolesEmpleado] = useState<any[]>([]);
  const [rolesDisponibles, setRolesDisponibles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      try {
        const empleadosData = await getEmpleadosConRoles();
        setEmpleados(empleadosData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar empleados');
      } finally {
        setLoading(false);
      }
    };
    fetchEmpleados();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!selectedEmpleado) return;
      setLoading(true);
      try {
        const [rolesEmp, rolesDisp] = await Promise.all([
          getRolesEmpleado(selectedEmpleado.codEmpleado),
          getRolesDisponibles()
        ]);
        setRolesEmpleado(rolesEmp);
        setRolesDisponibles(rolesDisp);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar roles');
      } finally {
        setLoading(false);
      }
    };
    if (selectedEmpleado) fetchRoles();
  }, [selectedEmpleado]);

  const handleSelectEmpleado = (empleado: any) => {
    setSelectedEmpleado(empleado);
  };

  const handleAsignarRoles = async (roles: any[]) => {
    if (!selectedEmpleado) return;
    await asignarRoles(roles);
    const updated = await getRolesEmpleado(selectedEmpleado.codEmpleado);
    setRolesEmpleado(updated);
  };

  const handleDesasignarRoles = async (roles: any[]) => {
    if (!selectedEmpleado) return;
    await desasignarRoles(roles);
    const updated = await getRolesEmpleado(selectedEmpleado.codEmpleado);
    setRolesEmpleado(updated);
  };

  return {
    empleados,
    selectedEmpleado,
    handleSelectEmpleado,
    rolesEmpleado,
    rolesDisponibles,
    loading,
    error,
    handleAsignarRoles,
    handleDesasignarRoles
  };
};
