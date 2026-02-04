export interface PropsConsultarEstadisticasCliente {
}

export interface DTOFinanzasCliente {
    fechaMovimiento: string;
    montoMovimiento: number;
    monedaMovimiento: string;
    descripcionMovimiento: string;
    nombreCategoriaMovimiento: string;
}

export interface DTOReservasCliente {
    fechaInicioReserva: string;
    fechaFinReserva: string;
    estadoReserva: string;
    nombreHuesped: string;
    montoTotalReserva: number;
}

export interface DTOInmueblesFiltro {
    codInmueble: string;
    nombreInmueble: string;
}
