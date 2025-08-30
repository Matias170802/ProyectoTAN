export const getEmpleadosConRoles = async () => {
  const res = await axios.get(`${API_URL}/empleados`);
  return res.data;
};
// Servicio para consumir los endpoints de administración de roles de usuarios
import axios from 'axios';

const API_URL = '/api/administrador';

export const getRolesEmpleado = async (codEmpleado: string) => {
  const res = await axios.get(`${API_URL}/empleado/${codEmpleado}`);
  return res.data;
};

export const getRolesDisponibles = async () => {
  const res = await axios.get(`${API_URL}/administrar-roles`);
  return res.data;
};

export const asignarRoles = async (rolesAsignados: any[]) => {
  const res = await axios.post(`${API_URL}/asignar`, rolesAsignados);
  return res.data;
};

export const desasignarRoles = async (rolesDesasignados: any[]) => {
  const res = await axios.post(`${API_URL}/desasignar`, rolesDesasignados);
  return res.data;
};
