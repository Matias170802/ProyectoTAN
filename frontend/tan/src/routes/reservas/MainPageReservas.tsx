
import { useEffect, useState } from "react";
import {Button, List} from "../../generalComponents/index";
import "./MainPageReservas.css";

type Reserva = {
    propiedad: string;
    checkin: string;
    checkout: string;
    huesped: string;
    personas: number;
    total: string;
    sena: string;
    estado: string;
    origen: string;
};

const reservasEjemplo = [
    {
        propiedad: "Apartamento Centro",
        checkin: "19/2/2025",
        checkout: "24/2/2025",
        huesped: "Juan Pérez",
        personas: 2,
        total: "$25000",
        sena: "$10000",
        estado: "Señada",
        origen: "Airbnb",
    },
    {
        propiedad: "Casa de Playa",
        checkin: "4/3/2025",
        checkout: "9/3/2025",
        huesped: "María González",
        personas: 4,
        total: "$35000",
        sena: "$15000",
        estado: "Señada",
        origen: "Booking",
    },
    {
        propiedad: "Cabaña Montaña",
        checkin: "14/3/2025",
        checkout: "19/3/2025",
        huesped: "Carlos Rodríguez",
        personas: 3,
        total: "$30000",
        sena: "$12000",
        estado: "Señada",
        origen: "Directo",
    },
    {
        propiedad: "Loft Urbano",
        checkin: "24/2/2025",
        checkout: "28/2/2025",
        huesped: "Laura Martínez",
        personas: 2,
        total: "$22000",
        sena: "$8000",
        estado: "Preparada",
        origen: "Airbnb",
    },
];



const estadosPosibles = ["Todos", "Señada", "Preparada", "Finalizada", "Cancelada"];
const inmueblesPosibles = [
    "Todos",
    "Apartamento Centro",
    "Casa de Playa",
    "Cabaña Montaña",
    "Loft Urbano"
];

const MainPageReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [tab, setTab] = useState("gestion");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroInmueble, setFiltroInmueble] = useState("Todos");

    useEffect(() => {
        // Simular GET
        setTimeout(() => {
            setReservas(reservasEjemplo);
        }, 500);
    }, []);

    // Filtrar reservas según los filtros seleccionados
    let reservasFiltradas = reservas.filter(r => {
        const estadoMatch = filtroEstado === "Todos" || r.estado === filtroEstado;
        const inmuebleMatch = filtroInmueble === "Todos" || r.propiedad === filtroInmueble;
        return estadoMatch && inmuebleMatch;
    });

    // Si no se selecciona inmueble ("Todos"), mostrar las reservas ordenadas por fecha de check-in más próxima
    if (filtroInmueble === "Todos") {
        reservasFiltradas = [...reservasFiltradas].sort((a, b) => {
            // Asume formato dd/mm/yyyy
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
                <Button label="Añadir Reserva" type="button" id="btn-add-reserva" />
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
                    <List
                        items={reservasFiltradas}
                        columnas={["propiedad", "checkin", "checkout", "huesped", "personas", "total", "sena", "estado", "origen"]}
                        showActions={false}
                        emptyMessage="No hay reservas para mostrar."
                    />
                </div>
            </div>
        </div>
    );
};

export default MainPageReservas;
