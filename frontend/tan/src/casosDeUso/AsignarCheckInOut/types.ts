// Tipos para AsignarCheckInOut

export interface Empleado {
    codEmpleado: string;
    nombreEmpleado: string;
    apellidoEmpleado?: string;
    emailEmpleado?: string;
}

export interface DTOTarea {
    nombreTarea: string;
    nroTarea?: number;
    descripcionTarea?: string;
    codEmpleado: string;
    codReserva: string;
    codTipoTarea: string;
}

export interface AsignarCheckInOutFormData {
    codReserva: string;
    empleadoCheckIn?: string; // codEmpleado
    empleadoCheckOut?: string; // codEmpleado
}

export interface ReservaDetailsForModal {
    codReserva: string;
    propiedad: string;
    checkin: string;
    checkout: string;
    huesped: string;
    estado: string;
}
