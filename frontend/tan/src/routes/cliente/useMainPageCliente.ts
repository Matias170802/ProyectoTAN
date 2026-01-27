import { useFetch } from "@/generalHooks/useFetch";
import { useState, useEffect } from "react";
import type { 
    Propiedad, 
    ReporteGanancias, 
    ReporteReservas, 
    FiltrosCliente 
} from "./types";

export const useMainPageCliente = () => {
    // Variables para filtros predeterminados (año y mes actual)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonthNumber = (currentDate.getMonth() + 1).toString();

    const [filtros, setFiltros] = useState<FiltrosCliente>({
        anio: currentYear,
        mes: currentMonthNumber,
        inmueble: ''
    });

    // Fetch de todas las propiedades del cliente
    const { 
        data: propiedades, 
        loading: loadingPropiedades, 
        error: errorPropiedades 
    } = useFetch<Propiedad[]>('/api/cliente/propiedades');

    // Establecer la primera propiedad como seleccionada por defecto
    useEffect(() => {
        if (propiedades && propiedades.length > 0 && !filtros.inmueble) {
            setFiltros(prev => ({
                ...prev,
                inmueble: propiedades[0].codInmueble
            }));
        }
    }, [propiedades]);

    // Fetch de reportes solo si hay inmueble seleccionado
    const shouldFetchReportes = !!filtros.inmueble;

    const { 
        data: reporteGanancias, 
        loading: loadingGanancias, 
        error: errorGanancias 
    } = useFetch<ReporteGanancias>(
        shouldFetchReportes 
            ? `/api/cliente/reporte-ganancias?mes=${filtros.mes}&anio=${filtros.anio}&inmueble=${filtros.inmueble}` 
            : null
    );

    const { 
        data: reporteReservas, 
        loading: loadingReservas, 
        error: errorReservas 
    } = useFetch<ReporteReservas>(
        shouldFetchReportes 
            ? `/api/cliente/reporte-reservas?mes=${filtros.mes}&anio=${filtros.anio}&inmueble=${filtros.inmueble}` 
            : null
    );

    // Propiedad seleccionada actual
    const propiedadSeleccionada = propiedades?.find(
        prop => prop.codInmueble === filtros.inmueble
    );

    return {
        propiedades,
        loadingPropiedades,
        errorPropiedades,
        reporteGanancias,
        loadingGanancias,
        errorGanancias,
        reporteReservas,
        loadingReservas,
        errorReservas,
        filtros,
        setFiltros,
        propiedadSeleccionada
    };
};
