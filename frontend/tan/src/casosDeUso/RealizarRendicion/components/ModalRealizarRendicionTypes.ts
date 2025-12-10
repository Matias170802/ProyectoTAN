import {type Props} from '../../../generalComponents/Modal/ModalTypes'

export interface PropsModalRealizarRendicion extends Omit<Props, 'children'>  {

    isOpen: boolean,
    onClose: () => void,
    showCloseButton: boolean,
    children?: React.ReactNode;
    refetchCajas?: () => void;
}