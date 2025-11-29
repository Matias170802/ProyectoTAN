
export interface Tarea {
    nombreTarea: string;
    ubicacionTarea: string;
    fechaTarea: string;
    horaTarea: string;
    tipoTarea: string;
}

export interface Transaccion {
    id: string;
    tipoTransaccion: string; // 'Ingreso' o 'Egreso'
    categoria: string;
    monto: number;
    descripcion?: string;
    moneda: string;
    fechaCreacion: Date;
}