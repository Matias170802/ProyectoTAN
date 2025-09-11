import React from 'react';
import { type MonedasExistentes } from '../types';
import { obtenerMonedasExistentes } from '../serviceRegistrarCotizacionMoneda';

export const useMoneda = () => {
    const [monedas, setMonedas] = React.useState<MonedasExistentes[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const buscarMonedasExistentes = async () => {
        setLoading(true);
        try {
            const datos = await obtenerMonedasExistentes();
            setMonedas(Array.isArray(datos) ? datos : [datos]);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

    return { monedas, buscarMonedasExistentes, loading, error };
};
