export interface PropsConsultarEstadisticas {
    
}

export interface EstadisticasFinancieras {
    gananciasCliente: number;
    gananciasEmpresa: number;
    gananciasTotales: number;
    estadisticasPorInmueble: estadisticasPorInmuebleFinancieras[];
    estadisticasReservas: estadisticasReservasFinancieras[];
}

//* detalle por inmueble para el GraficosBarra
interface estadisticasPorInmuebleFinancieras {
    nombreInmueble: string;
    gananciasCliente:number;
    gananciasEmpresa:number;
}

//* detalle de las reservas para el componente List
interface estadisticasReservasFinancieras {
    inmueble:string;
    huesped:string;
    checkin:Date;
    dias:number;
    total:number;
    gananciaCliente:number;
    gananciaEmpresa:number;
}