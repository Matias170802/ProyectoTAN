
import { useState } from "react";
import {Button, List, ModalAltaReserva} from "../../generalComponents/index";
import { useReservas as useAMReservas } from "../../casosDeUso/AMReservas";
import type { ReservaFormData } from "../../casosDeUso/AMReservas/types";
import "./MainPageReservas.css";

const estadosPosibles = ["Todos", "Señada", "Preparada", "Finalizada", "Cancelada"];
const inmueblesPosibles = [
    "Todos",
    "Apartamento Centro",
    "Casa de Playa",
    "Cabaña Montaña",
    "Loft Urbano"
];


const MainPageReservas = () => {
    const { reservas, loading, error, refreshReservas } = useAMReservas();
    const { 
        inmuebles, 
        mediosReserva, 
        createReserva, 
        loading: modalLoading 
    } = useAMReservas();
    
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroInmueble, setFiltroInmueble] = useState("Todos");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveReserva = async (reservaData: ReservaFormData) => {
        try {
            await createReserva(reservaData);
            await refreshReservas(); // Refresca la lista automáticamente
            handleCloseModal(); // Cierra el modal solo si la reserva fue exitosa
        } catch (error) {
            console.error('Error al guardar la reserva:', error);
            throw error;
        }
    };

    // Adaptar los datos del backend al formato esperado por la tabla
    const reservasAdaptadas = (reservas || []).map(r => ({
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
                            {inmueblesPosibles.map((inmueble, idx) => (
                                <option key={idx} value={inmueble}>{inmueble === "Todos" ? "Todos los inmuebles" : inmueble}</option>
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
                            {estadosPosibles.map((estado, idx) => (
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
                        showActions={false}
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
            />
        </div>
    );
};

export default MainPageReservas;
