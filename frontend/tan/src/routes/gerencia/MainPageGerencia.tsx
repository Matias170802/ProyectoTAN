// frontend/tan/src/routes/gerencia/MainPageGerencia.tsx
import React, { useState } from 'react';
import { Button, List } from '../../generalComponents';
import { useGerencia } from './useGerencia';
import ModalAltaCliente from './components/ModalAltaCliente';
import ModalAltaEmpleado from './components/ModalAltaEmpleado';
import ModalAltaInmueble from './components/ModalAltaInmueble';
import ModalBajaCliente from './components/ModalBajaCliente';
import ModalBajaEmpleado from './components/ModalBajaEmpleado';
import ModalBajaInmueble from './components/ModalBajaInmueble';
import ModalModificarCliente from './components/ModalModificarCliente';
import ModalModificarEmpleado from './components/ModalModificarEmpleado';
import ModalModificarInmueble from './components/ModalModificarInmueble';
import './MainPageGerencia.css';

type VistaActual = 'inmuebles' | 'clientes' | 'empleados';

const MainPageGerencia: React.FC = () => {
    const [vistaActual, setVistaActual] = useState<VistaActual>('inmuebles');
    const [modalAltaAbierto, setModalAltaAbierto] = useState(false);
    const [modalBajaAbierto, setModalBajaAbierto] = useState(false);
    const [modalModificarAbierto, setModalModificarAbierto] = useState(false);
    const [itemSeleccionadoParaBaja, setItemSeleccionadoParaBaja] = useState<any>(null);
    const [itemSeleccionadoParaModificar, setItemSeleccionadoParaModificar] = useState<any>(null);
    
    const {
        inmuebles,
        clientes,
        empleados,
        loading,
        error,
        bajaInmueble,
        bajaCliente,
        bajaEmpleado,
        modificarInmueble,
        modificarCliente,
        modificarEmpleado,
        refetchInmuebles,
        refetchClientes,
        refetchEmpleados
    } = useGerencia();

    // Función para extraer el número del código (últimos 3 dígitos)
    const extraerNumeroDelCodigo = (codigo: string): number => {
        // Extrae los últimos 3 dígitos del código (ej: "EMPL-001" → 1, "CLI-010" → 10)
        const numeros = codigo.match(/\d+$/);
        return numeros ? parseInt(numeros[0], 10) : 0;
    };

    // Adaptadores para mostrar los datos en formato tabla
    const inmueblesAdaptados = (inmuebles || [])
        .map(i => ({
            id: i.id,
            codigoInmueble: i.codInmueble,
            nombreInmueble: i.nombreInmueble,
            nombreCliente: i.nombreCliente,
            direccion: i.direccion,
            m2Inmueble: `${i.m2Inmueble} m²`,
            activo: i.activo,
            // Datos completos para los modales
            codInmueble: i.codInmueble,
            cantidadBaños: i.cantidadBaños,
            cantidadDormitorios: i.cantidadDormitorios,
            capacidad: i.capacidad,
            m2InmuebleNumero: i.m2Inmueble,
            precioPorNocheUSD: i.precioPorNocheUSD,
            fechaHoraAltaInmueble: i.fechaHoraAltaInmueble,
            codCliente: i.codCliente
        }))
        .sort((a, b) => extraerNumeroDelCodigo(a.codigoInmueble) - extraerNumeroDelCodigo(b.codigoInmueble));

    const clientesAdaptados = (clientes || [])
        .map(c => ({
            id: c.id,
            codigoCliente: c.codCliente,
            nombreCliente: c.nombreCliente,
            dniCliente: c.dniCliente,
            cantidadInmuebles: c.cantidadInmuebles,
            activo: c.activo,
            // Datos completos para los modales
            codCliente: c.codCliente,
            fechaHoraAltaCliente: c.fechaHoraAltaCliente,
            codigosInmuebles: c.codigosInmuebles,
            nombresInmuebles: c.nombresInmuebles
        }))
        .sort((a, b) => extraerNumeroDelCodigo(a.codigoCliente) - extraerNumeroDelCodigo(b.codigoCliente));

    const empleadosAdaptados = (empleados || [])
        .map(e => ({
            id: e.id,
            codigoEmpleado: e.codEmpleado,
            nombreEmpleado: e.nombreEmpleado,
            dniEmpleado: e.dniEmpleado,
            nombresRoles: e.nombresRoles?.join(', ') || 'Sin roles',
            balanceCajaARS: `$${e.balanceCajaARS?.toFixed(2) || '0.00'}`,
            balanceCajaUSD: `$${e.balanceCajaUSD?.toFixed(2) || '0.00'}`,
            activo: e.activo,
            // Datos completos para los modales
            codEmpleado: e.codEmpleado,
            codigosRoles: e.codigosRoles,
            nombresRolesArray: e.nombresRoles,
            balanceCajaARSNumero: e.balanceCajaARS,
            balanceCajaUSDNumero: e.balanceCajaUSD
        }))
        .sort((a, b) => extraerNumeroDelCodigo(a.codigoEmpleado) - extraerNumeroDelCodigo(b.codigoEmpleado));

    const handleBaja = (item: any) => {
        // Accept either the whole item object or an id (string|number)
        const id = (item !== null && typeof item === 'object') ? (item as any).id : item;

        // Buscar el item completo según la vista actual y el id recibido
        let itemCompleto: any = null;
        if (vistaActual === 'inmuebles') {
            itemCompleto = inmuebles?.find(i => i.id == id);
        } else if (vistaActual === 'clientes') {
            itemCompleto = clientes?.find(c => c.id == id);
        } else if (vistaActual === 'empleados') {
            itemCompleto = empleados?.find(e => e.id == id);
        }

        if (itemCompleto) {
            setItemSeleccionadoParaBaja(itemCompleto);
            setModalBajaAbierto(true);
        } else {
            console.warn('handleBaja: item not found for id', id);
        }
    };

    const confirmarBaja = async (id: number): Promise<void> => {
        try {
            if (vistaActual === 'inmuebles') {
                await bajaInmueble(id);
            } else if (vistaActual === 'clientes') {
                await bajaCliente(id);
            } else if (vistaActual === 'empleados') {
                await bajaEmpleado(id);
            }
        } catch (error) {
            console.error('Error al dar de baja:', error);
            throw error; // Re-lanzar el error para que el modal lo maneje
        }
    };

    const confirmarModificacion = async (id: number, data: any): Promise<any> => {
        try {
            if (vistaActual === 'inmuebles') {
                return await modificarInmueble(id, data);
            } else if (vistaActual === 'clientes') {
                return await modificarCliente(id, data);
            } else if (vistaActual === 'empleados') {
                return await modificarEmpleado(id, data);
            }
        } catch (error) {
            console.error('Error al modificar:', error);
            throw error; // Re-lanzar el error para que el modal lo maneje
        }
    };

    const handleEditar = (item: any) => {
        // Accept either the whole item object or an id (string|number)
        const id = (item !== null && typeof item === 'object') ? (item as any).id : item;

        // Buscar el item completo según la vista actual y el id recibido
        let itemCompleto: any = null;
        if (vistaActual === 'inmuebles') {
            itemCompleto = inmuebles?.find(i => i.id == id);
        } else if (vistaActual === 'clientes') {
            itemCompleto = clientes?.find(c => c.id == id);
        } else if (vistaActual === 'empleados') {
            itemCompleto = empleados?.find(e => e.id == id);
        }

        if (itemCompleto) {
            setItemSeleccionadoParaModificar(itemCompleto);
            setModalModificarAbierto(true);
        } else {
            console.warn('handleEditar: item not found for id', id);
        }
    };

    const handleAbrirModalAlta = () => {
        setModalAltaAbierto(true);
    };

    const handleCerrarModalAlta = () => {
        setModalAltaAbierto(false);
    };

    const handleCerrarModalBaja = () => {
        setModalBajaAbierto(false);
        setItemSeleccionadoParaBaja(null);
    };

    const handleCerrarModalModificar = () => {
        setModalModificarAbierto(false);
        setItemSeleccionadoParaModificar(null);
    };

    const handleSuccessAlta = () => {
        // Refrescar la lista correspondiente
        if (vistaActual === 'inmuebles' && refetchInmuebles) {
            refetchInmuebles();
        } else if (vistaActual === 'clientes' && refetchClientes) {
            refetchClientes();
        } else if (vistaActual === 'empleados' && refetchEmpleados) {
            refetchEmpleados();
        }
    };

    const handleSuccessBaja = () => {
        // Refrescar la lista correspondiente
        if (vistaActual === 'inmuebles' && refetchInmuebles) {
            refetchInmuebles();
        } else if (vistaActual === 'clientes' && refetchClientes) {
            refetchClientes();
        } else if (vistaActual === 'empleados' && refetchEmpleados) {
            refetchEmpleados();
        }
    };

    const handleSuccessModificar = () => {
        // Refrescar la lista correspondiente
        if (vistaActual === 'inmuebles' && refetchInmuebles) {
            refetchInmuebles();
        } else if (vistaActual === 'clientes' && refetchClientes) {
            refetchClientes();
        } else if (vistaActual === 'empleados' && refetchEmpleados) {
            refetchEmpleados();
        }
    };

    const getColumnasActuales = (): string[] => {
        switch (vistaActual) {
            case 'inmuebles':
                return ['codigoInmueble', 'nombreInmueble', 'nombreCliente', 'direccion', 'm2Inmueble'];
            case 'clientes':
                return ['codigoCliente', 'nombreCliente', 'dniCliente', 'cantidadInmuebles'];
            case 'empleados':
                return ['codigoEmpleado', 'nombreEmpleado', 'dniEmpleado', 'nombresRoles', 'balanceCajaARS', 'balanceCajaUSD'];
            default:
                return [];
        }
    };

    const getItemsActuales = (): Record<string, unknown>[] => {
        switch (vistaActual) {
            case 'inmuebles':
                return inmueblesAdaptados;
            case 'clientes':
                return clientesAdaptados;
            case 'empleados':
                return empleadosAdaptados;
            default:
                return [];
        }
    };
    
    const getTituloActual = (): string => {
        switch (vistaActual) {
            case 'inmuebles':
                return 'Inmuebles';
            case 'clientes':
                return 'Clientes';
            case 'empleados':
                return 'Empleados';
            default:
                return '';
        }
    };

    const getLabelBotonCrear = (): string => {
        switch (vistaActual) {
            case 'inmuebles':
                return 'Crear Inmueble';
            case 'clientes':
                return 'Crear Cliente';
            case 'empleados':
                return 'Crear Empleado';
            default:
                return 'Crear';
        }
    };

    return (
        <div className="gerencia-container">
            <div className="gerencia-header">
                <h1 className="gerencia-title">Gerencia</h1>
            </div>

            <div className="gerencia-card">
                {/* Tabs de navegación */}
                <div className="gerencia-tabs">
                    <button
                        className={`gerencia-tab ${vistaActual === 'inmuebles' ? 'active' : ''}`}
                        onClick={() => setVistaActual('inmuebles')}
                    >
                        Inmuebles
                    </button>
                    <button
                        className={`gerencia-tab ${vistaActual === 'clientes' ? 'active' : ''}`}
                        onClick={() => setVistaActual('clientes')}
                    >
                        Clientes
                    </button>
                    <button
                        className={`gerencia-tab ${vistaActual === 'empleados' ? 'active' : ''}`}
                        onClick={() => setVistaActual('empleados')}
                    >
                        Empleados
                    </button>
                </div>

                <div className="gerencia-content">
                    <div className="gerencia-subtitle-container">
                        <h2 className="gerencia-subtitle">
                            Listado de {getTituloActual()}
                        </h2>
                        <Button
                            label={getLabelBotonCrear()}
                            onClick={handleAbrirModalAlta}
                            className="btn-add-gerencia"
                        />
                    </div>

                    {loading && <p>Cargando {getTituloActual().toLowerCase()}...</p>}
                    {error && <p style={{ color: 'red' }}>Error al cargar datos: {error.message}</p>}

                    <div className="gerencia-table-container">
                        <List
                            items={getItemsActuales()}
                            columnas={getColumnasActuales()}
                            showActions={true}
                            actionsPosition="left"
                            idField="id"
                            onItemEdit={handleEditar}
                            onItemDelete={handleBaja}
                            emptyMessage={`No hay ${getTituloActual().toLowerCase()} para mostrar.`}
                        />
                    </div>
                </div>
            </div>

            {/* Modales de Alta */}
            {vistaActual === 'clientes' && (
                <ModalAltaCliente
                    isOpen={modalAltaAbierto}
                    onClose={handleCerrarModalAlta}
                    onSuccess={handleSuccessAlta}
                />
            )}

            {vistaActual === 'empleados' && (
                <ModalAltaEmpleado
                    isOpen={modalAltaAbierto}
                    onClose={handleCerrarModalAlta}
                    onSuccess={handleSuccessAlta}
                />
            )}

            {vistaActual === 'inmuebles' && (
                <ModalAltaInmueble
                    isOpen={modalAltaAbierto}
                    onClose={handleCerrarModalAlta}
                    onSuccess={handleSuccessAlta}
                />
            )}

            {/* Modales de Baja */}
            {vistaActual === 'clientes' && modalBajaAbierto && itemSeleccionadoParaBaja && (
                <ModalBajaCliente
                    isOpen={modalBajaAbierto}
                    onClose={handleCerrarModalBaja}
                    onSuccess={handleSuccessBaja}
                    cliente={itemSeleccionadoParaBaja}
                    onConfirm={confirmarBaja}
                />
            )}

            {vistaActual === 'empleados' && modalBajaAbierto && itemSeleccionadoParaBaja && (
                <ModalBajaEmpleado
                    isOpen={modalBajaAbierto}
                    onClose={handleCerrarModalBaja}
                    onSuccess={handleSuccessBaja}
                    empleado={itemSeleccionadoParaBaja}
                    onConfirm={confirmarBaja}
                />
            )}

            {vistaActual === 'inmuebles' && modalBajaAbierto && itemSeleccionadoParaBaja && (
                <ModalBajaInmueble
                    isOpen={modalBajaAbierto}
                    onClose={handleCerrarModalBaja}
                    onSuccess={handleSuccessBaja}
                    inmueble={itemSeleccionadoParaBaja}
                    onConfirm={confirmarBaja}
                />
            )}

            {/* Modales de Modificación */}
            {vistaActual === 'clientes' && modalModificarAbierto && itemSeleccionadoParaModificar && (
                <ModalModificarCliente
                    isOpen={modalModificarAbierto}
                    onClose={handleCerrarModalModificar}
                    onSuccess={handleSuccessModificar}
                    cliente={itemSeleccionadoParaModificar}
                    onConfirm={confirmarModificacion}
                />
            )}

            {vistaActual === 'empleados' && modalModificarAbierto && itemSeleccionadoParaModificar && (
                <ModalModificarEmpleado
                    isOpen={modalModificarAbierto}
                    onClose={handleCerrarModalModificar}
                    onSuccess={handleSuccessModificar}
                    empleado={itemSeleccionadoParaModificar}
                    onConfirm={confirmarModificacion}
                />
            )}

            {vistaActual === 'inmuebles' && modalModificarAbierto && itemSeleccionadoParaModificar && (
                <ModalModificarInmueble
                    isOpen={modalModificarAbierto}
                    onClose={handleCerrarModalModificar}
                    onSuccess={handleSuccessModificar}
                    inmueble={itemSeleccionadoParaModificar}
                    onConfirm={confirmarModificacion}
                />
            )}
        </div>
    );
};

export default MainPageGerencia;