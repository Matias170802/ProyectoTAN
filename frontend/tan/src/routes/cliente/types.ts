// Tipos para la página del cliente

export interface Propiedad {
    codInmueble: string;
    nombreInmueble: string;
    direccion: string;
    tipo: string;
    habitaciones: number;
    banos: number;
}

export interface GananciaDetalle {
    fecha: string;
    concepto: string;
    moneda: string;
    monto: number;
}

export interface ReporteGanancias {
    totalARS: number;
    totalUSD: number;
    detalleGanancias: GananciaDetalle[];
    evolucionGanancias: EvolucionGanancia[];
}

export interface EvolucionGanancia {
    mes: string;
    ars: number;
    usd: number;
}

export interface ReservaDetalle {
    fechaInicio: string;
    fechaFin: string;
    duracion: number;
    moneda: string;
    ganancia: number;
}

export interface ReporteReservas {
    totalReservas: number;
    diasOcupados: number;
    detalleReservas: ReservaDetalle[];
    reservasPorMes: ReservaPorMes[];
    distribucionDuracion: DistribucionDuracion[];
}

export interface ReservaPorMes {
    mes: string;
    reservas: number;
    diasOcupados: number;
}

export interface DistribucionDuracion {
    categoria: string;
    porcentaje: number;
}

export interface FiltrosCliente {
    mes: string;
    anio: string;
    inmueble: string;
}
