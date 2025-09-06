import React, { useState } from "react";
import ModalPanelAdministracion from "../../routes/administrador/ModalPanelAdministracion";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";


const Navbar: React.FC = () => {
	const [openAdminModal, setOpenAdminModal] = useState(false);
	const navigate = useNavigate();

	const handleOpenAdmin = () => setOpenAdminModal(true);
	const handleCloseAdmin = () => setOpenAdminModal(false);
	const handleAdministrarRoles = () => {
		setOpenAdminModal(false);
		navigate("/admin/roles");
	};

	const goToInicio = () => navigate("/");
	const goToReservas = () => navigate("/reservas");
	const goToFinanzas = () => navigate("/finanzas");
	const goToMiCaja = () => navigate("/mi-caja");
	const goToNotificaciones = () => navigate("/notificaciones");
	const goToPerfil = () => navigate("/perfil");
	const goToAgregarIngresoEgreso = () => navigate("/agregar-ingreso-egreso");

	return (
		<>
			<nav className="navbar">
				<div className="navbar__left">
					<span className="navbar__title">Gestión de Propiedades</span>
					<button className="navbar__item" onClick={goToInicio}>
						<span className="navbar__icon">🏠</span> Inicio
					</button>
					<button className="navbar__item" onClick={goToReservas}>
						<span className="navbar__icon">📅</span> Reservas
					</button>
					<button className="navbar__item" onClick={goToFinanzas}>
						<span className="navbar__icon">💲</span> Finanzas
					</button>
					<button className="navbar__item" onClick={handleOpenAdmin}>
						<span className="navbar__icon">⚙️</span> Administración
					</button>
					<button className="navbar__item" onClick={goToMiCaja}>
						<span className="navbar__icon">💳</span> Mi Caja
					</button>
				</div>
				<div className="navbar__right">
					<button className="navbar__item navbar__notifications" onClick={goToNotificaciones}>
						<span className="navbar__icon">🔔</span>
						Notificaciones
					</button>
					<button className="navbar__item" onClick={goToPerfil}>
						<span className="navbar__icon">👤</span> Mi Perfil
					</button>
					<button className="navbar__item navbar__add" onClick={goToAgregarIngresoEgreso}>
						<span className="navbar__icon">➕</span> Agregar Ingreso/Egreso
					</button>
				</div>
			</nav>
			<ModalPanelAdministracion
				open={openAdminModal}
				onClose={handleCloseAdmin}
				onAdministrarRoles={handleAdministrarRoles}
			/>
		</>
	);
};

export default Navbar;
