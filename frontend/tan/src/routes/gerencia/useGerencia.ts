import { useFetch } from '../../generalHooks/useFetch';
import { useMemo } from 'react';

// Tipos para Inmuebles
export interface DTOInmuebleListado {
    id: number;
    codInmueble: string;
    nombreInmueble: string;
    cantidadBaños: number;
    cantidadDormitorios: number;
    capacidad: number;
    direccion: string;
    m2Inmueble: number;
    precioPorNocheUSD: number;
    fechaHoraAltaInmueble: string;
    codCliente: string;
    nombreCliente: string;
    activo: boolean;
}

// Tipos para Clientes
export interface DTOClienteListado {
    id: number;
    codCliente: string;
    nombreCliente: string;
    dniCliente: string;
    fechaHoraAltaCliente: string;
    codigosInmuebles: string[];
    nombresInmuebles: string[];
    cantidadInmuebles: number;
    activo: boolean;
}

// Tipos para Empleados
export interface DTOEmpleadoListado {
    id: number;
    codEmpleado: string;
    nombreEmpleado: string;
    dniEmpleado: string;
    codigosRoles: string[];
    nombresRoles: string[];
    balanceCajaARS: number;
    balanceCajaUSD: number;
    activo: boolean;
}

export const useGerencia = () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    // Memoizar las opciones de autorización para evitar que el objeto options cambie en cada render
    const authOptions = useMemo(() => token ? { headers: { 'Authorization': `Bearer ${token}` } } : undefined, [token]);

    // Fetch de inmuebles
    const { 
        data: inmuebles, 
        loading: loadingInmuebles, 
        error: errorInmuebles,
        refetch: refetchInmuebles 
    } = useFetch<DTOInmuebleListado[]>('/api/inmuebles/listar', authOptions);

    // Fetch de clientes
    const { 
        data: clientes, 
        loading: loadingClientes, 
        error: errorClientes,
        refetch: refetchClientes 
    } = useFetch<DTOClienteListado[]>('/api/clientes/listar', authOptions);

    // Fetch de empleados
    const { 
        data: empleados, 
        loading: loadingEmpleados, 
        error: errorEmpleados,
        refetch: refetchEmpleados 
    } = useFetch<DTOEmpleadoListado[]>('/api/empleado/listar', authOptions);

    // Función para dar de baja inmueble
    const bajaInmueble = async (id: number) => {
        const response = await fetch(`/api/inmuebles/baja/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al dar de baja el inmueble');
        }

        // Refrescar la lista
        if (refetchInmuebles) refetchInmuebles();
        
        return await response.json();
    };

    // Función para dar de baja cliente
    const bajaCliente = async (id: number) => {
        const response = await fetch(`/api/clientes/baja/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al dar de baja el cliente');
        }

        // Refrescar la lista
        if (refetchClientes) refetchClientes();
        
        return await response.json();
    };

    // Función para dar de baja empleado
    const bajaEmpleado = async (id: number) => {
        const response = await fetch(`/api/empleado/baja/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al dar de baja el empleado');
        }

        // Refrescar la lista
        if (refetchEmpleados) refetchEmpleados();
        
        return await response.json();
    };

    return {
        inmuebles: inmuebles || [],
        clientes: clientes || [],
        empleados: empleados || [],
        loading: loadingInmuebles || loadingClientes || loadingEmpleados,
        error: errorInmuebles || errorClientes || errorEmpleados,
        bajaInmueble,
        bajaCliente,
        bajaEmpleado,
        refetchInmuebles,
        refetchClientes,
        refetchEmpleados
    };
};