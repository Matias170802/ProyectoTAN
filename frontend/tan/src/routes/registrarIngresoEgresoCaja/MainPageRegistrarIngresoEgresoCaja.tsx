import FormRegistrarIngresoEgresoCaja from '../../casosDeUso/RegistrarIngresoEgresoCaja/components/FormRegistrarIngresoEgresoCaja/FormRegistrarIngresoEgresoCaja'
import './MainPageRegistrarIngresoEgresoCaja.css'

const MainPageRegistrarIngresoEgresoCaja: React.FC = () => {

    return (
        <div className="App">
            
            <div id='mainPageFinanzasContent'>
                <p>Registrar Nuevo Ingreso/Egreso</p>
                
                <div id='formRegistrarIngresoEgresoCajaContainer'>
                    <FormRegistrarIngresoEgresoCaja
                    title="Registrar Nueva Transacción"
                    description="Completa el formulario para registrar un nuevo ingreso o egreso en tu caja"
                    />
                </div>
        
            </div>
        </div>
    )
}

export default MainPageRegistrarIngresoEgresoCaja;