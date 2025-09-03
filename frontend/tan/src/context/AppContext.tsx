

import React, { createContext, useContext } from 'react';
import type { Rol, EmpleadoConRoles } from '../casosDeUso/AdministrarRolesDeUsuario/types';

interface RolesContextType {
    empleado: EmpleadoConRoles | null;
    rolesDisponibles: Rol[];
    buscarRolesEmpleado: (codEmpleado: string) => Promise<void>;
    fetchRolesDisponibles: () => Promise<void>;
    quitarRol: (rolId: number) => Promise<void>;
    agregarRoles: (nuevosRoles: Rol[]) => Promise<void>;
}

export const AppContext = createContext<RolesContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe usarse dentro de AppProvider');
    }
    return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Implementación mínima para evitar error de importación
    const value: RolesContextType = {
        empleado: null,
        rolesDisponibles: [],
        buscarRolesEmpleado: async () => {},
        fetchRolesDisponibles: async () => {},
        quitarRol: async () => {},
        agregarRoles: async () => {},
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
