//se importa con type ya que son tipos de typescript y no son funciones
import type { EmpleadoConRoles, Rol } from "./types";

export const obtenerRolesEmpleado = async (dni: string): Promise<EmpleadoConRoles> => {
    // Reemplazá con llamada real a tu API
    return {
        dni,
        nombre: "Juan Pérez",
        roles: [
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Supervisor" },
        ],
    };
};

export const desasignarRol = async (dni: string, rolId: number): Promise<void> => {
  // Simula una llamada DELETE
};

export const asignarRoles = async (dni: string, roles: Rol[]): Promise<void> => {
  // Simula una llamada POST
};
