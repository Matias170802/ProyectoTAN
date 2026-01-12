import { getRolesDisponiblesParaAsignar } from '../../../AdministrarRolesDeUsuario/serviceAdministrarRolesDeUsuario';

export interface PropsConsultarEstadisticas {
    
}

//* Filtros para estadisticas de gerencia inmuebles
export interface InmuebleOption {
        codInmueble: string;
        nombreInmueble: string;
    }


//* estadisticas de gerenciaInmuebles
export interface EstadisticasGerenciaInmuebles {
    cantidadReservasInmueble: number;
    totalDiasOcupadosInmueble: number;
    totalDiasLibresInmueble: number;
    tasaOcupacionInmueble: number;
    ingresosGeneradosInmueble: number;
    nombreInmueble: string;
    detalleReservas: detalleReservas[];
}


//*estadisticas de gerenciaReservas 
export interface EstadisticasGerenciaReservas {
    cantTotalReservas: number;
    diasTotalesReservados: number;
    montoTotal: number;
    montoPromedioPorReserva: number;
    incidenciaInmuebles: incidenciaInmueble[];
    detalleReservas: detalleReservas[];
}

interface incidenciaInmueble {
    codInmueble: string;
    nombreInmueble: string;
    porcentajeIncidencia: number;
    [key: string]: any;
}

interface detalleReservas {
    nombreInmueble: string;
    huesped: string;
    checkIn: Date;
    checkOut: Date;
    dias: number;
    estadoReserva: string;
    montoTotalReserva: number;
}