import React, { useState } from "react";
import ModalPanelAdministracion from "../ModalPanelAdministracion/ModalPanelAdministracion";
import ModalAdministrarRolesUsuario from "../../casosDeUso/AdministrarRolesDeUsuario/components/ModalAdministrarRolesUsuario";
import "./Navbar.css";


const Navbar: React.FC = () => {
	// Aquí iría la lógica para obtener los roles del usuario logueado
	// Ejemplo: const roles = useApp().roles;


		const [openAdminModal, setOpenAdminModal] = useState(false);
		const [openRolesModal, setOpenRolesModal] = useState(false);

		const handleOpenAdmin = () => setOpenAdminModal(true);
		const handleCloseAdmin = () => setOpenAdminModal(false);
		const handleAdministrarRoles = () => {
			setOpenAdminModal(false);
			setOpenRolesModal(true);
		};
		const handleCloseRolesModal = () => setOpenRolesModal(false);

	return (
		<>
			<nav className="navbar">
				<div className="navbar__left">
					<span className="navbar__title">Gestión de Propiedades</span>
					<button className="navbar__item">
						<span className="navbar__icon">🏠</span> Inicio
					</button>
					<button className="navbar__item">
						<span className="navbar__icon">📅</span> Reservas
					</button>
					{/* Mostrar solo si el usuario tiene el rol de Finanzas */}
					{/* if (roles.includes('Financiero')) { ... } */}
					<button className="navbar__item">
						<span className="navbar__icon">💲</span> Finanzas
					</button>
					{/* Mostrar solo si el usuario tiene el rol de Administrador */}
					{/* if (roles.includes('Administrador')) { ... } */}
					<button className="navbar__item" onClick={handleOpenAdmin}>
						<span className="navbar__icon">⚙️</span> Administración
					</button>
					<button className="navbar__item">
						<span className="navbar__icon">💳</span> Mi Caja
					</button>
				</div>
				<div className="navbar__right">
					<button className="navbar__item navbar__notifications">
						<span className="navbar__icon">🔔</span>
						Notificaciones
					</button>
					<button className="navbar__item">
						<span className="navbar__icon">👤</span> Mi Perfil
					</button>
					<button className="navbar__item navbar__add">
						<span className="navbar__icon">➕</span> Agregar Ingreso/Egreso
					</button>
				</div>
			</nav>
					<ModalPanelAdministracion
						open={openAdminModal}
						onClose={handleCloseAdmin}
						onAdministrarRoles={handleAdministrarRoles}
					/>
					<ModalAdministrarRolesUsuario
						open={openRolesModal}
						onClose={handleCloseRolesModal}
					/>
		</>
	);
};

export default Navbar;
