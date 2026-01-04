import { useMemo } from "react";
import { useFetch } from "@/generalHooks/useFetch";
import {type EstadisticasFinancieras} from "../components/ModalConsultarEstadisticasFinancieras/ModalConsultarEstadisticasFinancierasTypes";

export interface FiltrosEstadisticasFinancieras {
    anio?: string;
    mes?: string;
}

export const useReportesFinanzas = (filtros?: FiltrosEstadisticasFinancieras) => {

    // Construir la URL con los filtros
    const url = useMemo(() => {
        let endpoint = '/api/reportes/estadisticasFinancieras';
        
        if (filtros) {
            const params = new URLSearchParams();
            
            if (filtros.anio && filtros.anio !== 'todos') {
                params.append('anio', filtros.anio);
            }
            
            if (filtros.mes && filtros.mes !== 'todos') {
                params.append('mes', filtros.mes);
            }
            
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }
        
        return endpoint;
    }, [filtros]);

    const {data: estadisticasFinancieras, loading, error} = useFetch<EstadisticasFinancieras>(url);

    return {
        estadisticasFinancieras,
        loading,
        error
    }
}