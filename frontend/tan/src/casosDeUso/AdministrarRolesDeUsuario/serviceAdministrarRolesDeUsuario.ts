import axios from 'axios';

const API_URL = '/api/administrador';

export const getEmpleadosConRoles = async () => {
  const res = await axios.get(`${API_URL}/empleados`);
  return res.data;
};

export const getRolesAsignadosEmpleado = async (codEmpleado: string) => {
  const res = await axios.get(`${API_URL}/roles-asignados-empleado/${codEmpleado}`);
  return res.data;
};

export const getRolesDisponiblesParaAsignar = async (codEmpleado: string) => {
  const res = await axios.get(`${API_URL}/roles-a-asignar-empleado/${codEmpleado}`);
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
