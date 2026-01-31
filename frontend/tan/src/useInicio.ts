import { useFetch } from "./generalHooks/useFetch";

interface Tarea {
    nroTarea: number;
    fechaYHoraTarea: Date;
    tipoTarea: string;
    descripcionTarea: string;
    ubicacionTarea: string;
    nombreTarea: string
}


export const useInicio = () => {
    const {data: tareas, loading: isLoadingTareas, error: errorTareas} = useFetch<Tarea[]>('/api/inicio/tareas');

    console.log('Tareas obtenidas en useInicio:', tareas);
    
    return {
        tareas,
        isLoadingTareas,
        errorTareas
    }
}