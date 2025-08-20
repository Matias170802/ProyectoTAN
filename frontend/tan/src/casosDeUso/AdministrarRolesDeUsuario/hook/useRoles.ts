import { useState } from "react";
import type { Rol, EmpleadoConRoles } from "../types";
import { obtenerRolesEmpleado, desasignarRol, asignarRoles } from "../serviceAdministrarRolesDeUsuario";

export const useRoles = () => {
    const [empleado, setEmpleado] = useState<EmpleadoConRoles | null>(null);

    const buscarRolesEmpleado = async (dni: string) => {
        const datos = await obtenerRolesEmpleado(dni);
        setEmpleado(datos);
    };

    const quitarRol = async (rolId: number) => {
        if (!empleado) return;
        await desasignarRol(empleado.dni, rolId);
        setEmpleado({
        ...empleado,
        roles: empleado.roles.filter((r) => r.id !== rolId),
        });
    };

    const agregarRoles = async (nuevosRoles: Rol[]) => {
        if (!empleado) return;
        await asignarRoles(empleado.dni, nuevosRoles);
        setEmpleado({
        ...empleado,
        roles: [...empleado.roles, ...nuevosRoles],
        });
    };

    return { empleado, buscarRolesEmpleado, quitarRol, agregarRoles };
};
