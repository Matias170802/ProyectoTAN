import {type Props} from '../../../../generalComponents/Modal/ModalTypes'

export interface PropsConsultarEstadisticas extends Omit<Props, 'children'> {
    
    children?: React.ReactNode;
}