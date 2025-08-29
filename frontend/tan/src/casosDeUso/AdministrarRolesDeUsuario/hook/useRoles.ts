import { useState } from "react";
import type { Rol, EmpleadoConRoles } from "../types";
import { obtenerRolesEmpleado, desasignarRol, asignarRoles, obtenerRolesDisponibles } from "../serviceAdministrarRolesDeUsuario";

// DTO para asignar/desasignar roles
interface DTORolesAsignados {
    codEmpleado: string;
    idRol: number;
}

export const useRoles = () => {
    const [empleado, setEmpleado] = useState<EmpleadoConRoles | null>(null);
    const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);

    // Buscar roles del empleado por codEmpleado
    const buscarRolesEmpleado = async (codEmpleado: string) => {
        const datos = await obtenerRolesEmpleado(codEmpleado);
        setEmpleado(datos);
    };

    // Obtener roles disponibles para asignar
    const fetchRolesDisponibles = async () => {
        const roles = await obtenerRolesDisponibles();
        setRolesDisponibles(roles);
    };

    // Quitar un rol (envía DTO al backend)
    const quitarRol = async (rolId: number) => {
        if (!empleado) return;
        const dto: DTORolesAsignados = {
            codEmpleado: empleado.dni, // Asume que dni es el código, ajusta si tienes codEmpleado
            idRol: rolId,
        };
        await desasignarRol([dto]);
        setEmpleado({
            ...empleado,
            roles: empleado.roles.filter((r: Rol) => r.id !== rolId),
        });
    };

    // Agregar roles (envía lista de DTOs al backend)
    const agregarRoles = async (nuevosRoles: Rol[]) => {
        if (!empleado) return;
        const dtos: DTORolesAsignados[] = nuevosRoles.map((rol) => ({
            codEmpleado: empleado.dni, // Asume que dni es el código, ajusta si tienes codEmpleado
            idRol: rol.id,
        }));
        await asignarRoles(dtos);
        setEmpleado({
            ...empleado,
            roles: [...empleado.roles, ...nuevosRoles],
        });
    };

    return {
        empleado,
        rolesDisponibles,
        buscarRolesEmpleado,
        fetchRolesDisponibles,
        quitarRol,
        agregarRoles,
    };
};
