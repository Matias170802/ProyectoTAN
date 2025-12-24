import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from '../index';
import { FaHome } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { GrConfigure } from 'react-icons/gr';
import { FaCreditCard } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { IoMdAdd } from 'react-icons/io';
import { MdBusinessCenter } from 'react-icons/md';
import useUserRoles from '../../hooks/useUserRoles';

const NavbarEmpleado: React.FC = () => {
  const { hasRole } = useUserRoles();

  // Usamos los nombres canónicos mapeados desde los códigos del backend
  const showFinanzas = hasRole('FINANZAS');
  const showGerencia = hasRole('GERENCIA');
  const showReservas = hasRole('RESERVAS');
  const showAdministracion = hasRole('ADMIN_SISTEMA');
  const showAgregarIE = hasRole('EMPLEADO');

  return (
    <nav>
      <p>Gestion de Propiedades</p>
      <ul>
        <li><Link to="/"><Button label="Inicio" icon={<FaHome/>}/></Link></li>
        {showReservas && <li><Link to="/reservas"><Button label="Reservas" icon={<FaCalendarAlt />}/></Link></li>}
        {showFinanzas && <li><Link to="/finanzas"><Button label="Finanzas" icon={<MdOutlineAttachMoney />}/></Link></li>}
        {showGerencia && <li><Link to="/gerencia"><Button label="Gerencia" icon={<MdBusinessCenter />}/></Link></li>}
        {showAdministracion && <li><Link to="/admin"><Button label="Administracion" icon={<GrConfigure />}/></Link></li>}
        <li><Link to="/micaja"><Button label="Mi Caja" icon={<FaCreditCard />}/></Link></li>
        <li><Link to="/perfil"><Button label="Mi Perfil" icon={<CgProfile />}/></Link></li>
        {showAgregarIE && <li><Link to="/registrarIngresoEgresoCaja"><Button label="Agregar Ingreso/Egreso" icon={<IoMdAdd />}/></Link></li>}
      </ul>
    </nav>
  );
}

export default NavbarEmpleado;
