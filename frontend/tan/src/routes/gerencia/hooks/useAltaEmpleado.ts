// frontend/tan/src/routes/gerencia/hooks/useAltaEmpleado.ts
import { useState } from 'react';

interface DTOAltaEmpleadoRequest {
    dniEmpleado: string;
    nombreEmpleado: string;
    nroTelefonoEmpleado: string;
    salarioEmpleado: number;
    codRoles: string[];
    email: string;
    password: string;
}

interface DTOAltaEmpleadoResponse {
    nombreEmpleado: string;
    mensaje: string;
    email: string;
    password: string;
}

export const useAltaEmpleado = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<DTOAltaEmpleadoResponse | null>(null);

    const altaEmpleado = async (data: DTOAltaEmpleadoRequest): Promise<DTOAltaEmpleadoResponse> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            
            const response = await fetch('/api/empleado/alta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error al crear el empleado');
            }

            const result: DTOAltaEmpleadoResponse = await response.json();
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
        altaEmpleado,
        loading,
        error,
        success,
        resetState
    };
};