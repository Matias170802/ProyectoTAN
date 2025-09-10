
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


const MainPageReservas = () => {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [tab, setTab] = useState("gestion");

    useEffect(() => {
        // Simular GET
        setTimeout(() => {
            setReservas(reservasEjemplo);
        }, 500);
    }, []);

        return (
            <div className="main-reservas-bg">
                <div className="main-reservas-header">
                    <h1 className="main-reservas-title">Reservas</h1>
                    <Button label="Añadir Reserva" type="button" id="btn-add-reserva" />
                </div>
                <div className="main-reservas-card">
                    <div className="main-reservas-tabs">
                        <Button
                            label="Gestión de Reservas"
                            type="button"
                            onClick={() => setTab("gestion")}
                            disabled={tab === "gestion"}
                        />
                        <Button
                            label="Reservas por Inmueble"
                            type="button"
                            onClick={() => setTab("inmueble")}
                            disabled={tab === "inmueble"}
                        />
                    </div>
                    <h2 className="main-reservas-subtitle">Reservas</h2>
                    <div className="main-reservas-table-container">
                        <List
                            items={reservas}
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
