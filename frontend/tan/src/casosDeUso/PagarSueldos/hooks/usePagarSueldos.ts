import { useFetch } from "@/generalHooks/useFetch";

interface Empleado {

    dniEmpleado: string;
    nombreEmpleado: string;
    sueldoEmpleado: number
}


export const usePagarSueldos = (dniEmpleado: string) => {

    const {data: empleados, loading: loadingEmpleados, refetch: refetchEmpleados, error: errorEmpleados} = useFetch<Empleado[]>('/api/finanzas/pagarSueldos');

    const {}
    return {
        empleados,
        loadingEmpleados,
        refetchEmpleados,
        errorEmpleados
    }
}