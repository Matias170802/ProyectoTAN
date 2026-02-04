//*Hacemos que los items sean genericos
export interface Props <T = any> {
    items: T[];
    onItemClick?: (item: T) => void;
    onItemDelete?: (id: string | number) => void;
    onItemEdit?: (item: T) => void;
    onItemInfo?: (item: T) => void;
    emptyMessage?: string;
    loadingItems?: boolean;
    showActions?: boolean;
    /** Position of the actions column. 'right' (default) or 'left' */
    actionsPosition?: 'left' | 'right';
    columnas: string[];
    idField?: string; //* Nombre del campo que actúa como ID único en los items
    getVisibleActions?: (item: T) => ('info' | 'edit' | 'delete')[];
    //*para seleccionar items de la lista
    onItemSelect?: (item: any) => void;
    selectedItem?: any;
    selectableCondition?: (item: any) => boolean;
    //*para paginación
    itemsPerPage?: number; //* Cantidad de items por página (default: 10)
    showPagination?: boolean; //* Mostrar controles de paginación (default: true si items > itemsPerPage)
}