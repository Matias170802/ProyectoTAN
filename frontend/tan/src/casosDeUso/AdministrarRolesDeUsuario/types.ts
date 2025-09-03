export interface Rol {
    id: number;
    nombre: string;
}

export interface EmpleadoConRoles {
    dni: string;
    nombre: string;
    roles: Rol[];
}
