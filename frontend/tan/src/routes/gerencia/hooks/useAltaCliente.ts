// frontend/tan/src/routes/gerencia/hooks/useAltaCliente.ts
import { useState } from 'react';

interface DTOAltaClienteRequest {
    dniCliente: string;
    nombreCliente: string;
    email: string;
}

interface DTOAltaClienteResponse {
    nombreCliente: string;
    codCliente: string;
    mensaje: string;
    email: string;
    password: string;
}

export const useAltaCliente = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<DTOAltaClienteResponse | null>(null);

    const altaCliente = async (data: DTOAltaClienteRequest): Promise<DTOAltaClienteResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            
            const response = await fetch('/api/clientes/alta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear el cliente');
            }

            const result: DTOAltaClienteResponse = await response.json();
            setSuccess(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        altaCliente,
        loading,
        error,
        success,
        resetState
    };
};