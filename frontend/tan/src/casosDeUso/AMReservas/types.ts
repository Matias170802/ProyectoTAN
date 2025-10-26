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

export interface EstadoReserva {
    codEstadoReserva: string;
    nombreEstadoReserva: string;
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
    nombreHuesped: string;
    emailHuesped: string;
    descripcionReserva: string;
    numeroTelefonoHuesped: string;
    totalDias: number;
    // detalles?: string; // Si ya no se usa, se puede eliminar
}

// DTO que coincide con el backend
// Incluye todos los campos del backend
// Si falta alguno, agregarlo aquí para evitar errores de tipado
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
    nombreHuesped?: string;
    emailHuesped?: string;
    descripcionReserva?: string;
    numeroTelefonoHuesped?: string;
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
    estados?: EstadoReserva[];
    loading: boolean;
    error: string | null;
    nombreHuesped?: string;
    descripcionReserva?: string;
}