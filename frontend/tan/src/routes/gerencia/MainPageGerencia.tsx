import React, { useState } from 'react';
import { Button, List } from '../../generalComponents';
import { useGerencia } from './useGerencia';
import './MainPageGerencia.css';

type VistaActual = 'inmuebles' | 'clientes' | 'empleados';

const MainPageGerencia: React.FC = () => {
    const [vistaActual, setVistaActual] = useState<VistaActual>('inmuebles');
    const {
        inmuebles,
        clientes,
        empleados,
        loading,
        error,
        bajaInmueble,
        bajaCliente,
        bajaEmpleado
    } = useGerencia();

    // Adaptadores para mostrar los datos en formato tabla
    const inmueblesAdaptados = (inmuebles || []).map(i => ({
        id: i.id,
        codInmueble: i.codInmueble,
        nombreInmueble: i.nombreInmueble,
        nombreCliente: i.nombreCliente,
        direccion: i.direccion,
        m2Inmueble: `${i.m2Inmueble} m²`,
        activo: i.activo
    }));

    const clientesAdaptados = (clientes || []).map(c => ({
        id: c.id,
        codCliente: c.codCliente,
        nombreCliente: c.nombreCliente,
        dniCliente: c.dniCliente,
        cantidadInmuebles: c.cantidadInmuebles,
        activo: c.activo
    }));

    const empleadosAdaptados = (empleados || []).map(e => ({
        id: e.id,
        codEmpleado: e.codEmpleado,
        nombreEmpleado: e.nombreEmpleado,
        dniEmpleado: e.dniEmpleado,
        nombresRoles: e.nombresRoles?.join(', ') || 'Sin roles',
        balanceCajaARS: `$${e.balanceCajaARS?.toFixed(2) || '0.00'}`,
        balanceCajaUSD: `$${e.balanceCajaUSD?.toFixed(2) || '0.00'}`,
        activo: e.activo
    }));

    const handleBaja = async (id: number | string) => {
        if (!confirm('¿Está seguro que desea dar de baja este elemento?')) return;

        try {
            if (vistaActual === 'inmuebles') {
                await bajaInmueble(Number(id));
            } else if (vistaActual === 'clientes') {
                await bajaCliente(Number(id));
            } else if (vistaActual === 'empleados') {
                await bajaEmpleado(Number(id));
            }
        } catch (error) {
            console.error('Error al dar de baja:', error);
            alert('Error al dar de baja el elemento');
        }
    };

    // TODO: Implementar modales de edición
    const handleEditar = (item: unknown) => {
        console.log('Editar:', item);
        alert('Función de edición en desarrollo');
    };

    const getColumnasActuales = () => {
        switch (vistaActual) {
            case 'inmuebles':
                return ['codInmueble', 'nombreInmueble', 'nombreCliente', 'direccion', 'm2Inmueble'];
            case 'clientes':
                return ['codCliente', 'nombreCliente', 'dniCliente', 'cantidadInmuebles'];
            case 'empleados':
                return ['codEmpleado', 'nombreEmpleado', 'dniEmpleado', 'nombresRoles', 'balanceCajaARS', 'balanceCajaUSD'];
            default:
                return [];
        }
    };

    const getItemsActuales = () => {
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

    const getTituloActual = () => {
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
                            label={`Agregar ${getTituloActual().slice(0, -1)}`}
                            onClick={() => alert('Función de agregar en desarrollo')}
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
                            idField="id"
                            onItemEdit={handleEditar}
                            onItemDelete={handleBaja}
                            emptyMessage={`No hay ${getTituloActual().toLowerCase()} para mostrar.`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPageGerencia;