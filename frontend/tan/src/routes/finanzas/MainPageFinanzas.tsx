import React from 'react';
import { IoBarChart } from "react-icons/io5";
import { MdCompareArrows, MdAttachMoney } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import {Button, List} from '../../generalComponents/index'
import './MainPageFinanzas.css'
import {ModalRegistrarCotizacionMoneda} from '../../casosDeUso/RegistrarCotizacionMoneda/components/index'
import { useFinanzas } from './useFinanzas';
import {ModalRegistrarCambioMoneda} from '../../casosDeUso/RegistrarCambioMoneda/components/ModalRegistrarCambioMoneda/ModalRegistrarCambioMoneda'

const MainPageFinanzas: React.FC = () => {

    const [openModalRegistrarCotizacionMoneda, setOpenModalRegistrarCotizacionMoneda] = React.useState(false);
    const [openModalRegistrarCambioMoneda, setOpenModalRegistrarCambioMoneda] = React.useState(false);
    const [cajaMadreSeleccionada, setCajaMadreSeleccionada] = React.useState<string>("");

    //*estados para los filtros
    const [tipoSeleccionado, setTipoSeleccionado] = React.useState("todasLasCajas");
    const [ordenSeleccionado, setOrdenSeleccionado] = React.useState("Movimiento más reciente");
    const [textoBuscado, setTextoBuscado] = React.useState("");

    const { obtenerCajasFiltradas, loadingCajas } = useFinanzas();
    const columnas = ["nombre", "tipo", "balanceARS", "balanceUSD", "ultimoMovimiento"];

    //*buscamos las cajas para mostrarlas
    const cajasAMostrar = obtenerCajasFiltradas(tipoSeleccionado, ordenSeleccionado, textoBuscado);

    return(
        <div className="App">
            
            <div id='mainPageFinanzasContent'>
                <p className='titulo'>Finanzas</p>
                
                <div id='modalFinanzas'>
                    <div id='topBarModalFinanzas'>
                        
                        <section id='parteIzquierda'>
                            
                            <input 
                            type="search" 
                            placeholder='Buscar Cajas...' 
                            value={textoBuscado}
                            onChange={e => setTextoBuscado(e.target.value)}
                            />

                            <select
                            value={tipoSeleccionado} 
                            onChange={e => setTipoSeleccionado(e.target.value)}
                            >
                                <option value="todasLasCajas">Todas las cajas</option>
                                <option value="cajasEmpleados">Cajas de empleados</option>
                                <option value="cajasEnmuebles">Cajas de inmuebles</option>
                                <option value="otrasCajas">Otras cajas</option>
                            </select>

                            <select
                            value={ordenSeleccionado} 
                            onChange={e => setOrdenSeleccionado(e.target.value)}
                            >
                                <option value="MovimientoMasReciente">Movimiento más reciente</option>
                                <option value="MovimientoMasAntiguo">Movimiento más antiguo</option>
                                <option value="MayorMonto">Mayor monto</option>
                                <option value="MenorMonto">Menor monto</option>
                            </select>

                        </section>
                    
                        <section id='parteDerecha'>
                            <Button label='Realizar Transferencia' id='botonRealizarTransferencia' icon={<MdCompareArrows/>}/>
                            <Button label="Registrar Cotización de Moneda" id="botonRegistrarCotizacionMoneda" icon={<MdAttachMoney/>} onClick={()=> setOpenModalRegistrarCotizacionMoneda(true)}/>
                            <Button label='Estadisticas' id='botonEstadisticas' icon={<IoBarChart/>}/>
                        </section>

                    </div>

                    <div id='middleBarModalFinanzas'>
                            <h1 id='cajasEncontradasEnFiltros'>{cajasAMostrar.length} cajas encontradas</h1>

                            <Button
                            label='Cambio de Moneda'
                            icon={<HiOutlineSwitchHorizontal />}
                            onClick={()=>{setOpenModalRegistrarCambioMoneda(true)}}
                            />
                            {//todo: agregar una prop al Button para que el boton se pueda enable o unabled si esta seleccionada la caja madre
                            }
                    </div>

                    <div id='listContainer'>
                        <List 
                        items={cajasAMostrar} 
                        columnas={columnas} 
                        showActions={false}
                        emptyMessage='No se encontraron cajas que coincidan con los filtros.'
                        loadingItems={loadingCajas}
                        />
                    </div>

                    {/*//*elementos extras que se muetran si se presiona un determinado boton */}

                    {openModalRegistrarCotizacionMoneda && (
                        <ModalRegistrarCotizacionMoneda 
                            isOpen={openModalRegistrarCotizacionMoneda} 
                            description='Ingresa los valores de compra y venta para la moneda seleccionada.' 
                            onClose={() => setOpenModalRegistrarCotizacionMoneda(false)}
                            title='Registrar Cotización de Moneda'
                            showCloseButton={true}
                        />
                    )}
                    {/*//*elementos extras que se muetran si se presiona un determinado boton */}

                    {openModalRegistrarCambioMoneda && (
                        <ModalRegistrarCambioMoneda 
                            isOpen={openModalRegistrarCambioMoneda} 
                            onClose={() => setOpenModalRegistrarCambioMoneda(false)}
                        />    
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainPageFinanzas
