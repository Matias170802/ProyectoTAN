import { useFetch } from "@/generalHooks/useFetch"
import { type CotizacionExistenteHoy } from "../types"

export const useRegistrarCambioMoneda = (tipoCambio?: string) => {

    // Solo hacer la petición si hay un tipo de cambio válido
    const shouldFetch = tipoCambio && tipoCambio !== "seleccioneUnTipoDeCambio";

    console.log('Hook useRegistrarCambioMoneda ejecutándose:');
    console.log('- tipoCambio:', tipoCambio);
    console.log('- shouldFetch:', shouldFetch);

    const {data: cotizacionMonedaHoy, loading, error: errorCotizacionHoy} = useFetch<CotizacionExistenteHoy>(
        shouldFetch ? `/api/finanzas/RegistrarCambioMoneda/cotizacionMonedaHoy?tipoCambio=${encodeURIComponent(tipoCambio)}` : null
    );
    
    console.log('- Resultado useFetch:', { cotizacionMonedaHoy, loading, errorCotizacionHoy });

    return {
        cotizacionMonedaHoy: shouldFetch ? cotizacionMonedaHoy : null,
        loading: shouldFetch ? loading : false,
        errorCotizacionHoy: shouldFetch ? errorCotizacionHoy : null
    };
}