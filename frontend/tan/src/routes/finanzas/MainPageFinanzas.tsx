import {Navbar, Button, List} from '../../generalComponents/index'
import './MainPageFinanzas.css'

const MainPageFinanzas: React.FC = () => {

    const cajas = [
        {id: 1, Nombre: 'Caja Principal', Tipo: 'Empleado', BalanceARS: 5000, UltimoMovimiento: '2024-10-01'},
        {id: 2, Nombre: 'Caja Secundaria', Tipo: 'Inmueble', BalanceARS: 3000, UltimoMovimiento: '2024-09-28'},
        {id: 3, Nombre: 'Caja Ahorros', Tipo: 'Otro', BalanceARS: 1500, UltimoMovimiento: '2024-09-30'},
    ]

    const columnas = ["Nombre", "Tipo", "BalanceARS", "BalanceUSD", "UltimoMovimiento"];

    return(
        <div className="App">
            <Navbar/>
            
            <div id='mainPageFinanzasContent'>
                <p>Finanzas</p>
                
                <div id='modalFinanzas'>
                    <div id='topBarModalFinanzas'>
                        
                        <section id='parteIzquierda'>
                            
                            <input type="search" placeholder='Buscar Cajas...'/>
                            <select>
                                <option value="todasLasCajas">Todas las cajas</option>
                                <option value="cajasEmpleados">Cajas de empleados</option>
                                <option value="cajasEnmuebles">Cajas de inmuebles</option>
                                <option value="otrasCajas">Otras cajas</option>
                            </select>

                            <select>
                                <option>Movimiento más reciente</option>
                                <option>Movimiento más antiguo</option>
                                <option>Mayor monto</option>
                                <option>Menor monto</option>
                            </select>

                        </section>
                    
                        <section id='parteDerecha'>
                            <Button label='Realizar Transferencia' id='botonRealizarTransferencia'/>
                            <Button label='Estadisticas' id='botonEstadisticas'/>
                        </section>

                    </div>

                    {/*//TODO: Reemplazar por la cantidad de cajas encontradas en los filtros*/}
                    <div id='middleBarModalFinanzas'>
                            <h1 id='cajasEncontradasEnFiltros'>.... cajas encontradas</h1>
                    </div>

                    <div id='listContainer'>
                        <List items={cajas} columnas={columnas}></List>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPageFinanzas
