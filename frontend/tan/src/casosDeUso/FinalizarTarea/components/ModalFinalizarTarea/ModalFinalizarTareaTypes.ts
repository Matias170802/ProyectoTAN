import {type Props} from '../../../../generalComponents/Modal/ModalTypes'

export interface PropsFinalizarTarea extends Omit<Props, 'children'> {
    tarea: {
        nombreTarea: string;
        fechaTarea: string;
        horaTarea: string;
        ubicacionTarea: string;
        tipoTarea: string;
    };
    children?: React.ReactNode;
}