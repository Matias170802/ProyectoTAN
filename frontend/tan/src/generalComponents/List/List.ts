//*Hacemos que los items sean genericos
export interface Props <T = any> {
    items: T[];
    onItemClick?: (item: T) => void;
    onItemDelete?: (id: string | number) => void;
    onItemEdit?: (item: T) => void;
    onItemInfo?: (item: T) => void;
    emptyMessage?: string;
    showActions?: boolean;
    /** Position of the actions column. 'right' (default) or 'left' */
    actionsPosition?: 'left' | 'right';
    columnas: string[];
    idField?: string; //* Nombre del campo que actúa como ID único en los items
    getVisibleActions?: (item: T) => ('info' | 'edit' | 'delete')[];
}