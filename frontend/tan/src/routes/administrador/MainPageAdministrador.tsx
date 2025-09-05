
import React, { useState } from "react";
import { Modal, Button } from '../../generalComponents/index';
import { FaUserShield, FaCog, FaDatabase } from "react-icons/fa";
import ModalAdministrarRolesUsuario from '../../casosDeUso/AdministrarRolesDeUsuario/components/ModalAdministrarRolesUsuario';
import './MainPageAdministrador.css';

const MainPageAdministrador = () => {
    const [openModal, setOpenModal] = useState(true);
    const [showRolesPanel, setShowRolesPanel] = useState(false);

    return (
        <>
            {/* ModalPanel de administración */}
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title={<span className="panel-admin-title"><span style={{marginRight:8}}><FaUserShield /></span>Panel de Administración</span>}
                showCloseButton={true}
            >
                <div className="panel-admin-modal">
                    <p className="panel-admin-desc">Selecciona una opción de administración del sistema.</p>
                    <div className="panel-admin-options">
                        <Button
                            label={
                                <div style={{display:'flex',alignItems:'center',gap:12}}>
                                    <span className="icon"><FaUserShield size="2em" color="#3b82f6"/></span>
                                    <div>
                                        <div style={{fontWeight:600}}>Administrar Roles de Usuarios</div>
                                        <div style={{fontSize:14, color:'#666'}}>Gestiona los roles y permisos de los empleados</div>
                                    </div>
                                </div>
                            }
                            onClick={() => setShowRolesPanel(true)}
                            className="panel-admin-btn"
                        />
                        <Button
                            label={
                                <div style={{display:'flex',alignItems:'center',gap:12}}>
                                    <span className="icon"><span style={{opacity:0.5}}><FaCog size="2em" color="#22c55e"/></span></span>
                                    <div>
                                        <div style={{fontWeight:600}}>Configuración del Sistema</div>
                                        <div style={{fontSize:14, color:'#666'}}>Próximamente disponible</div>
                                    </div>
                                </div>
                            }
                            disabled
                            className="panel-admin-btn"
                        />
                        <Button
                            label={
                                <div style={{display:'flex',alignItems:'center',gap:12}}>
                                    <span className="icon"><span style={{opacity:0.5}}><FaDatabase size="2em" color="#a78bfa"/></span></span>
                                    <div>
                                        <div style={{fontWeight:600}}>Gestión de Base de Datos</div>
                                        <div style={{fontSize:14, color:'#666'}}>Próximamente disponible</div>
                                    </div>
                                </div>
                            }
                            disabled
                            className="panel-admin-btn"
                        />
                    </div>
                    <div className="panel-admin-footer">
                        <Button label="Cerrar" onClick={() => setOpenModal(false)} type="button" />
                    </div>
                </div>
            </Modal>
            {/* Modal secundario para administrar roles de usuarios */}
            <ModalAdministrarRolesUsuario open={showRolesPanel} onClose={() => setShowRolesPanel(false)} />
        </>
    );
}

export default MainPageAdministrador;
