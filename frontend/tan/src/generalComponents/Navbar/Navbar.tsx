import { Link } from "react-router-dom";
import './Navbar.css'
import {Button} from '../index'


const Navbar: React.FC = () => {
    return (
    
        <nav>
            <p>Gestion de Propiedades</p>
            <ul>
                <li><Link to="/"><Button label="🏠Inicio"/></Link></li>
                <li><Link to="/reservas"><Button label="📅Reservas"/></Link></li>
                <li><Link to="/finanzas"><Button label="💲Finanzas"/></Link></li>
                <li><Link to="/admin"><Button label="⚙️Administracion"/></Link></li>
                <li><Link to="/micaja"><Button label="💳Mi Caja"/></Link></li>
                <li><Link to="/perfil"><Button label="👤Mi Perfil"/></Link></li>
                <li><Link to="/registrarIngresoEgresoCaja"><Button label="+ Agregar Ingreso/Egreso"/></Link></li>
                
            </ul>
        </nav>
    
    );
}

export default Navbar;