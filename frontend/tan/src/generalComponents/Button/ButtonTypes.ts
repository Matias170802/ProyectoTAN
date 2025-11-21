import type { ReactNode } from "react";

export interface Props {
    label?: string;
    onClick?: () => void;
    id?: string;
    type?: "button" | "submit" | "reset"; 
    disabled?: boolean;
    icon?: ReactNode;
    className?: string; // Permite pasar clases CSS personalizadas
    form?: string; // Permite asociar el botón a un formulario específico
}