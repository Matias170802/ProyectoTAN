export interface Props {
    label?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset"; 
    disabled?: boolean;
    icon?: string;
    form?: string; // Permite asociar el botón a un formulario específico
}