import './List.css'
import {type Props} from './List.ts'

const List = <T extends Record<string, any>> ({items, onItemClick, onItemDelete, onItemEdit, onItemInfo, emptyMessage, showActions = true, columnas, idField = 'id', getVisibleActions}: Props<T>) => {
    
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
                        title="Modificar configuración"
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
                            onItemDelete(getItemId(item)); // ⬅️ USAR getItemId como en tu código original
                        }}
                        title="Eliminar configuración"
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
        <table className="lista-tabla">
            
            {/*encabezado tabla*/}
            <thead>
                <tr className="tabla-header">
                    {columnas.map((columna) => (
                        <th key={columna} className="header-cell">
                            {formatoColumna(columna)}
                        </th>
                    ))}
                    {showActions && (
                        <th className="header-cell actions-header">
                            Acciones
                        </th>
                    )}
                </tr>
            </thead>

            {/*cuerpo tabla*/}
            <tbody>
                {items.map((item, index) => (
                    <tr
                        key={getItemId(item) || index}
                        className='tabla-row'
                        onClick={() => onItemClick?.(item)}
                    >
                        {/* celdas de datos*/}
                        {columnas.map((columna) => (
                            <td key={columna} className="tabla-cell">
                                {getColumnValue(item, columna)}
                            </td>
                        ))}

                        {renderActionButtons(item)}
                    </tr>
                ))}
            </tbody>
        </table>
    </section>
)
}

export default List;