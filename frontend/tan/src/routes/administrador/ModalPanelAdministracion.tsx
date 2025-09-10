import React from "react";
import './ModalPanelAdministracion.css';

interface ModalPanelAdministracionProps {
  open: boolean;
  onClose: () => void;
  onAdministrarRoles: () => void;
}

const ModalPanelAdministracion: React.FC<ModalPanelAdministracionProps> = ({ open, onClose, onAdministrarRoles }) => {
  if (!open) return null;

  return (
    <div className="modal-admin__overlay">
      <div className="modal-admin__container">
        <h2 className="modal-admin__title">Panel de Administración</h2>
        <p className="modal-admin__desc">Selecciona una opción de administración del sistema.</p>
        <button className="modal-admin__option" onClick={onAdministrarRoles}>
          <span className="modal-admin__icon">👥</span> Administrar Roles de Usuarios
        </button>
        <button className="modal-admin__close" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalPanelAdministracion;
