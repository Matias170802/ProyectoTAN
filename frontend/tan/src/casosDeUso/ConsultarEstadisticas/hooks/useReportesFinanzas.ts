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
            
            if (filtros.anio) {
                params.append('anio', filtros.anio);
            } else {
                //por defecto mando el año actual y mes actual
                const currentDate = new Date();
                params.append('anio', currentDate.getFullYear().toString());
            }
            
            if (filtros.mes) {
                params.append('mes', filtros.mes);
            } else {
                //por defecto mandamos el mes actual, y se agrega el + 1 porque los meses en TS van de 0 a 11
                const currentDate = new Date();
                params.append('mes', (currentDate.getMonth() + 1).toString());
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