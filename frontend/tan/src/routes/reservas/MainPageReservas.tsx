import React, { useState } from "react";
import { Button, List, ModalAltaReserva } from "../../generalComponents/index";
import { useReservas as useAMReservas } from "../../casosDeUso/AMReservas";
import ModalConfirmarCancelar from '../../casosDeUso/CancelarReserva/components/ModalConfirmarCancelar';
import { ModalAsignarCheckInOut } from '../../casosDeUso/AsignarCheckInOut';
import type { ReservaFormData } from "../../casosDeUso/AMReservas/types";
import type { ReservaDetailsForModal } from "../../casosDeUso/AsignarCheckInOut/types";
import "./MainPageReservas.css";

// Los estados se obtienen desde el backend via el hook; mantenemos esta lista como fallback
const estadosFallback = ["Señada", "Preparada", "Finalizada", "Cancelado"];

const MainPageReservas: React.FC = () => {
    const am = useAMReservas();
    const { reservas, loading, error, refreshReservas, inmuebles, mediosReserva, createReserva, updateReserva } = am;

    // Cancel modal state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelingReservaCod, setCancelingReservaCod] = useState<string | null>(null);

    // AsignarCheckInOut modal state
    const [isAsignarCheckInOutOpen, setIsAsignarCheckInOutOpen] = useState(false);
    const [selectedReservaForCheckInOut, setSelectedReservaForCheckInOut] = useState<ReservaDetailsForModal | null>(null);

    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroInmueble, setFiltroInmueble] = useState("Todos");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingReservaCod, setEditingReservaCod] = useState<string | null>(null);
    const [editingReservaData, setEditingReservaData] = useState<any | null>(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingReservaCod(null);
        setEditingReservaData(null);
    };

    const handleOpenAsignarCheckInOut = (item: any) => {
        const reservaDetail: ReservaDetailsForModal = {
            codReserva: item.codReserva,
            propiedad: item.propiedad,
            checkin: item.checkin,
            checkout: item.checkout,
            huesped: item.huesped,
            estado: item.estado,
        };
        setSelectedReservaForCheckInOut(reservaDetail);
        setIsAsignarCheckInOutOpen(true);
    };

    const handleCloseAsignarCheckInOut = () => {
        setIsAsignarCheckInOutOpen(false);
        setSelectedReservaForCheckInOut(null);
    };

    const handleSaveReserva = async (reservaData: ReservaFormData) => {
        try {
            if (isEditMode && editingReservaCod) {
                // Llamada a modificar
                await updateReserva(editingReservaCod, reservaData);
            } else {
                await createReserva(reservaData);
            }
            await refreshReservas(); // Refresca la lista automáticamente
            handleCloseModal(); // Cierra el modal solo si la reserva fue exitosa
        } catch (error) {
            console.error('Error al guardar la reserva:', error);
            throw error;
        }
    };

    // Adaptar los datos del backend al formato esperado por la tabla
    const reservasAdaptadas = (reservas || []).map(r => ({
        codReserva: r.codReserva,
        propiedad: r.nombreInmueble,
        checkin: r.fechaHoraCheckin ? new Date(r.fechaHoraCheckin).toLocaleDateString() : "",
        checkout: r.fechaHoraCheckout ? new Date(r.fechaHoraCheckout).toLocaleDateString() : "",
        personas: r.cantHuespedes,
        total: `$${r.totalMonto}`,
        sena: `$${r.totalMontoSenia}`,
        estado: r.nombreEstadoReserva,
        origen: r.plataformaOrigen || "-",
        huesped: r.nombreHuesped || "",
        email: r.emailHuesped || "",
        descripcion: r.descripcionReserva || "",
        dias: r.totalDias ?? '',
    }));

    // Filtrar reservas según los filtros seleccionados
    let reservasFiltradas = reservasAdaptadas.filter(r => {
        const estadoMatch = filtroEstado === "Todos" || r.estado === filtroEstado;
        const inmuebleMatch = filtroInmueble === "Todos" || r.propiedad === filtroInmueble;
        return estadoMatch && inmuebleMatch;
    });

    // Si no se selecciona inmueble ("Todos"), mostrar las reservas ordenadas por fecha de check-in más próxima
    if (filtroInmueble === "Todos") {
        reservasFiltradas = [...reservasFiltradas].sort((a, b) => {
            const parseDate = (str: string) => {
                const [d, m, y] = str.split("/").map(Number);
                return new Date(y, m - 1, d).getTime();
            };
            return parseDate(a.checkin) - parseDate(b.checkin);
        });
    }

    // Preparar lista de inmuebles para el select: preferimos la lista del backend, si está vacía
    // construimos una lista única a partir de las reservas (nombreInmueble).
    const inmueblesOptions = (inmuebles && inmuebles.length > 0)
        ? inmuebles
        : Array.from(new Map((reservas || []).map(r => [r.nombreInmueble, { codInmueble: r.codInmueble || r.nombreInmueble, nombreInmueble: r.nombreInmueble }])).values());

    return (
        <div className="main-reservas-bg">
            <div className="main-reservas-header">
                <h1 className="main-reservas-title">Reservas</h1>
                <Button 
                    label="Añadir Reserva" 
                    type="button" 
                    id="btn-add-reserva" 
                    onClick={handleOpenModal}
                />
            </div>
            <div className="main-reservas-card">
                {/* Filtros de inmueble y estado */}
                <div className="main-reservas-filtros">
                    <div className="main-reservas-filtro-group">
                        <label className="main-reservas-filtro-label">Seleccionar Inmueble</label>
                        <select
                            className="main-reservas-select"
                            value={filtroInmueble}
                            onChange={e => setFiltroInmueble(e.target.value)}
                        >
                            <option value="Todos">Todos los inmuebles</option>
                            {inmueblesOptions.map((inmueble) => (
                                <option key={inmueble.codInmueble || inmueble.nombreInmueble} value={inmueble.nombreInmueble}>{inmueble.nombreInmueble}</option>
                            ))}
                        </select>
                    </div>
                    <div className="main-reservas-filtro-group">
                        <label className="main-reservas-filtro-label">Filtrar por Estado</label>
                        <select
                            className="main-reservas-select"
                            value={filtroEstado}
                            onChange={e => setFiltroEstado(e.target.value)}
                        >
                            <option value="Todos">Estado: Todos</option>
                            {(am.estados && am.estados.length > 0 ? am.estados.map((e) => e.nombreEstadoReserva) : estadosFallback).map((estado, idx) => (
                                <option key={idx} value={estado}>Estado: {estado}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <h2 className="main-reservas-subtitle">Proximas Reservas ...</h2>
                <div className="main-reservas-table-container">
                    {loading && <p>Cargando reservas...</p>}
                    {error && <p style={{color: 'red'}}>Error al cargar reservas</p>}
                    <List
                        items={reservasFiltradas}
                        columnas={["propiedad", "checkin", "checkout", "personas", "huesped", "email", "dias", "descripcion", "total", "sena", "estado", "origen"]}
                        showActions={true}
                        actionsPosition="left"
                        idField="codReserva"
                        onItemClick={(item) => {
                            // Abrir modal de asignar check-in/out al hacer clic en una fila
                            handleOpenAsignarCheckInOut(item as any);
                        }}
                        onItemEdit={(item) => {
                            // item es el objeto adaptado; buscamos la reserva original por codReserva
                            const cod = (item as any).codReserva;
                            const original = reservas.find(r => r.codReserva === cod);
                            if (original) {
                                setEditingReservaCod(cod || null);
                                setEditingReservaData(original);
                                setIsEditMode(true);
                                setIsModalOpen(true);
                            }
                        }}
                        onItemDelete={(id) => {
                            // id viene del List como getItemId(item) => codReserva
                            const cod = String(id);
                            setCancelingReservaCod(cod);
                            setIsCancelModalOpen(true);
                        }}
                        // Mostrar la acción 'delete' (cruz) solo si el estado permite cancelar
                        getVisibleActions={(item) => {
                            const estado = (item as any).estado;
                            if (estado === 'Señada' || estado === 'Preparada') return ['edit', 'delete'];
                            return ['edit'];
                        }}
                        emptyMessage="No hay reservas para mostrar."
                    />
                </div>
            </div>

            <ModalAltaReserva
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveReserva}
                inmuebles={inmuebles}
                mediosReserva={mediosReserva}
                loading={loading}
                initialData={isEditMode ? editingReservaData : null}
            />

            <ModalConfirmarCancelar
                isOpen={isCancelModalOpen}
                onClose={() => { setIsCancelModalOpen(false); setCancelingReservaCod(null); }}
                codReserva={cancelingReservaCod}
                onConfirm={async (cod) => {
                    try {
                        await am.cancelReserva(cod);
                        await refreshReservas();
                    } catch (error) {
                        console.error('Error al cancelar reserva desde UI:', error);
                        // El hook ya setea el error en su estado; aquí podemos mostrar algo adicional si hace falta
                    }
                }}
                loading={loading}
            />

            <ModalAsignarCheckInOut
                isOpen={isAsignarCheckInOutOpen}
                onClose={handleCloseAsignarCheckInOut}
                reserva={selectedReservaForCheckInOut}
                onSuccess={() => {
                    handleCloseAsignarCheckInOut();
                    // Opcionalmente, refrescar la lista si el backend actualiza datos
                    refreshReservas();
                }}
            />
        </div>
    );
};

export default MainPageReservas;
