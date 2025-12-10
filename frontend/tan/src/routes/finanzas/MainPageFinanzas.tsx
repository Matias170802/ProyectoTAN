import React from 'react';
import { IoBarChart } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { IoNewspaperOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import {Button, List} from '../../generalComponents/index'
import './MainPageFinanzas.css'
import {ModalRegistrarCotizacionMoneda} from '../../casosDeUso/RegistrarCotizacionMoneda/components/index'
import { useFinanzas } from './useFinanzas';
import {ModalRegistrarCambioMoneda} from '../../casosDeUso/RegistrarCambioMoneda/components/ModalRegistrarCambioMoneda/ModalRegistrarCambioMoneda'
import {ModalPagarSueldos} from '../../casosDeUso/PagarSueldos/components/ModalPagarSueldos'
import {type Caja} from '../finanzas/typesFinanzas'
import { ModalRealizarRendicion } from '@/casosDeUso/RealizarRendicion/components/ModalRealizarRendicion';

const MainPageFinanzas: React.FC = () => {

    const [openModalRegistrarCotizacionMoneda, setOpenModalRegistrarCotizacionMoneda] = React.useState(false);
    const [openModalRegistrarCambioMoneda, setOpenModalRegistrarCambioMoneda] = React.useState(false);
    const [openModalPagarSueldos, setOpenModalPagarSueldos] = React.useState(false);
    const [openModalRealizarRendicion, setOpenModalRealizarRendicion] = React.useState(false);
    const [cajaMadreSeleccionada, setCajaMadreSeleccionada] = React.useState<Caja | null>(null);

    //*estados para los filtros
    const [tipoSeleccionado, setTipoSeleccionado] = React.useState("todasLasCajas");
    const [ordenSeleccionado, setOrdenSeleccionado] = React.useState("Movimiento más reciente");
    const [textoBuscado, setTextoBuscado] = React.useState("");

    const { obtenerCajasFiltradas, loadingCajas, refetchCajas, obtenerCajaMadre } = useFinanzas();
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

    const formatearFecha = (fecha: Date | string | null | undefined): string => {
        if (!fecha) return 'Sin movimientos';
        
        try {
            let date: Date;
            
            // Manejar diferentes tipos de entrada
            if (typeof fecha === 'string') {
                if (fecha.trim() === '') return 'Sin movimientos';
                
                // Intentar parsear string de fecha
                date = new Date(fecha);
                
                // Si el string no es una fecha válida, intentar otros formatos
                if (isNaN(date.getTime())) {
                    // Intentar formato ISO con milisegundos
                    const isoMatch = fecha.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2})\.?(\d+)?/);
                    if (isoMatch) {
                        date = new Date(isoMatch[1] + 'T' + isoMatch[2]);
                    } else {
                        return 'Sin movimientos';
                    }
                }
            } else {
                date = fecha;
            }
            
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                console.error('Fecha inválida:', fecha);
                return 'Sin movimientos';
            }
            
            return date.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error al formatear fecha:', error, 'Fecha recibida:', fecha);
            return 'Sin movimientos';
        }
    };

    const cajasFormateadasParaLista = cajasAMostrar.map(caja => ({
        ...caja,
        ultimoMovimiento: formatearFecha(caja.ultimoMovimiento)
    }));


    //* Función para manejar el cierre del modal de cambio moneda
    const handleCerrarModalCambioMoneda = () => {
        setOpenModalRegistrarCambioMoneda(false);
        setCajaMadreSeleccionada(null); // Limpiar selección
        
        if (refetchCajas) {
            refetchCajas();
        }
    };

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
                            <Button 
                            label='Realizar Rendicion' id='botonRealizarTransferencia' 
                            icon={<IoNewspaperOutline />}
                            onClick={() => setOpenModalRealizarRendicion(true)}
                            />
                            <Button label="Registrar Cotización de Moneda" id="botonRegistrarCotizacionMoneda" icon={<MdAttachMoney/>} onClick={()=> setOpenModalRegistrarCotizacionMoneda(true)}/>
                            <Button label='Estadisticas' id='botonEstadisticas' icon={<IoBarChart/>}/>
                        </section>

                    </div>

                    <div id='middleBarModalFinanzas'>
                            <h1 id='cajasEncontradasEnFiltros'>{cajasAMostrar.length} cajas encontradas</h1>

                            <div id='contenedroBotonesAccionesFinanzas'>
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
                                hidden={obtenerCajaMadre() == null}
                                />
                            </div>    
                    </div>

                    <div id='listContainer'>
                        <List 
                        items={cajasFormateadasParaLista} 
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

                    {openModalRegistrarCambioMoneda && cajaMadreSeleccionada !== null && (
                        <ModalRegistrarCambioMoneda 
                            isOpen={openModalRegistrarCambioMoneda} 
                            onClose={handleCerrarModalCambioMoneda}
                            cajaMadre={cajaMadreSeleccionada}
                        />    
                    )}

                    {openModalPagarSueldos && (
                        (() => {
                           const cajaMadre = obtenerCajaMadre(); // ← Usar cajas originales para el modal
                            if (!cajaMadre) return <div>No hay caja madre disponible</div>;
                            return (
                                <ModalPagarSueldos
                                    cajaMadre={cajaMadre}
                                    isOpen={openModalPagarSueldos}
                                    onClose={() => setOpenModalPagarSueldos(false)}
                                    showCloseButton={true}
                                    refetchCajas={refetchCajas} 
                                />
                            )
                        })()
                    )}

                    {openModalRealizarRendicion && (
                        <ModalRealizarRendicion
                        isOpen={openModalRealizarRendicion}
                        onClose={() => setOpenModalRealizarRendicion(false)}
                        showCloseButton={true}
                        refetchCajas={refetchCajas}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MainPageFinanzas
