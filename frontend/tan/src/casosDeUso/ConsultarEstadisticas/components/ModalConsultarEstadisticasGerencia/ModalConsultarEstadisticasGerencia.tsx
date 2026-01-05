import {type PropsConsultarEstadisticas} from './ModalConsultarEstadisticasGerenciaTypes';
import './ModalConsultarEstadisticasGerencia.css';
import {Button} from '../../../../generalComponents/index';

export const ModalConsultarEstadisticasGerencia: React.FC<PropsConsultarEstadisticas> = () => {
    
    const [activo, setActivo] = React.useState<'inmuebles' | 'reservas'>('reservas');    
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
                            <select name="inmueble">
                                <option value="">Seleccionar</option>
                            </select>
                        </div>
                    )}
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