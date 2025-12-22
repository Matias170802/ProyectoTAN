// useRealizarRendicion.ts
import { useFetch } from "@/generalHooks/useFetch";
import { useCallback, useEffect, useState } from "react";

interface Empleados {
    dniEmpleado: string;
    nombreEmpleado: string;
}

interface Inmuebles {
    codInmueble: string;
    nombreInmueble: string;
}

interface Balance {
    balanceARS: number;
    balanceUSD: number;
}
const fetchBalance = async (tipoRendicion: string, entidadId: string): Promise<Balance> => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    const response = await fetch(`/api/finanzas/realizarRendicion/balance/${entidadId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();
    console.log("Este es el resultado del back balance: ", result);
    console.log("este es el response.ok balance:", response.ok);
    console.log("Este es el result.codigo balance:", result.codigo);
    
    // Si el backend responde con error lógico
    if (!response.ok) {
        console.log("Este es el mensaje del error del back balance: ", result.mensaje);
        throw new Error(result.mensaje || result.message || 'Error al obtener balance');
    }

    return result;
};


export const useRealizarRendicion = (tipoRendicion?: string, entidadSeleccionada?: string) => {
    const [balance, setBalance] = useState<Balance | null>(null);
    const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
    const [errorBalance, setErrorBalance] = useState<Error | null>(null);

    // Solo buscar empleados si el tipo es RendicionEmpleado
    const shouldFetchEmpleados = tipoRendicion === 'RendicionEmpleado';
    const shouldFetchInmuebles = tipoRendicion === 'RendicionInmueble';
    const shouldFetchBalance = entidadSeleccionada && entidadSeleccionada !== 'seleccioneUnEmpleado' && entidadSeleccionada !== 'seleccioneUnInmueble';

    const {
        data: empleados, 
        loading: loadingEmpleados, 
        refetch: refetchEmpleados, 
        error: errorEmpleados
    } = useFetch<Empleados[] | null>(
        shouldFetchEmpleados ? '/api/finanzas/realizarRendicion/empleados' : null
    );

    const {
        data: inmuebles, 
        loading: loadingInmuebles, 
        refetch: refetchInmuebles, 
        error: errorInmuebles
    } = useFetch<Inmuebles[]>(
        shouldFetchInmuebles ? '/api/finanzas/realizarRendicion/inmuebles' : null
    );


    // Balance específico según la entidad seleccionada
    const getBalanceEndpoint = () => {
        if (!shouldFetchBalance) return null;
        
        if (tipoRendicion === 'RendicionEmpleado') {
            return `/api/finanzas/realizarRendicion/balance/${entidadSeleccionada}`;
        }
        if (tipoRendicion === 'RendicionInmueble') {
            return `/api/finanzas/realizarRendicion/balance/${entidadSeleccionada}`;
        }
        return null;
    };

    // Efecto para fetch del balance manual
    useEffect(() => {
        if (shouldFetchBalance && tipoRendicion && entidadSeleccionada) {
            const getBalance = async () => {
                try {
                    setLoadingBalance(true);
                    setErrorBalance(null);
                    console.log("🔍 Obteniendo balance para:", { tipoRendicion, entidadSeleccionada });
                    
                    const balanceResult = await fetchBalance(tipoRendicion, entidadSeleccionada);
                    setBalance(balanceResult);
                    console.log("✅ Balance obtenido exitosamente:", balanceResult);
                } catch (error) {
                    console.error("❌ Error al obtener balance:", error);
                    setErrorBalance(error instanceof Error ? error : new Error('Error desconocido'));
                    setBalance(null);
                } finally {
                    setLoadingBalance(false);
                }
            };

            getBalance();
        } else {
            // Reset balance cuando no se deben hacer peticiones
            setBalance(null);
            setErrorBalance(null);
            setLoadingBalance(false);
        }
    }, [shouldFetchBalance, tipoRendicion, entidadSeleccionada]);

     // Función refetch manual para balance
    const refetchBalance = useCallback(async () => {
        if (shouldFetchBalance && tipoRendicion && entidadSeleccionada) {
            try {
                setLoadingBalance(true);
                setErrorBalance(null);
                const balanceResult = await fetchBalance(tipoRendicion, entidadSeleccionada);
                setBalance(balanceResult);
            } catch (error) {
                console.error("Error al refetch balance:", error);
                setErrorBalance(error instanceof Error ? error : new Error('Error desconocido'));
                setBalance(null);
            } finally {
                setLoadingBalance(false);
            }
        }
    }, [shouldFetchBalance, tipoRendicion, entidadSeleccionada]);

    console.log("errorBalance manual:", errorBalance);
    console.log("errorBalance.message:", errorBalance?.message);
    console.log( "errorBalance",errorBalance)

    return {
        empleados,
        loadingEmpleados,
        refetchEmpleados,
        errorEmpleados,
        inmuebles,
        loadingInmuebles,
        refetchInmuebles,
        errorInmuebles,
        balance,
        loadingBalance,
        refetchBalance,
        errorBalance
    }
}