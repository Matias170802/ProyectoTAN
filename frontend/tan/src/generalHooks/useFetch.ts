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
export function useFetch<T>(url: string | null) {
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
