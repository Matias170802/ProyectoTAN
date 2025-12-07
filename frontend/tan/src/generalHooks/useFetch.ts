import {useCallback, useEffect, useState} from "react";

//*definimos los tipos que vamos a recibir
type Data <T> = T | null;
type ErrorType = Error | null;

//*parametros para el fetch
interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
}

//*parametros que recibimos en nuestro custom hook
interface Params <T> {
	data: Data<T>;
	loading?: boolean;
	error: ErrorType;
}

//*custom hook
export function useFetch<T>(url: string | null, options?: FetchOptions) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!url) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Obtener el token del localStorage
            const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
            
            // Configurar headers por defecto
            const defaultHeaders: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Agregar token si existe
            if (token) {
                defaultHeaders['Authorization'] = `Bearer ${token}`;
            }

            // Combinar headers por defecto con los proporcionados en options
            const finalHeaders = {
                ...defaultHeaders,
                ...options?.headers,
            };

            // Configurar opciones del fetch
            const fetchOptions: RequestInit = {
                method: options?.method || 'GET',
                headers: finalHeaders,
            };

            // Agregar body si existe y el método lo permite
            if (options?.body && (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH')) {
                fetchOptions.body = JSON.stringify(options.body);
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [url]);

    // Ejecutar fetchData cuando url cambie
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Función refetch para llamar manualmente
    const refetch = useCallback(() => {
        if (url) {
            fetchData();
        }
    }, [fetchData, url]);

    return { data, loading, error, refetch };
}
