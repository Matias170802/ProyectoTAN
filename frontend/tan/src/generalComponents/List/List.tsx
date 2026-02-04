import './List.css'
import {type Props} from './List.ts'
import { useState } from 'react';

const List = <T extends Record<string, any>> ({items, onItemClick, onItemDelete, onItemEdit, onItemInfo, emptyMessage, showActions = true, actionsPosition, columnas, idField = 'id', getVisibleActions, loadingItems, onItemSelect, selectedItem, selectableCondition, itemsPerPage = 10, showPagination}: Props<T>) => {
    
    //* Estado de paginación
    const [currentPage, setCurrentPage] = useState(1);
    
    //* Calcular valores de paginación
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const shouldShowPagination = showPagination !== undefined ? showPagination : items.length > itemsPerPage;
    
    //* Calcular items a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = shouldShowPagination ? items.slice(startIndex, endIndex) : items;
    
    //* Funciones de navegación
    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };
    
    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPreviousPage = () => goToPage(currentPage - 1);
    const goToNextPage = () => goToPage(currentPage + 1);
    
    //* Resetear página cuando cambian los items
    useState(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    });
    
    //* en el caso de que la lista este cargando
    if (loadingItems) {
        return (
            <section className='contenedor-lista'>
                <div className="lista-cargando">
                    <div className="spinner"></div>
                    Cargando items...
                </div>
            </section>
        );
    }

    //* en el caso de que la lista de items sea vacia
    if (items.length === 0) {
        return (
            <section className='contenedor-lista'>
                <div id='lista' className="empty-state">
                    <p>{emptyMessage}</p>
                </div>
            </section>
        )
    }

    //* Renderizar controles de paginación
    const renderPagination = () => {
        if (!shouldShowPagination || totalPages <= 1) return null;
        
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        
        return (
            <div className="pagination-container">
                <div className="pagination-info">
                    Mostrando {startIndex + 1}-{Math.min(endIndex, items.length)} de {items.length} items
                </div>
                <div className="pagination-controls">
                    <button 
                        className="pagination-btn" 
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        title="Primera página"
                    >
                        «
                    </button>
                    <button 
                        className="pagination-btn" 
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        title="Página anterior"
                    >
                        ‹
                    </button>
                    
                    {startPage > 1 && (
                        <>
                            <button className="pagination-btn" onClick={() => goToPage(1)}>1</button>
                            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
                        </>
                    )}
                    
                    {pageNumbers.map(pageNum => (
                        <button
                            key={pageNum}
                            className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => goToPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    ))}
                    
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
                            <button className="pagination-btn" onClick={() => goToPage(totalPages)}>{totalPages}</button>
                        </>
                    )}
                    
                    <button 
                        className="pagination-btn" 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        title="Página siguiente"
                    >
                        ›
                    </button>
                    <button 
                        className="pagination-btn" 
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        title="Última página"
                    >
                        »
                    </button>
                </div>
            </div>
        );
    };

    //*funcion para obtener el id del item
    const getItemId = (item: T): string | number => {
        return item[idField] || item.id || item.ID || 0;
    };

    //*FUNCIÓN PARA OBTENER EL VALOR DE UNA COLUMNA
    const getColumnValue = (item: T, columnKey: string) => {
        const value = columnKey.split('.').reduce((obj, key) => obj?.[key], item);    
        return value !== undefined && value !== null ? String(value) : '-';
    };

    //*funcion para poner lindo el nombre de la columna
    const formatoColumna = (columna: string) => {
        const nuevaColumna = columna.replace(/([a-z])([A-Z])/g, '$1 $2');
        const nuevaColumnaConMayusculaPrimeraLetra = nuevaColumna.replace(/^./, (letra) => letra.toUpperCase());
        
        return nuevaColumnaConMayusculaPrimeraLetra;
    }

    //* Función para determinar si un item está seleccionado
    const isItemSelected = (item: T): boolean => {
        if (!selectedItem) return false;
        return getItemId(item) === getItemId(selectedItem);
    };

    //* Función para determinar si un item es seleccionable
    const isItemSelectable = (item: T): boolean => {
        return selectableCondition ? selectableCondition(item) : true;
    };

    //* Función para generar las clases CSS del row
    const getRowClasses = (item: T): string => {
        let classes = 'tabla-row';
        
        if (isItemSelectable(item)) {
            classes += ' list-item-selectable';
            if (isItemSelected(item)) {
                classes += ' list-item-selected';
            }
        } else {
            classes += ' list-item-not-selectable';
        }
        
        // Añadir clase según estado para colorear la fila (señada=amarillo, preparada=verde, en curso/cancelada/finalizada=rojo)
        try {
            const rawEstado = (item as any).estado || '';
            const estado = String(rawEstado).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (estado === 'señada' || estado === 'senada') {
                classes += ' status-yellow';
            } else if (estado === 'preparada') {
                classes += ' status-green';
            } else if (estado === 'en curso' || estado === 'encurso' || estado === 'cancelada' || estado === 'finalizada') {
                classes += ' status-red';
            }
        } catch (e) {
            // ignore
        }

        return classes;
    };

    //* Función para manejar el click en un row
    const handleRowClick = (item: T) => {
        // Si hay función de selección y el item es seleccionable
        if (onItemSelect && isItemSelectable(item)) {
            onItemSelect(item);
        }
        
        // También llamar a onItemClick si existe (para mantener compatibilidad)
        if (onItemClick) {
            onItemClick(item);
        }
    };
    
    //*funcion para renderizar los botones de accion
    const renderActionButtons = (item: T) => {
    if (!showActions) return null;

    // ⬅️ DETERMINAR QUÉ BOTONES MOSTRAR
    const visibleActions = getVisibleActions ? getVisibleActions(item) : ['info', 'edit', 'delete'];
    
    return (
        <td className="tabla-cell actions-cell">
            <div className="actions-container">
                {/* ⬅️ BOTÓN INFO - SOLO SI ESTÁ EN VISIBLE ACTIONS */}
                {visibleActions.includes('info') && onItemInfo && (
                    <button
                        className="btn-action btn-info"
                        onClick={(e) => {
                            e.stopPropagation(); // ⬅️ MANTENER stopPropagation como en tu código original
                            onItemInfo(item);
                        }}
                        title="Ver información"
                        aria-label="Ver información"
                    >
                        ℹ️
                    </button>
                )}
                
                {/* ⬅️ BOTÓN EDITAR - SOLO SI ESTÁ EN VISIBLE ACTIONS */}
                {visibleActions.includes('edit') && onItemEdit && (
                    <button
                        className="btn-action btn-edit"
                        onClick={(e) => {
                            e.stopPropagation(); // ⬅️ MANTENER stopPropagation
                            onItemEdit(item);
                        }}
                        title="Modificar"
                        aria-label="Editar"
                    >
                        ✏️
                    </button>
                )}
                
                {/* ⬅️ BOTÓN ELIMINAR - SOLO SI ESTÁ EN VISIBLE ACTIONS */}
                {visibleActions.includes('delete') && onItemDelete && (
                    <button
                        className="btn-action btn-delete"
                        onClick={(e) => {
                            e.stopPropagation(); // ⬅️ MANTENER stopPropagation
                            onItemDelete(getItemId(item));
                        }}
                        title="Cancelar"
                        aria-label="Eliminar"
                    >
                        🗑️
                    </button>
                )}
            </div>
        </td>
    );
};

    return (
    <section className='contenedor-lista'>
        <div style={{ overflowX: 'auto' }}>
            <table className="lista-tabla">
            
            {/*encabezado tabla*/}
            <thead>
                <tr className="tabla-header">
                    {actionsPosition === 'left' && showActions && (
                        <th className="header-cell actions-header">Acciones</th>
                    )}

                    {columnas.map((columna) => (
                        <th key={columna} className="header-cell">
                            {formatoColumna(columna)}
                        </th>
                    ))}

                    {actionsPosition === 'right' && showActions && (
                        <th className="header-cell actions-header">Acciones</th>
                    )}
                </tr>
            </thead>

            {/*cuerpo tabla*/}
            <tbody>
                {currentItems.map((item, index) => (
                    <tr
                        key={getItemId(item) || index}
                        className={getRowClasses(item)}
                        onClick={() => handleRowClick(item)}
                        style={{
                            cursor: isItemSelectable(item) ? 'pointer' : 'default'
                        }}
                    >
                        {actionsPosition === 'left' && renderActionButtons(item)}
                        {/* celdas de datos*/}
                        {columnas.map((columna) => (
                            <td key={columna} className="tabla-cell">
                                {getColumnValue(item, columna)}
                            </td>
                        ))}

                        {actionsPosition === 'right' && renderActionButtons(item)}
                    </tr>
                ))}
            </tbody>
        </table>        </div>
        
        {renderPagination()}    </section>
)
}

export default List;