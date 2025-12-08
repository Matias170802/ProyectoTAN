import React from 'react';
import { IoBarChart } from "react-icons/io5";
import { MdCompareArrows, MdAttachMoney } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import {Button, List} from '../../generalComponents/index'
import './MainPageFinanzas.css'
import {ModalRegistrarCotizacionMoneda} from '../../casosDeUso/RegistrarCotizacionMoneda/components/index'
import { useFinanzas } from './useFinanzas';
import {ModalRegistrarCambioMoneda} from '../../casosDeUso/RegistrarCambioMoneda/components/ModalRegistrarCambioMoneda/ModalRegistrarCambioMoneda'
import {ModalPagarSueldos} from '../../casosDeUso/PagarSueldos/components/ModalPagarSueldos'
import {type Caja} from '../finanzas/typesFinanzas'

const MainPageFinanzas: React.FC = () => {

    const [openModalRegistrarCotizacionMoneda, setOpenModalRegistrarCotizacionMoneda] = React.useState(false);
    const [openModalRegistrarCambioMoneda, setOpenModalRegistrarCambioMoneda] = React.useState(false);
    const [openModalPagarSueldos, setOpenModalPagarSueldos] = React.useState(false);
    const [cajaMadreSeleccionada, setCajaMadreSeleccionada] = React.useState<Caja | null>(null);

    //*estados para los filtros
    const [tipoSeleccionado, setTipoSeleccionado] = React.useState("todasLasCajas");
    const [ordenSeleccionado, setOrdenSeleccionado] = React.useState("Movimiento más reciente");
    const [textoBuscado, setTextoBuscado] = React.useState("");

    const { obtenerCajasFiltradas, loadingCajas, refetchCajas } = useFinanzas();
    const columnas = ["nombre", "tipo", "balanceARS", "balanceUSD", "ultimoMovimiento"];

    //*buscamos las cajas para mostrarlas
    const cajasAMostrar = obtenerCajasFiltradas(tipoSeleccionado, ordenSeleccionado, textoBuscado);

    //* Función para manejar la selección de caja
    const handleCajaSelect = (caja: any) => {
        // Solo permitir selección si es tipo "Otro"
        if (caja.tipo === "Otro") {
            setCajaMadreSeleccionada(caja);
        } else {
            setCajaMadreSeleccionada(null);
        }
    };

    //* Función para verificar si una caja es seleccionable
    const isCajaSeleccionable = (caja: any) => {
        return caja.tipo === "Otro";
    };

    //* Función para manejar el cierre del modal de cambio moneda
    const handleCerrarModalCambioMoneda = () => {
        setOpenModalRegistrarCambioMoneda(false);
        setCajaMadreSeleccionada(null); // Limpiar selección
        
        if (refetchCajas) {
            refetchCajas();
        }
    };

    const obtenerCajaMadre = () => {
        const cajaMadre =  cajasAMostrar.find(caja => caja.tipo === "Otro");
        return cajaMadre || ({} as Caja);
    } 


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
                            hidden={cajaMadreSeleccionada == null}
                            />

                            <Button
                            label='Pagar Sueldos'
                            icon={<FaMoneyBillTransfer />}
                            onClick={()=>{setOpenModalPagarSueldos(true)}}
                            />
                            
                    </div>

                    <div id='listContainer'>
                        <List 
                        items={cajasAMostrar} 
                        columnas={columnas} 
                        showActions={false}
                        emptyMessage='No se encontraron cajas que coincidan con los filtros.'
                        loadingItems={loadingCajas}
                        onItemSelect={handleCajaSelect}
                        selectedItem={cajaMadreSeleccionada}
                        selectableCondition={isCajaSeleccionable}
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

                    {openModalRegistrarCambioMoneda && cajaMadreSeleccionada !== null && (
                        <ModalRegistrarCambioMoneda 
                            isOpen={openModalRegistrarCambioMoneda} 
                            onClose={handleCerrarModalCambioMoneda}
                            cajaMadre={cajaMadreSeleccionada}
                        />    
                    )}

                    {openModalPagarSueldos && (
                        <ModalPagarSueldos
                        cajaMadre={obtenerCajaMadre()}
                        isOpen={openModalPagarSueldos}
                        onClose={() => setOpenModalPagarSueldos(false)}
                        showCloseButton={true}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainPageFinanzas
