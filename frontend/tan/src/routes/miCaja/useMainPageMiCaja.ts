import { useFetch } from "@/generalHooks/useFetch"

interface Movimiento {

    monedaMovimiento: string;
    montoMovimiento:number;
    fechaMovimiento: Date;
    tipoMovimiento: string;
    descripcionMovimiento: string;
    categoriaMovimiento: string;
}


export const useMainPageMiCaja = () => {
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