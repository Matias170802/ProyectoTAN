import { useFetch } from "@/generalHooks/useFetch"
import {type TiposTransaccionesExistentes, type TiposMonedasExistentes, type Categorias} from '../typesRegistrarIngresoEgresoCaja'
import {registrarIngresoEgreso} from '../serviceRegistrarIngresoEgresoCaja';
import {type formSchemaRegistrarIngresoEgresoCajaType} from '../models/modelRegistrarIngresoEgresoCaja';
import { useState } from "react";


export const useIngresoEgresoCaja = () => {

    const [errorEncontrado, setErrorEncontrado] = useState<string | null>(null);
    const {data: tiposTransaccion} = useFetch<TiposTransaccionesExistentes[]>('/api/finanzas/registrarIngresoEgresoCaja/tiposTransaccion');
    const {data: tiposMoneda} = useFetch<TiposMonedasExistentes[]>('/api/finanzas/registrarIngresoEgresoCaja/tiposMoneda');
    const {data: categorias} = useFetch<Categorias[]>('/api/finanzas/registrarIngresoEgresoCaja/categorias');
    
    const registrarIngresoEgresoCaja = async (transacion: formSchemaRegistrarIngresoEgresoCajaType) => {
        try {
            await registrarIngresoEgreso(transacion);
            setErrorEncontrado(null);
            return true;
        } catch (error: any) {
            setErrorEncontrado(error.message);
            return false;
        }

    }
    return{
        tiposTransaccion: tiposTransaccion || [],
        tiposMoneda: tiposMoneda || [],
        categorias : categorias || [],
        registrarIngresoEgresoCaja,
        errorEncontrado
    }
}