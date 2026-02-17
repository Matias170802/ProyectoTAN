import { useState, useEffect } from 'react';
import type { Empleado } from '../types';
import { getEmpleados } from '../serviceAsignarCheckInOut';
import { useFetch } from '@/generalHooks/useFetch';

interface UseEmpleadosState {
    empleados: Empleado[];
    loading: boolean;
    error: string | null;
}

interface EmpleadosAsignados {
    empleadoAsignadoCheckIn?: string | null;
    empleadoAsignadoCheckOut?: string | null;
}

export const useEmpleados = (codReserva: string | undefined) => {
    const [state, setState] = useState<UseEmpleadosState>({
        empleados: [],
        loading: false,
        error: null,
    });

    // Hook debe estar en el nivel superior, no dentro de condicionales
    const { data: empleadosAsignados } = useFetch<EmpleadosAsignados>(
        codReserva ? `/api/reserva/asignarCheckInOut/${codReserva}` : null
    );

    useEffect(() => {
        loadEmpleados();
    }, []);

    const loadEmpleados = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await getEmpleados();
            setState(prev => ({ ...prev, empleados: data, loading: false }));
        } catch (error) {
            console.error('Error loading empleados:', error);
            setState(prev => ({
                ...prev,
                error: 'Error al cargar empleados',
                loading: false,
            }));
        }
    };

    return {
        empleados: state.empleados,
        loading: state.loading,
        error: state.error,
        refreshEmpleados: loadEmpleados,
        empleadoAsignadoCheckIn: empleadosAsignados?.empleadoAsignadoCheckIn ?? null,
        empleadoAsignadoCheckOut: empleadosAsignados?.empleadoAsignadoCheckOut ?? null,

    };
};
