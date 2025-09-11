import { useFetch } from "@/generalHooks/useFetch";
import { type MonedasExistentes } from '../types';

export const useMoneda = () => {
    const { data, loading, error } = useFetch<MonedasExistentes[]>('/api/finanzas/registrarCotizacionMoneda');

    return {
        monedas: data || [],
        loading,
        error
    };
};