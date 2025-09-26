export interface Inmueble {
    codInmueble: string;
    nombreInmueble: string;
    capacidad?: number;
    precioPorNocheUSD?: number;
}

export interface MedioReserva {
    id: string;
    nombre: string;
    descripcion?: string;
}

// Interfaz para el formulario del modal (lo que recoge el usuario)
export interface ReservaFormData {
    codReserva: string;
    codInmueble: string;
    fechaHoraCheckin: string; // ISO string
    fechaHoraCheckout: string; // ISO string
    cantHuespedes: number;
    totalMonto: number;
    totalMontoSenia: number;
    plataformaOrigen: string;
    nombreHuesped: string; // Campo adicional para el frontend, no va al DTO
    detalles?: string; // Campo adicional para el frontend
}

// DTO que coincide con el backend
export interface DTOReserva {
    codReserva: string;
    fechaHoraCheckin: string; // LocalDateTime como ISO string
    fechaHoraCheckout: string; // LocalDateTime como ISO string
    fechaHoraAltaReserva?: string; // LocalDateTime como ISO string
    totalDias?: number;
    cantHuespedes: number;
    totalMonto: number;
    totalMontoSenia: number;
    plataformaOrigen: string;
    codInmueble: string;
    nombreInmueble?: string;
    codEstadoReserva?: string;
    nombreEstadoReserva?: string;
}

// Interfaz para mostrar reservas (lo que viene del backend)
export interface Reserva extends DTOReserva {
    id?: number;
    nombreHuesped?: string;
}

export interface ReservaState {
    reservas: Reserva[];
    inmuebles: Inmueble[];
    mediosReserva: MedioReserva[];
    loading: boolean;
    error: string | null;
}