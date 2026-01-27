import './MainPageCliente.css';
import { useMainPageCliente } from './useMainPageCliente';
import { List } from '@/generalComponents';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaMapMarkerAlt, FaBed, FaBath, FaHome } from 'react-icons/fa';

const MainPageCliente: React.FC = () => {
    const {
        propiedades,
        loadingPropiedades,
        reporteGanancias,
        loadingGanancias,
        reporteReservas,
        loadingReservas,
        filtros,
        setFiltros,
        propiedadSeleccionada
    } = useMainPageCliente();

    // Nombres de meses en español
    const MESES_ES: Record<string, string> = {
        '1': 'Enero',
        '2': 'Febrero',
        '3': 'Marzo',
        '4': 'Abril',
        '5': 'Mayo',
        '6': 'Junio',
        '7': 'Julio',
        '8': 'Agosto',
        '9': 'Septiembre',
        '10': 'Octubre',
        '11': 'Noviembre',
        '12': 'Diciembre'
    };

    // Handler para cambios en los filtros
    const handleFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    // Columnas para la tabla de ganancias
    const columnasGanancias = ['Fecha', 'Concepto', 'Moneda', 'Monto'];

    // Items para la tabla de ganancias
    const itemsGanancias = reporteGanancias?.detalleGanancias.map(ganancia => ({
        Fecha: new Date(ganancia.fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        Concepto: ganancia.concepto,
        Moneda: ganancia.moneda === 'ARS' ? 'ARS' : 'USD',
        Monto: ganancia.moneda === 'ARS' ? `$${ganancia.monto}` : `US$${ganancia.monto}`
    })) || [];

    // Columnas para la tabla de reservas
    const columnasReservas = ['Fecha Inicio', 'Fecha Fin', 'Duracion', 'Moneda', 'Ganancia'];

    // Items para la tabla de reservas
    const itemsReservas = reporteReservas?.detalleReservas.map(reserva => ({
        'Fecha Inicio': new Date(reserva.fechaInicio).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        'Fecha Fin': new Date(reserva.fechaFin).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }),
        'Duracion': `${reserva.duracion} dias`,
        'Moneda': reserva.moneda === 'ARS' ? 'ARS' : 'USD',
        'Ganancia': reserva.moneda === 'ARS' ? `$${reserva.ganancia}` : `US$${reserva.ganancia}`
    })) || [];

    // Colores para gráficos
    const coloresDuracion = ['#3B82F6', '#10B981', '#F59E0B'];

    return (
        <div className="mainPageClienteContainer">
            <div id="mainPageClienteContent">
                <h1 className="titulo">Portal del Cliente</h1>

                {/* Sección: Seleccionar Propiedad */}
                <section id="selectorPropiedadSection">
                    <h3>Seleccionar Propiedad</h3>
                    <select 
                        name="inmueble"
                        value={filtros.inmueble}
                        onChange={handleFiltroChange}
                        disabled={loadingPropiedades}
                    >
                        {propiedades?.map(propiedad => (
                            <option key={propiedad.codInmueble} value={propiedad.codInmueble}>
                                {propiedad.nombreInmueble}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Card de Propiedad Seleccionada */}
                {propiedadSeleccionada && (
                    <section id="cardPropiedadSeleccionada">
                        <div className="cardHeader">
                            <h2>{propiedadSeleccionada.nombreInmueble}</h2>
                            <span className="badgeTipo">
                                <FaHome /> {propiedadSeleccionada.tipo}
                            </span>
                        </div>
                        <p className="direccion">
                            <FaMapMarkerAlt /> {propiedadSeleccionada.direccion}
                        </p>
                        <div className="cardDetails">
                            <div className="detailItem">
                                <p className="detailLabel">TIPO</p>
                                <p className="detailValue">{propiedadSeleccionada.tipo}</p>
                            </div>
                            <div className="detailItem">
                                <p className="detailLabel">HABITACIONES</p>
                                <p className="detailValue">
                                    <FaBed /> {propiedadSeleccionada.habitaciones}
                                </p>
                            </div>
                            <div className="detailItem">
                                <p className="detailLabel">BAÑOS</p>
                                <p className="detailValue">
                                    <FaBath /> {propiedadSeleccionada.banos}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Filtros */}
                <section id="filtrosSection">
                    <div className="filtroItem">
                        <label htmlFor="mes">Mes</label>
                        <select name="mes" value={filtros.mes} onChange={handleFiltroChange}>
                            {Object.entries(MESES_ES).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filtroItem">
                        <label htmlFor="anio">Año</label>
                        <select name="anio" value={filtros.anio} onChange={handleFiltroChange}>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>

                    <div className="filtroItem">
                        <label htmlFor="inmueble">Inmueble</label>
                        <select name="inmueble" value={filtros.inmueble} onChange={handleFiltroChange}>
                            {propiedades?.map(propiedad => (
                                <option key={propiedad.codInmueble} value={propiedad.codInmueble}>
                                    {propiedad.nombreInmueble}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Reporte de Ganancias */}
                <section id="reporteGananciasSection">
                    <div className="reporteHeader">
                        <div className="reporteTitulo">
                            <div className="iconoReporte">$</div>
                            <div>
                                <h3>Reporte de Ganancias</h3>
                                <p className="descripcionReporte">
                                    Detalle de ganancias que le corresponden por {propiedadSeleccionada?.nombreInmueble}
                                </p>
                            </div>
                        </div>
                        <div className="totalesReporte">
                            <div className="totalItem">
                                <p className="totalLabel">TOTAL ARS</p>
                                <p className="totalValue totalARS">${reporteGanancias?.totalARS || 0}</p>
                            </div>
                            <div className="totalItem">
                                <p className="totalLabel">TOTAL USD</p>
                                <p className="totalValue totalUSD">US${reporteGanancias?.totalUSD || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de Evolución de Ganancias */}
                    {reporteGanancias && reporteGanancias.evolucionGanancias.length > 0 && (
                        <div className="chartContainer">
                            <h4 className="chartTitle">Evolucion de Ganancias (Ultimos 5 meses)</h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={reporteGanancias.evolucionGanancias}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="ars" 
                                        stroke="#10B981" 
                                        strokeWidth={2}
                                        name="Pesos (ARS)"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="usd" 
                                        stroke="#3B82F6" 
                                        strokeWidth={2}
                                        name="Dolares (USD)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Tabla de Detalle de Ganancias */}
                    <div className="tableContainer">
                        <List 
                            columnas={columnasGanancias}
                            items={itemsGanancias}
                            loadingItems={loadingGanancias}
                        />
                    </div>
                </section>

                {/* Reporte de Reservas */}
                <section id="reporteReservasSection">
                    <div className="reporteHeader">
                        <div className="reporteTitulo">
                            <div className="iconoReporte iconoReservas">📅</div>
                            <div>
                                <h3>Reporte de Reservas</h3>
                                <p className="descripcionReporte">
                                    Listado de reservas con duracion y ganancias de {propiedadSeleccionada?.nombreInmueble}
                                </p>
                            </div>
                        </div>
                        <div className="totalesReporte">
                            <div className="totalItem">
                                <p className="totalLabel">TOTAL RESERVAS</p>
                                <p className="totalValue totalReservas">{reporteReservas?.totalReservas || 0}</p>
                            </div>
                            <div className="totalItem">
                                <p className="totalLabel">DIAS OCUPADOS</p>
                                <p className="totalValue totalDias">{reporteReservas?.diasOcupados || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos de Reservas */}
                    <div className="graficosReservasContainer">
                        {/* Gráfico de Reservas y Ocupación por Mes */}
                        {reporteReservas && reporteReservas.reservasPorMes.length > 0 && (
                            <div className="chartWrapper">
                                <h4 className="chartTitle">Reservas y Ocupacion por Mes</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={reporteReservas.reservasPorMes}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="mes" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="reservas" fill="#3B82F6" name="Reservas" />
                                        <Bar dataKey="diasOcupados" fill="#F59E0B" name="Dias Ocupados" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Gráfico de Distribución por Duración */}
                        {reporteReservas && reporteReservas.distribucionDuracion.length > 0 && (
                            <div className="chartWrapper">
                                <h4 className="chartTitle">Distribucion por Duracion</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={reporteReservas.distribucionDuracion}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="porcentaje"
                                        >
                                            {reporteReservas.distribucionDuracion.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={coloresDuracion[index % coloresDuracion.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Tabla de Detalle de Reservas */}
                    <div className="tableContainer">
                        <List 
                            columnas={columnasReservas}
                            items={itemsReservas}
                            loadingItems={loadingReservas}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MainPageCliente;
