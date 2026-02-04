import {type Props} from '../../../../generalComponents/Modal/ModalTypes'

export interface PropsFinalizarTarea extends Omit<Props, 'children'> {
    tarea: {
        nroTarea: number;
        fechaYHoraTarea: Date;
        tipoTarea: string;
        descripcionTarea: string;
        ubicacionTarea: string;
        nombreTarea: string
    };
    children?: React.ReactNode;
}

export interface TareaFinalizada {
    nroTarea: number;
    
}