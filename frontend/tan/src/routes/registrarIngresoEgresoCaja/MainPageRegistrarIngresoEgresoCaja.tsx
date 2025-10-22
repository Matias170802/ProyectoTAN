import ModalRegistrarIngresoEgresoCaja from '../../casosDeUso/RegistrarIngresoEgresoCaja/components/ModalRegistrarIngresoEgresoCaja/ModalRegistrarIngresoEgresoCaja'

const MainPageRegistrarIngresoEgresoCaja: React.FC = () => {

    return (
        <div className="App">
            
            <div id='mainPageFinanzasContent'>
                <p>Registrar Nuevo Ingreso/Egreso</p>
                
                <div id='modalFinanzas'>
                    <ModalRegistrarIngresoEgresoCaja
                    isOpen={true}
                    onClose={() => {}}
                    title="Registrar Nueva Transacción"
                    description="Completa el formulario para registrar un nuevo ingreso o egreso en tu caja"
                    showCloseButton={false}
                    />
                </div>
        
            </div>
        </div>
    )
}

export default MainPageRegistrarIngresoEgresoCaja;