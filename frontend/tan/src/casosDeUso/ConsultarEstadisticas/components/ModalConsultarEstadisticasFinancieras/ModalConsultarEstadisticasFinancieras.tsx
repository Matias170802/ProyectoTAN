import './ModalConsultarEstadisticasFinancieras.css';
import {type PropsConsultarEstadisticas} from './ModalConsultarEstadisticasFinancierasTypes'
import {List} from '../../../../generalComponents/index';
import { useState } from 'react';
import {type FiltrosEstadisticasFinancieras, useReportesFinanzas} from '../../hooks/useReportesFinanzas';

export const ModalConsultarEstadisticasFinancieras: React.FC<PropsConsultarEstadisticas> = () => {

    const columnas = ["Inmueble", "Huesped", "Check in", "Dias", "Total", "Ganancia Cliente", "Ganancia Empresa"];

    // Estados para los filtros
    const [filtros, setFiltros] = useState<FiltrosEstadisticasFinancieras>({
        anio: undefined,
        mes: undefined
    });

    // Hook personalizado con los filtros
    const {estadisticasFinancieras, loading, error} = useReportesFinanzas(filtros);

    // Maneja los cambios en los filtros
    const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Convertir los datos de estadisticasReservas al formato esperado por List
    const itemsTablero = estadisticasFinancieras?.estadisticasReservas?.map(reserva => ({
        'Inmueble': reserva.inmueble,
        'Huesped': reserva.huesped,
        'Check in': reserva.checkin,
        'Dias': reserva.dias,
        'Total': reserva.total,
        'Ganancia Cliente': reserva.gananciaCliente,
        'Ganancia Empresa': reserva.gananciaEmpresa
    })) || [];


    return (

        <div className='modalConsultarEstadisticasFinancierasContent'>
                
                <section id='contenedorFiltrosModalEstadisticasFinancieras'>
                    <p>Filtros</p>
                    

                    <div>
                        <label htmlFor='anio'>Año</label>
                        <select 
                            name='anio'
                            value={filtros.anio || ''}
                            onChange={handleFiltroChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value='2024'>2024</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="mes">Mes</label>
                        <select 
                            name='mes'
                            value={filtros.mes || ''}
                            onChange={handleFiltroChange}
                        > 
                            <option value="">Seleccionar</option>
                            <option value="enero">Enero</option>
                            <option value="febrero">Febrero</option>
                            <option value="marzo">Marzo</option>
                            <option value="abril">Abril</option>
                            <option value="mayo">Mayo</option>
                            <option value="junio">Junio</option>
                            <option value="julio">Julio</option>
                            <option value="agosto">Agosto</option>
                            <option value="septiembre">Septiembre</option>
                            <option value="octubre">Octubre</option>
                            <option value="noviembre">Noviembre</option>
                            <option value="diciembre">Diciembre</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                </section>

                <section id='contenedorGananciasTotales'>

                    <div id='gananciasEmpresa'>
                        <p>Ganancias de la Empresa</p>
                        <p>{estadisticasFinancieras?.gananciasEmpresa || 0}</p>
                    </div>

                    <div id='gananciasCliente'>
                        <p>Ganancias del Cliente</p>
                        <p>{estadisticasFinancieras?.gananciasCliente || 0}</p>

                    </div>

                    <div id='gananciasTotales'>
                        <p>Total General</p>
                        <p>{estadisticasFinancieras?.gananciasTotales || 0}</p>

                    </div>

                </section>

                <section id='contenedorGraficos'>

                    <p>Distribucion de Ganancias por Inmueble</p>
                    <p id='subtitulo'>Ganacias del Cliente vs Ganancias de la Empresa</p>

                    <div>grafico aca</div>

                </section>

                <section id='contenedorDetallesGanancias'>

                    <List
                    columnas={columnas}
                    items={itemsTablero}
                    />

                </section>


        </div>
    )
}