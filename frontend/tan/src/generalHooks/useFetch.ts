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
export const useFetch = <T>(url: string | null) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        
        if (!url || url.trim() === "") {
            console.log('useFetch: URL vacía o null, saltando petición');
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }

        console.log('useFetch: Realizando petición a:', url);
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('useFetch: Data recibida exitosamente:', result);
            setData(result);
            
        } catch (err) {
            console.error('useFetch: Error en la petición:', err);
            setError(err instanceof Error ? err : new Error('Error desconocido'));
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};
