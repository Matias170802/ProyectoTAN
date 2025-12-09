import { useFetch } from "@/generalHooks/useFetch"
import { type Caja } from "./typesFinanzas"

export const useFinanzas = () => {
    const { data: cajasData, loading: loadingCajas, error: errorCajas, refetch} = useFetch<Caja[]>('/api/finanzas');

    //* Filtros por tipo
    const filtrosPorTipo: Record<string, (caja: Caja) => boolean> = {
        todasLasCajas: () => true,
        cajasEmpleados: (caja) => caja.tipo === "Empleado",
        cajasEnmuebles: (caja) => caja.tipo === "Inmueble",
        otrasCajas: (caja) => caja.tipo === "Otro"
    };

    //* Ordenadores
    const ordenadores: Record<string, (a: Caja, b: Caja) => number> = {
        "MovimientoMasReciente": (a, b) => new Date(b.ultimoMovimiento).getTime() - new Date(a.ultimoMovimiento).getTime(),
        "MovimientoMasAntiguo": (a, b) => new Date(a.ultimoMovimiento).getTime() - new Date(b.ultimoMovimiento).getTime(),
        "MayorMonto": (a, b) => b.balanceARS - a.balanceARS,
        "MenorMonto": (a, b) => a.balanceARS - b.balanceARS
    };

    //* Función principal de filtrado y orden
    const obtenerCajasFiltradas = (
        tipoSeleccionado: string,
        ordenSeleccionado: string,
        textoBuscado: string
    ): Caja[] => {
        let resultado = cajasData || [];
        console.log("Cajas antes de filtrar:", resultado);

        //* Filtrar por tipo
        resultado = resultado.filter(filtrosPorTipo[tipoSeleccionado] || filtrosPorTipo["todasLasCajas"]);
        console.log(`Cajas después de filtrar por tipo (${tipoSeleccionado}):`, resultado);

        //* Filtrar por texto buscado (nombre o tipo)
        if (textoBuscado.trim() !== "") {
            const texto = textoBuscado.toLowerCase();
            resultado = resultado.filter(caja =>
                caja.nombre.toLowerCase().includes(texto)
            );
        }

        //*Ordenar
        resultado = resultado.slice().sort(ordenadores[ordenSeleccionado] || ordenadores["MovimientoMasReciente"]);
        console.log(`Cajas después de ordenar (${ordenSeleccionado}):`, resultado);

        return resultado;
    };

    const obtenerCajaMadre = (): Caja | null => {
        const cajas = cajasData || [];
        return cajas.find(caja => caja.tipo === "Otro") || null;
    };

    return {
        cajasData,
        loadingCajas,
        errorCajas,
        obtenerCajasFiltradas,
        obtenerCajaMadre,
        refetchCajas: refetch
    };
}