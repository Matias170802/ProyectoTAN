# Sistema de Roles y Control de Acceso

## Descripción General

El sistema implementa control de acceso basado en roles (RBAC) para empleados del sistema. Los clientes tienen un acceso limitado y se implementarán en futuros sprints.

## Mapeo de Roles

El backend retorna códigos de rol (`ROL001`, `ROL002`, etc.) que se mapean a nombres canónicos en el frontend:

| Código Backend | Nombre Frontend | Descripción |
|---|---|---|
| `ROL001` | `FINANZAS` | Administrador Financiero |
| `ROL002` | `GERENCIA` | Gerencia |
| `ROL003` | `EMPLEADO` | Empleado |
| `ROL004` | `RESERVAS` | Administrador de Reservas |
| `ROL005` | `ADMIN_SISTEMA` | Administrador del Sistema |

## Acceso a Rutas por Rol

### FINANZAS (ROL001)
- `/finanzas`

### GERENCIA (ROL002)
- `/gerencia`

### EMPLEADO (ROL003)
- `/` (Inicio)
- `/reportes`
- `/registrarIngresoEgresoCaja`
- `/perfil`
- `/micaja`

### RESERVAS (ROL004)
- `/reservas`

### ADMIN_SISTEMA (ROL005)
- `/admin`
- `/admin/roles`

## Flujo de Autenticación

1. **Login**: El usuario envía credenciales a `/auth/login` y recibe `access_token` y `refresh_token`
2. **Obtener datos de usuario**: Se llama a `/auth/me` con el token en el header `Authorization: Bearer <token>`
3. **Mapeo de roles**: Los códigos de rol se convierten a nombres canónicos
4. **Guardado en contexto**: Los datos del usuario se guardan en `UserContext`
5. **Renderizado de navbar**: El navbar muestra solo las opciones para las que el usuario tiene permisos

## Respuesta del endpoint /auth/me

### Para Empleados
```json
{
  "email": "mauricio@gmail.com",
  "nombre": "Mauricio",
  "codigo": "EMPL-001",
  "tipoUsuario": "EMPLEADO",
  "roles": ["ROL001", "ROL002", "ROL003"],
  "esEmpleado": true,
  "esCliente": false
}
```

### Para Clientes
```json
{
  "email": "cliente.demo@gmail.com",
  "nombre": "Cliente Demo",
  "codigo": "CLI007",
  "tipoUsuario": "CLIENTE",
  "roles": [],
  "esEmpleado": false,
  "esCliente": true
}
```

## Protección de Rutas

El componente `ProtectedRoute` valida:
1. Si el usuario está autenticado
2. Si el usuario es empleado (no cliente)
3. Si el usuario tiene acceso a la ruta actual según sus roles

Si no cumple, redirige a `/login` (sin autenticación) o `/` (sin permisos).

## Uso en Componentes

### Verificar acceso del usuario actual
```tsx
import { useUserContext } from '../context/UserContext';
import { canAccessRoute } from '../constants/roles';

const MyComponent = () => {
  const { user } = useUserContext();
  const canAccess = canAccessRoute(user?.roles || [], '/finanzas');
  
  return canAccess ? <div>Contenido protegido</div> : null;
};
```

### Obtener todas las rutas accesibles
```tsx
import { getAccessibleRoutes } from '../constants/roles';

const routes = getAccessibleRoutes(user?.roles || []);
```

## Archivos Modificados

- **[src/constants/roles.ts](src/constants/roles.ts)**: Definición del mapeo de roles y funciones de autorización
- **[src/services/authService.ts](src/services/authService.ts)**: Mapeo automático de códigos de rol a nombres canónicos
- **[src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx)**: Validación de acceso por ruta
- **[src/generalComponents/Navbar/Navbar.tsx](src/generalComponents/Navbar/Navbar.tsx)**: Renderizado condicional según roles

## Próximas Implementaciones

- Ruta `/cliente` para acceso de clientes
- Componentes específicos para clientes
- Posible actualización dinámica de permisos sin recargar la página
