import { useFetch } from "@/generalHooks/useFetch"
import { type MonedasExistentes } from "./types"

//TODO: colocar la url correcta

export const obtenerMonedasExistentes = async (): Promise<MonedasExistentes[]> => {
    const response = await fetch('/api/finanzas/registrarCotizacionMoneda');
    if (!response.ok) throw new Error('Error en la petición');
    return await response.json();
};