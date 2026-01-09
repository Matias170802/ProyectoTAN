import './ModalConsultarEstadisticasFinancieras.css';
import {type PropsConsultarEstadisticas} from './ModalConsultarEstadisticasFinancierasTypes'
import {List} from '../../../../generalComponents/index';
import { useState } from 'react';
import {type FiltrosEstadisticasFinancieras, useReportesFinanzas} from '../../hooks/useReportesFinanzas';

export const ModalConsultarEstadisticasFinancieras: React.FC<PropsConsultarEstadisticas> = () => {

    const columnas = ["Inmueble", "Huesped", "Check in", "Dias", "Total", "Ganancia Cliente", "Ganancia Empresa"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonthNumber = (currentDate.getMonth() + 1).toString();// +1 porque los meses van de 0 a 11

    // Estados para los filtros
    const [filtros, setFiltros] = useState<FiltrosEstadisticasFinancieras>({
        anio: currentYear,
        mes: currentMonthNumber
    });

    // Hook personalizado con los filtros
    const {estadisticasFinancieras, loading, error: errorEstadisticasFinancieras} = useReportesFinanzas(filtros);

    console.log('estadisticasFinancieras', estadisticasFinancieras);

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
                            <option value="2026" >2026</option>
                            <option value="2025">2025</option>
                            <option value='2024'>2024</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="mes">Mes</label>
                        <select 
                            name='mes'
                            value={filtros.mes || ''}
                            onChange={handleFiltroChange}
                        > 
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                            <option value="todos">Todos</option>
                        </select>
                    </div>
                </section>

                {errorEstadisticasFinancieras && (
                    <section id='contenedorError'>
                        <p>Error al cargar las estadísticas financieras: {errorEstadisticasFinancieras.message}</p>
                    </section>
                )}

                {estadisticasFinancieras && !errorEstadisticasFinancieras && !loading &&(

                    <div>
                        <section id='contenedorGananciasTotales'>

                        <div id='gananciasEmpresa'>
                            <p>Ganancias de la Empresa</p>
                            <p>${estadisticasFinancieras?.gananciasEmpresa || 0}</p>
                        </div>

                        <div id='gananciasCliente'>
                            <p>Ganancias del Cliente</p>
                            <p>${estadisticasFinancieras?.gananciasCliente || 0}</p>

                        </div>

                        <div id='gananciasTotales'>
                            <p>Total General</p>
                            <p>${estadisticasFinancieras?.gananciasTotales || 0}</p>

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
                )}
                


        </div>
    )
}