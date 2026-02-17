import { useState, useEffect } from 'react';
import type { Empleado } from '../types';
import { getEmpleados } from '../serviceAsignarCheckInOut';
import { useFetch } from '@/generalHooks/useFetch';

interface UseEmpleadosState {
    empleados: Empleado[];
    loading: boolean;
    error: string | null;
}

export const useEmpleados = (codReserva: String | undefined) => {
    const [state, setState] = useState<UseEmpleadosState>({
        empleados: [],
        loading: false,
        error: null,
    });

    if (codReserva != undefined) {
        const {data: empleadosAsignados} = useFetch(`/api/reserva/asignarCheckInOut/${codReserva}`)
    }
    

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
        empleadoAsignadoCheckIn: empleadosAsignados.empleadoAsignadoCheckIn ? empleadosAsignados.empleadoAsignadoCheckIn : null,
        empleadoAsignadoCheckOut: empleadosAsignados.empleadoAsignadoCheckOut ? empleadosAsignados.empleadoAsignadoCheckOut : null,

    };
};
