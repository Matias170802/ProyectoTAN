import { useFetch } from '../../generalHooks/useFetch';

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

    // Fetch de inmuebles
    const { 
        data: inmuebles, 
        loading: loadingInmuebles, 
        error: errorInmuebles,
        refetch: refetchInmuebles 
    } = useFetch<DTOInmuebleListado[]>('/api/inmuebles/listar', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Fetch de clientes
    const { 
        data: clientes, 
        loading: loadingClientes, 
        error: errorClientes,
        refetch: refetchClientes 
    } = useFetch<DTOClienteListado[]>('/api/clientes/listar', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    // Fetch de empleados
    const { 
        data: empleados, 
        loading: loadingEmpleados, 
        error: errorEmpleados,
        refetch: refetchEmpleados 
    } = useFetch<DTOEmpleadoListado[]>('/empleado/listar', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

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
        const response = await fetch(`/empleado/baja/${id}`, {
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