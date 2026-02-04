import { Link, useNavigate } from "react-router-dom";
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
import { MdLogout } from "react-icons/md";
import { useUserContext } from "../../context/UserContext";
import { getAccessibleRoutes } from "../../constants/roles";


const Navbar: React.FC = () => {
    const { user, logout } = useUserContext();
    const navigate = useNavigate();
    const accessibleRoutes = user?.roles ? getAccessibleRoutes(user.roles) : [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Si no hay usuario, no mostrar navbar
    if (!user) {
        return null;
    }

    const canAccess = (path: string) => accessibleRoutes.includes(path);
    
    return (
    
        <nav>
            <p>Gestión de<br/>Propiedades</p>
            {!user.esCliente && user.esEmpleado && (
                <ul>
                {/* Inicio - accesible para todos los empleados */}
                <li><Link to="/"><Button label="Inicio" icon={<FaHome/>}/></Link></li>

                {/* Reservas - requiere rol RESERVAS */}
                {canAccess('/reservas') && 
                    <li><Link to="/reservas"><Button label="Reservas" icon={<FaCalendarAlt />}/></Link></li>
                }

                {/* Finanzas - requiere rol FINANZAS */}
                {canAccess('/finanzas') && 
                    <li><Link to="/finanzas"><Button label="Finanzas" icon={<MdOutlineAttachMoney />}/></Link></li>
                }

                {/* Gerencia - requiere rol GERENCIA */}
                {canAccess('/gerencia') && 
                    <li><Link to="/gerencia"><Button label="Gerencia" icon={<MdBusinessCenter />}/></Link></li>
                }

                {/* Admin - requiere rol ADMIN_SISTEMA */}
                {canAccess('/admin') && 
                    <li><Link to="/admin"><Button label="Admin" icon={<GrConfigure />}/></Link></li>
                }

                {/* Mi Caja - accesible para empleados */}
                {canAccess('/micaja') && 
                    <li><Link to="/micaja"><Button label="Mi Caja" icon={<FaCreditCard />}/></Link></li>
                }

                {/* Perfil - accesible para empleados */}
                {canAccess('/perfil') && 
                    <li><Link to="/perfil"><Button label="Perfil" icon={<CgProfile />}/></Link></li>
                }

                {/* Agregar Ingreso/Egreso - accesible para empleados */}
                {canAccess('/registrarIngresoEgresoCaja') && 
                    <li><Link to="/registrarIngresoEgresoCaja"><Button label="Agregar IE" icon={<IoMdAdd />}/></Link></li>
                }

                {/* Reportes - accesible para empleados */}
                {canAccess('/reportes') && 
                    <li><Link to="/reportes"><Button label='Reportes' id='botonReportes' icon={<IoBarChart/>}/></Link></li>
                }

                {/* Logout - siempre disponible */}
                <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Button label="Salir" icon={<MdLogout/>}/></button></li>
            </ul>
            )}
            
            {user.esCliente && !user.esEmpleado && (
                <ul>
                    {/* Mis Propiedades - predeterminado */}
                    <li><Link to="/"><Button label="Mis Propiedades" icon={<FaHome/>}/></Link></li>

                    {/* Mi Caja */}
                    <li><Link to="/micaja"><Button label="Mi Caja" icon={<FaCreditCard />}/></Link></li>

                    {/* Perfil */}
                    <li><Link to="/perfil"><Button label="Perfil" icon={<CgProfile />}/></Link></li>

                    {/* Logout - siempre disponible */}
                <li><button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><Button label="Salir" icon={<MdLogout/>}/></button></li>
                
                </ul>
            )}
        </nav>
    
    );
}

export default Navbar;