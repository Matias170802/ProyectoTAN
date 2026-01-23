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
                // Try to parse a JSON error body and extract a friendly message
                const contentType = response.headers.get('content-type') || '';
                let message = 'Error al crear el cliente';
                try {
                    if (contentType.includes('application/json')) {
                        const errJson = await response.json();
                        message = errJson.message || errJson.mensaje || JSON.stringify(errJson);
                    } else {
                        const text = await response.text();
                        message = text || message;
                    }
                } catch (e) {
                    // fallback
                }
                throw new Error(message);
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