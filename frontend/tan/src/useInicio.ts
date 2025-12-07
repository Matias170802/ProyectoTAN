import { useFetch } from "./generalHooks/useFetch";

export const useInicio = () => {
    const {data: tareas, loading: isLoadingTareas, error: errorTareas} = useFetch('/api/inicio/tareas');

    return {
        tareas,
        isLoadingTareas,
        errorTareas
    }
}