# Credenciales del Sistema

## 📋 Tabla de Contenidos
- [Empleados](#empleados)
- [Cliente](#cliente)
- [Notas Importantes](#notas-importantes)

---

## 👥 Empleados

### 1. Admin Master (Súper Usuario - Todos los roles)
- **Email:** `admin.master@empresa.com`
- **Password:** `Master123!`
- **DNI:** `11111111`
- **Teléfono:** `2615000001`
- **Salario:** $500,000
- **Roles:**
    - ✅ Administrador Financiero (ROL001)
    - ✅ Gerencia (ROL002)
    - ✅ Empleado (ROL003)
    - ✅ Administrador de Reservas (ROL004)
    - ✅ Administrador del Sistema (ROL005)

---

### 2. Juan Perez (Solo Empleado)
- **Email:** `juan.perez@empresa.com`
- **Password:** `Juan123!`
- **DNI:** `22222222`
- **Teléfono:** `2615000002`
- **Salario:** $200,000
- **Roles:**
    - ✅ Empleado (ROL003)

---

### 3. Maria Garcia (Gerencia + Empleado)
- **Email:** `maria.garcia@empresa.com`
- **Password:** `Maria123!`
- **DNI:** `33333333`
- **Teléfono:** `2615000003`
- **Salario:** $400,000
- **Roles:**
    - ✅ Gerencia (ROL002)
    - ✅ Empleado (ROL003)

---

### 4. Carlos Rodriguez (Administrador Financiero + Empleado)
- **Email:** `carlos.rodriguez@empresa.com`
- **Password:** `Carlos123!`
- **DNI:** `44444444`
- **Teléfono:** `2615000004`
- **Salario:** $350,000
- **Roles:**
    - ✅ Administrador Financiero (ROL001)
    - ✅ Empleado (ROL003)

---

### 5. Laura Martinez (Administrador de Reservas + Empleado)
- **Email:** `laura.martinez@empresa.com`
- **Password:** `Laura123!`
- **DNI:** `55555555`
- **Teléfono:** `2615000005`
- **Salario:** $300,000
- **Roles:**
    - ✅ Administrador de Reservas (ROL004)
    - ✅ Empleado (ROL003)

---

### 6. Pedro Fernandez (Administrador del Sistema + Empleado)
- **Email:** `pedro.fernandez@empresa.com`
- **Password:** `Pedro123!`
- **DNI:** `66666666`
- **Teléfono:** `2615000006`
- **Salario:** $380,000
- **Roles:**
    - ✅ Administrador del Sistema (ROL005)
    - ✅ Empleado (ROL003)

---

### 7. Ana Lopez (Gerencia + Administrador Financiero + Empleado)
- **Email:** `ana.lopez@empresa.com`
- **Password:** `Ana123!`
- **DNI:** `77777777`
- **Teléfono:** `2615000007`
- **Salario:** $450,000
- **Roles:**
    - ✅ Gerencia (ROL002)
    - ✅ Administrador Financiero (ROL001)
    - ✅ Empleado (ROL003)

---

### 8. Roberto Sanchez (Gerencia + Administrador de Reservas + Empleado)
- **Email:** `roberto.sanchez@empresa.com`
- **Password:** `Roberto123!`
- **DNI:** `88888888`
- **Teléfono:** `2615000008`
- **Salario:** $420,000
- **Roles:**
    - ✅ Gerencia (ROL002)
    - ✅ Administrador de Reservas (ROL004)
    - ✅ Empleado (ROL003)

---

### 9. Sofia Torres (Administrador Financiero + Administrador de Reservas + Empleado)
- **Email:** `sofia.torres@empresa.com`
- **Password:** `Sofia123!`
- **DNI:** `99999999`
- **Teléfono:** `2615000009`
- **Salario:** $380,000
- **Roles:**
    - ✅ Administrador Financiero (ROL001)
    - ✅ Administrador de Reservas (ROL004)
    - ✅ Empleado (ROL003)

---

### 10. Diego Ramirez (Administrador del Sistema + Gerencia + Empleado)
- **Email:** `diego.ramirez@empresa.com`
- **Password:** `Diego123!`
- **DNI:** `10101010`
- **Teléfono:** `2615000010`
- **Salario:** $470,000
- **Roles:**
    - ✅ Administrador del Sistema (ROL005)
    - ✅ Gerencia (ROL002)
    - ✅ Empleado (ROL003)

---

## 🏠 Cliente

### Cliente Demo
- **NOMBRES DE CLIENTES:** Matias, Clara, Jose, Mau y Maria
- **Email:** `(nombreCliente)@gmail.com` ejemplo `Maria@gmail.com`
- **Password:** `Passw0rd!` *(Contraseña por defecto)*
- **DNI:** `20202020`
- **Código Cliente:** Se genera automáticamente (formato: CLI###)

---

## 📌 Notas Importantes

### Formato de Contraseñas
Todas las contraseñas de empleados siguen el patrón:
```
NombreCapitalizado123!
```

Por ejemplo:
- Juan → `Juan123!`
- Maria → `Maria123!`
- Carlos → `Carlos123!`

### Roles del Sistema

| Código | Nombre | Descripción |
|--------|--------|-------------|
| ROL001 | Administrador Financiero | Gestión de finanzas, cajas, pagos |
| ROL002 | Gerencia | Acceso a reportes y gestión general |
| ROL003 | Empleado | Rol base para todos los empleados |
| ROL004 | Administrador de Reservas | Gestión de reservas e inmuebles |
| ROL005 | Administrador del Sistema | Gestión de usuarios y roles |

### Jerarquía de Roles
- **ROL003 (Empleado)** es el rol base que todos los empleados deben tener
- Los demás roles se agregan adicionalmente según las responsabilidades
- Un empleado puede tener múltiples roles simultáneamente

### Endpoints Útiles

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin.master@empresa.com",
  "password": "Master123!"
}
```

#### Cambiar Contraseña
```http
POST /api/credenciales/cambiar-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "passwordActual": "Master123!",
  "nuevaPassword": "NuevaPassword123!",
  "confirmarNuevaPassword": "NuevaPassword123!"
}
```

#### Información del Usuario Actual
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## ⚠️ Recomendaciones de Seguridad

1. **Cambiar contraseñas por defecto** inmediatamente después del primer login
2. **No compartir credenciales** entre usuarios
3. **Usar contraseñas fuertes** con al menos:
    - 8 caracteres
    - Una mayúscula
    - Una minúscula
    - Un número
    - Un carácter especial (@#$%^&+=!)
4. **Revisar periódicamente** los roles asignados a cada usuario
5. **Desactivar cuentas** de empleados que ya no trabajan en la empresa

---

## 🔄 Recuperación de Credenciales

### Recuperar Email Olvidado
```http
POST /api/credenciales/recuperar-email
Content-Type: application/json

{
  "dni": "11111111",
  "tipoUsuario": "EMPLEADO"
}
```

### Solicitar Recuperación de Contraseña
```http
POST /api/credenciales/recuperar-password/solicitar
Content-Type: application/json

{
  "email": "admin.master@empresa.com"
}
```

---

**Generado automáticamente por el sistema**  
*Última actualización: Al iniciar la aplicación*