export interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    showCloseButton?: boolean;
}
