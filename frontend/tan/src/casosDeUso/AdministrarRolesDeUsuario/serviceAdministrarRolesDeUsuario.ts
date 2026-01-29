import axios from 'axios';

const API_URL = '/api/administrador';

export const getEmpleadosConRoles = async () => {

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const res = await axios.get(`${API_URL}/empleados`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log("Empleados data URL");
  console.log(res.data);
  return res.data;
};

export const getRolesAsignadosEmpleado = async (codEmpleado: string) => {

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const res = await axios.get(`${API_URL}/roles-asignados-empleado/${codEmpleado}`, {
    method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
  });

  return res.data;
};

export const getRolesDisponiblesParaAsignar = async (codEmpleado: string) => {

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const res = await axios.get(`${API_URL}/roles-a-asignar-empleado/${codEmpleado}`, {
    method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
  });
  return res.data;
};

export const asignarRoles = async (rolesAsignados: any[]) => {

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  
  const res = await axios.post(`${API_URL}/asignar`, rolesAsignados, {
    method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
  });
  return res.data;
};

export const desasignarRoles = async (rolesDesasignados: any[]) => {

  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

  const res = await axios.patch(`${API_URL}/desasignar`, rolesDesasignados, {
    method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
  });
  return res.data;
};
