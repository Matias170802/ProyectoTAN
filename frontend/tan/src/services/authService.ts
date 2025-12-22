export interface CurrentUser {
  email: string;
  nombre: string;
  codigo: string;
  tipoUsuario: 'EMPLEADO' | 'CLIENTE';
  roles: string[];
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
  // Expected shape: { email, nombre, codigo, tipoUsuario, roles }
  return data as CurrentUser;
}

export default {
  getStoredToken,
  clearTokens,
  fetchCurrentUser,
};
