import { useMemo, useState } from 'react';
import {List} from '../../generalComponents/index';
import { useMainPageMiCaja } from './useMainPageMiCaja';
import './MainPageMiCaja.css'

const MainPageMiCaja: React.FC = () => {

    const [filter, setFilter] = useState<'todas' | 'ingresos' | 'egresos'>('todas');

    const columnas = ["Fecha", "Tipo", "Monto", "Descripcion", "Categoria"];
    const {movimientos, loadingMovimientos, errorMovimientos, refetchMovimientos, balance, errorBalance, loadingBalance, refetchBalance} = useMainPageMiCaja();

    const filteredMovimientos = useMemo(() => {
        const items = movimientos ?? [];
        
        // Formatear las fechas antes de filtrar
        const itemsWithFormattedDates = items.map(item => ({
            ...item,
            Fecha: item.fechaMovimiento 
                ? new Date(item.fechaMovimiento).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
                : '-',
            Tipo: item.tipoMovimiento,
            Monto: item.monedaMovimiento == "Dolar" ? `$USD${item.montoMovimiento}` : `$${item.montoMovimiento}`,
            Descripcion: item.descripcionMovimiento ? item.descripcionMovimiento : '-',
            Categoria: item.categoriaMovimiento
        }));
        
        if (filter === 'todas') return itemsWithFormattedDates;
        if (filter === 'ingresos') return itemsWithFormattedDates.filter(m => m.tipoMovimiento?.toString().toLowerCase().includes('ingres'));
        return itemsWithFormattedDates.filter(m => m.tipoMovimiento?.toString().toLowerCase().includes('egres'));
    }, [movimientos, filter]);


    return(
        <div id='mainPageMiCaja'>
            <h2>Mi Caja</h2>
            <section id="contenedorBalances">
                <div id="balanceARS" className={balance?.balanceARS && balance.balanceARS < 0 ? 'negative' : 'positive'}>
                    <h3>Balance en Pesos</h3>
                    <p>Tu saldo actual en ARS</p>
                    <p>${balance?.balanceARS ? balance.balanceARS : '0'}</p>

                </div>

                <div id="balanceUSD" className={balance?.balanceUSD && balance.balanceUSD < 0 ? 'negative' : 'positive'}>
                    <h3>Balance en Dólares</h3>
                    <p>Tu saldo actual en USD</p>
                    <p>$USD{balance?.balanceUSD ? balance.balanceUSD : '0'}</p>
                </div>
            </section>

            <section id="contenedorDeMovimientos">
                <header>
                    <h2>Historial de Movimientos</h2>
                </header>

                <div id='contenedorDeFiltros'>
                    <div className="filterSeg">
                        <button
                            className={`filterBtn ${filter === 'todas' ? 'active' : ''}`}
                            onClick={() => setFilter('todas')}
                            type="button"
                        >
                            Todas
                        </button>
                        <button
                            className={`filterBtn ${filter === 'ingresos' ? 'active' : ''}`}
                            onClick={() => setFilter('ingresos')}
                            type="button"
                        >
                            Ingresos
                        </button>
                        <button
                            className={`filterBtn ${filter === 'egresos' ? 'active' : ''}`}
                            onClick={() => setFilter('egresos')}
                            type="button"
                        >
                            Egresos
                        </button>
                    </div>
                </div>
                
                <List
                columnas={columnas}
                items={filteredMovimientos}
                loadingItems={loadingMovimientos}
                />
            </section>
        </div>
    )
}

export default MainPageMiCaja
