import type { Caja } from '@/routes/finanzas/typesFinanzas'
import {type Props} from '../../../generalComponents/Modal/ModalTypes'

export interface PropsModalPagarSueldos extends Omit<Props, 'children'>  {

    cajaMadre: Caja,
    isOpen: boolean,
    onClose: () => void,
    showCloseButton: boolean,
    children?: React.ReactNode;
}