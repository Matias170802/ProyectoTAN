import {type PropsConsultarEstadisticas, type EstadisticasGerenciaReservas, type EstadisticasGerenciaInmuebles, type InmuebleOption} from './ModalConsultarEstadisticasGerenciaTypes';
import './ModalConsultarEstadisticasGerencia.css';
import {Button, List} from '../../../../generalComponents/index';
import { useState } from 'react';
import { useReportesGerencia, type FiltrosEstadisticasGerencia } from '../../hooks/useReportesGerencia';
import { useFetch } from '@/generalHooks/useFetch';

export const ModalConsultarEstadisticasGerencia: React.FC<PropsConsultarEstadisticas> = () => {
    
    const columnasReservas = ["Inmueble", "Huesped", "Check in", "Check out", "Dias", "Estado", "Monto Total"];
    const columnasInmuebles = ["Huesped", "Check in", "Check out", "Dias", "Estado", "Monto Total"];
    //*variables para indicar en los filtros como predeterminado el año y mes actual
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonthNumber = (currentDate.getMonth() + 1).toString();// +1 porque los meses van de 0 a 11
    //*variables para indicar en los filtros como predeterminado el año y mes actual
    const [activo, setActivo] = useState<'inmuebles' | 'reservas'>('reservas'); 
    const [filtros, setFiltros] = useState<FiltrosEstadisticasGerencia>({
        anio: currentYear,
        mes: currentMonthNumber
    });

    //*fetch para traerme los inmuebles para el filtro inmuebles cuando el activo es igual a "Inmuebles"
    const { data: inmueblesFiltro} = useFetch<InmuebleOption[]>(
        activo === 'inmuebles' ? '/api/reportes/inmuebles' : null
    );

    //*nombre del inmueble seleccionado en el filtro
    const inmuebleSeleccionado = inmueblesFiltro?.find(inmueble => inmueble.codInmueble === filtros.inmueble)?.nombreInmueble;

    //* Fetch de estadisticas según el activo y filtros
    const { data: reportesData, loading, error } = useReportesGerencia(activo, filtros);

    const estadisticasGerenciaReservas = activo === 'reservas' ? reportesData as EstadisticasGerenciaReservas : undefined;
    const estadisticasGerenciaInmuebles = activo === 'inmuebles' ? reportesData as EstadisticasGerenciaInmuebles : undefined;

    const handleFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };


    //* items para el componente list ya transformados al formato esperado RESERVAS
    const itemsTableroReservas = estadisticasGerenciaReservas ? estadisticasGerenciaReservas.detalleReservas.map(reserva => ({
        'Inmueble': reserva.nombreInmueble,
        'Huesped': reserva.huesped,
        'Check in': new Date(reserva.checkIn).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Dias': reserva.dias,
        'Total': `USD$ ${reserva.montoTotalReserva}`,
        'Estado': reserva.estadoReserva
    })) : [];

    //* items para el componente list ya transformados al formato esperado INMUEBLES
    const itemsTableroInmuebles = estadisticasGerenciaInmuebles ? estadisticasGerenciaInmuebles.detalleReservas.map(inmueble => ({
        'Huesped': inmueble.huesped,
        'Check in': new Date(inmueble.checkIn).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Check out': new Date(inmueble.checkOut).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Dias': inmueble.dias,
        'Total': `USD$ ${inmueble.montoTotalReserva}`,
        'Estado': inmueble.estadoReserva
    })) : [];


    return (
        <div id='modalConsultarEstadisticasGerenciaContent'>

            <section id='contenedorSelectInmuebeOReservas'>
                
                <Button
                    label="Reservas"
                    id="botonReservas"
                    type="button"
                    onClick={() => setActivo('reservas')}
                    className={activo === 'reservas' ? 'toggle-active' : 'toggle-inactive'}
                />
                <Button
                    label="Inmuebles"
                    id="botonInmuebles"
                    type="button"
                    onClick={() => setActivo('inmuebles')}
                    className={activo === 'inmuebles' ? 'toggle-active' : 'toggle-inactive'}
                />
            
            </section>

            <section id='contenedorFiltrosModalEstadisticasFinancieras'>
                    <p>Filtros</p>
                    

                    <div>
                        <label htmlFor='anio'>Año</label>
                        <select 
                            name='anio'
                            value={filtros.anio || ''}
                            onChange={handleFiltroChange}
                        >
                            <option value="2026">2026</option>
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

                    {activo === 'inmuebles' && (
                        <div>
                            <label htmlFor="inmueble">Inmueble</label>
                            <select 
                                name="inmueble"
                                value={filtros.inmueble || ''}
                                onChange={handleFiltroChange}
                            >
                                <option value="seleccionarInmueble">Seleccionar Inmueble</option>
                                {inmueblesFiltro?.map((inmueble) => (
                                    <option key={inmueble.codInmueble} value={inmueble.codInmueble}>
                                        {inmueble.nombreInmueble}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                </section>

                {error && (
                    <section id='contenedorError'>
                        <p>Error al cargar las estadísticas: {error.message}</p>
                    </section>
                )}

                {!loading && !error && activo === 'inmuebles' && (!inmuebleSeleccionado || inmuebleSeleccionado === 'seleccionarInmueble') && (
                        <section id='mensajeSeleccioneInmueble'>
                            <p>Por favor seleccione un inmueble para ver el reporte</p>
                            <p>Utiliza el filtro de arriba para seleccionar un inmueble específico</p>
                        </section>
                )}

                {!loading && !error && activo === 'reservas' && (
                    <section id='contenedorGananciasTotales'>

                        <div id='totalReservas'>
                            <p>Total de Reservas</p>
                            <p>${estadisticasGerenciaReservas?.cantTotalReservas || 0}</p>
                        </div>

                        <div id='diasTotalesReservados'>
                            <p>Días Totales Reservados</p>
                            <p>${estadisticasGerenciaReservas?.diasTotalesReservados || 0}</p>

                        </div>

                        <div id='montoTotalGanancias'>
                            <p>Monto Total</p>
                            <p>${estadisticasGerenciaReservas?.montoTotalGanado || 0}</p>

                        </div>

                        <div id='promedioPorReserva'>
                            <p>Promedio por Reserva</p>
                            <p>${estadisticasGerenciaReservas?.montoPromedioPorReserva || 0}</p>

                        </div>

                    </section>

                )}
                
                {!loading && !error && activo === 'inmuebles' && inmuebleSeleccionado && (
                    <section id='contenedorGananciasTotales'>

                        <div id='totalReservasINmueble'>
                            <p>Reservas del Inmueble</p>
                            <p>${estadisticasGerenciaInmuebles?.cantidadReservasInmueble || 0}</p>
                        </div>

                        <div id='diasTotalesOcupados'>
                            <p>Días Totales Ocupados</p>
                            <p>${estadisticasGerenciaInmuebles?.totalDiasOcupadosInmueble || 0}</p>

                        </div>

                        <div id='tasaOcupacionInmueble'>
                            <p>Tasa de Ocupación</p>
                            <p>${estadisticasGerenciaInmuebles?.tasaOcupacionInmueble || 0}</p>

                        </div>

                        <div id='montoTotalGanancias'>
                            <p>Ingresos Totales</p>
                            <p>${estadisticasGerenciaInmuebles?.ingresosGeneradosInmueble || 0}</p>

                        </div>

                    </section>
                )}



                {!loading && !error && activo === 'reservas' && (
                    <section id='contenedorGraficos'>

                        <p>Incidencia de Reserva por Inmueble</p>
                        <p className='subtitulo'>Participación porcentual de cada inmueble sobre el total de reservas</p>

                        <div>grafico aca</div>

                    </section>
                )}

                {!loading && !error && activo === 'inmuebles' && inmuebleSeleccionado && (
                    <section id='contenedorGraficos'>

                        <p>Ocupación del Inmueble {inmuebleSeleccionado}</p>
                        <p className='subtitulo'>Distribución de días ocupados vs. disponibles en el período seleccionado</p>

                        <div>grafico aca</div>

                        <section id='contenedorAnalisisGrafico'>
                            <p id='analisisGrafico'>Analisis: El inmueble tuvo una ocupación de {estadisticasGerenciaInmuebles?.tasaOcupacionInmueble || 0}% durante {filtros.mes} de {filtros.anio}, con {estadisticasGerenciaInmuebles?.cantidadReservasInmueble} reservas que totalizaron {estadisticasGerenciaInmuebles?.totalDiasOcupadosInmueble} días ocupados de los {(estadisticasGerenciaInmuebles?.totalDiasLibresInmueble ?? 0) + (estadisticasGerenciaInmuebles?.totalDiasOcupadosInmueble ?? 0)} días disponibles</p>
                        </section>

                    </section>
                )}
                
                {!loading && !error && activo === 'reservas' && (
                    <section id='contenedorDetallesGanancias'>

                        <p>Detalle de Reservas</p>
                        <p className='subtitulo'>Información completa de cada reserva</p>
                        
                        <List
                        columnas={columnasReservas}
                        items={itemsTableroReservas}
                        />

                    </section>
                )}

                {!loading && !error && activo === 'inmuebles' && inmuebleSeleccionado && (
                    <section id='contenedorDetallesGanancias'>

                        <p>Reservas de {inmuebleSeleccionado}</p>
                        <p className='subtitulo'>Detalle completo de todas las reservas del inmueble del periodo seleccionado</p>
                        
                        <List
                        columnas={columnasInmuebles}
                        items={itemsTableroInmuebles}
                        />

                    </section>
                )}

                
        </div>
    )
}