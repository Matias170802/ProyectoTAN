
export interface PropsConsultarEstadisticas {
    
}

export interface EstadisticasGerenciaReservas {
    gananciasCliente: number;
    gananciasEmpresa: number;
    gananciasTotales: number;
    estadisticasPorInmueble: [];
    estadisticasReservas: [];
}

export interface EstadisticasGerenciaInmuebles {
    gananciasCliente: number;
    gananciasEmpresa: number;
    gananciasTotales: number;
    estadisticasPorInmueble: [];
    estadisticasReservas: [];
}

export interface InmuebleOption {
        codInmueble: string;
        nombreInmueble: string;
    }