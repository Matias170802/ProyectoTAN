// Utilidades para manejar autenticación

export const getAccessToken = (): string | null => {
  return sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
};

export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem('refresh_token') || localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken: string, refreshToken: string, remember: boolean = false) => {
  if (remember) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  } else {
    sessionStorage.setItem('access_token', accessToken);
    sessionStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearTokens = () => {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

export const logout = () => {
  clearTokens();
  window.location.href = '/login';
};