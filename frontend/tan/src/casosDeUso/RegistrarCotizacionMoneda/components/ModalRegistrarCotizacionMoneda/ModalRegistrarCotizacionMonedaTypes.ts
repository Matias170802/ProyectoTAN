export interface PropsRegistrarCotizacionMoneda {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    showCloseButton?: boolean;
    onSuccess?: () => void;
}