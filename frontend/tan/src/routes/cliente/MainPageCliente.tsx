import './MainPageCliente.css';
import { ModalConsultarEstadisticasCliente } from '@/casosDeUso/ConsultarEstadisticas/components/ModalConsultarEstadisticasCliente/ModalConsultarEstadisticasCliente';

const MainPageCliente: React.FC = () => {
    return (
        <div className="App">
            <div id="mainPageClienteContent">
                <h1 className="titulo">Mis Propiedades</h1>
                <ModalConsultarEstadisticasCliente />
            </div>
        </div>
    );
};

export default MainPageCliente;

