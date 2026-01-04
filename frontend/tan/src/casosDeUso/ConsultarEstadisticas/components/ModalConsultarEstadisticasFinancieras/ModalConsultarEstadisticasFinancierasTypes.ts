export interface PropsConsultarEstadisticas {
    
}

export interface EstadisticasFinancieras {
    gananciasCliente: number;
    gananciasEmpresa: number;
    gananciasTotales: number;
    estadisticasPorInmueble: estadisticasPorInmuebleFinancieras[];
    estadisticasReservas: estadisticasReservasFinancieras[];
}

interface estadisticasPorInmuebleFinancieras {
    nombreInmueble: string;
    gananciasCliente:number;
    gananciasEmpresa:number;
}

interface estadisticasReservasFinancieras {
    inmueble:string;
    huesped:string;
    checkin:string;
    dias:number;
    total:number;
    gananciaCliente:number;
    gananciaEmpresa:number;
}