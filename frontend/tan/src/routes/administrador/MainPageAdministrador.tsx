import React from "react";
import './ModalPanelAdministracion.css';
import { useNavigate } from "react-router-dom";

const MainPageAdministrador: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="modal-admin__overlay">
        <div className="modal-admin__container">
            <h2 className="modal-admin__title">Panel de Administración</h2>
            <p className="modal-admin__desc">Selecciona una opción de administración del sistema.</p>
            <button className="modal-admin__option" onClick={() => navigate("/admin/roles")}> 
            <span className="modal-admin__icon">👥</span> Administrar Roles de Usuarios
            </button>
            <button className="modal-admin__option disabled" disabled>
            <span className="modal-admin__icon">⚙️</span> Configuración del Sistema <span className="modal-admin__soon">(Próximamente)</span>
            </button>
            <button className="modal-admin__option disabled" disabled>
            <span className="modal-admin__icon">🗄️</span> Gestión de Base de Datos <span className="modal-admin__soon">(Próximamente)</span>
            </button>
            {/* El botón cerrar puede navegar a inicio o a la página anterior */}
            <button className="modal-admin__close" onClick={() => navigate("/")}>Cerrar</button>
        </div>
        </div>
    );
};

export default MainPageAdministrador;
