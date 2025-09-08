export interface Props {
    label?: string;
    onClick?: () => void;
    id?: string;
    type?: "button" | "submit" | "reset"; 
    disabled?: boolean;
    icon?: string;
    form?: string; // Permite asociar el botón a un formulario específico
}