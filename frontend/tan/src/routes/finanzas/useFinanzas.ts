import { useFetch } from "@/generalHooks/useFetch"
import { type Caja } from "./typesFinanzas"

export const useFinanzas = () => {
    const { data: cajasData, loading: loadingCajas, error: errorCajas } = useFetch<Caja[]>('/api/finanzas');

    //* Filtros por tipo
    const filtrosPorTipo: Record<string, (caja: Caja) => boolean> = {
        todasLasCajas: () => true,
        cajasEmpleados: (caja) => caja.tipo === "Empleado",
        cajasEnmuebles: (caja) => caja.tipo === "Inmueble",
        otrasCajas: (caja) => caja.tipo === "Otro"
    };

    //* Ordenadores
    const ordenadores: Record<string, (a: Caja, b: Caja) => number> = {
        "Movimiento más reciente": (a, b) => b.ultimoMovimiento.getTime() - a.ultimoMovimiento.getTime(),
        "Movimiento más antiguo": (a, b) => a.ultimoMovimiento.getTime() - b.ultimoMovimiento.getTime(),
        "Mayor monto": (a, b) => b.balanceARS - a.balanceARS,
        "Menor monto": (a, b) => a.balanceARS - b.balanceARS
    };

    //* Función principal de filtrado y orden
    const obtenerCajasFiltradas = (
        tipoSeleccionado: string,
        ordenSeleccionado: string,
        textoBuscado: string
    ) => {
        let resultado = cajasData || [];

        //* Filtrar por tipo
        resultado = resultado.filter(filtrosPorTipo[tipoSeleccionado] || filtrosPorTipo["todasLasCajas"]);

        //* Filtrar por texto buscado (nombre o tipo)
        if (textoBuscado.trim() !== "") {
            const texto = textoBuscado.toLowerCase();
            resultado = resultado.filter(caja =>
                caja.nombre.toLowerCase().includes(texto)
            );
        }

        //*Ordenar
        resultado = resultado.slice().sort(ordenadores[ordenSeleccionado] || ordenadores["Movimiento más reciente"]);

        return resultado;
    };

    return {
        cajasData,
        loadingCajas,
        errorCajas,
        obtenerCajasFiltradas
    };
}