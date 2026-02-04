// frontend/tan/src/routes/gerencia/hooks/useAltaInmueble.ts
import { useState, useCallback } from 'react';

interface DTOAltaInmuebleRequest {
    cantidadBaños: number;
    cantidadDormitorios: number;
    capacidad: number;
    direccion: string;
    m2Inmueble: number;
    nombreInmueble: string;
    precioPorNocheUSD: number;
    codCliente: string;
}

interface DTOAltaInmuebleResponse {
    mensaje: string;
    exito: boolean;
    codInmueble: string;
    nombreInmueble: string;
    codCliente: string;
    nombreCliente: string;
}

export const useAltaInmueble = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<DTOAltaInmuebleResponse | null>(null);

    const altaInmueble = useCallback(async (data: DTOAltaInmuebleRequest): Promise<DTOAltaInmuebleResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            
            const response = await fetch('/api/inmuebles/alta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear el inmueble');
            }

            const result: DTOAltaInmuebleResponse = await response.json();
            setSuccess(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    return {
        altaInmueble,
        loading,
        error,
        success,
        resetState
    };
};