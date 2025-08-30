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

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRolesToRemove, setSelectedRolesToRemove] = useState<string[]>([]);

  if (!open) return null;

  return (
    <div className="modal-roles__overlay">
      <div className="modal-roles__container">
        <h2 className="modal-roles__title">Administración de Roles de Usuarios</h2>
        <p className="modal-roles__desc">Gestiona los roles y permisos de los usuarios del sistema.</p>
        <div className="modal-roles__content">
          {loading ? (
            <div>Cargando empleados...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <strong>Empleados:</strong>
                <ul className="modal-roles__list">
                  {empleados.map((emp: any) => (
                    <li
                      key={emp.codEmpleado}
                      className={`modal-roles__item${selectedEmpleado?.codEmpleado === emp.codEmpleado ? ' modal-roles__item--selected' : ''}`}
                      onClick={() => handleSelectEmpleado(emp)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="modal-roles__nombre">{emp.nombreEmpleado}</div>
                      <div className="modal-roles__codigo">Código: {emp.codEmpleado}</div>
                      <div className="modal-roles__roles">
                        <span className="modal-roles__roles-label">Roles:</span>
                        {emp.nombreRol && emp.nombreRol.length > 0 ? (
                          <div className="modal-roles__chip-list">
                            {emp.nombreRol.map((rol: string, idx: number) => (
                              <span key={idx} className="modal-roles__chip">
                                <span className="modal-roles__chip-icon">
                                  {rol === 'Administrador' ? '🛡️' : rol === 'Finanzas' ? '💰' : rol === 'Usuario' ? '👤' : '🔑'}
                                </span>
                                {rol}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="modal-roles__chip-empty">Sin roles</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedEmpleado && (
                <div style={{ marginTop: 24 }}>
                  <strong>Editar roles de {selectedEmpleado.nombreEmpleado}:</strong>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>Roles asignados:</span>
                      <div className="modal-roles__chip-list">
                        {rolesEmpleado.map((rol: any, idx: number) => (
                          <label key={idx} style={{ marginRight: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedRolesToRemove.includes(rol.codRol)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedRolesToRemove([...selectedRolesToRemove, rol.codRol]);
                                } else {
                                  setSelectedRolesToRemove(selectedRolesToRemove.filter(r => r !== rol.codRol));
                                }
                              }}
                              style={{ marginRight: 4 }}
                            />
                            <span className="modal-roles__chip">
                              <span className="modal-roles__chip-icon">
                                {rol.nombreRol === 'Administrador' ? '🛡️' : rol.nombreRol === 'Finanzas' ? '💰' : rol.nombreRol === 'Usuario' ? '👤' : '🔑'}
                              </span>
                              {rol.nombreRol}
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        style={{ marginTop: 8, background: '#e57373', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}
                        disabled={selectedRolesToRemove.length === 0}
                        onClick={async () => {
                          await handleDesasignarRoles(selectedRolesToRemove.map(codRol => ({ codRol, codEmpleado: selectedEmpleado.codEmpleado })));
                          setSelectedRolesToRemove([]);
                        }}
                      >Quitar roles seleccionados</button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>Roles disponibles para asignar:</span>
                      <div className="modal-roles__chip-list">
                        {rolesDisponibles.map((rol: any, idx: number) => (
                          <label key={idx} style={{ marginRight: 8, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={selectedRoles.includes(rol.codRol)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedRoles([...selectedRoles, rol.codRol]);
                                } else {
                                  setSelectedRoles(selectedRoles.filter(r => r !== rol.codRol));
                                }
                              }}
                              style={{ marginRight: 4 }}
                            />
                            <span className="modal-roles__chip">
                              <span className="modal-roles__chip-icon">
                                {rol.nombreRol === 'Administrador' ? '🛡️' : rol.nombreRol === 'Finanzas' ? '💰' : rol.nombreRol === 'Usuario' ? '👤' : '🔑'}
                              </span>
                              {rol.nombreRol}
                            </span>
                          </label>
                        ))}
                      </div>
                      <button
                        style={{ marginTop: 8, background: '#64b5f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer', fontWeight: 500 }}
                        disabled={selectedRoles.length === 0}
                        onClick={async () => {
                          await handleAsignarRoles(selectedRoles.map(codRol => ({ codRol, codEmpleado: selectedEmpleado.codEmpleado })));
                          setSelectedRoles([]);
                        }}
                      >Asignar roles seleccionados</button>
                    </div>
                  </div>
                </div>
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
