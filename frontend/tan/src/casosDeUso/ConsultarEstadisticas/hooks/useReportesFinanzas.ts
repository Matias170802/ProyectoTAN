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
                // Por defecto, enviar mes actual como java.time.Month
                const currentDate = new Date();
                const currentMonthNumber = (currentDate.getMonth() + 1).toString();// +1 porque los meses van de 0 a 11
                params.append('mes', currentMonthNumber);
            }
            
            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }
        
        return endpoint;
    }, [filtros]);

    console.log('URL construida en useReportesFinanzas:', url);
    const {data: estadisticasFinancieras, loading, error} = useFetch<EstadisticasFinancieras>(url);

    return {
        estadisticasFinancieras,
        loading,
        error
    }
}