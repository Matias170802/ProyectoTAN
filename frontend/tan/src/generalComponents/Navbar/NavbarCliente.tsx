import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Button } from '../index';
import { FaHome } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';

const NavbarCliente: React.FC = () => {
  return (
    <nav>
      <p>Gestion de Propiedades</p>
      <ul>
        <li><Link to="/"><Button label="Inicio" icon={<FaHome/>}/></Link></li>
        <li><Link to="/perfil"><Button label="Mi Perfil" icon={<CgProfile />}/></Link></li>
      </ul>
    </nav>
  );
}

export default NavbarCliente;
