import { useMemo } from "react";
import { useFetch } from "@/generalHooks/useFetch";
import {type EstadisticasGerenciaReservas, type EstadisticasGerenciaInmuebles} from "../components/ModalConsultarEstadisticasGerencia/ModalConsultarEstadisticasGerenciaTypes";

export interface FiltrosEstadisticasGerencia {
    anio?: string;
    mes?: string;
    inmueble?: string;
}

export const useReportesGerencia = (activo: string, filtros?: FiltrosEstadisticasGerencia) => {

    // Construir la URL con los filtros
    const url = useMemo(() => {
        const baseEndpoint = `/api/reportes/estadisticasGerencia/${encodeURIComponent(activo)}`;
        let endpoint = baseEndpoint;
        
        if (filtros) {
            const params = new URLSearchParams();
            
            if (filtros.anio) {
                params.append('anio', filtros.anio);
            }
            
            if (filtros.mes) {
                params.append('mes', filtros.mes);
            }

            if (filtros.inmueble) {
                params.append('inmueble', filtros.inmueble);
            }
            
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }
        
        return endpoint;
    }, [filtros, activo]);

    if (activo === 'inmuebles') {
        const {data: estadisticasGerencia, loading, error} = useFetch<EstadisticasGerenciaInmuebles>(url);
        
        return {
            data: estadisticasGerencia,
            loading,
            error
        }
    }

    if (activo === 'reservas') {
        const {data: estadisticasGerenciaReservas, loading, error} = useFetch<EstadisticasGerenciaReservas>(url);
        
        return {
            data: estadisticasGerenciaReservas,
            loading,
            error
        }
    }

    return { data: null, loading: false, error: null };
}