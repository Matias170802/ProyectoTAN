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
            
            if (filtros.anio && filtros.anio !== 'todos') {
                params.append('anio', filtros.anio);
            }
            
            if (filtros.mes && filtros.mes !== 'todos') {
                params.append('mes', filtros.mes);
            }

            if (filtros.inmueble && filtros.inmueble !== 'todos') {
                params.append('inmueble', filtros.inmueble);
            }
            
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }
        
        return endpoint;
    }, [filtros, activo]);

    if (activo === 'inmuebles') {
        const {data: estadisticasGerencia, loading: loadingInmuebles, error: errorInmuebles} = useFetch<EstadisticasGerenciaInmuebles>(url);
        
        return {
            estadisticasGerenciaInmuebles: estadisticasGerencia,
            loadingInmuebles,
            errorInmuebles
        }
    }

    if (activo === 'reservas') {
        const {data: estadisticasGerenciaReservas, loading: loadingReservas, error: errorReservas} = useFetch<EstadisticasGerenciaReservas>(url);
        
        return {
            estadisticasGerenciaReservas: estadisticasGerenciaReservas,
            loadingReservas,
            errorReservas
        }
    }

}