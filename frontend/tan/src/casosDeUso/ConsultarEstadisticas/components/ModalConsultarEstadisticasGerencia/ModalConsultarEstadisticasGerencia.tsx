import {type PropsConsultarEstadisticas, type EstadisticasGerenciaReservas, type EstadisticasGerenciaInmuebles, type InmuebleOption} from './ModalConsultarEstadisticasGerenciaTypes';
import './ModalConsultarEstadisticasGerencia.css';
import {Button, List} from '../../../../generalComponents/index';
import { useState } from 'react';
import { useReportesGerencia, type FiltrosEstadisticasGerencia } from '../../hooks/useReportesGerencia';
import { useFetch } from '@/generalHooks/useFetch';

export const ModalConsultarEstadisticasGerencia: React.FC<PropsConsultarEstadisticas> = () => {
    
    const columnasReservas = ["Inmueble", "Huesped", "Check in", "Check out", "Dias", "Estado", "Monto Total"];
    const columnasInmuebles = ["Huesped", "Check in", "Check out", "Dias", "Estado", "Monto Total"];
    const [activo, setActivo] = useState<'inmuebles' | 'reservas'>('reservas'); 
    const [filtros, setFiltros] = useState<FiltrosEstadisticasGerencia>({});

    //*fetch para traerme los inmuebles para el filtro inmuebles cuando el activo es igual a "Inmuebles"
    const { data: inmueblesFiltro} = useFetch<InmuebleOption[]>(
        activo === 'inmuebles' ? '/api/reportes/inmuebles' : null
    );

    //*nombre del inmueble seleccionado en el filtro
    const inmuebleSeleccionado = inmueblesFiltro?.find(inmueble => inmueble.codInmueble === filtros.inmueble)?.nombreInmueble;

    //* Fetch de estadisticas según el activo y filtros
    const reportes = useReportesGerencia(activo, filtros);

    const estadisticasGerenciaReservas = (reportes as { estadisticasGerenciaReservas?: EstadisticasGerenciaReservas })?.estadisticasGerenciaReservas;
    const estadisticasGerenciaInmuebles = (reportes as { estadisticasGerenciaInmuebles?: EstadisticasGerenciaInmuebles })?.estadisticasGerenciaInmuebles;

    const handleFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    //TODO: Placeholder para la lista hasta que se conecte a datos reales
    const itemsTablero: any[] = [];

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

                {activo === 'inmuebles' && (!inmuebleSeleccionado || inmuebleSeleccionado === 'seleccionarInmueble') && (
                        <section id='mensajeSeleccioneInmueble'>
                            <p>Por favor seleccione un inmueble para ver el reporte</p>
                            <p>Utiliza el filtro de arriba para seleccionar un inmueble específico</p>
                        </section>
                )}

                {activo === 'reservas' && (
                    <section id='contenedorGananciasTotales'>

                        <div id='totalReservas'>
                            <p>Total de Reservas</p>
                            <p>{estadisticasGerenciaReservas?.gananciasEmpresa || 0}</p>
                        </div>

                        <div id='diasTotalesReservados'>
                            <p>Días Totales Reservados</p>
                            <p>{estadisticasGerenciaReservas?.gananciasCliente || 0}</p>

                        </div>

                        <div id='montoTotalGanancias'>
                            <p>Monto Total</p>
                            <p>{estadisticasGerenciaReservas?.gananciasTotales || 0}</p>

                        </div>

                        <div id='promedioPorReserva'>
                            <p>Promedio por Reserva</p>
                            <p>{estadisticasGerenciaReservas?.gananciasTotales || 0}</p>

                        </div>

                    </section>

                )}
                
                {activo === 'inmuebles' &&  inmuebleSeleccionado && (
                    <section id='contenedorGananciasTotales'>

                        <div id='totalReservasINmueble'>
                            <p>Reservas del Inmueble</p>
                            <p>{estadisticasGerenciaInmuebles?.gananciasEmpresa || 0}</p>
                        </div>

                        <div id='diasTotalesOcupados'>
                            <p>Días Totales Ocupados</p>
                            <p>{estadisticasGerenciaInmuebles?.gananciasCliente || 0}</p>

                        </div>

                        <div id='tasaOcupacionInmueble'>
                            <p>Tasa de Ocupación</p>
                            <p>{estadisticasGerenciaInmuebles?.gananciasCliente || 0}</p>

                        </div>

                        <div id='montoTotalGanancias'>
                            <p>Ingresos Totales</p>
                            <p>{estadisticasGerenciaInmuebles?.gananciasTotales || 0}</p>

                        </div>

                    </section>
                )}



                {activo === 'reservas' && (
                    <section id='contenedorGraficos'>

                        <p>Incidencia de Reserva por Inmueble</p>
                        <p className='subtitulo'>Participación porcentual de cada inmueble sobre el total de reservas</p>

                        <div>grafico aca</div>

                    </section>
                )}

                {activo === 'inmuebles' &&  inmuebleSeleccionado && (
                    <section id='contenedorGraficos'>

                        <p>Ocupación del Inmueble {inmuebleSeleccionado}</p>
                        <p className='subtitulo'>Distribución de días ocupados vs. disponibles en el período seleccionado</p>

                        <div>grafico aca</div>

                        <section id='contenedorAnalisisGrafico'>
                            <p id='analisisGrafico'>Analisis: ....</p>
                        </section>

                    </section>
                )}
                
                {activo === 'reservas' && (
                    <section id='contenedorDetallesGanancias'>

                        <p>Detalle de Reservas</p>
                        <p className='subtitulo'>Información completa de cada reserva</p>
                        
                        <List
                        columnas={columnasReservas}
                        items={itemsTablero}
                        />

                    </section>
                )}

                {activo === 'inmuebles' &&  inmuebleSeleccionado &&(
                    <section id='contenedorDetallesGanancias'>

                        <p>Reservas de {inmuebleSeleccionado}</p>
                        <p className='subtitulo'>Detalle completo de todas las reservas del inmueble del periodo seleccionado</p>
                        
                        <List
                        columnas={columnasInmuebles}
                        items={itemsTablero}
                        />

                    </section>
                )}

                
        </div>
    )
}