import { useFetch } from "@/generalHooks/useFetch"
import { type CotizacionExistenteHoy } from "../types"
import { useCallback, useState } from "react";
import { registrarCambioMoneda } from "../serviceRegistrarCambioMoneda";
import { type formSchemaRegistrarCambioMonedaType } from '../models/modelRegistrarCambioMoneda';

export const useRegistrarCambioMoneda = (tipoCambio?: string) => {

    const [errorEncontrado, setErrorEncontrado] = useState<string | null>(null);
    // Solo hacer la petición si hay un tipo de cambio válido
    const shouldFetch = tipoCambio && tipoCambio !== "seleccioneUnTipoDeCambio";

    console.log('Hook useRegistrarCambioMoneda ejecutándose:');
    console.log('- tipoCambio:', tipoCambio);
    console.log('- shouldFetch:', shouldFetch);

    const {data: cotizacionMonedaHoy, loading, error: errorCotizacionHoy, refetch} = useFetch<CotizacionExistenteHoy>(
        shouldFetch ? `/api/finanzas/registrarCambioMoneda/cotizacionMonedaHoy?tipoCambio=${encodeURIComponent(tipoCambio)}` : null
    );
    
    // Función para refrescar cotización
    const refreshCotizacion = useCallback(() => {
        if (shouldFetch && refetch) {
            refetch();
        }
    }, [shouldFetch, refetch]);

    console.log('- Resultado useFetch:', { cotizacionMonedaHoy, loading, errorCotizacionHoy });

    const registrarCambioMon = async (cambio: formSchemaRegistrarCambioMonedaType) => {
            try {
                await registrarCambioMoneda(cambio);
                setErrorEncontrado(null);
                return true;
            } catch (e: any) {
                setErrorEncontrado(e.message);
                return false;
            }
    }

    return {
        cotizacionMonedaHoy: shouldFetch ? cotizacionMonedaHoy : null,
        loading: shouldFetch ? loading : false,
        errorCotizacionHoy: shouldFetch ? errorCotizacionHoy : null,
        refreshCotizacion,
        registrarCambioMoneda: registrarCambioMon,
        errorEncontrado
    };
}