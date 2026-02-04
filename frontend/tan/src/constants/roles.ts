/**
 * Mapeo de códigos de roles del backend a nombres canónicos del frontend
 * Se usa para estandarizar los roles en toda la aplicación
 */

export const ROLE_CODE_MAP: Record<string, string> = {
  'ROL001': 'FINANZAS',        // Administrador Financiero
  'ROL002': 'GERENCIA',        // Gerencia
  'ROL003': 'EMPLEADO',        // Empleado
  'ROL004': 'RESERVAS',        // Administrador de Reservas
  'ROL005': 'ADMIN_SISTEMA'    // Administrador del Sistema
};

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  'ROL001': 'Administrador Financiero',
  'ROL002': 'Gerencia',
  'ROL003': 'Empleado',
  'ROL004': 'Administrador de Reservas',
  'ROL005': 'Administrador del Sistema'
};

/**
 * Mapeo de roles a rutas a las que pueden acceder
 */
export const ROLE_ROUTE_MAP: Record<string, string[]> = {
  'FINANZAS': ['/finanzas', '/reportes'],
  'GERENCIA': ['/gerencia', '/reportes'],
  'EMPLEADO': ['/registrarIngresoEgresoCaja', '/perfil', '/micaja', '/', '/finalizar-tarea/agregar-ie'],
  'RESERVAS': ['/reservas'],
  'ADMIN_SISTEMA': ['/admin', '/admin/roles']
};

/**
 * Convierte códigos de rol del backend a nombres canónicos
 */
export function mapRoleCodesToNames(roleCodes: string[]): string[] {
  return roleCodes
    .map(code => ROLE_CODE_MAP[code] || code)
    .filter((role, index, self) => self.indexOf(role) === index); // remover duplicados
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica
 */
export function canAccessRoute(userRoles: string[], routePath: string): boolean {
  // Si el usuario no tiene roles (cliente), no puede acceder a rutas de empleado
  if (userRoles.length === 0) {
    return false;
  }

  // Verificar si alguno de los roles del usuario permite acceder a la ruta
  return userRoles.some(role => {
    const allowedRoutes = ROLE_ROUTE_MAP[role] || [];
    return allowedRoutes.some(allowedRoute => {
      return routePath === allowedRoute || routePath.startsWith(`${allowedRoute}/`);
    });
  });
}

/**
 * Obtiene todas las rutas a las que un usuario puede acceder
 */
export function getAccessibleRoutes(userRoles: string[]): string[] {
  const routes = new Set<string>();
  
  userRoles.forEach(role => {
    const allowedRoutes = ROLE_ROUTE_MAP[role] || [];
    allowedRoutes.forEach(route => routes.add(route));
  });

  return Array.from(routes);
}
