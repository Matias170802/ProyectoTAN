import './ModalConsultarEstadisticasCliente.css';
import { type PropsConsultarEstadisticasCliente } from './ModalConsultarEstadisticasClienteTypes';
import { List } from '../../../../generalComponents/index';
import { useState } from 'react';
import { type FiltrosClienteReportes, useInmueblesCliente, useFinanzasCliente, useReservasCliente } from '../../hooks/useClienteReportes';
import { useUserContext } from '../../../../context/UserContext';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export const ModalConsultarEstadisticasCliente: React.FC<PropsConsultarEstadisticasCliente> = () => {
    const { user } = useUserContext();
    const codCliente = user?.codigo;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonthNumber = (currentDate.getMonth() + 1).toString();

    // Obtener inmuebles del cliente
    const { inmuebles, loading: loadingInmuebles, error: errorInmuebles } = useInmueblesCliente(codCliente);

    // Estado para el inmueble seleccionado
    const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState<string>('');

    // Estados para los filtros
    const [filtros, setFiltros] = useState<FiltrosClienteReportes>({
        anio: currentYear,
        mes: currentMonthNumber,
        codInmueble: ''
    });

    // Obtener finanzas y reservas del cliente
    const { finanzas, loading: loadingFinanzas, error: errorFinanzas } = useFinanzasCliente(filtros.codInmueble ? filtros : undefined);
    const { reservas, loading: loadingReservas, error: errorReservas } = useReservasCliente(filtros.codInmueble ? filtros : undefined);

    // Maneja el cambio de inmueble seleccionado
    const handleInmuebleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const codInmueble = e.target.value;
        setInmuebleSeleccionado(codInmueble);
        setFiltros(prev => ({
            ...prev,
            codInmueble: codInmueble
        }));
    };

    // Maneja los cambios en los filtros de año y mes
    const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Meses en español
    const MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Procesar datos de finanzas por mes
    const procesarFinanzasPorMes = () => {
        if (!finanzas || finanzas.length === 0) return [];
        
        const dataPorMes: Record<number, number> = {};
        
        finanzas.forEach(finanza => {
            const fecha = new Date(finanza.fechaMovimiento);
            const mes = fecha.getMonth() + 1;
            dataPorMes[mes] = (dataPorMes[mes] || 0) + finanza.montoMovimiento;
        });

        return Object.entries(dataPorMes)
            .map(([mes, monto]) => ({
                mes: MESES_CORTOS[parseInt(mes) - 1],
                Recaudado: parseFloat(monto.toFixed(2))
            }))
            .sort((a, b) => MESES_CORTOS.indexOf(a.mes) - MESES_CORTOS.indexOf(b.mes));
    };

    // Procesar datos de reservas por mes
    const procesarReservasPorMes = () => {
        if (!reservas || reservas.length === 0) return [];
        
        const dataPorMes: Record<number, number> = {};
        
        reservas.forEach(reserva => {
            const fecha = new Date(reserva.fechaInicioReserva);
            const mes = fecha.getMonth() + 1;
            dataPorMes[mes] = (dataPorMes[mes] || 0) + 1;
        });

        return Object.entries(dataPorMes)
            .map(([mes, cantidad]) => ({
                mes: MESES_CORTOS[parseInt(mes) - 1],
                Cantidad: cantidad
            }))
            .sort((a, b) => MESES_CORTOS.indexOf(a.mes) - MESES_CORTOS.indexOf(b.mes));
    };

    const datosGraficosFinanzas = procesarFinanzasPorMes();
    const datosGraficosReservas = procesarReservasPorMes();

    // Convertir datos de finanzas para la tabla
    const columnasFinanzas = ['Fecha', 'Descripción', 'Categoría', 'Moneda', 'Monto'];
    const itemsFinanzas = finanzas?.map(finanza => ({
        'Fecha': new Date(finanza.fechaMovimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Descripción': finanza.descripcionMovimiento,
        'Categoría': finanza.nombreCategoriaMovimiento,
        'Moneda': finanza.monedaMovimiento,
        'Monto': `${finanza.montoMovimiento}`
    })) || [];

    // Convertir datos de reservas para la tabla
    const columnasReservas = ['Inicio', 'Fin', 'Huésped', 'Estado', 'Monto'];
    const itemsReservas = reservas?.map(reserva => ({
        'Inicio': new Date(reserva.fechaInicioReserva).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Fin': new Date(reserva.fechaFinReserva).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        'Huésped': reserva.nombreHuesped,
        'Estado': reserva.estadoReserva,
        'Monto': `${reserva.montoTotalReserva}`
    })) || [];

    return (
        <div className='modalConsultarEstadisticasClienteContent'>
            {/* Seleccionar Inmueble */}
            {loadingInmuebles && (
                <section id='contenedorCargando'>
                    <p>Cargando inmuebles...</p>
                </section>
            )}

            {errorInmuebles && (
                <section id='contenedorError'>
                    <p>Error al cargar los inmuebles: {errorInmuebles.message}</p>
                </section>
            )}

            {inmuebles && inmuebles.length > 0 && !loadingInmuebles && (
                <>
                    <section id='contenedorSeleccionarInmueble'>
                        <p>Seleccionar Propiedad</p>
                        <select value={inmuebleSeleccionado} onChange={handleInmuebleChange}>
                            <option value="">-- Selecciona un inmueble --</option>
                            {inmuebles.map(inmueble => (
                                <option key={inmueble.codInmueble} value={inmueble.codInmueble}>
                                    {inmueble.nombreInmueble}
                                </option>
                            ))}
                        </select>
                    </section>

                    {/* Mostrar filtros y tablas solo si hay inmueble seleccionado */}
                    {inmuebleSeleccionado && (
                        <>
                            {/* Filtros */}
                            <section id='contenedorFiltrosModalEstadisticasCliente'>
                                <p>Filtros</p>

                                <div>
                                    <label htmlFor='anio'>Año</label>
                                    <select
                                        name='anio'
                                        value={filtros.anio || ''}
                                        onChange={handleFiltroChange}
                                    >
                                        <option value="2027">2027</option>
                                        <option value="2026">2026</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
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

                            {/* Tablas */}
                            {(loadingFinanzas || loadingReservas) && (
                                <section id='contenedorCargando'>
                                    <p>Cargando reportes...</p>
                                </section>
                            )}

                            {(errorFinanzas || errorReservas) && (
                                <section id='contenedorError'>
                                    {errorFinanzas && <p>Error al cargar finanzas: {errorFinanzas.message}</p>}
                                    {errorReservas && <p>Error al cargar reservas: {errorReservas.message}</p>}
                                </section>
                            )}

                            {!loadingFinanzas && !loadingReservas && !errorFinanzas && !errorReservas && (
                                <div id='contenedorTablas'>
                                    {/* Tabla de Ganancias */}
                                    <div className='tablaReporteCliente'>
                                        <h3>
                                            Reporte de Ganancias
                                        </h3>
                                        
                                        {finanzas && finanzas.length > 0 && datosGraficosFinanzas.length > 0 && (
                                            <section id='contenedorGraficosCliente'>
                                                <p>Recaudación por Mes</p>
                                                <div className='chartWrapper'>
                                                    <ResponsiveContainer width="100%" height={320}>
                                                        <BarChart data={datosGraficosFinanzas} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="mes" />
                                                            <YAxis label={{ value: 'USD', angle: -90, position: 'left' }} />
                                                            <Tooltip formatter={(value) => `USD$ ${value}`} />
                                                            <Bar dataKey="Recaudado" fill="#4CAF50" name="Recaudado" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </section>
                                        )}
                                        
                                        {finanzas && finanzas.length > 0 ? (
                                            <List columnas={columnasFinanzas} items={itemsFinanzas} />
                                        ) : (
                                            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No hay movimientos para este período</p>
                                        )}
                                    </div>

                                    {/* Tabla de Reservas */}
                                    <div className='tablaReporteCliente'>
                                        <h3>
                                            Reporte de Reservas
                                        </h3>
                                        
                                        {reservas && reservas.length > 0 && datosGraficosReservas.length > 0 && (
                                            <section id='contenedorGraficosCliente'>
                                                <p>Cantidad de Reservas por Mes</p>
                                                <div className='chartWrapper'>
                                                    <ResponsiveContainer width="100%" height={320}>
                                                        <BarChart data={datosGraficosReservas} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="mes" />
                                                            <YAxis label={{ value: 'Cantidad', angle: -90, position: 'left' }} />
                                                            <Tooltip />
                                                            <Bar dataKey="Cantidad" fill="#1E88E5" name="Cantidad de Reservas" />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </section>
                                        )}
                                        
                                        {reservas && reservas.length > 0 ? (
                                            <List columnas={columnasReservas} items={itemsReservas} />
                                        ) : (
                                            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No hay reservas para este período</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {inmuebles && inmuebles.length === 0 && !loadingInmuebles && !errorInmuebles && (
                <section id='contenedorError'>
                    <p>No tienes propiedades registradas</p>
                </section>
            )}
        </div>
    );
};
