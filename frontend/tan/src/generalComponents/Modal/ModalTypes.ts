export interface Props {
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    title?: string;
    description?: string;
    showCloseButton?: boolean;
}