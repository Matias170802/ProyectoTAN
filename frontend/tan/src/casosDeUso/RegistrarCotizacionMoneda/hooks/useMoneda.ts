import React from 'react';
import { useFetch } from "@/generalHooks/useFetch";
import { type MonedasExistentes } from '../types';
import {registrarCotizacion} from '../serviceRegistrarCotizacionMoneda';
import {type formSchemaRegistrarCotizacionMonedaType} from '../models/modelRegistrarCotizacionMoneda';

export const useMoneda = () => {
    const [errorEncontrado, setErrorEncontrado] = React.useState<string | null>(null);
    const { data, loading, error } = useFetch<MonedasExistentes[]>('/api/finanzas/registrarCotizacionMoneda');

    const registrarCotizacionMoneda = async (cotizacion: formSchemaRegistrarCotizacionMonedaType) => {
        try {
            await registrarCotizacion(cotizacion);
            setErrorEncontrado(null);
            return true;
        } catch (e: any) {
            setErrorEncontrado(e.message);
            return false;
        }
    }
    return {
        monedas: data || [],
        loading,
        error,
        registrarCotizacionMoneda,
        errorEncontrado
    };
};