export interface Rol {
    id: number;
    codRol: string;
    nombreRol: string;
}

export interface EmpleadoConRoles {
    codEmpleado: string;
    nombreEmpleado: string;
    codRol: string[];
    nombreRol: string[];
}
