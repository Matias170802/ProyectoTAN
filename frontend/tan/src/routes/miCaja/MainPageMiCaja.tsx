import { useMemo, useState } from 'react';
import {List} from '../../generalComponents/index';
import { useMainPageMiCaja } from './useMainPageMiCaja';

const MainPageMiCaja: React.FC = () => {

    const [filter, setFilter] = useState<'todas' | 'ingresos' | 'egresos'>('todas');

    const columnas = ["Fecha", "Tipo", "Monto", "Descripcion", "Categoria"];
    const {movimientos, loadingMovimientos, errorMovimientos, refetchMovimientos, balance, errorBalance, loadingBalance, refetchBalance} = useMainPageMiCaja();

    const filteredMovimientos = useMemo(() => {
        const items = movimientos ?? [];
        if (filter === 'todas') return items;
        if (filter === 'ingresos') return items.filter(m => m.tipoMovimiento?.toString().toLowerCase().includes('ingres'));
        return items.filter(m => m.tipoMovimiento?.toString().toLowerCase().includes('egres'));
    }, [movimientos, filter]);


    return(
        <div>
            <main>
                <section id="contenedorBalances">
                    <div id="balanceARS">
                        <h3>Balance en Pesos</h3>
                        <p>Tu saldo actual en ARS</p>
                        <p>${}</p>

                    </div>

                    <div id="balanceUSD">
                        <h3>Balance en Dolares</h3>
                        <p>Tu saldo actual en USD</p>
                        <p>$USD{}</p>
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
                    items={movimientos ?? []}
                    loadingItems={loadingMovimientos}
                    />
                </section>
            </main>
        </div>
    )
}

export default MainPageMiCaja
