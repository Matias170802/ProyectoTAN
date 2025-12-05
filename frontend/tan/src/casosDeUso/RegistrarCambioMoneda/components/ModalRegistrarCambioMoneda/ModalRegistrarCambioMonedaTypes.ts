import {type Caja} from '../../../../routes/finanzas/typesFinanzas'

export interface ProposModalRegistrarCambioMoneda {
    isOpen: boolean;
    onClose?: () => void;
    cajaMadre: Caja;
}