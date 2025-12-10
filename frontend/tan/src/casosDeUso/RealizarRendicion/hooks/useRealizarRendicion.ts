// useRealizarRendicion.ts
import { useFetch } from "@/generalHooks/useFetch";
import { useEffect, useState } from "react";

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

export const useRealizarRendicion = (tipoRendicion?: string, entidadSeleccionada?: string) => {
    
    // Solo buscar empleados si el tipo es RendicionEmpleado
    const shouldFetchEmpleados = tipoRendicion === 'RendicionEmpleado';
    const shouldFetchInmuebles = tipoRendicion === 'RendicionInmueble';
    const shouldFetchBalance = entidadSeleccionada && entidadSeleccionada !== 'seleccioneUnEmpleado' && entidadSeleccionada !== 'seleccioneUnInmueble';


    console.log("shouldFetchEmpleados", shouldFetchEmpleados)
    console.log("shouldFetchInmuebles", shouldFetchInmuebles)
    

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

    const {
        data: balance, 
        loading: loadingBalance, 
        refetch: refetchBalance, 
        error: errorBalance
    } = useFetch<Balance>(getBalanceEndpoint());

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