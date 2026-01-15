import { Link } from "react-router-dom";
import './Navbar.css'
import { IoBarChart } from "react-icons/io5";
import {Button} from '../index'
import { FaHome } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import { FaCreditCard } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { MdBusinessCenter } from "react-icons/md";


const Navbar: React.FC = () => {
    return (
    
        <nav>
            <p>Gestion de Propiedades</p>
            <ul>
                <li><Link to="/"><Button label="Inicio" icon={<FaHome/>}/></Link></li>
                <li><Link to="/reservas"><Button label="Reservas" icon={<FaCalendarAlt />}/></Link></li>
                <li><Link to="/finanzas"><Button label="Finanzas" icon={<MdOutlineAttachMoney />}/></Link></li>
                <li><Link to="/gerencia"><Button label="Gerencia" icon={<MdBusinessCenter />}/></Link></li>
                <li><Link to="/admin"><Button label="Administracion" icon={<GrConfigure />}/></Link></li>
                <li><Link to="/micaja"><Button label="Mi Caja" icon={<FaCreditCard />}/></Link></li>
                <li><Link to="/perfil"><Button label="Mi Perfil" icon={<CgProfile />}/></Link></li>
                <li><Link to="/registrarIngresoEgresoCaja"><Button label="Agregar Ingreso/Egreso" icon={<IoMdAdd />}/></Link></li>
                <li><Link to="/reportes"><Button label='Reportes' id='botonReportes' icon={<IoBarChart/>}/></Link></li>
                
            </ul>
        </nav>
    
    );
}

export default Navbar;