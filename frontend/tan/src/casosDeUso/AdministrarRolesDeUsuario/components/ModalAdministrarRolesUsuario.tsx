import React, { useState } from "react";
import { useRoles } from '../hook/useRoles';
import "./ModalAdministrarRolesUsuario.css";

interface ModalAdministrarRolesUsuarioProps {
  open?: boolean;
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

  // Limpiar empleado seleccionado al cerrar el modal
  const handleClose = () => {
    handleSelectEmpleado(null);
    onClose();
  };

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRolesToRemove, setSelectedRolesToRemove] = useState<string[]>([]);

  if (!open) return null;

  // Filtrar roles asignados y disponibles para evitar duplicados y mostrar solo los correctos
  const codRolesAsignados = rolesEmpleado.map((rol: any) => rol.codRol);
  const rolesAsignadosUnicos = rolesEmpleado.filter(
    (rol: any, idx: number, arr: any[]) => arr.findIndex(r => r.codRol === rol.codRol) === idx
  );
  const rolesDisponiblesFiltrados = rolesDisponibles.filter(
    (rol: any) => !codRolesAsignados.includes(rol.codRol)
  );

  return (
    <div className="modal-roles__overlay">
      <div className="modal-roles__container" style={{maxHeight: '90vh', overflowY: 'auto'}}>
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
                      onClick={() => {
                        if (selectedEmpleado?.codEmpleado === emp.codEmpleado) {
                          handleSelectEmpleado(null);
                        } else {
                          handleSelectEmpleado(emp);
                        }
                      }}
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
                        {rolesAsignadosUnicos.map((rol: any, idx: number) => (
                          <span key={idx} className="modal-roles__chip" style={{display:'inline-flex',alignItems:'center',marginRight:8}}>
                            <span className="modal-roles__chip-icon">
                              {rol.nombreRol === 'Administrador' ? '🛡️' : rol.nombreRol === 'Finanzas' ? '💰' : rol.nombreRol === 'Usuario' ? '👤' : '🔑'}
                            </span>
                            {rol.nombreRol}
                            <button
                              title="Desasignar rol"
                              style={{marginLeft:6,background:'none',border:'none',cursor:'pointer',color:'#e57373',fontSize:'14px',lineHeight:'1'}}
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleDesasignarRoles([
                                  {
                                    codEmpleado: selectedEmpleado.codEmpleado,
                                    codRol: [rol.codRol],
                                    nombreEmpleado: selectedEmpleado.nombreEmpleado,
                                    nombreRol: [rol.nombreRol]
                                  }
                                ]);
                                // Actualizar roles después de desasignar
                                if (selectedEmpleado) {
                                  await handleSelectEmpleado(selectedEmpleado);
                                }
                              }}
                            ><span style={{fontSize:'14px',display:'inline-block',verticalAlign:'middle'}}>🗑️</span></button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 500 }}>Roles disponibles para asignar:</span>
                      <div className="modal-roles__chip-list">
                        {rolesDisponiblesFiltrados.map((rol: any, idx: number) => (
                          <span key={idx} className="modal-roles__chip" style={{display:'inline-flex',alignItems:'center',marginRight:8}}>
                            <span className="modal-roles__chip-icon">
                              {rol.nombreRol === 'Administrador' ? '🛡️' : rol.nombreRol === 'Finanzas' ? '💰' : rol.nombreRol === 'Usuario' ? '👤' : '🔑'}
                            </span>
                            {rol.nombreRol}
                            <button
                              title="Asignar rol"
                              style={{marginLeft:6,background:'none',border:'none',cursor:'pointer',color:'#64b5f6',fontSize:'14px',lineHeight:'1'}}
                              onClick={async (e) => {
                                e.stopPropagation();
                                await handleAsignarRoles([
                                  {
                                    codEmpleado: selectedEmpleado.codEmpleado,
                                    codRol: [rol.codRol],
                                    nombreEmpleado: selectedEmpleado.nombreEmpleado,
                                    nombreRol: [rol.nombreRol]
                                  }
                                ]);
                                // Actualizar roles después de asignar
                                if (selectedEmpleado) {
                                  await handleSelectEmpleado(selectedEmpleado);
                                }
                              }}
                            ><span style={{fontSize:'14px',display:'inline-block',verticalAlign:'middle'}}>➕</span></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
  <button className="modal-roles__close" onClick={handleClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default ModalAdministrarRolesUsuario;
