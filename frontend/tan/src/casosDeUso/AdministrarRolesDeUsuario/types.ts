//tengo todos los tipos que manejo en el cu administrar roles de usuario

export interface Rol {
    id: number;
    nombre: string;
}

export interface EmpleadoConRoles {
    dni: string;
    nombre: string;
    roles: Rol[];
}
