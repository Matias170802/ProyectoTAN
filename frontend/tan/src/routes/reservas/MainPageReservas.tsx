import React, { useState } from "react";
import { Button, List, ModalAltaReserva } from "../../generalComponents/index";
import { useReservas as useAMReservas } from "../../casosDeUso/AMReservas";
import ModalConfirmarCancelar from '../../casosDeUso/CancelarReserva/components/ModalConfirmarCancelar';
import { ModalAsignarCheckInOut } from '../../casosDeUso/AsignarCheckInOut';
import type { ReservaFormData } from "../../casosDeUso/AMReservas/types";
import type { ReservaDetailsForModal } from "../../casosDeUso/AsignarCheckInOut/types";
import "./MainPageReservas.css";

// Los estados se obtienen desde el backend via el hook; mantenemos esta lista como fallback
const estadosFallback = ["Señada", "Preparada", "Finalizada", "Cancelada", "En Curso"];

const MainPageReservas: React.FC = () => {
    const am = useAMReservas();
    const { reservas, loading, error, refreshReservas, inmuebles, mediosReserva, createReserva, updateReserva } = am;

    // Cancel modal state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelingReservaCod, setCancelingReservaCod] = useState<string | null>(null);

    // AsignarCheckInOut modal state
    const [isAsignarCheckInOutOpen, setIsAsignarCheckInOutOpen] = useState(false);
    const [selectedReservaForCheckInOut, setSelectedReservaForCheckInOut] = useState<ReservaDetailsForModal | null>(null);
    const [onlyCheckoutMode, setOnlyCheckoutMode] = useState(false);

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
        // Determinar si se permite asignar y si es modo solo CHECKOUT (en curso)
        const rawEstado = String(item.estado || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
        const isSenada = rawEstado === 'señada' || rawEstado === 'senada';
        const isPreparada = rawEstado === 'preparada';
        const isEnCurso = rawEstado === 'en curso' || rawEstado === 'encurso';

        // Solo abrir modal si está en Señada, Preparada o En Curso
        if (!isSenada && !isPreparada && !isEnCurso) return;

        const reservaDetail: ReservaDetailsForModal = {
            codReserva: item.codReserva,
            propiedad: item.propiedad,
            checkin: item.checkin,
            checkout: item.checkout,
            huesped: item.huesped,
            estado: item.estado,
        };

        setSelectedReservaForCheckInOut(reservaDetail);
        setOnlyCheckoutMode(isEnCurso);
        setIsAsignarCheckInOutOpen(true);
    };

    const handleCloseAsignarCheckInOut = () => {
        setIsAsignarCheckInOutOpen(false);
        setSelectedReservaForCheckInOut(null);
        setOnlyCheckoutMode(false);
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

    // Ordenar reservas: futuras próximas primero, luego pasadas
    reservasFiltradas = [...reservasFiltradas].sort((a, b) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const parseDate = (str: string) => {
            const [d, m, y] = str.split("/").map(Number);
            const date = new Date(y, m - 1, d);
            date.setHours(0, 0, 0, 0);
            return date;
        };

        const dateA = parseDate(a.checkin);
        const dateB = parseDate(b.checkin);

        const distA = dateA.getTime() - today.getTime();
        const distB = dateB.getTime() - today.getTime();

        // Si uno es futuro y otro pasado, futuro va primero
        if ((distA >= 0) !== (distB >= 0)) {
            return distA >= 0 ? -1 : 1;
        }

        // Si ambos son futuros, ordenar por proximidad (menor distancia primero)
        if (distA >= 0 && distB >= 0) {
            return distA - distB;
        }

        // Si ambos son pasados, ordenar por proximidad (más reciente primero)
        return distB - distA;
    });

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
                            // Intentar abrir modal (la función internamente decide si corresponde)
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
                            const estado = (item as any).estado || '';
                            const normalized = String(estado).toLowerCase();
                            if (normalized === 'señada' || normalized === 'preparada' || normalized === 'en curso') return ['edit', 'delete'];
                            return [];
                        }}
                        // Hacer seleccionable (y marcar) solo las filas sobre las que se puede asignar check-in/out
                        selectableCondition={(item) => {
                            const estado = String((item as any).estado || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
                            return estado === 'señada' || estado === 'senada' || estado === 'preparada' || estado === 'en curso' || estado === 'encurso';
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
                onlyCheckout={onlyCheckoutMode}
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
