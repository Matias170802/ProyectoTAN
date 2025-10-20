import { useFetch } from "@/generalHooks/useFetch"
import {type TiposTransaccionesExistentes} from '../typesRegistrarIngresoEgresoCaja'

export const useIngresoEgresoCaja = () => {
    //TODO: IMPLEMENTAR BUSQUEDAS DE: TIPO TRANSACCION, CATEGORIAMOVIMIENTO, SUBCATEGORIA(EMPLEADOS O INMUEBLES), TIPO OPERACION(CHECKIN, ETC)
    const {data: tiposTransaccion} = useFetch<TiposTransaccionesExistentes[]>('/api/finanzas/registrarIngresoEgresoCaja/tiposTransaccion');

    return{
        tiposTransaccion: tiposTransaccion || []
    }
}