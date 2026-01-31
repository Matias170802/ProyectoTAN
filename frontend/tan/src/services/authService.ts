import { mapRoleCodesToNames } from '../constants/roles';

export interface CurrentUser {
  email: string;
  nombre: string;
  codigo: string;
  tipoUsuario: 'EMPLEADO' | 'CLIENTE';
  roles: string[];
  esEmpleado: boolean;
  esCliente: boolean;
}

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getStoredToken(): string | null {
  return sessionStorage.getItem(ACCESS_KEY) || localStorage.getItem(ACCESS_KEY) || null;
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const token = getStoredToken();
  if (!token) throw new Error('Token no proporcionado');

  const r = await fetch('http://localhost:8080/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.error || body.message || 'Token inválido');
  }

  const data = await r.json();
  // Expected shape: { email, nombre, codigo, tipoUsuario, roles, esEmpleado, esCliente } 
  // where roles are role codes (e.g. ROL001)

  // Map role codes from backend to frontend canonical role names
  const mappedRoles: string[] = Array.isArray(data.roles)
    ? mapRoleCodesToNames(data.roles)
    : [];

  return {
    email: data.email,
    nombre: data.nombre,
    codigo: data.codigo,
    tipoUsuario: data.tipoUsuario,
    roles: mappedRoles,
    esEmpleado: data.esEmpleado ?? false,
    esCliente: data.esCliente ?? false,
  } as CurrentUser;
}

export async function changePassword(
  passwordActual: string,
  nuevaPassword: string,
  confirmarNuevaPassword: string
): Promise<{ mensaje: string; exito: boolean; tokens: { access_token: string; refresh_token: string } }> {
  const token = getStoredToken();
  if (!token) throw new Error('Token no proporcionado');

  const r = await fetch('/api/credenciales/cambiar-password', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      passwordActual,
      nuevaPassword,
      confirmarNuevaPassword
    })
  });

  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    const errorMessage = body.message || body.error || 'Error al cambiar contraseña';
    throw new Error(JSON.stringify({ message: errorMessage }));
  }

  return await r.json();
}

export async function changeEmail(
  nuevoEmail: string,
  passwordActual: string
): Promise<{ mensaje: string; exito: boolean; tokens: { access_token: string; refresh_token: string } }> {
  const token = getStoredToken();
  if (!token) throw new Error('Token no proporcionado');

  const r = await fetch('/api/credenciales/cambiar-email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nuevoEmail,
      passwordActual
    })
  });

  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    const errorMessage = body.message || body.error || 'Error al cambiar email';
    throw new Error(JSON.stringify({ message: errorMessage }));
  }

  return await r.json();
}

export default {
  getStoredToken,
  clearTokens,
  fetchCurrentUser,
  changePassword,
  changeEmail,
};