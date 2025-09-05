import {useEffect, useState} from "react";

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
export const useFetch = <T> (url:string, options: FetchOptions = {}): Params <T> => {
	const [data, setData] = useState<Data<T>> (null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<ErrorType> (null)
	
	useEffect( () => {
		setLoading(true)

        //*defino la funcion que me hace la peticion al back
		const fetchData = async () => {
			try {
				const response = await fetch(url, {
                    method: options.method || 'GET',
                    headers: options.headers,
                    body: options.body ? JSON.stringify(options.body) : null,
                });
				
				if (!response.ok) {
					throw new Error("Error en la peticion")
				}
				
				//*paso la respuesta que me devolvio la api a formato json
				const jsonData: T = await response.json();
				setData(jsonData)
				setError(null)

			} catch (err) {
				setError(err as Error)
			} finally { 
				setLoading(false)
			}
		}
		
		//*llamo a la funcion que me realiza la peticion
		fetchData();
	}, [url])
	
	return {data, loading, error}
}
