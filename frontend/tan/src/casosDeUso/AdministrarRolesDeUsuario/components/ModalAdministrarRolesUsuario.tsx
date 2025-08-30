import React, { useState } from "react";
import { useRoles } from '../hook/useRoles';
import "./ModalAdministrarRolesUsuario.css";

interface ModalAdministrarRolesUsuarioProps {
  open: boolean;
  onClose: () => void;
}


const ModalAdministrarRolesUsuario: React.FC<ModalAdministrarRolesUsuarioProps> = ({ open, onClose }) => {
  const {
    empleados,
    selectedEmpleado,
    handleSelectEmpleado,
    rolesEmpleado,
    rolesDisponibles,
    loading,
    error,
    handleAsignarRoles,
    handleDesasignarRoles
  } = useRoles();

  const [search, setSearch] = useState("");

  if (!open) return null;

  // Filtrar empleados por nombre o email
  const empleadosFiltrados = empleados.filter((emp: any) =>
    emp.nombreEmpleado.toLowerCase().includes(search.toLowerCase()) ||
    emp.codEmpleado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="modal-roles__overlay">
      <div className="modal-roles__container">
        <h2 className="modal-roles__title">Administración de Roles de Usuarios</h2>
        <p className="modal-roles__desc">Gestiona los roles y permisos de los usuarios del sistema.</p>
        <div className="modal-roles__content">
          <input
            type="text"
            placeholder="Buscar empleado por nombre o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
          />
          {loading ? (
            <div>Cargando empleados...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <strong>Empleados:</strong>
                <ul style={{ maxHeight: 180, overflowY: 'auto', padding: 0 }}>
                  {empleadosFiltrados.map((emp: any) => (
                    <li
                      key={emp.codEmpleado}
                      style={{
                        listStyle: 'none',
                        marginBottom: 8,
                        padding: 8,
                        borderRadius: 8,
                        background: selectedEmpleado?.codEmpleado === emp.codEmpleado ? '#eaeaea' : '#f7f7f7',
                        cursor: 'pointer',
                        fontWeight: selectedEmpleado?.codEmpleado === emp.codEmpleado ? 'bold' : 'normal'
                      }}
                      onClick={() => handleSelectEmpleado(emp)}
                    >
                      {emp.nombreEmpleado} <span style={{ color: '#888', fontSize: '0.95em' }}>({emp.codEmpleado})</span>
                      {emp.nombreRol && emp.nombreRol.length > 0 && (
                        <span style={{ marginLeft: 12, color: '#b48be4', fontSize: '0.95em' }}>
                          Roles: {emp.nombreRol.join(', ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedEmpleado && (
                <>
                  <div>
                    <strong>Roles asignados:</strong>
                    <ul>
                      {rolesEmpleado.map((rol: any, idx: number) => (
                        <li key={idx}>{rol.nombre}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <strong>Roles disponibles para asignar:</strong>
                    <ul>
                      {rolesDisponibles.map((rol: any, idx: number) => (
                        <li key={idx}>{rol.nombre}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <button className="modal-roles__close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalAdministrarRolesUsuario;
