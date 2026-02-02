import { useMemo } from "react";
import { useFetch } from "@/generalHooks/useFetch";
import { type DTOFinanzasCliente, type DTOReservasCliente, type DTOInmueblesFiltro } from "../components/ModalConsultarEstadisticasCliente/ModalConsultarEstadisticasClienteTypes";

export interface FiltrosClienteReportes {
    anio?: string;
    mes?: string;
    codInmueble?: string;
}

// Hook para obtener los inmuebles del cliente
export const useInmueblesCliente = (codCliente: string | undefined) => {
    const url = useMemo(() => {
        if (!codCliente) return null;
        return `/api/reportes/inmueblesCliente/${codCliente}`;
    }, [codCliente]);

    const { data: inmuebles, loading, error } = useFetch<DTOInmueblesFiltro[]>(url || '');

    return {
        inmuebles,
        loading,
        error
    };
};

// Hook para obtener las finanzas del cliente por inmueble
export const useFinanzasCliente = (filtros?: FiltrosClienteReportes) => {
    const url = useMemo(() => {
        let endpoint = '/api/reportes/estadisticasFinancierasCliente';

        if (filtros && filtros.codInmueble) {
            const params = new URLSearchParams();

            if (filtros.anio) {
                params.append('anio', filtros.anio);
            } else {
                const currentDate = new Date();
                params.append('anio', currentDate.getFullYear().toString());
            }

            if (filtros.mes) {
                params.append('mes', filtros.mes);
            } else {
                const currentDate = new Date();
                const currentMonthNumber = (currentDate.getMonth() + 1).toString();
                params.append('mes', currentMonthNumber);
            }

            params.append('codInmueble', filtros.codInmueble);

            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }

        return endpoint;
    }, [filtros]);

    const { data: finanzas, loading, error } = useFetch<DTOFinanzasCliente[]>(url);

    return {
        finanzas,
        loading,
        error
    };
};

// Hook para obtener las reservas del cliente por inmueble
export const useReservasCliente = (filtros?: FiltrosClienteReportes) => {
    const url = useMemo(() => {
        let endpoint = '/api/reportes/estadisticasReservasCliente';

        if (filtros && filtros.codInmueble) {
            const params = new URLSearchParams();

            if (filtros.anio) {
                params.append('anio', filtros.anio);
            } else {
                const currentDate = new Date();
                params.append('anio', currentDate.getFullYear().toString());
            }

            if (filtros.mes) {
                params.append('mes', filtros.mes);
            } else {
                const currentDate = new Date();
                const currentMonthNumber = (currentDate.getMonth() + 1).toString();
                params.append('mes', currentMonthNumber);
            }

            params.append('codInmueble', filtros.codInmueble);

            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }

        return endpoint;
    }, [filtros]);

    const { data: reservas, loading, error } = useFetch<DTOReservasCliente[]>(url);

    return {
        reservas,
        loading,
        error
    };
};
