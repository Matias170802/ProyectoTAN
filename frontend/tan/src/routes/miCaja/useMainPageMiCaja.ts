import { useFetch } from "@/generalHooks/useFetch"

export interface Movimiento {

    monedaMovimiento: string;
    montoMovimiento:number;
    fechaMovimiento: Date;
    tipoMovimiento: string;
    descripcionMovimiento: string;
    categoriaMovimiento: string;
}


export const useMainPageMiCaja = (esGerencia: boolean, reporteSeleccionado: 'cajaMadre' | 'miCaja') => {
    
    //en caso de que no tenga el rol de gerencia o tenga el rol de gerencia péro esté seleccionado el boton de mostrar "Mi Caja"
    if (!esGerencia || (esGerencia && reporteSeleccionado === 'miCaja')) {
        const {data: movimientos, loading: loadingMovimientos, error: errorMovimientos, refetch: refetchMovimientos} = useFetch<Movimiento[] | []>('/api/finanzas/movimientos');
        const {data: balance, loading: loadingBalance, error: errorBalance, refetch: refetchBalance} = useFetch<{balanceARS: number, balanceUSD: number}>('/api/finanzas/balance');
    
        return {
        movimientos,
        loadingMovimientos,
        errorMovimientos,
        refetchMovimientos,
        balance,
        loadingBalance,
        errorBalance,
        refetchBalance
        }
    }

    //caso de que sea gerencia y tenga seleccionado el boton de mostrar "Caja Madre"
    if (esGerencia && reporteSeleccionado === 'cajaMadre') {
        const {data: movimientos, loading: loadingMovimientos, error: errorMovimientos, refetch: refetchMovimientos} = useFetch<Movimiento[] | []>('/api/finanzas/movimientosCajaMadre');
        const {data: balance, loading: loadingBalance, error: errorBalance, refetch: refetchBalance} = useFetch<{balanceARS: number, balanceUSD: number}>('/api/finanzas/balanceCajaMadre');
    
        return {
        movimientos,
        loadingMovimientos,
        errorMovimientos,
        refetchMovimientos,
        balance,
        loadingBalance,
        errorBalance,
        refetchBalance
        }
    }

    //en caso de error
    return {
        movimientos: [],
        loadingMovimientos: false,
        errorMovimientos: null,
        refetchMovimientos: () => {},
        balance: null,
        loadingBalance: false,
        errorBalance: null,
        refetchBalance: () => {}
    };

}